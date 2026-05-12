#!/bin/bash

# Jay24codes - Setup and Build Script
# This script sets up the entire MERN stack for development or production

set -e

echo "================================================"
echo "Jay24codes - Personal Cloud Dashboard Setup"
echo "================================================"
echo ""

# Check Docker and Docker Compose
echo "Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Docker Compose Environment Variables
JWT_SECRET=your-super-secret-jwt-key-change-in-production
EOF
    echo "✅ .env file created. Please edit it with your secrets."
fi

echo ""
echo "Building and starting services..."
echo ""

# Build and start services
docker-compose up -d --build

echo ""
echo "================================================"
echo "✅ Services are starting..."
echo "================================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo "API Docs: http://localhost:5000/api/health"
echo ""
echo "Waiting for services to be ready..."
sleep 5

# Health checks
echo ""
echo "Checking service health..."

# Frontend health check
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "⚠️  Frontend is starting... (may take a moment)"
fi

# Backend health check
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend is starting... (may take a moment)"
fi

echo ""
echo "================================================"
echo "Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Visit http://localhost:3000 in your browser"
echo "2. Register an admin account via the API:"
echo ""
echo "   curl -X POST http://localhost:5000/api/auth/register \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{'"
echo "       \"username\": \"admin\","
echo "       \"email\": \"admin@jay24codes.me\","
echo "       \"password\": \"your-password\""
echo "     }'"
echo ""
echo "3. Log in via the Admin Portal button on the website"
echo ""
echo "Docker commands:"
echo "  - View logs:       docker-compose logs -f"
echo "  - Stop services:   docker-compose down"
echo "  - Restart:         docker-compose restart"
echo "  - Remove volumes:  docker-compose down -v"
echo ""
