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
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    margin: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .cors-error {
    background: #fff3cd;
    color: #856404;
    border-color: #ffeaa7;
  }

  .error-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.05);
  }

  .error-icon {
    font-size: 1.2rem;
  }

  .error-title {
    flex: 1;
    font-weight: 600;
    font-size: 1rem;
  }

  .dismiss-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity 0.2s, background-color 0.2s;
  }

  .dismiss-btn:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .error-content {
    padding: 1rem;
  }

  .error-text {
    margin: 0 0 1rem 0;
    font-weight: 500;
  }

  .solution-box {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 6px;
    padding: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .solution-box h4 {
    margin: 0 0 1rem 0;
    color: #495057;
  }

  .solutions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .solution {
    background: white;
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #e9ecef;
  }

  .solution strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #495057;
  }

  .solution code {
    display: block;
    background: #f8f9fa;
    padding: 0.5rem;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.875rem;
    margin: 0.25rem 0;
    border: 1px solid #e9ecef;
    color: #495057;
  }

  .solution p {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    color: #6c757d;
  }

  .fallback-note {
    margin-top: 1rem;
    padding: 0.75rem;
    background: #d1ecf1;
    border: 1px solid #bee5eb;
    border-radius: 4px;
    font-size: 0.875rem;
    color: #0c5460;
  }

  @media (max-width: 768px) {
    .error-banner {
      margin: 0.5rem;
    }

    .solution code {
      font-size: 0.75rem;
      word-break: break-all;
    }

    .solutions {
      gap: 0.75rem;
    }

    .solution {
      padding: 0.5rem;
    }
  }
</style>
