<script lang="ts">
  import { webSearchEnabled } from './stores';
  import { WEB_SEARCH_ENABLED } from './ollama';
  
  function handleToggle() {
    if (WEB_SEARCH_ENABLED) {
      webSearchEnabled.update(enabled => !enabled);
    }
  }
</script>

<div class="web-search-toggle">
  <button 
    class="toggle-button" 
    class:enabled={$webSearchEnabled}
    disabled={!WEB_SEARCH_ENABLED}
    on:click={handleToggle}
    type="button"
    title={WEB_SEARCH_ENABLED 
      ? ($webSearchEnabled ? 'Web search enabled' : 'Web search disabled') 
      : 'Web search unavailable'
    }
  >
    <span class="toggle-icon">🌐</span>
    <span class="toggle-text">Search</span>
    <span class="toggle-indicator" class:active={$webSearchEnabled}></span>
  </button>
</div>

<style>
  .web-search-toggle {
    display: flex;
    align-items: center;
  }

  .toggle-button {
    background: var(--md-sys-color-surface-container-high);
    border: none;
    border-radius: 12px;
    color: var(--md-sys-color-on-surface);
    padding: 12px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Roboto', system-ui, -apple-system, sans-serif;
    transition: all 0.2s ease;
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    min-height: 44px;
  }

  .toggle-button:hover:not(:disabled) {
    background: var(--md-sys-color-surface-container-highest);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  .toggle-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--md-sys-color-primary);
  }

  .toggle-button:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }

  .toggle-button.enabled {
    background: var(--md-sys-color-tertiary-container);
    color: var(--md-sys-color-on-tertiary-container);
  }

  .toggle-button.enabled:hover:not(:disabled) {
    background: var(--md-sys-color-tertiary-container);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  .toggle-icon {
    font-size: 16px;
  }

  .toggle-text {
    font-weight: 500;
    white-space: nowrap;
  }

  .toggle-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--md-sys-color-outline);
    transition: all 0.2s ease;
  }

  .toggle-indicator.active {
    background-color: var(--md-sys-color-tertiary);
    box-shadow: 0 0 8px rgba(103, 80, 164, 0.3);
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .toggle-button {
      font-size: 12px;
      padding: 6px 12px;
      gap: 6px;
    }

    .toggle-text {
      display: none;
    }
  }
</style>
