# 🤖 Ollama Chat Interface with Web Search

A modern, responsive web interface for chatting with AI models running on [Ollama](https://ollama.ai). Built with SvelteKit and TypeScript, with integrated support for web search capabilities.

## ✨ Features

- **Model Selection**: Browse and switch between available Ollama models
- **Real-time Chat**: Complete conversations with AI models
- **Web Search Integration**: Enable AI to search the web for current information (requires ollama-web-search extension)
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Connection Status**: Visual indicators for Ollama server connectivity
- **Error Handling**: Graceful error messages and recovery
- **Chat Management**: Clear conversations and scroll to latest messages
- **Custom Server Support**: Easy configuration for remote Ollama servers

## 🌐 Web Search Setup

This interface supports the [ollama-web-search](https://github.com/GaryKu0/ollama-web-search) extension for enabling web search capabilities:

1. **Install the extension** following the instructions in the repository
2. **Toggle web search** using the 🌐 Web Search toggle in the interface
3. **Ask questions that require current information**, like:
   - "What's the latest news about AI?"
   - "What's the current weather in New York?"
   - "Find recent information about Svelte 5"

When web search is enabled, messages will show a 🌐 badge indicating web-enhanced responses.

## 🚀 Quick Start

### Prerequisites

1. **Install Ollama**: Download and install from [ollama.ai](https://ollama.ai)
2. **Node.js**: Version 16 or higher

### Setup

1. **Clone or download this project**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Ollama server**:
   ```bash
   ollama serve
   ```

4. **Pull an AI model** (if you haven't already):
   ```bash
   ollama pull llama2
   # or try other models like:
   # ollama pull codellama
   # ollama pull mistral
   # ollama pull llama2:13b
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:5173`

## 🔧 Configuration

### Custom Ollama Server URL

To connect to a remote Ollama server or change the default URL:

1. Open `src/lib/ollama.ts`
2. Modify the `OLLAMA_BASE_URL` constant:

```typescript
// For a remote server:
export const OLLAMA_BASE_URL = 'http://your-server.com:11434';

// For a different port:
export const OLLAMA_BASE_URL = 'http://localhost:8080';

// For HTTPS:
export const OLLAMA_BASE_URL = 'https://your-secure-ollama-api.com';
```

### Web Search Configuration

Web search can be configured in `src/lib/ollama.ts`:

```typescript
// Enable/disable web search globally
export const WEB_SEARCH_ENABLED = true;

// Customize the system message for web search
export const WEB_SEARCH_SYSTEM_MESSAGE = `Your custom prompt here...`;
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript and Svelte checks

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── ollama.ts          # Ollama API client and types
│   ├── stores.ts          # Svelte stores for state management
│   ├── ModelSelector.svelte # Model selection component
│   ├── ChatArea.svelte    # Chat messages display
│   ├── ChatInput.svelte   # Message input component
│   ├── MessageBubble.svelte # Individual message component
│   └── WebSearchToggle.svelte # Web search toggle control
├── app.css               # Global styles
├── App.svelte           # Main application component
└── main.ts              # Application entry point
```

## 🤝 Usage Tips

### Model Management
- The interface automatically detects available models from your Ollama installation
- Use the refresh button (🔄) to reload the model list
- Model size is displayed to help you choose based on your system resources

### Chat Features
- Press `Enter` to send a message
- Press `Shift+Enter` for a new line
- Use the "Clear" button to start a fresh conversation
- The interface auto-scrolls to new messages

### Web Search Features
- Toggle the 🌐 Web Search switch to enable/disable web capabilities
- When enabled, messages with web search results show a 🌐 badge
- The input area shows "🌐 Web search enabled" when active
- Web search works best with questions requiring current information

### Troubleshooting
- **"Cannot connect to Ollama server"**: Ensure Ollama is running (`ollama serve`)
- **"No models available"**: Pull at least one model (`ollama pull llama2`)
- **"Web search unavailable"**: Install the ollama-web-search extension
- **Slow responses**: Consider using smaller models on less powerful hardware

## 🛠️ Development

This project uses:
- **SvelteKit** with Vite for fast development and building
- **TypeScript** for type safety
- **CSS** with custom properties for styling
- **Svelte stores** for reactive state management

### Adding New Features

The codebase is modular and well-documented. Key areas:

- **API Integration**: `src/lib/ollama.ts`
- **State Management**: `src/lib/stores.ts`
- **UI Components**: `src/lib/*.svelte`
- **Styling**: Component-scoped CSS with global styles in `src/app.css`

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) for providing an excellent local AI server
- [ollama-web-search](https://github.com/GaryKu0/ollama-web-search) for web search capabilities
- [SvelteKit](https://kit.svelte.dev) for the amazing development experience
- The open-source AI community for making local AI accessible
