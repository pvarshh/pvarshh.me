export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Serve index.html for root path
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const html = `<!-- paste your index.html content here -->`;
      return new Response(html, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};