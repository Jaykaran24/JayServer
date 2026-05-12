# Jay24codes - Personal Cloud Dashboard & Developer Portfolio

A centralized Personal Cloud Dashboard and Developer Portfolio built with MERN stack (MongoDB, Express, React, Node.js) and containerized with Docker.

## Features

- **Public Portfolio View**: Showcase your projects and skills with a modern, responsive interface
- **Secure Authentication**: JWT-based login system with bcrypt password hashing
- **Admin Dashboard**: Private dashboard with quick links and file manager
- **File Manager**: Upload, store, and manage files with ease
- **Fully Containerized**: Docker and docker-compose setup for easy deployment

## Architecture

```
┌─────────────────────────────────────────┐
│         Cloudflare Tunnel               │
│      (jay24codes.me + subdomains)       │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────────┐    ┌──────▼────────┐
│  Frontend   │    │   Backend     │
│  (React)    │    │  (Express)    │
│  Port 3000  │    │  Port 5000    │
└────────────┘    └────┬──────────┘
                       │
                  ┌────▼──────────┐
                  │   MongoDB     │
                  │  Port 27017   │
                  └───────────────┘
```

## Prerequisites

- Docker and Docker Compose installed
- Git

## Quick Start

### 1. Clone and Setup

```bash
cd jay-server
```

### 2. Configure Environment Variables

Edit `.env` file with your settings:

```bash
JWT_SECRET=your-secure-secret-key-here
```

### 3. Build and Run with Docker

```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

### 5. First-Time Setup

Before logging in, register an admin account:

```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@jay24codes.me",
    "password": "your-secure-password"
  }'
```

Then use these credentials to log in via the UI.

## Project Structure

```
jay-server/
├── frontend/                 # React Vite application
│   ├── src/
│   │   ├── App.jsx          # Main app component (Portfolio + Admin Dashboard)
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Tailwind CSS
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   └── package.json
│
├── backend/                  # Express.js API
│   ├── server.js            # Main server file
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── models/
│   │   └── User.js          # User schema
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   └── files.js         # File management endpoints
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── uploads/             # File storage directory
│   ├── Dockerfile
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml       # Docker Compose configuration
├── .env                     # Environment variables
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register new admin user
- **POST** `/api/auth/login` - Login and receive JWT token
- **GET** `/api/auth/me` - Get current user (requires auth)

### Files

- **GET** `/api/files` - List all uploaded files (requires auth)
- **POST** `/api/files/upload` - Upload a new file (requires auth)
- **DELETE** `/api/files/:filename` - Delete a file (requires auth)

### Health

- **GET** `/api/health` - Backend health check

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://mongo:27017/jay-dashboard
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
```

### Root (.env)

```
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Development

### Running Locally (Without Docker)

#### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 with Vite dev server
```

#### Backend

```bash
cd backend
npm install
npm run dev
# Requires MongoDB running on localhost:27017
```

### Building for Production

#### Frontend

```bash
cd frontend
npm run build
# Creates optimized build in dist/
```

#### Backend

```bash
# Already production-ready with docker-compose
```

## Deployment to Ubuntu Server

### Prerequisites

1. Install Docker and Docker Compose on your Ubuntu server
2. Set up Cloudflare Tunnel for secure routing

### Steps

```bash
# 1. Clone the repository
git clone <your-repo> /path/to/jay-server
cd /path/to/jay-server

# 2. Set environment variables
cp .env.example .env
# Edit .env with production values

# 3. Build and deploy
docker-compose up -d --build

# 4. Verify services are running
docker-compose ps

# 5. Check logs for any issues
docker-compose logs -f
```

### Cloudflare Tunnel Setup

1. Install Cloudflare tunnel on your server:
```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
cloudflared tunnel login
cloudflared tunnel create jay-dashboard
```

2. Create tunnel config (`~/.cloudflared/config.yml`):
```yaml
tunnel: jay-dashboard
credentials-file: /home/user/.cloudflared/<UUID>.json

ingress:
  - hostname: jay24codes.me
    service: http://localhost:3000
  - hostname: api.jay24codes.me
    service: http://localhost:5000
  - hostname: cogniprep.jay24codes.me
    service: http://cogniprep:3000  # Or appropriate service
  - service: http_status:404
```

3. Start the tunnel:
```bash
cloudflared tunnel run
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs

# Rebuild containers
docker-compose down
docker-compose up --build
```

### MongoDB connection issues

```bash
# Verify MongoDB is running
docker-compose ps mongo

# Check MongoDB logs
docker-compose logs mongo
```

### Frontend can't connect to backend

- Check that backend is running: `curl http://localhost:5000/api/health`
- Verify CORS is enabled in backend
- Check network connectivity between containers

### Port conflicts

If ports are already in use, edit `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Maps host:3001 to container:3000
```

## Performance Optimization

- Frontend uses Vite for fast HMR during development
- Backend implements proper caching strategies
- MongoDB indexes are optimized for queries
- Docker multi-stage builds minimize image sizes

## Security Considerations

1. Change default JWT_SECRET in production
2. Use strong passwords for admin accounts
3. Enable HTTPS via Cloudflare Tunnel
4. Keep dependencies updated: `npm audit fix`
5. Use environment-specific configurations

## License

MIT - Jay Karan Chaturvedi

## Support

For issues or questions, refer to the [official documentation](#) or create an issue in the repository.
