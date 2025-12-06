import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

let elevenlabsClient = null;

// Initialize ElevenLabs client if API key is available
if (process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY !== 'your_api_key_here') {
  try {
    elevenlabsClient = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY
    });
    console.log('✅ ElevenLabs client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize ElevenLabs client:', error.message);
  }
} else {
  console.warn('⚠️ ELEVENLABS_API_KEY not found in environment variables. Speech-to-text will use mock data.');
}

// Mock transcription generator
const generateMockTranscription = () => {
  const mockTexts = [
    "This is a sample transcription in demo mode. Please upgrade your ElevenLabs account for real AI transcription.",
    "Hello, this is a mock transcription. The actual speech-to-text feature requires ElevenLabs API permissions.",
    "Testing the voice recorder. This text is generated as a placeholder. Upgrade for full functionality.",
    "Your voice message has been recorded. This is a simulated transcription for demonstration purposes."
  ];
  return mockTexts[Math.floor(Math.random() * mockTexts.length)];
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the audio file from the request
    const { audio } = req.body;

    if (!audio) {
      return res.status(400).json({ error: 'No audio file provided.' });
    }

    console.log(`🎤 Processing audio file (${audio.length} bytes)`);

    let transcriptionText = '';
    let apiUsed = 'ElevenLabs Speech-to-Text';
    let transcriptionError = false;

    if (!elevenlabsClient) {
      transcriptionText = generateMockTranscription();
      apiUsed = 'Mock Transcription (Client Not Initialized)';
      transcriptionError = true;
      console.warn('🔄 Using mock transcription because ElevenLabs client is not initialized.');
    } else {
      try {
        // Convert base64 audio to buffer
        const audioBuffer = Buffer.from(audio, 'base64');

        const transcription = await elevenlabsClient.speechToText.convert({
          audio: audioBuffer,
          model_id: 'scribe_v1',
          tag_audio_events: true,
          language_code: 'en',
          timestamps_granularity: 'word'
        });
        transcriptionText = transcription.text;
        console.log('✅ Transcription completed');
      } catch (error) {
        console.error('❌ Speech-to-text error:', error);
        transcriptionError = true;

        if (error.statusCode === 401 && error.body?.detail?.status === 'missing_permissions') {
          transcriptionText = generateMockTranscription();
          apiUsed = 'Mock Transcription (Missing Permissions)';
          console.warn('🔄 Using mock transcription due to missing API permissions.');
        } else {
          return res.status(error.statusCode || 500).json({
            error: 'Failed to transcribe audio',
            details: error.message,
            statusCode: error.statusCode,
            body: error.body
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      transcription: transcriptionText,
      metadata: {
        language: 'en',
        duration: audio.length / 10000, // Placeholder duration
        word_count: transcriptionText.split(' ').length
      },
      timestamp: new Date().toISOString(),
      apiUsed: apiUsed,
      transcriptionError: transcriptionError
    });

  } catch (error) {
    console.error('❌ Unexpected error in speech-to-text handler:', error);
    res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.message
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb'
    }
  }
};
