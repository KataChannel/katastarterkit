// Test external API connection to verify integration
const testApiConnection = async () => {
  const API_BASE = 'https://hoadondientu.gdt.gov.vn:30000';
  const token = 'your-token-here'; // This would be from config in real app
  
  try {
    console.log('Testing external API connection...');
    
    // Test with current month
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    console.log(`Testing for month ${month}/${year}`);
    
    const url = `${API_BASE}/api/tracuuhoadon/banra?page=0&size=20&sort=tdlap:desc,khmshdon:asc,shdon:desc&tuthang=${month}&denthang=${month}&nam=${year}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response successful:', {
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        size: data.size,
        dataCount: data.datas ? data.datas.length : 0
      });
    } else {
      const errorText = await response.text();
      console.log('API Error:', errorText);
    }
    
  } catch (error) {
    console.error('Connection error:', error.message);
  }
};

// Note: This test requires a valid token from the configuration
console.log('External API test script created. This requires configuration with valid token.');
console.log('The frontend app will handle token management through ConfigService.');