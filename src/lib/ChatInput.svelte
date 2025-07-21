<script lang="ts">
  import { selectedModel, messages, isSendingMessage, errorMessage, webSearchEnabled, addMessage, clearError } from './stores';
  import { ollamaAPI } from './ollama';
  import type { ChatMessage } from './ollama';

  let messageInput = '';
  let textareaElement: HTMLTextAreaElement;

  // Export function to send message programmatically
  export function sendMessageProgrammatically(message: string) {
    if (!message.trim() || !$selectedModel || $isSendingMessage) {
      return;
    }
    messageInput = message;
    sendMessage();
  }

  async function sendMessage() {
    if (!messageInput.trim() || !$selectedModel || $isSendingMessage) {
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageInput.trim(),
      timestamp: new Date()
    };

    // Add user message to chat
    addMessage(userMessage);
    
    // Clear input and error
    const currentInput = messageInput;
    messageInput = '';
    clearError();
    isSendingMessage.set(true);

    try {
      // Prepare chat history for API
      const chatHistory = $messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Send to Ollama
      const response = await ollamaAPI.chat({
        model: $selectedModel,
        messages: chatHistory,
        enableWebSearch: $webSearchEnabled
      });

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message.content,
        timestamp: new Date()
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      errorMessage.set(error instanceof Error ? error.message : 'Failed to send message');
      
      // Restore the message input if there was an error
      messageInput = currentInput;
    } finally {
      isSendingMessage.set(false);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      } else {
        // Send message with Enter
        event.preventDefault();
        sendMessage();
      }
    }
  }

  function autoResize() {
    if (textareaElement) {
      textareaElement.style.height = 'auto';
      textareaElement.style.height = textareaElement.scrollHeight + 'px';
    }
  }

  // Auto-resize on input change
  $: if (messageInput !== undefined) {
    setTimeout(autoResize, 0);
  }
</script>

<div class="chat-input-container">
  <div class="input-wrapper">
    <textarea
      bind:this={textareaElement}
      bind:value={messageInput}
      on:keydown={handleKeydown}
      on:input={autoResize}
      placeholder={$selectedModel ? `Message ${$selectedModel}...` : 'Select a model to start chatting...'}
      disabled={!$selectedModel || $isSendingMessage}
      rows="1"
      class="message-input"
      class:disabled={!$selectedModel || $isSendingMessage}
    ></textarea>
    
    <button 
      class="send-button"
      on:click={sendMessage}
      disabled={!messageInput.trim() || !$selectedModel || $isSendingMessage}
      title="Send message (Enter)"
    >
      {#if $isSendingMessage}
        <span class="loading-spinner">⏳</span>
      {:else}
        <span class="send-icon">➤</span>
      {/if}
    </button>
  </div>
  
  <div class="input-help">
    <span class="help-text">
      Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line
      {#if $webSearchEnabled}
        <span class="web-search-indicator">🌐 Web search enabled</span>
      {/if}
    </span>
    {#if $selectedModel}
      <span class="model-indicator">Using: {$selectedModel}</span>
    {/if}
  </div>
</div>

<style>
  .chat-input-container {
    border-top: 1px solid var(--md-sys-color-surface-container-highest);
    padding: 16px;
    background: var(--md-sys-color-surface-container-low);
    flex-shrink: 0;
  }

  .input-wrapper {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    background: var(--md-sys-color-surface-container);
    border: none;
    border-radius: 24px;
    padding: 8px 16px;
    transition: box-shadow 0.2s ease;
  }

  .input-wrapper:focus-within {
    box-shadow: 0 0 0 2px var(--md-sys-color-primary);
  }

  .message-input {
    flex: 1;
    border: none;
    background: transparent;
    resize: none;
    outline: none;
    font-family: 'Roboto', system-ui, -apple-system, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    padding: 8px 0;
    min-height: 24px;
    max-height: 120px;
    overflow-y: auto;
    color: var(--md-sys-color-on-surface);
  }

  .message-input.disabled {
    color: var(--md-sys-color-on-surface-variant);
    cursor: not-allowed;
  }

  .message-input::placeholder {
    color: var(--md-sys-color-on-surface-variant);
  }

  .send-button {
    background: var(--md-sys-color-primary);
    border: none;
    border-radius: 12px;
    color: var(--md-sys-color-on-primary);
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    height: 44px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  }

  .send-button:hover:not(:disabled) {
    background: var(--md-sys-color-primary-container);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .send-button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  }

  .send-button:disabled {
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface-variant);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .send-icon {
    font-size: 20px;
    transform: rotate(0deg);
  }

  .loading-spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .input-help {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding: 0 8px;
    font-size: 12px;
    color: var(--md-sys-color-on-surface-variant);
    font-weight: 400;
  }

  .help-text kbd {
    background: var(--md-sys-color-surface-container-high);
    border: 1px solid var(--md-sys-color-outline);
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 11px;
    color: var(--md-sys-color-on-surface);
    font-family: 'Roboto Mono', monospace;
  }

  .model-indicator {
    font-weight: 500;
    color: var(--md-sys-color-primary);
  }

  .web-search-indicator {
    color: var(--md-sys-color-tertiary);
    font-weight: 500;
    margin-left: 8px;
  }

  @media (max-width: 768px) {
    .chat-input-container {
      padding: 12px;
    }

    .input-help {
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;
    }
  }
</style>
