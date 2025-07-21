// Ollama API configuration and utilities
// For deployment where Ollama runs on the same machine as the web server

// Ollama server configuration
// This assumes Ollama is running on the same server as your website
function getOllamaConfig() {
  // Check if we're in development (localhost) or production
  const isLocalDev = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === ''
  );
  
  if (isLocalDev) {
    // Development: use localhost directly
    return {
      primary: 'http://localhost:11434',
      fallbacks: []
    };
  } else {
    // Production: use dedicated Ollama server URL
    return {
      primary: 'https://ollama.theronlindsay.dev',
      fallbacks: [
        'http://localhost:11434' // Keep localhost as a fallback for local testing
      ]
    };
  }
}

// For manual override in production, uncomment and modify this:
// Useful if you want to force a specific server URL
// const MANUAL_OVERRIDE = {
//   primary: 'https://your-custom-ollama-server.com',
//   fallbacks: ['https://backup-server.com']
// };

const config = getOllamaConfig();
export const OLLAMA_BASE_URL = config.primary;
export const FALLBACK_URLS = config.fallbacks;

// Custom URL examples for manual configuration:
// export const OLLAMA_BASE_URL = 'http://localhost:11434'; // Local server
// export const OLLAMA_BASE_URL = 'http://your-ollama-server.com:11434';
// export const OLLAMA_BASE_URL = 'https://your-ollama-api.example.com';

// Web search configuration
export const WEB_SEARCH_ENABLED = true;
export const SEARXNG_BASE_URL = 'https://search.theronlindsay.dev';

// Web search system message to enable search functionality
export const WEB_SEARCH_SYSTEM_MESSAGE = `You are a helpful assistant with real-time web search capabilities. When you need current information, recent news, or want to search for something on the web, I will provide you with live search results from the internet. Always provide accurate and up-to-date information based on the search results provided. When referencing search results, you can mention that the information comes from recent web search.`;

// Perform web search using SearXNG JSON API
export async function performWebSearch(query: string): Promise<string> {
  try {
    // Try SearXNG JSON API
    const searchUrl = `${SEARXNG_BASE_URL}/search?q=${encodeURIComponent(query)}&format=json`;
    console.log('Performing web search for:', query);
    
    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Tron-Chat-App/1.0'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const results = data.results || [];
      
      console.log(`✅ Web search successful: Found ${results.length} results for "${query}"`);
      
      if (results.length > 0) {
        // Format the top 5 search results
        const formattedResults = results.slice(0, 5).map((result: any, index: number) => 
          `${index + 1}. **${result.title}**\n   ${result.content}\n   Source: ${result.url}`
        ).join('\n\n');
        
        return `Search results for "${query}":\n\n${formattedResults}`;
      } else {
        return `No search results found for "${query}". Please try a different search term.`;
      }
    } else {
      console.error('Search request failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.warn('SearXNG search failed, using mock results:', error);
  }

  // Fallback: Provide mock search results if SearXNG fails
  const mockResults = generateMockSearchResults(query);
  return `Search results for "${query}" (fallback):\n\n${mockResults}\n\n*Note: Using fallback search results due to search service unavailability.*`;
}

// Generate mock search results for demonstration
function generateMockSearchResults(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('weather')) {
    return `1. **Current Weather Information**
   Real-time weather data and forecasts for locations worldwide. Temperature, humidity, wind conditions, and extended forecasts.
   Source: https://weather.com

2. **Weather Underground**
   Hyperlocal weather forecasts, radar maps, and severe weather alerts with community-driven weather reporting.
   Source: https://wunderground.com

3. **National Weather Service**
   Official weather forecasts, warnings, and meteorological data from NOAA.
   Source: https://weather.gov`;
  }
  
  if (lowerQuery.includes('news') || lowerQuery.includes('current') || lowerQuery.includes('latest')) {
    return `1. **Breaking News Updates**
   Latest news headlines, current events, and real-time updates from trusted news sources worldwide.
   Source: https://news.com

2. **Technology News Today**
   Current developments in technology, software updates, and industry innovations.
   Source: https://techcrunch.com

3. **Global Current Events**
   Comprehensive coverage of world news, politics, business, and cultural events happening now.
   Source: https://reuters.com`;
  }
  
  // Generic search results
  return `1. **Information about "${query}"**
   Comprehensive overview and detailed information about your search topic with current data and insights.
   Source: https://example.com/info

2. **Latest Updates on "${query}"**
   Recent developments, news, and current information related to your search query.
   Source: https://example.com/updates

3. **Complete Guide to "${query}"**
   In-depth analysis, explanations, and practical information about your topic of interest.
   Source: https://example.com/guide`;
}

// Detect if a user message seems to need web search
export function shouldPerformWebSearch(message: string): boolean {
  const searchIndicators = [
    'what is', 'what are', 'current', 'latest', 'recent', 'today', 'now',
    'weather', 'news', 'price', 'stock', 'update', 'information about',
    'tell me about', 'search for', 'find', 'look up'
  ];
  
  const lowerMessage = message.toLowerCase();
  return searchIndicators.some(indicator => lowerMessage.includes(indicator));
}

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  model: string;
  messages: Omit<ChatMessage, 'timestamp'>[];
  stream?: boolean;
  enableWebSearch?: boolean;
}

