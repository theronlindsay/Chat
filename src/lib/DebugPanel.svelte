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
  
  <div class="environment-info">
    <h5>🌍 Server Configuration</h5>
    <div class="env-details">
      <div><strong>Hostname:</strong> {window.location.hostname}</div>
      <div><strong>Protocol:</strong> {window.location.protocol}</div>
      <div><strong>Environment:</strong> {window.location.hostname.includes('localhost') ? 'Development' : 'Production'}</div>
      <div><strong>Primary Ollama URL:</strong> {OLLAMA_BASE_URL}</div>
      <div><strong>Fallback URLs:</strong> {FALLBACK_URLS.length > 0 ? FALLBACK_URLS.join(', ') : 'None'}</div>
      <div><strong>Deployment:</strong> Same-machine Ollama with nginx proxy</div>
    </div>
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

  .environment-info {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: #e7f3ff;
    border-radius: 6px;
    border: 1px solid #bee5eb;
  }

  .environment-info h5 {
    margin: 0 0 0.5rem 0;
    color: #0c5460;
  }

  .env-details {
    display: grid;
    gap: 0.25rem;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.8rem;
  }

  .env-details div {
    color: #495057;
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
