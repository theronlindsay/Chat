#!/bin/bash

# GitHub Pages Deployment Status Checker
# Usage: ./check-deployment.sh

echo "🔍 GitHub Pages Deployment Status"
echo "================================="

# Check if docs folder exists and has content
if [ -d "docs" ] && [ "$(ls -A docs)" ]; then
    echo "✅ docs/ folder exists and has content"
    echo "📁 Files in docs/:"
    ls -la docs/
    echo ""
    
    # Check docs/index.html content
    if [ -f "docs/index.html" ]; then
        echo "✅ index.html found"
        echo "📄 Title: $(grep -o '<title[^>]*>[^<]*' docs/index.html | sed 's/<title[^>]*>//')"
        echo ""
    else
        echo "❌ index.html not found in docs/"
    fi
else
    echo "❌ docs/ folder is empty or doesn't exist"
    echo "💡 Run: npm run build:pages"
    echo ""
fi

# Check if .github/workflows exists
if [ -d ".github/workflows" ]; then
    echo "✅ GitHub Actions workflows configured"
    echo "📋 Workflows:"
    ls -1 .github/workflows/
    echo ""
else
    echo "❌ No GitHub Actions workflows found"
    echo "💡 Workflows should be in .github/workflows/"
    echo ""
fi

# Check vite.config.ts
if grep -q "outDir.*docs" vite.config.ts 2>/dev/null; then
    echo "✅ Vite configured to build to docs/"
else
    echo "❌ Vite not configured for docs/ output"
    echo "💡 Check vite.config.ts: outDir should be 'docs'"
fi

if grep -q "base.*'./'\\|base.*\"./\"" vite.config.ts 2>/dev/null; then
    echo "✅ Vite configured for relative paths"
else
    echo "❌ Vite not configured for relative paths"
    echo "💡 Check vite.config.ts: base should be './'"
fi

echo ""
echo "📊 Build Commands:"
echo "  npm run build:pages    # Build for GitHub Pages"
echo "  npm run deploy:pages   # Build + commit + push"
echo "  npm run preview:pages  # Preview built site"
echo ""
echo "🌐 After deployment, check:"
echo "  https://[username].github.io/[repo-name]/"
