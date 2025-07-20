<script lang="ts">
  import { messages, clearMessages } from './stores';
  import MessageBubble from './MessageBubble.svelte';
  import { afterUpdate } from 'svelte';

  let chatContainer: HTMLDivElement;
  let autoScroll = true;

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
          <p><strong>Try asking:</strong></p>
          <ul>
            <li>"Explain quantum computing in simple terms"</li>
            <li>"Write a Python function to sort a list"</li>
            <li>"What's the weather like today?" (Note: AI may not have real-time data)</li>
            <li>"Help me brainstorm ideas for a project"</li>
          </ul>
        </div>
      </div>
    {:else}
      {#each $messages as message (message.timestamp)}
        <MessageBubble {message} />
      {/each}
    {/if}
  </div>
</div>

<style>
  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    background: #f8f9fa;
  }

  .chat-header h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #495057;
  }

  .chat-controls {
    display: flex;
    gap: 0.5rem;
  }

  .clear-button, .scroll-button {
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .clear-button:hover {
    background: #5a6268;
  }

  .scroll-button {
    background: #007bff;
    animation: pulse 2s infinite;
  }

  .scroll-button:hover {
    background: #0056b3;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    scroll-behavior: smooth;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: #6c757d;
    padding: 2rem;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-state h3 {
    margin: 0 0 0.5rem 0;
    color: #495057;
  }

  .empty-state p {
    margin: 0 0 1.5rem 0;
    font-size: 1.1rem;
  }

  .example-prompts {
    max-width: 400px;
    text-align: left;
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .example-prompts p {
    margin: 0 0 0.5rem 0;
    font-weight: 600;
    color: #495057;
  }

  .example-prompts ul {
    margin: 0;
    padding-left: 1.2rem;
  }

  .example-prompts li {
    margin-bottom: 0.5rem;
    font-style: italic;
    color: #007bff;
  }

  /* Custom scrollbar */
  .messages-container::-webkit-scrollbar {
    width: 8px;
  }

  .messages-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .messages-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  .messages-container::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }

  @media (max-width: 768px) {
    .chat-header {
      padding: 0.75rem;
    }

    .chat-header h2 {
      font-size: 1.1rem;
    }

    .messages-container {
      padding: 0.75rem;
    }

    .empty-state {
      padding: 1rem;
    }

    .empty-icon {
      font-size: 3rem;
    }

    .example-prompts {
      max-width: 100%;
    }
  }
</style>
