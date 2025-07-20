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
  <div class="selector-header">
    <label for="model-select">Select Model:</label>
    <button 
      class="refresh-btn" 
      on:click={loadModels}
      disabled={$isLoadingModels}
      title="Refresh models"
    >
      🔄
    </button>
  </div>
  
  <div class="dropdown-container">
    <button 
      class="dropdown-toggle" 
      class:loading={$isLoadingModels}
      class:connected={$isConnected}
      class:error={!$isConnected}
      on:click={toggleDropdown}
      disabled={$isLoadingModels}
    >
      {#if $isLoadingModels}
        Loading models...
      {:else if $selectedModel}
        {$selectedModel}
      {:else if $models.length === 0}
        No models available
      {:else}
        Select a model
      {/if}
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
  
  {#if $errorMessage}
    <div class="error-message">
      {$errorMessage}
    </div>
  {/if}
  
  <div class="connection-status">
    <span class="status-indicator" class:connected={$isConnected} class:disconnected={!$isConnected}></span>
    {#if $isConnected && $currentServerUrl}
      Connected to: {$currentServerUrl}
    {:else}
      Disconnected - No available servers
    {/if}
  </div>
</div>

<style>
  .model-selector {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .selector-header label {
    font-weight: 600;
    color: #495057;
  }

  .refresh-btn {
    background: none;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .refresh-btn:hover:not(:disabled) {
    background-color: #e9ecef;
  }

  .refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .dropdown-container {
    position: relative;
    width: 100%;
  }

  .dropdown-toggle {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .dropdown-toggle:hover:not(:disabled) {
    border-color: #adb5bd;
  }

  .dropdown-toggle:focus {
    outline: none;
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  }

  .dropdown-toggle.loading {
    color: #6c757d;
    cursor: not-allowed;
  }

  .dropdown-toggle.connected {
    border-color: #198754;
  }

  .dropdown-toggle.error {
    border-color: #dc3545;
    background-color: #f8d7da;
  }

  .dropdown-arrow {
    transition: transform 0.2s;
    font-size: 0.8rem;
    color: #6c757d;
  }

  .dropdown-arrow.open {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ced4da;
    border-top: none;
    border-radius: 0 0 6px 6px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .dropdown-item {
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: white;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.2s;
    border-bottom: 1px solid #f8f9fa;
  }

  .dropdown-item:hover {
    background-color: #f8f9fa;
  }

  .dropdown-item.selected {
    background-color: #e7f3ff;
    color: #0056b3;
  }

  .dropdown-item:last-child {
    border-bottom: none;
  }

  .model-name {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  .model-info {
    font-size: 0.875rem;
    color: #6c757d;
  }

  .error-message {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: #f8d7da;
    color: #721c24;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .connection-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #6c757d;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #dc3545;
  }

  .status-indicator.connected {
    background-color: #198754;
  }

  .status-indicator.disconnected {
    background-color: #dc3545;
  }
</style>
