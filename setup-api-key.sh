#!/bin/bash

# ElevenLabs API Key Setup Script
# This script helps you set up your ElevenLabs API key

echo "🎵 ElevenLabs API Key Setup"
echo "==========================="
echo ""

# Check if backend/.env exists
if [ ! -f "backend/.env" ]; then
    echo "📄 Creating backend/.env file..."
    echo "ELEVENLABS_API_KEY=your_api_key_here" > backend/.env
fi

# Display current API key (masked)
if [ -f "backend/.env" ]; then
    current_key=$(grep "ELEVENLABS_API_KEY" backend/.env | cut -d'=' -f2)
    if [ "$current_key" = "your_api_key_here" ] || [ "$current_key" = "ELEVENLABS_API_KEY" ]; then
        echo "⚠️  Current API key is still placeholder"
    else
        masked_key="${current_key:0:10}...${current_key: -4}"
        echo "✅ Current API key: $masked_key"
    fi
fi

echo ""
echo "📋 To set up your ElevenLabs API key:"
echo ""
echo "1. 🌐 Go to https://elevenlabs.io/app/profile"
echo "2. 🔑 Copy your API key (starts with 'sk_')"
echo "3. ✏️  Edit backend/.env file and replace the value"
echo "4. 🔄 Restart the backend service: pnpm dev:backend"
echo ""
echo "💡 Account Tiers:"
echo "   - Free: Sound Generation API (recommended)"
echo "   - Starter (\$5/mo): Full text-to-speech"
echo "   - Creator (\$22/mo): Unlimited usage"
echo ""

# Interactive setup
read -p "Do you have your ElevenLabs API key ready? (y/n): " ready

if [ "$ready" = "y" ] || [ "$ready" = "Y" ]; then
    echo ""
    read -p "Enter your ElevenLabs API key: " api_key

    if [ -n "$api_key" ] && [ "$api_key" != "your_api_key_here" ]; then
        echo "ELEVENLABS_API_KEY=$api_key" > backend/.env
        echo ""
        echo "✅ API key saved to backend/.env"
        echo ""
        echo "🚀 Now restart the backend service:"
        echo "   pnpm dev:backend"
        echo ""
        echo "🎵 Then test the music generation in your browser!"
    else
        echo "❌ Invalid API key. Please try again."
        exit 1
    fi
else
    echo ""
    echo "ℹ️  Get your API key from: https://elevenlabs.io/app/profile"
    echo "ℹ️  Then run this script again or manually edit backend/.env"
fi

echo ""
echo "📚 Need help? Check the README.md for detailed instructions."
