#!/bin/bash

# Ollama Deployment Test Script
# Tests the Ollama server setup for theronlindsay.dev deployment

echo "🔍 Ollama Deployment Test"
echo "========================="

# Check if Ollama is running locally
echo "1. Checking local Ollama server..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "   ✅ Local Ollama server is running"
    
    # Check available models
    MODEL_COUNT=$(curl -s http://localhost:11434/api/tags | jq '.models | length' 2>/dev/null || echo "unknown")
    echo "   📦 Available models: $MODEL_COUNT"
    
    # Check CORS configuration
    CORS_HEADER=$(curl -s -I http://localhost:11434/api/tags | grep -i "access-control-allow-origin" | head -1)
    if [ -n "$CORS_HEADER" ]; then
        echo "   ✅ CORS headers configured: $CORS_HEADER"
    else
        echo "   ⚠️  No CORS headers found"
    fi
else
    echo "   ❌ Local Ollama server not accessible"
    exit 1
fi

# Check if running with proper environment variables
echo ""
echo "2. Checking Ollama configuration..."
OLLAMA_PID=$(pgrep ollama)
if [ -n "$OLLAMA_PID" ]; then
    OLLAMA_ORIGINS=$(ps eww $OLLAMA_PID | tr ' ' '\n' | grep OLLAMA_ORIGINS | head -1)
    if [ -n "$OLLAMA_ORIGINS" ]; then
        echo "   ✅ $OLLAMA_ORIGINS"
    else
        echo "   ⚠️  OLLAMA_ORIGINS not set"
    fi
else
    echo "   ❌ Cannot find Ollama process"
fi

# Test built application
echo ""
echo "3. Checking built application..."
if [ -f "docs/index.html" ]; then
    echo "   ✅ Application built in docs/ folder"
    
    # Check if it contains the right configuration
    if grep -q "ollama" docs/assets/*.js 2>/dev/null; then
        echo "   ✅ Ollama configuration found in build"
    else
        echo "   ⚠️  Ollama configuration may not be in build"
    fi
else
    echo "   ❌ Application not built (run 'npm run build')"
fi

# Provide next steps
echo ""
echo "🚀 Next Steps for Deployment:"
echo "=============================="
echo "1. Copy built files to your web server:"
echo "   cp -r docs/* /var/www/theronlindsay.dev/Chat/"
echo ""
echo "2. Add nginx proxy configuration to your theronlindsay.dev config:"
echo "   See nginx-integrated-config.conf for the complete setup"
echo ""
echo "3. Test the proxy after nginx configuration:"
echo "   curl https://theronlindsay.dev/api/ollama/api/tags"
echo ""
echo "4. Access your chat application:"
echo "   https://theronlindsay.dev/Chat"
echo ""
echo "📋 Detailed instructions in PRODUCTION-DEPLOYMENT.md"
