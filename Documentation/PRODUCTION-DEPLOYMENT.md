# Production Deployment Guide

## Current Configuration Status

✅ **Environment Detection**: The app automatically detects if it's running locally vs. in production
✅ **Server Auto-Selection**: Uses localhost for development, nginx proxy for production
✅ **CORS Handling**: Properly configured for cross-origin requests
✅ **Same-Machine Deployment**: Ollama runs on the same server as the website

## Deployment Architecture

Your setup:
- **Website**: `theronlindsay.dev/Chat`
- **Ollama Server**: Running on the same machine as the website
- **Access Method**: nginx reverse proxy to integrate Ollama API

## Required Setup Steps

### 1. Ollama Server Configuration

Your Ollama server is already running correctly:
```bash
# Verify Ollama is running with CORS enabled
ps aux | grep ollama
# Should show: ollama serve with OLLAMA_ORIGINS=*
```

### 2. Nginx Configuration

Choose one of these approaches:

#### Option A: Integrated Proxy (Recommended)
Add this to your main `theronlindsay.dev` nginx configuration:

```nginx
# Add this location block to your existing theronlindsay.dev server config
location /api/ollama/ {
    rewrite ^/api/ollama/(.*) /$1 break;
    proxy_pass http://127.0.0.1:11434;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
    add_header 'Access-Control-Allow-Headers' 'Origin, Content-Type, Accept, Authorization, X-Requested-With' always;
    
    # Handle preflight OPTIONS requests
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'Origin, Content-Type, Accept, Authorization, X-Requested-With' always;
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }
    
    # Proxy settings
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 86400;
    proxy_send_timeout 86400;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

#### Option B: Subdomain (Alternative)
Use the existing `nginx-ollama-config.conf` to set up `ollama.theronlindsay.dev`

### 3. Deploy Your Chat Application

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Copy built files to your web server**:
   ```bash
   # Copy the built files to your web server
   cp -r build/* /var/www/theronlindsay.dev/Chat/
   ```

3. **Test the deployment**:
   ```bash
   # Test the nginx proxy
   curl https://theronlindsay.dev/api/ollama/api/tags
   
   # Should return JSON with available models
   ```

### 4. Verification Steps

1. **Check Ollama is accessible**:
   ```bash
   curl http://localhost:11434/api/tags
   ```

2. **Check nginx proxy works**:
   ```bash
   curl https://theronlindsay.dev/api/ollama/api/tags
   ```

3. **Test from browser**:
   - Open `https://theronlindsay.dev/Chat`
   - Use the Debug Panel to test server connections
   - Try selecting a model and sending a message

## Current Status

✅ **Ollama Server**: Running on your machine with CORS enabled
✅ **Models Available**: Multiple models pulled and ready
✅ **Code Configuration**: Updated to use nginx proxy approach
❓ **Nginx Setup**: Needs to be configured with the proxy rules above
❓ **Build Deployment**: Built files need to be copied to web server

## Troubleshooting

### If you get "Connection Failed" errors:

1. **Check nginx configuration**:
   ```bash
   nginx -t  # Test configuration
   systemctl reload nginx  # Reload if needed
   ```

2. **Check logs**:
   ```bash
   tail -f /var/log/nginx/error.log
   ```

3. **Test proxy directly**:
   ```bash
   curl -v https://theronlindsay.dev/api/ollama/api/tags
   ```

### If you get 403 errors:

1. **Verify CORS headers in response**:
   ```bash
   curl -I https://theronlindsay.dev/api/ollama/api/tags
   ```

2. **Check Ollama environment**:
   ```bash
   ps eww $(pgrep ollama) | grep OLLAMA_ORIGINS
   ```

## Next Steps

1. ✅ Update nginx configuration with the proxy rules above
2. ✅ Build and deploy the updated chat application
3. ✅ Test the complete setup end-to-end
4. ✅ Monitor logs for any issues

The setup should work smoothly since Ollama is already running on your machine with proper CORS configuration!
