// Simple test script for web search functionality
const SEARXNG_BASE_URL = 'https://search.theronlindsay.dev';

async function testWebSearch(query) {
  try {
    const searchUrl = `${SEARXNG_BASE_URL}/search?q=${encodeURIComponent(query)}&format=json`;
    console.log('Testing search URL:', searchUrl);
    
    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Tron-Chat-App/1.0'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const results = data.results || [];
      
      console.log(`Found ${results.length} results for "${query}"`);
      
      if (results.length > 0) {
        const formattedResults = results.slice(0, 3).map((result, index) => 
          `${index + 1}. ${result.title}\n   ${result.content}\n   Source: ${result.url}`
        ).join('\n\n');
        
        console.log('\nFormatted results:');
        console.log(formattedResults);
        return true;
      }
    } else {
      console.error('Search failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Search error:', error);
    return false;
  }
}

// Test the search
testWebSearch('current weather in New York').then(success => {
  console.log('\nSearch test', success ? 'PASSED' : 'FAILED');
  process.exit(success ? 0 : 1);
});
