import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow Vite dev server
  credentials: true
}));
app.use(express.json());

// Initialize ElevenLabs client
let elevenlabsClient = null;

if (process.env.ELEVENLABS_API_KEY) {
  // Check if it's still the placeholder value
  if (process.env.ELEVENLABS_API_KEY === 'your_api_key_here' ||
      process.env.ELEVENLABS_API_KEY === 'ELEVENLABS_API_KEY') {
    console.warn('⚠️  ELEVENLABS_API_KEY is still set to placeholder value');
    console.warn('⚠️  Please set your actual ElevenLabs API key in backend/.env');
    console.warn('⚠️  Get your API key from: https://elevenlabs.io/app/profile');
  } else {
    try {
      elevenlabsClient = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY
      });
      console.log('✅ ElevenLabs client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize ElevenLabs client:', error.message);
    }
  }
} else {
  console.warn('⚠️  ELEVENLABS_API_KEY not found in environment variables');
  console.warn('⚠️  Please create backend/.env file with your ElevenLabs API key');
}

// Music generation prompts for coding background
const musicPrompts = [
  'gentle ambient electronic music with soft synth pads and subtle beats, perfect for coding focus',
  'calm lo-fi beats with smooth piano melodies and light percussion, ideal for concentration',
  'atmospheric electronic soundscape with distant echoes and warm synthesizer textures',
  'minimalist ambient music with soft arpeggios and gentle reverb, great for deep work',
  'ethereal electronic composition with floating melodies and subtle rhythmic elements',
  'peaceful electronic ambient with smooth transitions and harmonic progressions',
  'soft electronic music with warm pads and delicate rhythmic patterns for coding sessions',
  'tranquil synthesizer music with gentle modulations and ambient textures',
  'calm electronic soundscape with subtle beats and melodic synth lines',
  'minimal ambient electronic with smooth transitions and peaceful atmosphere'
];

// API Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    elevenlabsReady: !!elevenlabsClient
  });
});

app.post('/api/generate-music', async (req, res) => {
  try {
    if (!elevenlabsClient) {
      return res.status(500).json({
        error: 'ElevenLabs client not initialized. Please check your ELEVENLABS_API_KEY environment variable.'
      });
    }

    // Check if API key is available
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({
        error: 'ELEVENLABS_API_KEY environment variable is not set.'
      });
    }

    // Select random prompt
    const randomPrompt = musicPrompts[Math.floor(Math.random() * musicPrompts.length)];

    console.log(`🎵 Generating music: ${randomPrompt}`);

      // Try Sound Generation API first (works with free accounts)
      let audio;
      try {
        console.log('🎵 Trying Sound Generation API...')
        audio = await elevenlabsClient.soundGeneration.generate({
          prompt: `Create ambient background music: ${randomPrompt}. Make it continuous, loopable, and suitable for coding focus.`,
          durationSeconds: 30, // Generate 30-second clips
          modelId: 'elevenlabs_sound_generation'
        });
      } catch (soundGenError) {
        console.log('🎵 Sound Generation failed, trying Text-to-Speech fallback...')
        // Fallback to text-to-speech if sound generation fails
        audio = await elevenlabsClient.textToSpeech.convert(
          'JBFqnCBsd6RMkjVDRZzb', // voice_id - using a calm voice
          {
            text: `Create ${randomPrompt}. Make it continuous and loopable.`,
            modelId: 'eleven_multilingual_v2',
            outputFormat: 'mp3_44100_128',
          }
        );
      };

    // Get audio buffer
    const audioBuffer = await audio.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    res.json({
      success: true,
      prompt: randomPrompt,
      audioData: audioBase64,
      contentType: 'audio/mpeg'
    });

  } catch (error) {
    console.error('❌ Music generation error:', error);
    res.status(500).json({
      error: 'Failed to generate music',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎵 Music generation: POST http://localhost:${PORT}/api/generate-music`);
});
