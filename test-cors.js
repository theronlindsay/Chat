// Test script to verify CORS and web search functionality
const SEARXNG_BASE_URL = 'https://search.theronlindsay.dev';

async function testCORS() {
  try {
    console.log('Testing CORS with SearXNG...');
    
    const searchUrl = `${SEARXNG_BASE_URL}/search?q=test&format=json`;
    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Tron-Chat-App/1.0'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ CORS is working!');
      console.log(`Found ${data.results?.length || 0} search results`);
      
      if (data.results && data.results.length > 0) {
        console.log('Sample result:', {
          title: data.results[0].title,
          url: data.results[0].url,
          content: data.results[0].content?.substring(0, 100) + '...'
        });
      }
      
      return true;
    } else {
      console.error('❌ Search request failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ CORS or network error:', error);
    return false;
  }
}

// Run the test
testCORS().then(success => {
  if (success) {
    console.log('\n🎉 Web search functionality is ready!');
  } else {
    console.log('\n💥 Web search still has issues');
  }
});
