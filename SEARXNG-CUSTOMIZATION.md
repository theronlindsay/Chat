# SearXNG Customization Guide

## 🎨 How to Customize Your SearXNG Instance

### Method 1: Browser Extension/Userscript (Immediate)

**Install Tampermonkey/Greasemonkey and use the userscript:**
1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Open the userscript file: `searxng-tron-theme.user.js`
3. Copy and paste into Tampermonkey
4. The theme will automatically apply to `https://search.theronlindsay.dev`

### Method 2: Bookmarklet (Instant Testing)

Create a bookmark with this JavaScript:

```javascript
javascript:(function(){const style=document.createElement('style');style.textContent=':root{--tron-primary:#00D2FF;--tron-secondary:#00FF88;--tron-dark:#0A0A0A;--tron-text:#E0E0E0;}body{background:linear-gradient(135deg,var(--tron-dark) 0%,#050505 100%)!important;color:var(--tron-text)!important;}#q,#search{background:rgba(255,255,255,0.05)!important;border:2px solid var(--tron-primary)!important;border-radius:25px!important;color:var(--tron-text)!important;padding:12px 20px!important;}#q:focus,#search:focus{border-color:var(--tron-secondary)!important;box-shadow:0 0 20px rgba(0,210,255,0.3)!important;}.result,.search_result{background:rgba(255,255,255,0.03)!important;border:1px solid #333!important;border-radius:10px!important;padding:20px!important;}.result h3 a,.search_result h3 a{color:var(--tron-primary)!important;}';document.head.appendChild(style);})();
```

### Method 3: Docker Volume Mount (Persistent)

1. **Stop current SearXNG container:**
   ```bash
   docker stop searxng
   docker rm searxng
   ```

2. **Start with custom volume mounts:**
   ```bash
   docker run -d \
     --name searxng \
     -p 8080:8080 \
     -v /Users/theron/Github/Tron/searxng-custom/static:/usr/local/searxng/searx/static/themes/simple/custom:ro \
     -v /tmp/searxng_settings.yml:/etc/searxng/settings.yml:ro \
     searxng/searxng:latest
   ```

3. **Reference custom CSS in templates** (requires template modification)

### Method 4: Settings Configuration (Advanced)

Modify SearXNG settings to include custom CSS paths:

```yaml
ui:
  static_path: "/custom"
  theme_args:
    simple_style: dark
    custom_css: "/custom/tron-theme.css"
```

## 🎯 Available Customizations

### Colors & Theme
- **Primary Color**: `#00D2FF` (Tron Blue)
- **Secondary Color**: `#00FF88` (Tron Green)  
- **Background**: Dark gradient
- **Text**: Light gray (`#E0E0E0`)

### Components Styled
- ✅ Search input with glow effects
- ✅ Search results with hover animations
- ✅ Navigation bar with backdrop blur
- ✅ Buttons with gradient backgrounds
- ✅ Custom scrollbars
- ✅ Responsive design

### Features
- **Hover Effects**: Results lift and glow on hover
- **Focus States**: Search input glows when focused
- **Smooth Transitions**: All interactions are animated
- **Mobile Responsive**: Works on all screen sizes

## 🔧 Quick Test

Visit `https://search.theronlindsay.dev` and:

1. **Paste this in console** for instant theme:
   ```javascript
   const style = document.createElement('style');
   style.textContent = `
     body { background: linear-gradient(135deg, #0A0A0A 0%, #050505 100%) !important; color: #E0E0E0 !important; }
     #q { background: rgba(255,255,255,0.05) !important; border: 2px solid #00D2FF !important; border-radius: 25px !important; color: #E0E0E0 !important; padding: 12px 20px !important; }
     .result { background: rgba(255,255,255,0.03) !important; border: 1px solid #333 !important; border-radius: 10px !important; padding: 20px !important; }
     .result h3 a { color: #00D2FF !important; }
   `;
   document.head.appendChild(style);
   ```

2. **Or use the bookmarklet** above for one-click theming

## 📁 Files Created

- `searxng-tron-theme.user.js` - Tampermonkey userscript
- `searxng-custom/static/tron-theme.css` - Custom CSS file
- `docker-compose.searxng.yml` - Docker compose with volume mounts

## 🚀 Next Steps

1. **Test the bookmarklet** for immediate results
2. **Install the userscript** for persistent theming
3. **Modify Docker setup** for permanent custom files
4. **Customize colors/animations** to your preference
