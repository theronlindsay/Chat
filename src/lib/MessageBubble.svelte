<script lang="ts">
  import { messages } from './stores';
  import type { ChatMessage } from './ollama';

  export let message: ChatMessage;

  function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatContent(content: string): string {
    // Simple markdown-like formatting for code blocks
    return content
      .replace(/```(\w+)?\n([\s\S]*?)\n```/g, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  // Check if message might contain web search results
  $: hasWebSearchIndicators = message.content.includes('search') || 
                              message.content.includes('found') || 
                              message.content.includes('according to') ||
                              message.content.includes('based on recent information') ||
                              message.content.includes('web search') ||
                              message.content.includes('I searched');
</script>

<div class="message-container" class:user={message.role === 'user'} class:assistant={message.role === 'assistant'} class:system={message.role === 'system'}>
  <div class="message-bubble">
    <div class="message-content">
      {@html formatContent(message.content)}
    </div>
    <div class="message-meta">
      <span class="timestamp">{formatTime(message.timestamp)}</span>
      {#if message.role === 'assistant' && hasWebSearchIndicators}
        <span class="web-search-indicator">🌐</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .message-container {
    display: flex;
    margin-bottom: 12px;
    padding: 0 16px;
    max-width: 100%;
  }

  .message-container.user {
    justify-content: flex-end;
  }

  .message-container.assistant {
    justify-content: flex-start;
  }

  .message-container.system {
    justify-content: center;
  }

  .message-bubble {
    max-width: 75%;
    min-width: 48px;
    border-radius: 18px;
    padding: 8px 12px;
    position: relative;
    word-wrap: break-word;
    overflow-wrap: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  }

  .message-container.user .message-bubble {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    border-bottom-right-radius: 4px;
  }

  .message-container.assistant .message-bubble {
    background: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
    border-bottom-left-radius: 4px;
  }

  .message-container.system .message-bubble {
    background: var(--md-sys-color-surface-variant);
    color: var(--md-sys-color-on-surface-variant);
    border-radius: 18px;
    max-width: 60%;
    text-align: center;
    font-style: italic;
  }

  .message-content {
    line-height: 1.4;
    font-size: 16px;
    margin-bottom: 2px;
  }

  .message-meta {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 2px;
  }

  .timestamp {
    font-size: 12px;
    opacity: 0.7;
    white-space: nowrap;
  }

  .message-container.user .timestamp {
    color: rgba(255, 255, 255, 0.7);
  }

  .message-container.assistant .timestamp {
    color: rgba(28, 27, 31, 0.6);
  }

  .web-search-indicator {
    font-size: 12px;
    opacity: 0.8;
  }

  .message-content :global(code) {
    background: rgba(0, 0, 0, 0.08);
    padding: 2px 6px;
    border-radius: 6px;
    font-family: 'Roboto Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
  }

  .message-container.user .message-content :global(code) {
    background: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.95);
  }

  .message-content :global(pre) {
    background: rgba(0, 0, 0, 0.04);
    padding: 12px;
    border-radius: 12px;
    overflow-x: auto;
    margin: 8px 0;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .message-container.user .message-content :global(pre) {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .message-content :global(pre code) {
    background: none;
    padding: 0;
  }

  .message-content :global(strong) {
    font-weight: 600;
  }

  .message-content :global(em) {
    font-style: italic;
  }

  @media (max-width: 768px) {
    .message-bubble {
      max-width: 85%;
    }
    
    .message-container.system .message-bubble {
      max-width: 90%;
    }
    
    .message-container {
      padding: 0 12px;
    }
  }
</style>
