<script lang="ts">
  import { messages, clearMessages, selectedModel, isSendingMessage } from './stores';
  import MessageBubble from './MessageBubble.svelte';
  import { afterUpdate, onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let chatContainer: HTMLDivElement;
  let autoScroll = true;
  let isGeneratingPrompts = false;
  let promptTimeoutId: number | null = null;

  // Start with empty suggestions, wait for AI to generate them
  let currentSuggestions: string[] = [];

  // Generate prompts on page load
  onMount(() => {
    // Only generate prompts if there are no messages
    if ($messages.length === 0) {
      generateInterestingPrompts();
      
      // Add a timeout fallback in case AI generation fails or takes too long
      promptTimeoutId = setTimeout(() => {
        if (isGeneratingPrompts && currentSuggestions.length === 0) {
          console.warn('Prompt generation timed out');
          isGeneratingPrompts = false;
          promptTimeoutId = null;
        }
      }, 15000); // 15 second timeout
    }
  });

  // Auto-scroll to bottom when new messages arrive
  afterUpdate(() => {
    if (autoScroll && chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });

  function handleScroll() {
    if (chatContainer) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      // Consider "at bottom" if within 50px of the bottom
      autoScroll = scrollTop + clientHeight >= scrollHeight - 50;
    }
  }

  function scrollToBottom() {
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
      autoScroll = true;
    }
  }

  function handleClearChat() {
    if (confirm('Are you sure you want to clear all messages?')) {
      clearMessages();
    }
  }

  function handleSuggestionClick(suggestion: string) {
    // Dispatch an event to send the message
    dispatch('sendMessage', { message: suggestion });
  }

  async function generateInterestingPrompts() {
    if ($isSendingMessage) return;
    
    // Clear any existing timeout
    if (promptTimeoutId) {
      clearTimeout(promptTimeoutId);
      promptTimeoutId = null;
    }
    
    isGeneratingPrompts = true;
    
    // Add timeout fallback for manual generation as well
    promptTimeoutId = setTimeout(() => {
      if (isGeneratingPrompts) {
        console.warn('Manual prompt generation timed out');
        isGeneratingPrompts = false;
        promptTimeoutId = null;
      }
    }, 15000); // 15 second timeout
    
    try {
      // Always use gemma3:4b for generating suggestions, regardless of selected chat model
      const promptGenerationMessage = `Generate 4 interesting and diverse questions or prompts that would be great to ask an AI model. Make them engaging, educational, and showcase different capabilities like creative writing, technical explanations, problem-solving, and general knowledge. Return only the questions as a simple list, no numbering, explanations, or extra text. Each question should be on a new line.`;
      
      // Dispatch event to send this message internally (won't show in chat)
      dispatch('generatePrompts', { message: promptGenerationMessage, forceModel: 'gemma3:4b' });
      
    } catch (error) {
      console.error('Error generating prompts:', error);
      // No fallback - keep suggestions empty and let user try manual generation
      if (promptTimeoutId) {
        clearTimeout(promptTimeoutId);
        promptTimeoutId = null;
      }
      isGeneratingPrompts = false;
    }
    // Note: isGeneratingPrompts will be set to false in updateSuggestions when AI responds
  }

  // Function to update suggestions from generated prompts
  export function updateSuggestions(newSuggestions: string[]) {
    // Clear timeout when suggestions are successfully received
    if (promptTimeoutId) {
      clearTimeout(promptTimeoutId);
      promptTimeoutId = null;
    }
    currentSuggestions = newSuggestions;
    isGeneratingPrompts = false; // Stop loading indicator when suggestions are received
  }
</script>

