import { fetchAccessToken } from 'hume';

interface Message {
  type: 'user_message' | 'assistant_message';
  message: {
    role: string;
    content: string;
  };
  models: {
    prosody?: {
      scores: Record<string, number>;
    };
  };
}

interface VoiceState {
  status: {
    value: 'disconnected' | 'connecting' | 'connected';
  };
  isMuted: boolean;
  messages: Message[];
  micFft: number[];
}

let voiceState: VoiceState = {
  status: { value: 'disconnected' },
  isMuted: false,
  messages: [],
  micFft: Array(24).fill(0),
};

let ws: WebSocket | null = null;

export const getHumeAccessToken = async () => {
  const accessToken = await fetchAccessToken({
    apiKey: String(process.env.NEXT_PUBLIC_HUME_API_KEY),
    secretKey: String(process.env.NEXT_PUBLIC_HUME_SECRET_KEY),
  });

  if (accessToken === 'undefined') {
    return null;
  }

  return accessToken ?? null;
};

export const initializeEVI = async () => {
  const accessToken = await getHumeAccessToken();
  if (!accessToken) {
    throw new Error('Failed to get Hume access token');
  }

  const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID;
  const wsUrl = `wss://api.hume.ai/v0/stream/models?config_id=${configId}`;

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    ws?.send(JSON.stringify({ type: 'auth', accessToken }));
    voiceState.status.value = 'connected';
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleWebSocketMessage(data);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    voiceState.status.value = 'disconnected';
  };

  ws.onclose = () => {
    voiceState.status.value = 'disconnected';
  };
};

export const startConversation = async () => {
  if (voiceState.status.value !== 'connected') {
    throw new Error('EVI not connected');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
      if (ws && ws.readyState === WebSocket.OPEN && !voiceState.isMuted) {
        const audioData = e.inputBuffer.getChannelData(0);
        // Convert audio data to format expected by Hume
        const buffer = convertAudioData(audioData);
        ws.send(buffer);
      }
    };

    // Update FFT data for visualization
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const updateFFT = () => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      voiceState.micFft = Array.from(dataArray).slice(0, 24);
      requestAnimationFrame(updateFFT);
    };
    updateFFT();
  } catch (error) {
    console.error('Failed to start audio stream:', error);
    throw error;
  }
};

export const stopConversation = async () => {
  if (ws) {
    ws.close();
    ws = null;
  }
  voiceState.status.value = 'disconnected';
};

export const disconnectEVI = async () => {
  await stopConversation();
  voiceState = {
    status: { value: 'disconnected' },
    isMuted: false,
    messages: [],
    micFft: Array(24).fill(0),
  };
};

export const toggleMute = () => {
  voiceState.isMuted = !voiceState.isMuted;
};

function handleWebSocketMessage(data: any) {
  if (data.type === 'prosody') {
    const message: Message = {
      type: 'user_message',
      message: {
        role: 'user',
        content: data.text || '',
      },
      models: {
        prosody: {
          scores: data.predictions || {},
        },
      },
    };
    voiceState.messages.push(message);
  }
}

function convertAudioData(audioData: Float32Array): ArrayBuffer {
  // Convert Float32Array to Int16Array for more efficient transmission
  const int16Data = new Int16Array(audioData.length);
  for (let i = 0; i < audioData.length; i++) {
    int16Data[i] = audioData[i] * 32767;
  }
  return int16Data.buffer;
}
