# 🚀 GitHub Pages Deployment Guide

This repository is configured for automatic deployment to GitHub Pages. The built static files are generated in the `docs/` folder.

## 📁 Repository Structure

```
/Users/theron/Github/Tron/
├── docs/                          # ← GitHub Pages serves from here
│   ├── index.html
│   ├── assets/
│   └── vite.svg
├── .github/workflows/
│   ├── deploy.yml                 # Automatic deployment
│   └── build-docs.yml             # Manual deployment
├── src/                           # Source code
├── package.json                   # Build scripts
└── vite.config.ts                 # Build configuration
```

## 🔧 Setup Instructions

### 1. GitHub Repository Settings

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose **Branch: main** and **Folder: /docs**
5. Click **Save**

### 2. Build & Deploy Options

#### Option A: Automatic Deployment (Recommended)
- Push to `main` branch → Automatic build & deploy via GitHub Actions
- Uses `.github/workflows/deploy.yml`

#### Option B: Manual Build & Commit
```bash
# Build and commit docs folder
npm run deploy:pages

# Or step by step:
npm run build:pages
git add docs/
git commit -m "Deploy to GitHub Pages"
git push
```

#### Option C: Manual GitHub Action
- Go to **Actions** tab in GitHub
- Run "Manual Deploy to Docs" workflow

## 🛠 Build Commands

```bash
# Development
npm run dev                # Start dev server

# Production builds
npm run build             # Build to dist/ (default)
npm run build:pages       # Build to docs/ (for GitHub Pages)
npm run preview:pages     # Preview docs/ build

# Deployment
npm run deploy:pages      # Build + commit + push
```

## 🌐 Access Your Site

After deployment, your site will be available at:
```
https://[username].github.io/[repository-name]/
```

For example: `https://theronlindsay.github.io/Tron/`

## ⚙️ Configuration Details

### Vite Configuration (vite.config.ts)
```typescript
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'docs',        # Output to docs/ for GitHub Pages
    emptyOutDir: true,
  },
  base: './',              # Relative paths for GitHub Pages
})
```

### Package.json Scripts
- `build:pages` - Builds to docs/ folder
- `deploy:pages` - Builds, commits, and pushes
- `preview:pages` - Previews the docs/ build

## 🔍 Troubleshooting

### Common Issues:

1. **404 Error**: Check GitHub Pages source is set to `/docs` folder
2. **Assets not loading**: Ensure `base: './'` in vite.config.ts
3. **Build fails**: Check Node.js version in GitHub Actions (set to 20)

### Manual Deployment:
If automatic deployment fails, you can always build manually:
```bash
npm run build:pages
git add docs/
git commit -m "Update GitHub Pages"
git push
```

## 📋 Checklist

- [ ] Repository pushed to GitHub
- [ ] GitHub Pages configured (Settings → Pages → Deploy from branch → main → /docs)
- [ ] GitHub Actions enabled (if using automatic deployment)
- [ ] First build completed successfully
- [ ] Site accessible at GitHub Pages URL

## 🔗 Related Files

- `vite.config.ts` - Build configuration
- `.github/workflows/deploy.yml` - Automatic deployment
- `.gitignore` - Updated to include docs/ folder
- `package.json` - Deployment scripts
