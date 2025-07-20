#!/bin/bash

# SearXNG Theme Manager
# Usage: ./searxng-theme.sh [apply|remove|restart]

SEARXNG_CONTAINER="searxng"
THEME_DIR="/Users/theron/Github/Tron/searxng-custom"
SETTINGS_FILE="/Users/theron/Github/Tron/searxng-settings.yml"

echo "🎨 SearXNG Theme Manager"
echo "======================="

case "${1:-apply}" in
    "apply")
        echo "📥 Applying Tron theme to SearXNG..."
        
        # Check if container is running
        if ! docker ps | grep -q $SEARXNG_CONTAINER; then
            echo "❌ SearXNG container not running. Starting with theme..."
            docker-compose -f docker-compose.searxng.yml up -d
        else
            echo "✅ SearXNG container is running"
            echo "💡 Use browser console method for instant theming, or restart for volume mount"
        fi
        
        echo ""
        echo "🚀 Quick Theme Application Methods:"
        echo ""
        echo "1️⃣  Browser Console (Instant):"
        echo "   - Open https://search.theronlindsay.dev"
        echo "   - Press F12 to open console"
        echo "   - Paste the code from searxng-theme-installer.html"
        echo ""
        echo "2️⃣  Bookmarklet (One-click):"
        echo "   - Open searxng-theme-installer.html in browser"
        echo "   - Drag the bookmarklet to your bookmarks bar"
        echo "   - Click it while on SearXNG"
        echo ""
        echo "3️⃣  Permanent Install (Restart required):"
        echo "   - Run: ./searxng-theme.sh restart"
        ;;
        
    "remove")
        echo "🧹 Removing custom theme..."
        echo "💡 Refresh SearXNG page to see original theme"
        echo "   Or run: ./searxng-theme.sh restart"
        ;;
        
    "restart")
        echo "🔄 Restarting SearXNG with volume mounts..."
        
        # Stop current container
        docker stop $SEARXNG_CONTAINER 2>/dev/null
        docker rm $SEARXNG_CONTAINER 2>/dev/null
        
        # Start with docker-compose (includes volume mounts)
        cd /Users/theron/Github/Tron
        docker-compose -f docker-compose.searxng.yml up -d
        
        echo "⏳ Waiting for SearXNG to start..."
        sleep 5
        
        # Check if it's running
        if docker ps | grep -q $SEARXNG_CONTAINER; then
            echo "✅ SearXNG restarted successfully!"
            echo "🌐 Available at: https://search.theronlindsay.dev"
            echo "📁 Custom files mounted from: $THEME_DIR"
        else
            echo "❌ Failed to start SearXNG. Check logs:"
            docker logs $SEARXNG_CONTAINER
        fi
        ;;
        
    "status")
        echo "📊 SearXNG Status:"
        if docker ps | grep -q $SEARXNG_CONTAINER; then
            echo "✅ Container: Running"
            echo "🌐 URL: https://search.theronlindsay.dev"
            echo "🐳 Container ID: $(docker ps | grep $SEARXNG_CONTAINER | awk '{print $1}')"
            echo "📁 Custom theme files: $(ls -1 $THEME_DIR/static/ 2>/dev/null | wc -l) files"
        else
            echo "❌ Container: Not running"
        fi
        ;;
        
    *)
        echo "Usage: $0 [apply|remove|restart|status]"
        echo ""
        echo "Commands:"
        echo "  apply   - Show theme application methods"
        echo "  remove  - Remove custom theme"
        echo "  restart - Restart with volume mounts"
        echo "  status  - Show current status"
        exit 1
        ;;
esac

echo ""
echo "📁 Theme files location: $THEME_DIR"
echo "⚙️  Settings file: $SETTINGS_FILE"
echo "🔧 Theme installer: searxng-theme-installer.html"
