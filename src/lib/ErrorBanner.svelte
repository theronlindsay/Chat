<script lang="ts">
  import { errorMessage, isConnected } from './stores';

  function dismissError() {
    errorMessage.set('');
  }

  // Check if it's a CORS/403 related error
  $: is403Error = $errorMessage.includes('403') || $errorMessage.includes('CORS') || $errorMessage.includes('Forbidden');
</script>

{#if $errorMessage}
  <div class="error-banner" class:cors-error={is403Error}>
    <div class="error-header">
      <span class="error-icon">
        {#if is403Error}
          🚫
        {:else}
          ⚠️
        {/if}
      </span>
      <span class="error-title">
        {#if is403Error}
          CORS / Access Denied Error
        {:else}
          Connection Error
        {/if}
      </span>
      <button class="dismiss-btn" on:click={dismissError} title="Dismiss error">×</button>
    </div>
    
    <div class="error-content">
      <p class="error-text">{$errorMessage}</p>
      
      {#if is403Error}
        <div class="solution-box">
          <h4>🔧 How to fix this:</h4>
          <div class="solutions">
            <div class="solution">
              <strong>1. Configure Ollama for web access:</strong>
              <code>export OLLAMA_ORIGINS="*"</code>
              <code>ollama serve</code>
            </div>
            
            <div class="solution">
              <strong>2. Or start Ollama with CORS enabled:</strong>
              <code>OLLAMA_ORIGINS="http://localhost:5173,http://localhost:3000" ollama serve</code>
            </div>
            
            <div class="solution">
              <strong>3. For production, use specific origins:</strong>
              <code>OLLAMA_ORIGINS="https://your-domain.com" ollama serve</code>
            </div>
            
            <div class="solution">
              <strong>4. Check reverse proxy configuration (nginx/apache):</strong>
              <p>Ensure your reverse proxy includes CORS headers</p>
            </div>
          </div>
          
          <p class="fallback-note">
            💡 <strong>Tip:</strong> The app will automatically use your local Ollama server (localhost:11434) as a fallback if available.
          </p>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .error-banner {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
    border: 1px solid var(--md-sys-color-error);
    border-radius: 12px;
    margin: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    font-family: 'Roboto', system-ui, -apple-system, sans-serif;
  }

  .cors-error {
    background: #fef7cd;
    color: #7c2d12;
    border-color: #f59e0b;
  }

  .error-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    background: rgba(0, 0, 0, 0.05);
    border-radius: 12px 12px 0 0;
  }

  .error-icon {
    font-size: 20px;
  }

  .error-title {
    flex: 1;
    font-weight: 500;
    font-size: 16px;
  }

  .dismiss-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity 0.2s ease, background-color 0.2s ease;
    color: inherit;
  }

  .dismiss-btn:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .error-content {
    padding: 16px;
  }

  .error-text {
    margin: 0 0 16px 0;
    font-weight: 400;
    line-height: 1.5;
  }

  .solution-box {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid var(--md-sys-color-outline-variant);
  }

  .solution-box h4 {
    margin: 0 0 16px 0;
    color: var(--md-sys-color-on-surface);
    font-weight: 500;
  }

  .solutions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .solution {
    background: var(--md-sys-color-surface-container-highest);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--md-sys-color-outline-variant);
  }

  .solution strong {
    display: block;
    margin-bottom: 8px;
    color: var(--md-sys-color-on-surface);
    font-weight: 500;
  }

  .solution code {
    display: block;
    background: var(--md-sys-color-surface-container-high);
    padding: 8px 12px;
    border-radius: 6px;
    font-family: 'Roboto Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    margin: 4px 0;
    border: 1px solid var(--md-sys-color-outline-variant);
    color: var(--md-sys-color-on-surface);
  }

  .solution p {
    margin: 8px 0 0 0;
    font-size: 14px;
    color: var(--md-sys-color-on-surface-variant);
    line-height: 1.4;
  }

  .fallback-note {
    margin-top: 16px;
    padding: 12px;
    background: var(--md-sys-color-tertiary-container);
    border: 1px solid var(--md-sys-color-tertiary);
    border-radius: 8px;
    font-size: 14px;
    color: var(--md-sys-color-on-tertiary-container);
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .error-banner {
      margin: 8px;
    }

    .error-header {
      padding: 12px;
    }

    .error-content {
      padding: 12px;
    }

    .solution code {
      font-size: 12px;
      word-break: break-all;
    }

    .solutions {
      gap: 8px;
    }

    .solution {
      padding: 8px;
    }
  }
</style>