<div class="chat-area">
  <div class="chat-header">
    <h2>Chat Messages</h2>
    <div class="chat-controls">
      {#if $messages.length > 0}
        <button class="clear-button" on:click={handleClearChat} title="Clear all messages">
          🗑️ Clear
        </button>
      {/if}
      {#if $messages.length > 0 && !autoScroll}
        <button class="scroll-button" on:click={scrollToBottom} title="Scroll to bottom">
          ↓ New messages
        </button>
      {/if}
    </div>
  </div>

  <div 
    class="messages-container" 
    bind:this={chatContainer}
    on:scroll={handleScroll}
  >
    {#if $messages.length === 0}
      <div class="empty-state">
        <div class="empty-icon">💬</div>
        <h3>No messages yet</h3>
        <p>Start a conversation with your selected AI model!</p>
        <div class="example-prompts">
          <div class="prompts-header">
            <p><strong>Try asking:</strong></p>
            <button 
              class="generate-prompts-btn" 
              on:click={generateInterestingPrompts}
              disabled={isGeneratingPrompts}
              title="Generate interesting prompts using AI"
            >
              {#if isGeneratingPrompts}
                🔄
              {:else}
                ❓
              {/if}
            </button>
          </div>
          <div class="suggestions-grid">
            {#if isGeneratingPrompts}
              <div class="suggestions-loading">
                <div class="loading-spinner">🔄</div>
                <p>Generating personalized prompts...</p>
              </div>
            {:else if currentSuggestions.length > 0}
              {#each currentSuggestions as suggestion}
                <button 
                  class="suggestion-button"
                  on:click={() => handleSuggestionClick(suggestion)}
                  disabled={$isSendingMessage}
                >
                  {suggestion}
                </button>
              {/each}
            {:else}
              <div class="no-suggestions">
                <p>Click the ❓ button to generate AI-powered conversation starters!</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      {#each $messages as message (message.timestamp)}
        <MessageBubble {message} />
      {/each}

      {#if $isSendingMessage}
        <div class="message-container assistant">
          <div class="message-bubble">
            <div class="typing-indicator">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--md-sys-color-surface-container-low);
    overflow: hidden;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--md-sys-color-surface-container-highest);
    background: var(--md-sys-color-surface-container);
  }

  .chat-header h2 {
    margin: 0;
    font-size: 20px;
    color: var(--md-sys-color-on-surface);
    font-weight: 500;
    font-family: 'Roboto', system-ui, -apple-system, sans-serif;
  }

  .chat-controls {
    display: flex;
    gap: 8px;
  }

  .clear-button, .scroll-button {
    background: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
    border: none;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Roboto', system-ui, -apple-system, sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .clear-button:hover {
    background: var(--md-sys-color-surface-container-high);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  .scroll-button {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    animation: pulse 2s infinite;
  }

  .scroll-button:hover {
    background: var(--md-sys-color-primary-container);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    padding-bottom: 32px;
    scroll-behavior: smooth;
    min-height: 0;
    background: var(--md-sys-color-surface-container-low);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: var(--md-sys-color-on-surface-variant);
    padding: 32px;
  }

  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .empty-state h3 {
    margin: 0 0 8px 0;
    color: var(--md-sys-color-on-surface);
    font-weight: 500;
    font-family: 'Roboto', system-ui, -apple-system, sans-serif;
  }

  .empty-state p {
    margin: 0 0 24px 0;
    font-size: 16px;
    font-family: 'Roboto', system-ui, -apple-system, sans-serif;
    color: var(--md-sys-color-on-surface-variant);
  }

  .example-prompts {
    max-width: 500px;
    text-align: left;
    background: var(--md-sys-color-surface-container);
    padding: 24px;
    border-radius: 16px;
    border: 1px solid var(--md-sys-color-surface-container-highest);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }

  .prompts-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .example-prompts p {
    margin: 0;
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
    font-family: 'Roboto', system-ui, -apple-system, sans-serif;
  }

  .generate-prompts-btn {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    border: none;
    border-radius: 12px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 18px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  }

  .generate-prompts-btn:hover:not(:disabled) {
    background: var(--md-sys-color-primary-container);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .generate-prompts-btn:disabled {
    background: var(--md-sys-color-surface-container);
    opacity: 0.38;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  }

  .suggestions-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .suggestion-button {
    background: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
    border: none;
    border-radius: 12px;
    padding: 16px 20px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    line-height: 1.4;
    font-family: 'Roboto', system-ui, -apple-system, sans-serif;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    min-height: 56px;
    display: flex;
    align-items: center;
  }

  .suggestion-button:hover:not(:disabled) {
    background: var(--md-sys-color-surface-container-high);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .suggestion-button:disabled {
    opacity: 0.38;
    cursor: not-allowed;
    transform: none;
  }

  .suggestion-button:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  .suggestions-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    color: var(--md-sys-color-on-surface-variant);
    text-align: center;
  }

  .loading-spinner {
    font-size: 32px;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
    color: var(--md-sys-color-on-surface);
  }

  .suggestions-loading p {
    margin: 0;
    font-size: 14px;
    font-style: italic;
    color: var(--md-sys-color-on-surface-variant);
    font-family: 'Roboto', system-ui, -apple-system, sans-serif;
  }

  .no-suggestions {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    color: var(--md-sys-color-on-surface-variant);
    text-align: center;
  }

  .no-suggestions p {
    margin: 0;
    font-size: 14px;
    font-style: italic;
    color: var(--md-sys-color-on-surface-variant);
    font-family: 'Roboto', system-ui, -apple-system, sans-serif;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Custom scrollbar */
  .messages-container::-webkit-scrollbar {
    width: 8px;
  }

  .messages-container::-webkit-scrollbar-track {
    background: var(--md-sys-color-surface-container-low);
    border-radius: 4px;
  }

  .messages-container::-webkit-scrollbar-thumb {
    background: var(--md-sys-color-outline);
    border-radius: 4px;
  }

  .messages-container::-webkit-scrollbar-thumb:hover {
    background: var(--md-sys-color-outline-variant);
  }

  @media (max-width: 768px) {
    .chat-header {
      padding: 12px;
    }

    .chat-header h2 {
      font-size: 18px;
    }

    .messages-container {
      padding: 12px;
    }

    .empty-state {
      padding: 16px;
    }

    .empty-icon {
      font-size: 48px;
    }

    .example-prompts {
      max-width: 100%;
      padding: 16px;
    }

    .suggestions-grid {
      gap: 8px;
    }

    .suggestion-button {
      padding: 8px 12px;
      font-size: 12px;
    }

    .generate-prompts-btn {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }

    .suggestions-loading {
      padding: 24px;
    }

    .loading-spinner {
      font-size: 24px;
      margin-bottom: 12px;
    }

    .suggestions-loading p {
      font-size: 12px;
    }
  }

  /* Add styles for the thinking indicator bubble */
  .message-container.assistant {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 12px;
    padding: 0 16px;
    max-width: 100%;
  }

  .message-container.assistant .message-bubble {
    max-width: 75%;
    min-width: 48px;
    border-radius: 18px;
    padding: 8px 12px;
    position: relative;
    word-wrap: break-word;
    overflow-wrap: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    background: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
    border-bottom-left-radius: 4px;
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    padding: 6px 0;
  }

  .typing-indicator .dot {
    width: 8px;
    height: 8px;
    margin: 0 2px;
    background-color: var(--md-sys-color-on-surface-variant);
    border-radius: 50%;
    animation: bounce 1.4s infinite both;
  }

  .typing-indicator .dot:nth-child(1) {
    animation-delay: -0.32s;
  }

  .typing-indicator .dot:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
</style>
