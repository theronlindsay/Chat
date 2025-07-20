<script lang="ts">
  import { webSearchEnabled } from './stores';
  import { WEB_SEARCH_ENABLED } from './ollama';
  
  // Debug: log the current state
  $: console.log('WebSearchToggle - webSearchEnabled:', $webSearchEnabled, 'WEB_SEARCH_ENABLED:', WEB_SEARCH_ENABLED);
  
  function handleToggle() {
    if (WEB_SEARCH_ENABLED) {
      webSearchEnabled.update(enabled => !enabled);
    }
  }
</script>

<div class="web-search-toggle">
  <div class="toggle-container">
    <div class="toggle-info">
      <span class="toggle-icon">🌐</span>
      <span class="toggle-text">Web Search</span>
    </div>
    
    <button 
      class="toggle-button" 
      class:enabled={$webSearchEnabled}
      disabled={!WEB_SEARCH_ENABLED}
      on:click={handleToggle}
      type="button"
      aria-label="Toggle web search"
    >
      <span class="toggle-slider"></span>
    </button>
  </div>
  
  <div class="toggle-description">
    {#if WEB_SEARCH_ENABLED}
      {#if $webSearchEnabled}
        <span class="status-enabled">✅ Web search enabled - AI can search the internet for current information</span>
      {:else}
        <span class="status-disabled">🔒 Web search disabled - AI will use only its training data</span>
      {/if}
    {:else}
      <span class="status-unavailable">❌ Web search unavailable - install ollama-web-search extension</span>
    {/if}
  </div>
</div>

<style>
  .web-search-toggle {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .toggle-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .toggle-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #495057;
  }

  .toggle-icon {
    font-size: 1.2rem;
  }

  .toggle-text {
    font-size: 1rem;
  }

  .toggle-button {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
    background-color: #ccc;
    border: none;
    border-radius: 24px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    outline: none;
  }

  .toggle-button:focus {
    box-shadow: 0 0 0 2px #007bff40;
  }

  .toggle-button.enabled {
    background-color: #007bff;
  }

  .toggle-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .toggle-slider {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    top: 3px;
    background-color: white;
    transition: transform 0.3s ease;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    display: block;
  }

  .toggle-button.enabled .toggle-slider {
    transform: translateX(26px);
  }

  .toggle-button:disabled .toggle-slider {
    background-color: #f8f9fa;
  }

  .toggle-description {
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .status-enabled {
    color: #198754;
    font-weight: 500;
  }

  .status-disabled {
    color: #6c757d;
  }

  .status-unavailable {
    color: #dc3545;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .toggle-container {
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .toggle-button {
      align-self: flex-end;
    }
  }
</style>
