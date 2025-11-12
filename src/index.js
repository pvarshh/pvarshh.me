import indexHTML from '../index.html';
import adviceHTML from '../writing/advice.html';
import mainJS from './js/main.js';
import stylesCSS from './css/styles.css';
import resumeHTML from '../resume.html';
// Local images (placeholders)
import mountainSvg from './images/mountain.svg';
import birdSvg from './images/bird.svg';
import desertSvg from './images/desert.svg';
import forestSvg from './images/forest.svg';
import imagesHTML from '../favorites/images.html';
import musicHTML from '../favorites/music.html';

// Import favicons
import faviconIco from './favicon/favicon.ico';
import favicon16 from './favicon/favicon-16x16.png';
import favicon32 from './favicon/favicon-32x32.png';
import appleTouchIcon from './favicon/apple-touch-icon.png';
import androidChrome192 from './favicon/android-chrome-192x192.png';
import androidChrome512 from './favicon/android-chrome-512x512.png';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Serve HTML pages
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(indexHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }
    
    if (url.pathname === '/writing/advice.html') {
      return new Response(adviceHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    // Resume page
    if (url.pathname === '/resume.html') {
      return new Response(resumeHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    // Favorites: images and music
    if (url.pathname === '/favorites/images.html') {
      return new Response(imagesHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (url.pathname === '/favorites/music.html') {
      return new Response(musicHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }
    
    // Serve static assets
    if (url.pathname === '/src/js/main.js') {
      return new Response(mainJS, {
        headers: { 'content-type': 'application/javascript;charset=UTF-8' }
      });
    }
    
    if (url.pathname === '/src/css/styles.css') {
      return new Response(stylesCSS, {
        headers: { 'content-type': 'text/css;charset=UTF-8' }
      });
    }
    
    // Serve favicons
    if (url.pathname === '/src/favicon/favicon.ico') {
      return new Response(faviconIco, {
        headers: { 'content-type': 'image/x-icon' }
      });
    }
    
    if (url.pathname === '/src/favicon/favicon-16x16.png') {
      return new Response(favicon16, {
        headers: { 'content-type': 'image/png' }
      });
    }
    
    if (url.pathname === '/src/favicon/favicon-32x32.png') {
      return new Response(favicon32, {
        headers: { 'content-type': 'image/png' }
      });
    }
    
    if (url.pathname === '/src/favicon/apple-touch-icon.png') {
      return new Response(appleTouchIcon, {
        headers: { 'content-type': 'image/png' }
      });
    }
    
    if (url.pathname === '/src/favicon/android-chrome-192x192.png') {
      return new Response(androidChrome192, {
        headers: { 'content-type': 'image/png' }
      });
    }
    
    if (url.pathname === '/src/favicon/android-chrome-512x512.png') {
      return new Response(androidChrome512, {
        headers: { 'content-type': 'image/png' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};