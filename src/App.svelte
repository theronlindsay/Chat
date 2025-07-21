<script lang="ts">
  import ModelSelector from './lib/ModelSelector.svelte';
  import ChatArea from './lib/ChatArea.svelte';
  import ChatInput from './lib/ChatInput.svelte';
  import WebSearchToggle from './lib/WebSearchToggle.svelte';
  import Settings from './lib/Settings.svelte';
  import ErrorBanner from './lib/ErrorBanner.svelte';
  import { errorMessage, currentServerUrl, isConnected, selectedModel, isSendingMessage } from './lib/stores';
  import { ollamaAPI } from './lib/ollama';
  import type { ChatMessage } from './lib/ollama';

  let chatInputComponent: ChatInput;
  let chatAreaComponent: ChatArea;

  function handleSendMessage(event: CustomEvent<{message: string}>) {
    const { message } = event.detail;
    chatInputComponent?.sendMessageProgrammatically(message);
  }

  async function handleGeneratePrompts(event: CustomEvent<{message: string, forceModel?: string}>) {
    const { message, forceModel } = event.detail;
    
    if ($isSendingMessage) return;
    
    // Use the forced model (gemma3:4b) for suggestions, or fall back to selected model
    const modelToUse = forceModel || $selectedModel;
    
    if (!modelToUse) return;
    
    try {
      // Send request to generate prompts without adding to chat history
      const response = await ollamaAPI.chat({
        model: modelToUse,
        messages: [{ role: 'user', content: message }],
        enableWebSearch: false
      });
      
      // Parse the response to extract suggestions
      const suggestions = response.message.content
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 4) // Take only first 4 suggestions
        .map(line => line.replace(/^[\d\-\*\•]\s*/, '').trim()); // Clean up formatting
      
      if (suggestions.length > 0) {
        chatAreaComponent?.updateSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error generating prompts:', error);
    }
  }
</script>

<main>
  <div class="app-header">
    <div class="header-left">
      <img src="/tron.svg" alt="TRON Logo" />
      <h1>  TRON</h1>
      <div class="connection-status">
        {#if $isConnected && $currentServerUrl}
          <span class="status-indicator connected"></span>
          <span class="status-text">Connected</span>
        {:else}
          <span class="status-indicator connecting"></span>
          <span class="status-text">Connecting...</span>
        {/if}
      </div>
    </div>
    
    <div class="header-controls">
      <ModelSelector />
      <WebSearchToggle />
      <Settings />
    </div>
  </div>

  <div class="chat-container">
    <ErrorBanner />
    <ChatArea 
      bind:this={chatAreaComponent}
      on:sendMessage={handleSendMessage}
      on:generatePrompts={handleGeneratePrompts}
    />
    <ChatInput bind:this={chatInputComponent} />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: var(--md-sys-color-background);
    color: var(--md-sys-color-on-background);
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    background-color: var(--md-sys-color-surface-container);
    border-bottom: 1px solid var(--md-sys-color-surface-container-highest);
    height: 64px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header-left img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    margin-right: 4px;
    vertical-align: middle;
  }

  .app-header h1 {
    font-size: 24px;
    font-weight: 700;
    color: var(--md-sys-color-on-surface);
    margin: 0;
    font-family: 'Roboto', sans-serif;
  }

  .connection-status {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: var(--md-sys-color-surface-container-high);
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    color: var(--md-sys-color-on-surface-variant);
  }

  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .status-indicator.connected {
    background-color: #4ade80; /* green-400 */
  }

  .status-indicator.connecting {
    background-color: #facc15; /* yellow-400 */
    animation: pulse-yellow 1.5s infinite;
  }

  @keyframes pulse-yellow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .app-header {
      padding: 0.75rem 1rem;
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
      height: auto;
    }

    .header-left {
      justify-content: center;
    }

    .header-controls {
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .app-header h1 {
      font-size: 1.25rem;
    }

    .connection-status {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .app-header {
      padding: 0.5rem;
    }

    .header-controls {
      gap: 0.5rem;
    }

    .app-header h1 {
      font-size: 1.125rem;
    }
  }
</style>
