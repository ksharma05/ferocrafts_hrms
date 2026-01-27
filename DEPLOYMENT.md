# Deployment Guide

This guide covers deployment of FeroCrafts HRMS to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
  - [Railway](#railway)
  - [Render](#render)
  - [Fly.io](#flyio)
- [Database Setup](#database-setup)
- [SSL/HTTPS](#sslhttps)
- [Monitoring](#monitoring)
- [Backup Strategy](#backup-strategy)

## Prerequisites

- Docker and Docker Compose (for Docker deployment)
- MongoDB Atlas account (for cloud database)
- Domain name (optional, for custom domain)
- Git repository

## Environment Variables

Create a `.env` file based on `.env.example`:

### Required Variables

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ferocrafts_hrms

# JWT Secrets (MUST be changed in production)
JWT_SECRET=your_super_secure_jwt_secret_min_32_chars
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_min_32_chars

# JWT Expiration
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# URLs
CLIENT_URL=https://your-frontend-domain.com
BASE_URL=https://your-backend-domain.com

# Node Environment
NODE_ENV=production
PORT=5000
```

### Optional Variables

```env
# Logging (for external services)
SENTRY_DSN=your_sentry_dsn

# Cloud Storage (if using)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Docker Deployment

### 1. Build and Run with Docker Compose

```bash
# Clone repository
git clone <your-repo-url>
cd FeroCraftsHRMS

# Create .env file
cp .env.example .env
# Edit .env with your values

# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Build Docker Image Manually

```bash
# Build image
docker build -t ferocrafts-hrms:latest .

# Run container
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name ferocrafts-app \
  ferocrafts-hrms:latest
```

### 3. Production Docker Compose

For production, use `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  app:
    image: ferocrafts-hrms:latest
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - mongodb
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:5000/health')"]
      interval: 30s
      timeout: 10s
      retries: 3

  mongodb:
    image: mongo:7
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}

volumes:
  mongodb_data:
```

## Cloud Deployment

### Railway

Railway offers free tier with $5/month credit.

1. **Create Account**: Sign up at [railway.app](https://railway.app)

2. **Deploy from GitHub**:
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Initialize project
   railway init

   # Add MongoDB
   railway add mongodb

   # Deploy
   railway up
   ```

3. **Set Environment Variables**:
   - Go to your project dashboard
   - Click on "Variables"
   - Add all required environment variables

4. **Custom Domain** (Optional):
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Update DNS records as instructed

### Render

Render offers free tier with limitations.

1. **Create Account**: Sign up at [render.com](https://render.com)

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `ferocrafts-hrms`
     - Environment: `Docker`
     - Region: Choose closest to your users
     - Branch: `main`

3. **Environment Variables**:
   - Add all required variables in the "Environment" section

4. **Database**:
   - Create a new MongoDB instance or use MongoDB Atlas
   - Copy connection string to `MONGO_URI`

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete

### Fly.io

Fly.io offers generous free tier.

1. **Install Fly CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**:
   ```bash
   fly auth login
   ```

3. **Launch App**:
   ```bash
   fly launch
   ```

4. **Set Secrets**:
   ```bash
   fly secrets set JWT_SECRET=your_secret
   fly secrets set JWT_REFRESH_SECRET=your_refresh_secret
   fly secrets set MONGO_URI=your_mongo_uri
   # ... set all other secrets
   ```

5. **Deploy**:
   ```bash
   fly deploy
   ```

6. **Scale** (if needed):
   ```bash
   fly scale count 2
   ```

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Account**: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Cluster**:
   - Choose free tier (M0)
   - Select region closest to your app
   - Create cluster

3. **Configure Access**:
   - Database Access: Create user with read/write permissions
   - Network Access: Add IP addresses (or 0.0.0.0/0 for all - less secure)

4. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Add to `MONGO_URI` in `.env`

5. **Run Migrations**:
   ```bash
   cd server
   npm run migrate:up
   ```

## SSL/HTTPS

### Using Let's Encrypt (Free)

If deploying on your own server:

1. **Install Certbot**:
   ```bash
   sudo apt-get update
   sudo apt-get install certbot
   ```

2. **Get Certificate**:
   ```bash
   sudo certbot certonly --standalone -d your-domain.com
   ```

3. **Configure Nginx** (if using as reverse proxy):
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;

       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Cloud Platforms

Most cloud platforms (Railway, Render, Fly.io) provide automatic SSL certificates.

## Monitoring

### Health Checks

The application includes a health check endpoint:

```
GET /health
```

Response:
```json
{
  "success": true,
  "message": "Server is healthy",
  "uptime": 12345,
  "timestamp": "2025-01-01T00:00:00.000Z",
  "database": "connected"
}
```

### Uptime Monitoring

Use free services:

1. **UptimeRobot** (free: 50 monitors)
   - Sign up at [uptimerobot.com](https://uptimerobot.com)
   - Add monitor for `https://your-domain.com/health`
   - Set check interval (5 minutes recommended)

2. **Better Stack** (free tier available)
   - Sign up at [betterstack.com](https://betterstack.com)
   - Add uptime monitor
   - Configure alerts

### Application Monitoring

1. **Logs**:
   ```bash
   # View logs (Docker)
   docker-compose logs -f app

   # View logs (Railway)
   railway logs

   # View logs (Render)
   # Available in dashboard

   # View logs (Fly.io)
   fly logs
   ```

2. **Error Tracking** (Optional):
   - Use Sentry (free tier: 5k events/month)
   - Add `SENTRY_DSN` to environment variables

## Backup Strategy

### Database Backups

1. **MongoDB Atlas** (Automatic):
   - Backups are automatic on paid tiers
   - Free tier: Manual backups only

2. **Manual Backup**:
   ```bash
   # Backup
   mongodump --uri="your_mongo_uri" --out=./backup

   # Restore
   mongorestore --uri="your_mongo_uri" ./backup
   ```

3. **Automated Backup Script**:
   ```bash
   #!/bin/bash
   # backup.sh

   DATE=$(date +%Y%m%d_%H%M%S)
   BACKUP_DIR="/backups/mongodb_$DATE"

   # Create backup
   mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR"

   # Compress
   tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"

   # Remove uncompressed
   rm -rf "$BACKUP_DIR"

   # Upload to cloud storage (optional)
   # aws s3 cp "$BACKUP_DIR.tar.gz" s3://your-bucket/backups/

   # Keep only last 30 days
   find /backups -name "mongodb_*.tar.gz" -mtime +30 -delete
   ```

4. **Schedule with Cron**:
   ```bash
   # Run daily at 2 AM
   0 2 * * * /path/to/backup.sh
   ```

### File Backups

Backup uploaded files (selfies, documents, PDFs):

```bash
#!/bin/bash
# backup-files.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/files_$DATE"

# Create backup
mkdir -p "$BACKUP_DIR"
cp -r /app/server/uploads "$BACKUP_DIR/"
cp -r /app/server/pdfs "$BACKUP_DIR/"

# Compress
tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"

# Remove uncompressed
rm -rf "$BACKUP_DIR"

# Upload to cloud storage
# rclone copy "$BACKUP_DIR.tar.gz" remote:backups/
```

## Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Database connected and migrations run
- [ ] SSL/HTTPS configured
- [ ] Health check endpoint responding
- [ ] Uptime monitoring configured
- [ ] Error tracking configured (optional)
- [ ] Backup strategy implemented
- [ ] DNS records configured (if using custom domain)
- [ ] CORS settings updated for production domain
- [ ] Test all critical features:
  - [ ] User registration/login
  - [ ] Employee check-in with selfie
  - [ ] Attendance approval
  - [ ] Payout generation
  - [ ] PDF download
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Documentation updated

## Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check `MONGO_URI` format
   - Verify network access in MongoDB Atlas
   - Check firewall rules

2. **CORS Errors**:
   - Update `CLIENT_URL` in environment variables
   - Restart application

3. **File Upload Fails**:
   - Check disk space
   - Verify upload directory permissions
   - Check file size limits

4. **High Memory Usage**:
   - Check for memory leaks
   - Optimize database queries
   - Implement caching
   - Scale horizontally

5. **Slow Response Times**:
   - Add database indexes
   - Enable caching
   - Use CDN for static assets
   - Optimize images

## Support

For deployment issues:
- Check logs first
- Review this documentation
- Create an issue on GitHub
- Email: support@ferocrafts.com

---

**Security Note**: Never commit `.env` files or secrets to version control. Always use environment variables or secret management services.

