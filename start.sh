#!/bin/bash

# Love's Legacy - Start Script
# Starts both backend (port 3000) and frontend (port 5173)

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on a specific port
kill_port() {
    local port=$1
    local name=$2

    if check_port $port; then
        print_warning "Port $port ($name) is in use. Killing existing process..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
        print_status "Killed process on port $port"
    else
        print_info "Port $port ($name) is free"
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1

    print_info "Waiting for $service_name to be ready..."

    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            print_status "$service_name is ready!"
            return 0
        fi

        echo -n "."
        sleep 1
        ((attempt++))
    done

    print_error "$service_name failed to start within ${max_attempts}s"
    return 1
}

# Function to start backend
start_backend() {
    print_header "Starting Love's Legacy Backend (Port 3000)"

    # Check if backend directory exists
    if [ ! -d "backend" ]; then
        print_error "Backend directory not found!"
        exit 1
    fi

    # Check if .env file exists
    if [ ! -f "backend/.env" ]; then
        print_warning "backend/.env not found. Creating with placeholder..."
        echo "ELEVENLABS_API_KEY=your_api_key_here" > backend/.env
        echo "PORT=3000" >> backend/.env
        print_warning "Please update backend/.env with your actual ElevenLabs API key"
    fi

    # Navigate to backend directory and start
    cd backend

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_info "Installing backend dependencies..."
        if command_exists pnpm; then
            pnpm install
        else
            print_error "pnpm not found. Please install pnpm first."
            exit 1
        fi
    fi

    # Start backend in background
    print_info "Starting backend server..."
    if command_exists pnpm; then
        pnpm dev &
    else
        print_error "pnpm not found!"
        exit 1
    fi

    BACKEND_PID=$!
    cd ..
    print_status "Backend started with PID: $BACKEND_PID"

    # Wait for backend to be ready
    wait_for_service "http://localhost:3000/health" "Backend"
}

# Function to start frontend
start_frontend() {
    print_header "Starting Love's Legacy Frontend (Port 5173)"

    # Check if leaving-world-app directory exists
    if [ ! -d "leaving-world-app" ]; then
        print_error "Frontend directory (leaving-world-app) not found!"
        exit 1
    fi

    # Navigate to frontend directory and start
    cd leaving-world-app

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_info "Installing frontend dependencies..."
        if command_exists pnpm; then
            pnpm install
        else
            print_error "pnpm not found. Please install pnpm first."
            exit 1
        fi
    fi

    # Start frontend in background
    print_info "Starting frontend development server..."
    if command_exists pnpm; then
        pnpm dev &
    else
        print_error "pnpm not found!"
        exit 1
    fi

    FRONTEND_PID=$!
    cd ..
    print_status "Frontend started with PID: $FRONTEND_PID"

    # Wait for frontend to be ready
    wait_for_service "http://localhost:5173" "Frontend"
}

# Function to cleanup on exit
cleanup() {
    print_warning "Shutting down services..."

    # Kill background processes
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_status "Backend stopped"
    fi

    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_status "Frontend stopped"
    fi

    # Kill any remaining processes on our ports
    kill_port 3000 "Backend"
    kill_port 5173 "Frontend"

    print_info "All services stopped. Goodbye! 👋"
    exit 0
}

# Set up signal handlers for graceful shutdown
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    print_header "Love's Legacy - Starting All Services"
    echo -e "${CYAN}💖 Love's Legacy Startup Script${NC}"
    echo -e "${WHITE}================================${NC}"

    # Check prerequisites
    print_info "Checking prerequisites..."

    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi

    if ! command_exists pnpm; then
        print_error "pnpm is not installed. Please install pnpm first."
        exit 1
    fi

    if ! command_exists curl; then
        print_error "curl is not installed. Please install curl first."
        exit 1
    fi

    print_status "Prerequisites check passed"

    # Kill any existing processes on our ports
    kill_port 3000 "Backend"
    kill_port 5173 "Frontend"

    # Start services
    start_backend
    start_frontend

    # Success message
    echo ""
    print_status "🎉 All services started successfully!"
    echo ""
    echo -e "${GREEN}🌐 Access Love's Legacy:${NC}"
    echo -e "   ${CYAN}💖 Frontend:${NC} http://localhost:5173"
    echo -e "   ${CYAN}💚 Backend API:${NC} http://localhost:3000"
    echo -e "   ${CYAN}💚 Health Check:${NC} http://localhost:3000/health"
    echo ""
    echo -e "${YELLOW}📝 Note: Make sure to configure your ElevenLabs API key in backend/.env${NC}"
    echo ""
    print_info "Press Ctrl+C to stop all services"

    # Wait for user interrupt
    wait
}

# Run main function
main "$@"
