#!/bin/bash

# AI Music Generator - Start Script
# This script kills existing processes and starts both frontend and backend services

echo "🎵 AI Music Generator - Starting Services"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to kill process on specific port
kill_port() {
    local port=$1
    local name=$2

    echo -e "${YELLOW}Checking for processes on port $port ($name)...${NC}"

    # Find process using the port
    local pid=$(lsof -ti:$port 2>/dev/null)

    if [ ! -z "$pid" ]; then
        echo -e "${RED}Found process $pid on port $port, killing...${NC}"
        kill -9 $pid 2>/dev/null
        sleep 2

        # Check if it's still running
        if lsof -ti:$port >/dev/null 2>&1; then
            echo -e "${RED}Failed to kill process on port $port${NC}"
            return 1
        else
            echo -e "${GREEN}Successfully killed process on port $port${NC}"
        fi
    else
        echo -e "${GREEN}No process found on port $port${NC}"
    fi
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to start service
start_service() {
    local name=$1
    local command=$2
    local port=$3

    echo -e "${BLUE}Starting $name on port $port...${NC}"

    # Start the service in background
    eval "$command" &
    local pid=$!

    # Wait a bit for the service to start
    sleep 3

    # Check if it's still running
    if kill -0 $pid 2>/dev/null; then
        echo -e "${GREEN}$name started successfully (PID: $pid)${NC}"

        # Check if port is listening
        if lsof -ti:$port >/dev/null 2>&1; then
            echo -e "${GREEN}$name is listening on port $port${NC}"
        else
            echo -e "${YELLOW}Warning: $name may not be listening on port $port yet${NC}"
        fi

        return 0
    else
        echo -e "${RED}Failed to start $name${NC}"
        return 1
    fi
}

# Check if required commands exist
echo -e "${BLUE}Checking system requirements...${NC}"

if ! command_exists node; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

if ! command_exists pnpm; then
    echo -e "${RED}Error: pnpm is not installed${NC}"
    exit 1
fi

if ! command_exists lsof; then
    echo -e "${YELLOW}Warning: lsof not found. Port killing may not work properly.${NC}"
fi

echo -e "${GREEN}System requirements check passed${NC}"

# Kill existing processes
echo -e "${YELLOW}Killing existing processes...${NC}"
kill_port 3000 "Backend API"
kill_port 5173 "Frontend Dev Server"

# Clean up any remaining processes
echo -e "${YELLOW}Cleaning up any remaining processes...${NC}"
pkill -f "vite" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true
sleep 2

# Check if backend/.env exists and API key is configured
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Warning: backend/.env not found. Creating template...${NC}"
    echo "ELEVENLABS_API_KEY=your_api_key_here" > backend/.env
    echo -e "${YELLOW}Please run './setup-api-key.sh' to configure your ElevenLabs API key${NC}"
elif [ -f "backend/.env" ]; then
    api_key=$(grep "ELEVENLABS_API_KEY" backend/.env | cut -d'=' -f2)
    if [ "$api_key" = "your_api_key_here" ] || [ "$api_key" = "ELEVENLABS_API_KEY" ] || [ -z "$api_key" ]; then
        echo -e "${YELLOW}Warning: ElevenLabs API key not configured${NC}"
        echo -e "${YELLOW}Please run './setup-api-key.sh' to configure your API key${NC}"
        echo -e "${BLUE}Get your API key from: https://elevenlabs.io/app/profile${NC}"
        echo -e "${BLUE}Note: Free accounts work with Sound Generation API${NC}"
    else
        echo -e "${GREEN}ElevenLabs API key is configured${NC}"
    fi
fi

# Start backend service
echo -e "${BLUE}Starting backend service...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    pnpm install
fi

start_service "Backend API" "pnpm dev" 3000
backend_started=$?
cd ..

if [ $backend_started -ne 0 ]; then
    echo -e "${RED}Failed to start backend service. Exiting.${NC}"
    exit 1
fi

# Wait a bit for backend to fully start
sleep 2

# Start frontend service
echo -e "${BLUE}Starting frontend service...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    pnpm install
fi

start_service "Frontend Dev Server" "pnpm dev" 5173
frontend_started=$?

if [ $frontend_started -ne 0 ]; then
    echo -e "${RED}Failed to start frontend service. Exiting.${NC}"
    exit 1
fi

# Final status
echo ""
echo -e "${GREEN}🎵 AI Music Generator Services Started Successfully!${NC}"
echo "=============================================="
echo -e "${GREEN}📊 Backend API:       http://localhost:3000${NC}"
echo -e "${GREEN}🎨 Frontend App:      http://localhost:5173${NC}"
echo -e "${GREEN}💚 Health Check:      http://localhost:3000/health${NC}"
echo ""
echo -e "${BLUE}To stop all services, press Ctrl+C or run:${NC}"
echo -e "${BLUE}pkill -f \"vite\" && pkill -f \"node.*server.js\"${NC}"
echo ""
echo -e "${YELLOW}Note: Make sure to add your ElevenLabs API key to backend/.env${NC}"

# Keep the script running to show logs
echo -e "${BLUE}Services are running. Press Ctrl+C to stop.${NC}"
trap 'echo -e "\n${YELLOW}Shutting down services...${NC}"; pkill -f "vite" 2>/dev/null; pkill -f "node.*server.js" 2>/dev/null; exit 0' INT
wait
