<script lang="ts">
  import { isConnected, currentServerUrl, errorMessage } from './stores';
  import { ollamaAPI } from './ollama';
  
  let showSettings = false;
  let isTestingConnection = false;

  function toggleSettings() {
    showSettings = !showSettings;
  }

  async function testConnection() {
    isTestingConnection = true;
    errorMessage.set('');
    ollamaAPI.resetConnection();
    
    try {
      const connected = await ollamaAPI.testConnection();
      isConnected.set(connected);
      
      if (connected) {
        const workingUrl = ollamaAPI.getWorkingUrl();
        if (workingUrl) {
          currentServerUrl.set(workingUrl);
        }
        errorMessage.set('✅ Connection successful!');
      } else {
        errorMessage.set('❌ Failed to connect to any Ollama server');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      errorMessage.set(error instanceof Error ? error.message : 'Connection test failed');
      isConnected.set(false);
    } finally {
      isTestingConnection = false;
    }
  }

  function closeSettings(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      showSettings = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      showSettings = false;
    }
  }
</script>

<button class="settings-button" on:click={toggleSettings} aria-label="Settings">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1m15.5-6.5L19 6.5m-14 11l2.5-2.5m11-11L16 6.5M5 17.5l2.5-2.5"></path>
  </svg>
</button>

