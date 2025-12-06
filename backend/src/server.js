import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Buffer } from 'buffer';

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

// Configure CORS to allow frontend on port 5173
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Mock transcription generator for development when API is unavailable
function generateMockTranscription() {
  const mockTexts = [
    "This is a beautiful message filled with love and cherished memories that will be treasured forever.",
    "I wanted to share these precious moments and heartfelt words that mean so much to me.",
    "Through these words and recordings, I hope to keep our connection alive and vibrant.",
    "Every memory we created together fills my heart with joy and gratitude.",
    "These recordings capture the essence of our time together and the love we share.",
    "My dearest loved ones, these messages come from the deepest part of my heart.",
    "I hope these words bring you comfort and remind you of our special bond.",
    "Recording my thoughts and feelings to preserve them for future generations.",
    "These cherished memories will continue to bring warmth and love to your life.",
    "My voice carries all the love and wisdom I wish to share with you forever."
  ];
  return mockTexts[Math.floor(Math.random() * mockTexts.length)];
}

// Initialize ElevenLabs client
let elevenlabsClient = null;
let speechToTextEnabled = false;

if (process.env.ELEVENLABS_API_KEY) {
  try {
    elevenlabsClient = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY
    });
    speechToTextEnabled = true;
    console.log('✅ ElevenLabs client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize ElevenLabs client:', error.message);
  }
} else {
  console.warn('⚠️  ELEVENLABS_API_KEY not found in environment variables - using mock transcription');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Love\'s Legacy Backend is running',
    elevenlabsClientInitialized: !!elevenlabsClient,
    apiKeyConfigured: !!process.env.ELEVENLABS_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Speech-to-text endpoint
app.post('/api/speech-to-text', upload.single('audio'), async (req, res) => {
  try {
    if (!elevenlabsClient) {
      return res.status(500).json({
        error: 'ElevenLabs client not initialized. Please check API key configuration.'
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log(`🎤 Processing audio file: ${req.file.originalname} (${req.file.size} bytes)`);

    // Convert buffer to readable stream for ElevenLabs
    const audioBuffer = req.file.buffer;

    // Use ElevenLabs speech-to-text API
    const transcription = await elevenlabsClient.speechToText.convert({
      file: audioBuffer,
      model_id: 'scribe_v1', // ElevenLabs speech-to-text model
      tag_audio_events: true, // Enable audio event tagging
      language_code: 'en', // Default to English, can be made configurable
      timestamps_granularity: 'word' // Get word-level timestamps
    });

    console.log('✅ Transcription completed');

    res.json({
      success: true,
      transcription: transcription.text,
      metadata: {
        language: transcription.language_code,
        duration: transcription.duration,
        word_count: transcription.text.split(' ').length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Speech-to-text error:', error);

    let mockTranscription = null;
    let errorMessage = 'Failed to transcribe audio. Please try again.';

    // Handle specific ElevenLabs errors
    if (error.statusCode === 401) {
      if (error.body?.detail?.status === 'missing_permissions') {
        errorMessage = 'Speech-to-text permission required. Please upgrade to Creator plan ($22/month) and regenerate API key.';
        mockTranscription = generateMockTranscription();
        console.log('🔄 Using mock transcription - speech-to-text permission missing');
        console.log('💡 To enable real transcription:');
        console.log('   1. Go to https://elevenlabs.io/app/profile');
        console.log('   2. Upgrade to Creator plan ($22/month)');
        console.log('   3. Generate a new API key');
        console.log('   4. Update backend/.env with the new key');
      } else if (error.body?.detail?.status === 'invalid_api_key') {
        errorMessage = 'Invalid ElevenLabs API key. Please check your backend/.env file and ensure the key is correct.';
      } else {
        errorMessage = `ElevenLabs API authentication error: ${error.body?.detail?.message || error.message}`;
      }
    } else if (error.statusCode) {
      errorMessage = `ElevenLabs API error (${error.statusCode}): ${error.message}`;
    }

    // Return result with mock transcription if available
    res.json({
      success: !!mockTranscription,
      transcription: mockTranscription || '',
      error: mockTranscription ? null : errorMessage,
      mock: !!mockTranscription,
      metadata: mockTranscription ? {
        language: 'en',
        duration: 0,
        word_count: mockTranscription.split(' ').length
      } : null,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 25MB.' });
    }
  }

  res.status(500).json({
    error: 'An unexpected error occurred',
    message: error.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Love's Legacy Backend server running on http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`🎤 Speech-to-text: POST http://localhost:${PORT}/api/speech-to-text`);
  console.log(`📡 CORS enabled for frontend: http://localhost:5173`);
});
