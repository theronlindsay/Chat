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

<div class="message" class:user={message.role === 'user'} class:assistant={message.role === 'assistant'} class:system={message.role === 'system'}>
  <div class="message-header">
    <span class="role-indicator">
      {#if message.role === 'user'}
        👤
      {:else if message.role === 'assistant'}
        🤖
      {:else}
        ⚙️
      {/if}
    </span>
    <span class="role-name">
      {message.role === 'user' ? 'You' : message.role === 'assistant' ? 'Assistant' : 'System'}
      {#if message.role === 'assistant' && hasWebSearchIndicators}
        <span class="web-search-badge">🌐 Web</span>
      {/if}
    </span>
    <span class="timestamp">{formatTime(message.timestamp)}</span>
  </div>
  <div class="message-content">
    {@html formatContent(message.content)}
  </div>
</div>

<style>
  .message {
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 12px;
    max-width: 80%;
    word-wrap: break-word;
    position: relative;
  }

  .message.user {
    background: #007bff;
    color: white;
    margin-left: auto;
    margin-right: 0;
  }

  .message.assistant {
    background: #f8f9fa;
    color: #212529;
    border: 1px solid #e9ecef;
    margin-left: 0;
    margin-right: auto;
  }

  .message.system {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
    margin-left: auto;
    margin-right: auto;
    max-width: 60%;
    text-align: center;
    font-style: italic;
  }

  .message-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    opacity: 0.8;
  }

  .role-indicator {
    font-size: 1rem;
  }

  .role-name {
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .web-search-badge {
    background: #198754;
    color: white;
    font-size: 0.7rem;
    padding: 0.1rem 0.4rem;
    border-radius: 12px;
    font-weight: 500;
  }

  .timestamp {
    margin-left: auto;
    font-size: 0.75rem;
  }

  .message-content {
    line-height: 1.5;
  }

  .message.user .message-content {
    color: rgba(255, 255, 255, 0.95);
  }

  .message-content :global(code) {
    background: rgba(0, 0, 0, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.875rem;
  }

  .message.user .message-content :global(code) {
    background: rgba(255, 255, 255, 0.2);
  }

  .message-content :global(pre) {
    background: rgba(0, 0, 0, 0.05);
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 0.5rem 0;
  }

  .message.user .message-content :global(pre) {
    background: rgba(255, 255, 255, 0.1);
  }

  .message-content :global(pre code) {
    background: none;
    padding: 0;
  }

  .message-content :global(strong) {
    font-weight: 700;
  }

  .message-content :global(em) {
    font-style: italic;
  }

  @media (max-width: 768px) {
    .message {
      max-width: 95%;
    }

    .message.system {
      max-width: 90%;
    }
  }
</style>