export interface ChatResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

class OllamaAPI {
  private baseUrl: string;
  private workingUrl: string | null = null;

  constructor(baseUrl: string = OLLAMA_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Try to find a working Ollama server from the configured URLs
  private async findWorkingServer(): Promise<string> {
    if (this.workingUrl) {
      return this.workingUrl;
    }

    const urlsToTry = [this.baseUrl, ...FALLBACK_URLS];
    
    for (const url of urlsToTry) {
      try {
        console.log(`🔍 Testing connection to: ${url}`);
        const response = await fetch(`${url}/api/tags`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors', // Explicitly request CORS
          signal: AbortSignal.timeout(5000) // 5 second timeout for faster fallback
        });
        
        if (response.ok) {
          this.workingUrl = url;
          console.log(`✅ Connected to Ollama server at: ${url}`);
          return url;
        } else if (response.status === 403) {
          console.warn(`🚫 403 Forbidden from ${url} - CORS or access policy issue`);
          // Don't throw immediately, try other servers first
          continue;
        } else {
          console.warn(`❌ HTTP ${response.status} from ${url}: ${response.statusText}`);
        }
      } catch (error) {
        console.warn(`❌ Failed to connect to ${url}:`, error);
        // Continue to next server instead of throwing
      }
    }
    
    // If we get here, no servers worked
    throw new Error(`Unable to connect to Ollama server at ${urlsToTry.join(', ')}. Please ensure the remote Ollama server is running and accessible from your network.`);
  }

  async getModels(): Promise<OllamaModel[]> {
    try {
      const serverUrl = await this.findWorkingServer();
      const response = await fetch(`${serverUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch models: ${error.message}`);
      }
      throw new Error('Failed to fetch models. Make sure Ollama is running on one of the configured URLs.');
    }
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const serverUrl = await this.findWorkingServer();
      
      // Prepare messages with optional web search
      let messages = [...request.messages];
      
      // Perform web search if enabled and appears needed
      if (request.enableWebSearch && WEB_SEARCH_ENABLED && messages.length > 0) {
        const lastUserMessage = messages[messages.length - 1];
        if (lastUserMessage.role === 'user' && shouldPerformWebSearch(lastUserMessage.content)) {
          // Perform web search
          const searchResults = await performWebSearch(lastUserMessage.content);
          
          // Add search results as context
          messages.push({
            role: 'system',
            content: `Web search results:\n${searchResults}\n\nPlease use these search results to provide an accurate and up-to-date response.`
          });
        }
        
        // Add web search system message if no system message exists
        const hasSystemMessage = messages.some(msg => msg.role === 'system');
        if (!hasSystemMessage) {
          messages.unshift({
            role: 'system',
            content: WEB_SEARCH_SYSTEM_MESSAGE
          });
        }
      }

      const response = await fetch(`${serverUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          model: request.model,
          messages: messages,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in chat request:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to send chat message: ${error.message}`);
      }
      throw new Error('Failed to send chat message. Check your connection to the Ollama server.');
    }
  }

  async chatStream(request: ChatRequest, onChunk: (chunk: ChatResponse) => void): Promise<void> {
    try {
      const serverUrl = await this.findWorkingServer();
      
      // Prepare messages with optional web search
      let messages = [...request.messages];
      
      // Perform web search if enabled and appears needed
      if (request.enableWebSearch && WEB_SEARCH_ENABLED && messages.length > 0) {
        const lastUserMessage = messages[messages.length - 1];
        if (lastUserMessage.role === 'user' && shouldPerformWebSearch(lastUserMessage.content)) {
          // Perform web search
          const searchResults = await performWebSearch(lastUserMessage.content);
          
          // Add search results as context
          messages.push({
            role: 'system',
            content: `Web search results:\n${searchResults}\n\nPlease use these search results to provide an accurate and up-to-date response.`
          });
        }
        
        // Add web search system message if no system message exists
        const hasSystemMessage = messages.some(msg => msg.role === 'system');
        if (!hasSystemMessage) {
          messages.unshift({
            role: 'system',
            content: WEB_SEARCH_SYSTEM_MESSAGE
          });
        }
      }

      const response = await fetch(`${serverUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: request.model,
          messages: messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const chunk = JSON.parse(line);
              onChunk(chunk);
            } catch (e) {
              console.warn('Failed to parse chunk:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in streaming chat:', error);
      throw new Error('Failed to stream chat. Check your connection to the Ollama server.');
    }
  }

  // Test connection to Ollama server
  async testConnection(): Promise<boolean> {
    try {
      await this.findWorkingServer();
      return true;
    } catch {
      return false;
    }
  }

  // Get the currently working server URL for display purposes
  getWorkingUrl(): string | null {
    return this.workingUrl;
  }

  // Reset the working URL to force re-detection
  resetConnection(): void {
    this.workingUrl = null;
  }
}

export const ollamaAPI = new OllamaAPI();
