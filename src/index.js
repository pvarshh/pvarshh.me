import indexHTML from '../index.html';
import adviceHTML from '../writing/advice.html';
import mainJS from '../assets/js/main.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Serve index.html for root path
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(indexHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }
    
    // Handle /writing/advice.html
    if (url.pathname === '/writing/advice.html') {
      return new Response(adviceHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }
    
    // Serve JavaScript file
    if (url.pathname === '/assets/js/main.js') {
      return new Response(mainJS, {
        headers: { 'content-type': 'application/javascript;charset=UTF-8' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};