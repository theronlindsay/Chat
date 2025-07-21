<script lang="ts">
  import { onMount } from 'svelte';
  import { models, selectedModel, isLoadingModels, isConnected, errorMessage, currentServerUrl } from './stores';
  import { ollamaAPI } from './ollama';

  let showDropdown = false;

  onMount(async () => {
    await loadModels();
  });

  async function loadModels() {
    isLoadingModels.set(true);
    errorMessage.set('');
    ollamaAPI.resetConnection(); // Reset to try all servers again
    
    try {
      // Test connection first
      const connected = await ollamaAPI.testConnection();
      isConnected.set(connected);
      
      if (!connected) {
        throw new Error('Cannot connect to any Ollama server. Please check your server configuration.');
      }

      // Update current server URL
      const workingUrl = ollamaAPI.getWorkingUrl();
      if (workingUrl) {
        currentServerUrl.set(workingUrl);
      }

      const modelList = await ollamaAPI.getModels();
      models.set(modelList);
      
      // Select first model if none selected
      if (modelList.length > 0 && !$selectedModel) {
        selectedModel.set(modelList[0].name);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      errorMessage.set(error instanceof Error ? error.message : 'Failed to load models');
      isConnected.set(false);
    } finally {
      isLoadingModels.set(false);
    }
  }

  function selectModel(modelName: string) {
    selectedModel.set(modelName);
    showDropdown = false;
  }

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event: Event) {
    const target = event.target as Element;
    if (!target.closest('.model-selector')) {
      showDropdown = false;
    }
  }
</script>

<svelte:document on:click={handleClickOutside} />

<div class="model-selector">
  <div class="dropdown-container">
    <button 
      class="dropdown-toggle" 
      class:loading={$isLoadingModels}
      class:connected={$isConnected}
      class:error={!$isConnected}
      on:click={toggleDropdown}
      disabled={$isLoadingModels}
      title="Select AI Model"
    >
      <span class="model-icon">🤖</span>
      <span class="model-text">
        {#if $isLoadingModels}
          Loading...
        {:else if $selectedModel}
          {$selectedModel.split(':')[0]}
        {:else if $models.length === 0}
          No models
        {:else}
          Select model
        {/if}
      </span>
      <span class="dropdown-arrow" class:open={showDropdown}>▼</span>
    </button>
    
    {#if showDropdown && $models.length > 0}
      <div class="dropdown-menu">
        {#each $models as model}
          <button 
            class="dropdown-item"
            class:selected={model.name === $selectedModel}
            on:click={() => selectModel(model.name)}
          >
            <div class="model-name">{model.name}</div>
            <div class="model-info">
              {(model.size / 1024 / 1024 / 1024).toFixed(1)}GB
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </div>
  
  <button 
    class="refresh-btn" 
    on:click={loadModels}
    disabled={$isLoadingModels}
    title="Refresh models"
  >
    <span class:spinning={$isLoadingModels}>🔄</span>
  </button>
</div>

<style>
  .model-selector {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dropdown-container {
    position: relative;
  }

  .dropdown-toggle {
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
    min-width: 140px;
    min-height: 44px;
    white-space: nowrap;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .dropdown-toggle:hover:not(:disabled) {
    background: var(--md-sys-color-surface-container-highest);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  .dropdown-toggle:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--md-sys-color-primary);
  }

  .dropdown-toggle:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }

  .dropdown-toggle.error {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
  }

  .model-icon {
    font-size: 16px;
  }

  .model-text {
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dropdown-arrow {
    transition: transform 0.2s ease;
    font-size: 12px;
    opacity: 0.6;
  }

  .dropdown-arrow.open {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: var(--md-sys-color-surface-container);
    border: none;
    border-radius: 16px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    min-width: 200px;
    padding: 8px;
  }

  .dropdown-item {
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: transparent;
    color: var(--md-sys-color-on-surface);
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
    border-radius: 12px;
    margin-bottom: 4px;
    font-family: 'Roboto', system-ui, -apple-system, sans-serif;
  }

  .dropdown-item:hover {
    background-color: var(--md-sys-color-surface-container-high);
  }

  .dropdown-item.selected {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  .dropdown-item:last-child {
    margin-bottom: 0;
  }

  .model-name {
    font-weight: 500;
    margin-bottom: 4px;
    font-size: 14px;
  }

  .model-info {
    font-size: 12px;
    color: var(--md-sys-color-on-surface-variant);
  }

  .dropdown-item.selected .model-info {
    color: var(--md-sys-color-on-secondary-container);
    opacity: 0.8;
  }

  .refresh-btn {
    background: var(--md-sys-color-surface-container-high);
    border: none;
    border-radius: 12px;
    color: var(--md-sys-color-on-surface);
    padding: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    min-width: 44px;
    min-height: 44px;
  }

  .refresh-btn:hover:not(:disabled) {
    background: var(--md-sys-color-surface-container-highest);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  .refresh-btn:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .dropdown-toggle {
      min-width: 100px;
      font-size: 12px;
      padding: 6px 12px;
    }

    .dropdown-menu {
      min-width: 180px;
    }
  }
</style>
