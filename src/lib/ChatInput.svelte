<script lang="ts">
  import { selectedModel, messages, isSendingMessage, errorMessage, webSearchEnabled, addMessage, clearError } from './stores';
  import { ollamaAPI } from './ollama';
  import type { ChatMessage } from './ollama';

  let messageInput = '';
  let textareaElement: HTMLTextAreaElement;

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
    border-top: 1px solid #e9ecef;
    padding: 1rem;
    background: white;
    flex-shrink: 0; /* Prevent the input from shrinking */
  }

  .input-wrapper {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
    background: #f8f9fa;
    border: 1px solid #ced4da;
    border-radius: 12px;
    padding: 0.5rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .input-wrapper:focus-within {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  }

  .message-input {
    flex: 1;
    border: none;
    background: transparent;
    resize: none;
    outline: none;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.5;
    padding: 0.5rem;
    min-height: 24px;
    max-height: 120px;
    overflow-y: auto;
  }

  .message-input.disabled {
    color: #6c757d;
    cursor: not-allowed;
  }

  .message-input::placeholder {
    color: #adb5bd;
  }

  .send-button {
    background: #007bff;
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    transition: background-color 0.2s, transform 0.1s;
  }

  .send-button:hover:not(:disabled) {
    background: #0056b3;
    transform: translateY(-1px);
  }

  .send-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .send-button:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
  }

  .send-icon {
    font-size: 1.2rem;
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
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #6c757d;
  }

  .help-text kbd {
    background: #e9ecef;
    border: 1px solid #adb5bd;
    border-radius: 3px;
    padding: 0.1rem 0.3rem;
    font-size: 0.7rem;
  }

  .model-indicator {
    font-weight: 500;
    color: #007bff;
  }

  .web-search-indicator {
    color: #198754;
    font-weight: 500;
    margin-left: 0.5rem;
  }

  @media (max-width: 768px) {
    .chat-input-container {
      padding: 0.75rem;
    }

    .input-help {
      flex-direction: column;
      gap: 0.25rem;
      align-items: flex-start;
    }
  }
</style>
