<script lang="ts">
  import ModelSelector from './lib/ModelSelector.svelte';
  import ChatArea from './lib/ChatArea.svelte';
  import ChatInput from './lib/ChatInput.svelte';
  import WebSearchToggle from './lib/WebSearchToggle.svelte';
  import ErrorBanner from './lib/ErrorBanner.svelte';
  import DebugPanel from './lib/DebugPanel.svelte';
  import { errorMessage, currentServerUrl, isConnected } from './lib/stores';
</script>

<main>
  <div class="app-header">
    <h1>🤖 Ollama Chat Interface</h1>
    <p class="subtitle">
      {#if $isConnected && $currentServerUrl}
        Connected to {$currentServerUrl} • Web search available
      {:else}
        Attempting to connect to Ollama servers...
      {/if}
    </p>
  </div>

  <div class="chat-container">
    <div class="sidebar">
      <ModelSelector />
      <WebSearchToggle />
      <DebugPanel />
      
      <div class="info-panel">
        <h3>💡 Server Information</h3>
        <div class="info-content">
          <p><strong>Server Configuration:</strong></p>
          <code>Primary: ollama.theronlindsay.dev</code><br>
          <code>Fallback: localhost:11434</code>
          
          {#if $currentServerUrl}
            <p><strong>Currently Connected:</strong></p>
            <code>{$currentServerUrl}</code>
          {/if}
          
          <p><strong>Web Search:</strong></p>
          <p>Enable the toggle above to use web search capabilities with your queries.</p>
          
          <p><strong>Usage Tips:</strong></p>
          <ul>
            <li>The app automatically tries backup servers if the primary fails</li>
            <li>Enable web search for current information</li>
            <li>Press Enter to send, Shift+Enter for new lines</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="main-chat">
      <ErrorBanner />
      
      <ChatArea />
      <ChatInput />
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #f5f5f5;
    height: 100vh;
    overflow: hidden;
  }

  :global(#app) {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .app-header {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    color: white;
    padding: 1rem;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .app-header h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
    font-weight: 700;
  }

  .subtitle {
    margin: 0;
    opacity: 0.9;
    font-size: 1rem;
  }

  .chat-container {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  .sidebar {
    width: 350px;
    background: white;
    border-right: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .main-chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .info-panel {
    padding: 1rem;
    border-top: 1px solid #e9ecef;
    background: #f8f9fa;
    flex-shrink: 0;
  }

  .info-panel h3 {
    margin: 0 0 1rem 0;
    color: #495057;
    font-size: 1rem;
  }

  .info-content {
    font-size: 0.875rem;
    line-height: 1.4;
    color: #6c757d;
  }

  .info-content p {
    margin: 0 0 0.75rem 0;
  }

  .info-content p:last-child {
    margin-bottom: 0;
  }

  .info-content code {
    background: #e9ecef;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.8rem;
    display: inline-block;
    margin: 0.2rem 0;
  }

  .info-content ul {
    margin: 0.5rem 0;
    padding-left: 1.2rem;
  }

  .info-content li {
    margin-bottom: 0.25rem;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .chat-container {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      height: auto;
      max-height: 40vh;
      border-right: none;
      border-bottom: 1px solid #e9ecef;
    }

    .info-panel {
      display: none; /* Hide info panel on mobile to save space */
    }

    .app-header h1 {
      font-size: 1.5rem;
    }

    .app-header {
      padding: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .sidebar {
      max-height: 35vh;
    }

    .app-header h1 {
      font-size: 1.3rem;
    }

    .subtitle {
      font-size: 0.9rem;
    }
  }
</style>