{#if showSettings}
  <div class="settings-overlay" on:click={closeSettings} on:keydown={handleKeydown} role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="settings-title">
    <div class="settings-modal">
      <div class="settings-header">
        <h2 id="settings-title">⚙️ Settings</h2>
        <button class="close-button" on:click={toggleSettings}>×</button>
      </div>
      
      <div class="settings-content">
        <div class="tron-branding">
          <div class="tron-logo">
            <div class="tron-text">
              <span class="tron-letter t">T</span>
              <span class="tron-letter r">R</span>
              <span class="tron-letter o">O</span>
              <span class="tron-letter n">N</span>
            </div>
            <div class="tron-subtitle">Theron's Realm of Networks</div>
            <div class="matrix-rain">
              <div class="matrix-column" style="left: 0%; animation-delay: 0s;" data-text="SYSTEM BREACH DETECTED"></div>
              <div class="matrix-column" style="left: 2.5%; animation-delay: 1s;" data-text="ACCESSING MAINFRAME"></div>
              <div class="matrix-column" style="left: 5%; animation-delay: 2s;" data-text="NEURAL NETWORK ACTIVE"></div>
              <div class="matrix-column" style="left: 7.5%; animation-delay: 0.5s;" data-text="QUANTUM ENCRYPTION"></div>
              <div class="matrix-column" style="left: 10%; animation-delay: 1.5s;" data-text="FIREWALL BYPASSED"></div>
              <div class="matrix-column" style="left: 12.5%; animation-delay: 2.5s;" data-text="DATA STREAM ONLINE"></div>
              <div class="matrix-column" style="left: 15%; animation-delay: 0.8s;" data-text="KERNEL PROTOCOL"></div>
              <div class="matrix-column" style="left: 17.5%; animation-delay: 1.8s;" data-text="CIPHER ALGORITHM"></div>
              <div class="matrix-column" style="left: 20%; animation-delay: 2.2s;" data-text="MATRIX PROTOCOL"></div>
              <div class="matrix-column" style="left: 22.5%; animation-delay: 0.3s;" data-text="BACKDOOR ACCESS"></div>
              <div class="matrix-column" style="left: 25%; animation-delay: 1.3s;" data-text="ROOT PRIVILEGE"></div>
              <div class="matrix-column" style="left: 27.5%; animation-delay: 2.8s;" data-text="SHELL INJECTION"></div>
              <div class="matrix-column" style="left: 30%; animation-delay: 0.6s;" data-text="BUFFER OVERFLOW"></div>
              <div class="matrix-column" style="left: 32.5%; animation-delay: 1.6s;" data-text="STACK EXECUTION"></div>
              <div class="matrix-column" style="left: 35%; animation-delay: 2.1s;" data-text="MEMORY ALLOCATION"></div>
              <div class="matrix-column" style="left: 37.5%; animation-delay: 0.9s;" data-text="PAYLOAD DELIVERY"></div>
              <div class="matrix-column" style="left: 40%; animation-delay: 1.9s;" data-text="EXPLOIT FRAMEWORK"></div>
              <div class="matrix-column" style="left: 42.5%; animation-delay: 2.7s;" data-text="REVERSE SHELL"></div>
              <div class="matrix-column" style="left: 45%; animation-delay: 0.4s;" data-text="PRIVILEGE ESCALATION"></div>
              <div class="matrix-column" style="left: 47.5%; animation-delay: 1.4s;" data-text="STEGANOGRAPHY"></div>
              <div class="matrix-column" style="left: 50%; animation-delay: 2.4s;" data-text="CRYPTOGRAPHIC HASH"></div>
              <div class="matrix-column" style="left: 52.5%; animation-delay: 0.7s;" data-text="VULNERABILITY SCAN"></div>
              <div class="matrix-column" style="left: 55%; animation-delay: 1.7s;" data-text="PENETRATION TEST"></div>
              <div class="matrix-column" style="left: 57.5%; animation-delay: 2.3s;" data-text="SOCIAL ENGINEERING"></div>
              <div class="matrix-column" style="left: 60%; animation-delay: 1.1s;" data-text="ZERO DAY EXPLOIT"></div>
              <div class="matrix-column" style="left: 62.5%; animation-delay: 0.2s;" data-text="NETWORK INTRUSION"></div>
              <div class="matrix-column" style="left: 65%; animation-delay: 1.2s;" data-text="BINARY EXECUTION"></div>
              <div class="matrix-column" style="left: 67.5%; animation-delay: 2.6s;" data-text="CODE INJECTION"></div>
              <div class="matrix-column" style="left: 70%; animation-delay: 0.1s;" data-text="SQL INJECTION"></div>
              <div class="matrix-column" style="left: 72.5%; animation-delay: 1.0s;" data-text="CROSS SITE SCRIPT"></div>
              <div class="matrix-column" style="left: 75%; animation-delay: 2.0s;" data-text="DENIAL OF SERVICE"></div>
              <div class="matrix-column" style="left: 77.5%; animation-delay: 0.7s;" data-text="BRUTE FORCE ATTACK"></div>
              <div class="matrix-column" style="left: 80%; animation-delay: 1.8s;" data-text="TROJAN HORSE"></div>
              <div class="matrix-column" style="left: 82.5%; animation-delay: 2.9s;" data-text="MALWARE DETECTED"></div>
              <div class="matrix-column" style="left: 85%; animation-delay: 0.4s;" data-text="PHISHING ATTEMPT"></div>
              <div class="matrix-column" style="left: 87.5%; animation-delay: 1.5s;" data-text="RANSOMWARE ALERT"></div>
              <div class="matrix-column" style="left: 90%; animation-delay: 2.7s;" data-text="BOTNET ACTIVITY"></div>
              <div class="matrix-column" style="left: 92.5%; animation-delay: 0.9s;" data-text="KEYLOGGER ACTIVE"></div>
              <div class="matrix-column" style="left: 95%; animation-delay: 1.7s;" data-text="SPYWARE RUNNING"></div>
              <div class="matrix-column" style="left: 97.5%; animation-delay: 2.5s;" data-text="ROOTKIT INSTALLED"></div>
            </div>
          </div>
        </div>
        <div class="setting-section">
          <h3>🌐 Server Connection</h3>
          <div class="connection-info">
            <p><strong>Status:</strong> 
              {#if $isConnected}
                <span class="status-connected">✅ Connected</span>
              {:else}
                <span class="status-disconnected">❌ Disconnected</span>
              {/if}
            </p>
            
            {#if $currentServerUrl}
              <p><strong>Server:</strong> <code>{$currentServerUrl}</code></p>
            {/if}
            
            <div class="server-list">
              <p><strong>Configuration:</strong></p>
              <div class="server-item">
                <code>Primary: ollama.theronlindsay.dev</code>
              </div>
              <div class="server-item">
                <code>Fallback: localhost:11434</code>
              </div>
            </div>
            
            <button 
              class="test-connection-button" 
              on:click={testConnection}
              disabled={isTestingConnection}
            >
              {#if isTestingConnection}
                🔄 Testing...
              {:else}
                🔍 Test Connection
              {/if}
            </button>
          </div>
        </div>

        <div class="setting-section">
          <h3>💡 Usage Tips</h3>
          <ul class="tips-list">
            <li>The app automatically tries backup servers if the primary fails</li>
            <li>Enable web search for current information and recent updates</li>
            <li>Press Enter to send messages, Shift+Enter for new lines</li>
            <li>Select different models from the dropdown for varied responses</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .settings-button {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: white;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .settings-button:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .settings-modal {
    background: #1e1e1e;
    border: 1px solid #333;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .settings-header {
    background: #252525;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #333;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .settings-header h2 {
    margin: 0;
    color: #fff;
    font-size: 1.25rem;
  }

  .close-button {
    background: none;
    border: none;
    color: #ccc;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .settings-content {
    padding: 1.5rem;
    overflow-y: auto;
    max-height: calc(80vh - 80px);
  }

  .tron-branding {
    margin-bottom: 2rem;
    padding: 2rem;
    background: linear-gradient(135deg, #0a0f0a 0%, #0f1a0f 25%, #1a1a1a 50%, #0f1a0f 75%, #0a0f0a 100%);
    border-radius: 12px;
    border: 1px solid #00ff41;
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3), 0 0 40px rgba(59, 130, 246, 0.2);
    position: relative;
    overflow: hidden;
  }

  .tron-logo {
    text-align: center;
    position: relative;
    z-index: 2;
  }

  .tron-text {
    display: flex;
    justify-content: center;
    gap: -0.5rem;
    margin-bottom: 1rem;
  }

  .tron-letter {
    font-size: 3rem;
    font-weight: 900;
    font-family: 'Helvetica', 'Arial', sans-serif;
    color: #000000;
    -webkit-text-stroke: 3px #ff0040;
    filter: drop-shadow(0 0 2px #ff0040) 
            drop-shadow(0 0 4px #ff0040);
    animation: tronGlow 2s ease-in-out infinite alternate;
    transition: all 0.3s ease;
    cursor: default;
    text-transform: uppercase;
    letter-spacing: -3px;
  }

  .tron-letter:hover {
    transform: scale(1.1);
    filter: drop-shadow(0 0 4px #ff0040) 
            drop-shadow(0 0 8px #ff0040);
  }

  .tron-letter.t {
    animation-delay: 0s;
  }

  .tron-letter.r {
    animation-delay: 0.2s;
  }

  .tron-letter.o {
    animation-delay: 0.4s;
  }

  .tron-letter.n {
    animation-delay: 0.6s;
  }

  @keyframes tronGlow {
    0% {
      filter: drop-shadow(0 0 2px #ff0040) 
              drop-shadow(0 0 4px #ff0040);
    }
    100% {
      filter: drop-shadow(0 0 4px #ff0040) 
              drop-shadow(0 0 8px #ff0040) 
              drop-shadow(0 0 12px #cc0030);
    }
  }

  .tron-subtitle {
    font-size: 1rem;
    color: #94a3b8;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }

  .matrix-rain {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    overflow: hidden;
    opacity: 0.8;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-weight: normal;
    font-size: 8px;
    line-height: 1;
  }

  .matrix-column {
    position: absolute;
    top: -800px;
    width: 25px;
    height: 800px;
    color: #00ff41;
    text-shadow: 0 0 3px #00ff41;
    animation: matrixFall 6s linear infinite;
    opacity: 0.9;
    writing-mode: vertical-rl;
    text-orientation: upright;
    letter-spacing: 1px;
    word-spacing: 2px;
    transform-origin: center;
  }

  .matrix-column::before {
    content: attr(data-text) '\A' attr(data-text) '\A' attr(data-text) '\A' attr(data-text) '\A' attr(data-text) '\A' attr(data-text) '\A' attr(data-text) '\A' attr(data-text) '\A' attr(data-text) '\A' attr(data-text) '\A' attr(data-text) '\A' attr(data-text) '\A' attr(data-text) '\A' attr(data-text) '\A' attr(data-text) '\A' attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    white-space: pre-line;
    word-break: break-all;
    animation: matrixTextScroll 1.5s linear infinite;
    filter: brightness(1.2);
    text-align: center;
  }

  @keyframes matrixFall {
    0% {
      transform: translateY(-800px);
      opacity: 0;
    }
    2% {
      opacity: 1;
    }
    98% {
      opacity: 1;
    }
    100% {
      transform: translateY(calc(100vh + 200px));
      opacity: 0;
    }
  }

  @keyframes matrixTextScroll {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-60px);
    }
  }

  .setting-section {
    margin-bottom: 2rem;
  }

  .setting-section:last-child {
    margin-bottom: 0;
  }

  .setting-section h3 {
    color: #fff;
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
  }

  .connection-info p {
    color: #ccc;
    margin: 0 0 0.75rem 0;
    line-height: 1.5;
  }

  .status-connected {
    color: #4ade80;
    font-weight: 500;
  }

  .status-disconnected {
    color: #f87171;
    font-weight: 500;
  }

  .server-list {
    margin: 1rem 0;
  }

  .server-item {
    margin: 0.5rem 0;
  }

  .server-item code {
    background: #333;
    color: #e5e5e5;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.875rem;
    display: inline-block;
  }

  .test-connection-button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease;
    margin-top: 1rem;
  }

  .test-connection-button:hover:not(:disabled) {
    background: #2563eb;
  }

  .test-connection-button:disabled {
    background: #4b5563;
    cursor: not-allowed;
  }

  .tips-list {
    color: #ccc;
    margin: 0;
    padding-left: 1.25rem;
    line-height: 1.6;
  }

  .tips-list li {
    margin-bottom: 0.5rem;
  }

  .tips-list li:last-child {
    margin-bottom: 0;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .settings-modal {
      width: 95%;
      max-height: 90vh;
    }

    .tron-branding {
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .tron-letter {
      font-size: 2.5rem;
    }

    .tron-subtitle {
      font-size: 0.875rem;
      letter-spacing: 1px;
    }
  }

  @media (max-width: 480px) {
    .tron-branding {
      padding: 1rem;
    }

    .tron-letter {
      font-size: 2rem;
    }

    .tron-text {
      gap: 0.25rem;
    }

    .tron-subtitle {
      font-size: 0.75rem;
    }
  }
</style>
