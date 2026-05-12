# Quick Reference - Terminal Commands

## Initial Setup

### Windows PowerShell - Project Initialization

```powershell
# Navigate to project directory
cd c:\Users\jayka\OneDrive\Pictures\Projects\jay-server

# Create folder structure
New-Item -ItemType Directory -Path frontend, backend -Force | Out-Null

# Initialize frontend
cd frontend
npm init -y
npm install react react-dom vite @vitejs/plugin-react tailwindcss postcss autoprefixer axios --save

# Initialize backend
cd ..\backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv multer cors uuid --save
```

## Docker Commands

### Build and Run Services

```powershell
# Start all services
docker-compose up -d

# Start with rebuild
docker-compose up -d --build

# Stop all services
docker-compose down

# View service status
docker-compose ps

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo

# Remove everything (including volumes)
docker-compose down -v
```

## Development Commands

### Frontend (Without Docker)

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 with Vite dev server
npm run build
npm run preview
```

### Backend (Without Docker)

```bash
cd backend
npm install
npm run dev  # Requires MongoDB on localhost:27017
npm start    # Production mode
```

## API Testing

### Register Admin User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@jay24codes.me",
    "password": "your-secure-password"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-secure-password"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Upload File

```bash
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/file.pdf"
```

### List Files

```bash
curl -X GET http://localhost:5000/api/files \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Delete File

```bash
curl -X DELETE http://localhost:5000/api/files/filename-timestamp.pdf \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## MongoDB Commands

### Connect to MongoDB Container

```bash
docker-compose exec mongo mongosh
```

### View Collections

```javascript
use jay-dashboard
db.getCollectionNames()
db.users.find()
```

## Environment Configuration

### Production Deployment on Ubuntu

```bash
# SSH into server
ssh user@your-ubuntu-server

# Clone repository
git clone <your-repo> /home/user/jay-server
cd /home/user/jay-server

# Create .env with production secrets
nano .env
# Set JWT_SECRET to a strong random value

# Build and deploy
docker-compose up -d --build

# View logs
docker-compose logs -f

# Set up auto-restart
sudo systemctl enable docker
```

### Cloudflare Tunnel Setup

```bash
# Install cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create jay-dashboard

# Configure ingress rules (edit ~/.cloudflared/config.yml)
# Then run: cloudflared tunnel run
```

## Troubleshooting

### Check if ports are in use (Windows)

```powershell
# Find process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Find process using port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Find process using port 27017
Get-Process -Id (Get-NetTCPConnection -LocalPort 27017).OwningProcess
```

### View Docker Compose Network

```bash
docker network ls
docker network inspect jay-server_jay-network
```

### Restart a Specific Service

```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mongo
```

### Clean Up Docker (Remove unused images/volumes)

```bash
docker system prune -a
docker volume prune
```

## File Locations

- Frontend: `./frontend/` (Vite React App)
- Backend: `./backend/` (Express API)
- MongoDB Data: Docker volume `jay-server_mongo_data`
- Uploads: `./backend/uploads/`
- Configs: `docker-compose.yml`, `.env`
