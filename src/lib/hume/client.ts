const HUME_API_ENDPOINT = 'https://api.hume.ai/v0';

interface HumeConfig {
  apiKey: string;
}

export class HumeClient {
  private apiKey: string;

  constructor(config: HumeConfig) {
    this.apiKey = config.apiKey;
  }

  async analyzeSpeech(audioData: Blob) {
    const formData = new FormData();
    formData.append('file', audioData);
    formData.append('models', JSON.stringify(['prosody', 'language']));

    const response = await fetch(`${HUME_API_ENDPOINT}/batch/jobs`, {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Hume API error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const createHumeClient = () => {
  const HUME_API_KEY = process.env.NEXT_PUBLIC_HUME_API_KEY;

  if (!HUME_API_KEY) {
    throw new Error('HUME_API_KEY is not defined');
  }

  return new HumeClient({ apiKey: HUME_API_KEY });
};
