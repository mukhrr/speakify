import { HumeClient } from 'hume';

const HUME_API_ENDPOINT = 'https://api.hume.ai/v0';

export const createHumeClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY;
  const secretKey = process.env.NEXT_PUBLIC_HUME_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error('Hume API credentials are not defined');
  }

  return new HumeClient({
    apiKey,
    secretKey,
  });
};

export async function analyzeAudio(audioBlob: Blob, config: any) {
  const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY;

  if (!apiKey) {
    throw new Error('Hume API key is not defined');
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.wav');
  formData.append('config', JSON.stringify(config));

  // Send request to Hume API
  const response = await fetch(`${HUME_API_ENDPOINT}/batch/jobs`, {
    method: 'POST',
    headers: {
      'X-Hume-Api-Key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Hume API error: ${response.statusText}`);
  }

  const job = await response.json();

  // Poll for job completion
  const result = await pollJobCompletion(job.job_id, apiKey);
  return result;
}

async function pollJobCompletion(jobId: string, apiKey: string) {
  const maxAttempts = 30;
  const interval = 2000; // 2 seconds

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`${HUME_API_ENDPOINT}/batch/jobs/${jobId}`, {
      headers: {
        'X-Hume-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to check job status: ${response.statusText}`);
    }

    const status = await response.json();

    if (status.state === 'completed') {
      return status.results;
    } else if (status.state === 'failed') {
      throw new Error('Job processing failed');
    }

    // Wait before next attempt
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error('Job timed out');
}

export const humeConfig = {
  models: {
    prosody: {
      identify_speakers: true,
      granularity: 'utterance',
      window: {
        length: 4,
        step: 1,
      },
    },
    language: {
      granularity: 'utterance',
      identify_speakers: true,
    },
    emotion: {
      granularity: 'utterance',
      identify_speakers: true,
    },
  },
};
