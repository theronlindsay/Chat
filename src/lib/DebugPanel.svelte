<script lang="ts">
  import { ollamaAPI } from './ollama';
  import { OLLAMA_BASE_URL, FALLBACK_URLS } from './ollama';

  let testResults: Array<{url: string, status: string, error?: string}> = [];
  let testing = false;

  async function testAllServers() {
    testing = true;
    testResults = [];
    
    const allUrls = [OLLAMA_BASE_URL, ...FALLBACK_URLS];
    
    for (const url of allUrls) {
      try {
        console.log(`Testing ${url}...`);
        const response = await fetch(`${url}/api/tags`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          const data = await response.json();
          testResults.push({
            url,
            status: `✅ Success (${data.models?.length || 0} models)`
          });
        } else {
          testResults.push({
            url,
            status: `❌ HTTP ${response.status}`,
            error: response.statusText
          });
        }
      } catch (error) {
        testResults.push({
          url,
          status: '❌ Failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    testing = false;
    testResults = [...testResults]; // Trigger reactivity
  }
</script>

<div class="debug-panel">
  <div class="debug-header">
    <h4>🔍 Connection Debug</h4>
    <button 
      class="test-btn" 
      on:click={testAllServers}
      disabled={testing}
    >
      {testing ? 'Testing...' : 'Test All Servers'}
    </button>
  </div>
  
  {#if testResults.length > 0}
    <div class="test-results">
      {#each testResults as result}
        <div class="test-result">
          <div class="result-url">{result.url}</div>
          <div class="result-status">{result.status}</div>
          {#if result.error}
            <div class="result-error">{result.error}</div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
  
  <div class="cors-info">
    <strong>💡 CORS Issue?</strong>
    <p>If you see 403 errors, your Ollama server needs CORS configuration:</p>
    <code>export OLLAMA_ORIGINS="*"</code>
    <code>ollama serve</code>
  </div>
</div>

<style>
  .debug-panel {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .debug-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .debug-header h4 {
    margin: 0;
    color: #495057;
  }

  .test-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
  }

  .test-btn:hover:not(:disabled) {
    background: #0056b3;
  }

  .test-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  .test-results {
    margin-bottom: 1rem;
  }

  .test-result {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .result-url {
    font-weight: 600;
    color: #007bff;
    margin-bottom: 0.25rem;
    word-break: break-all;
  }

  .result-status {
    margin-bottom: 0.25rem;
  }

  .result-error {
    color: #dc3545;
    font-size: 0.8rem;
    background: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    margin-top: 0.25rem;
  }

  .cors-info {
    background: #d1ecf1;
    border: 1px solid #bee5eb;
    border-radius: 4px;
    padding: 0.75rem;
    color: #0c5460;
  }

  .cors-info strong {
    display: block;
    margin-bottom: 0.5rem;
  }

  .cors-info p {
    margin: 0 0 0.5rem 0;
  }

  .cors-info code {
    display: block;
    background: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    margin: 0.25rem 0;
    font-family: monospace;
    color: #495057;
  }
</style>
