import indexHTML from '../index.html';
import adviceHTML from '../writing/advice.html';
import lifeHTML from '../writing/life.html';
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
import booksHTML from '../favorites/books.html';
import moviesHTML from '../favorites/movies.html';
import tvShowsHTML from '../favorites/tv_shows.html';

// Import favicons
import faviconIco from './favicon/favicon.ico';
import favicon16 from './favicon/favicon-16x16.png';
import favicon32 from './favicon/favicon-32x32.png';
import appleTouchIcon from './favicon/apple-touch-icon.png';
import androidChrome192 from './favicon/android-chrome-192x192.png';
import androidChrome512 from './favicon/android-chrome-512x512.png';
import resumePDF from './pdf/resume.pdf';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Normalize path: remove trailing slash if present (except for root)
    if (path.endsWith('/') && path.length > 1) {
      path = path.slice(0, -1);
    }
    
    // Serve HTML pages
    if (path === '/' || path === '/index.html') {
      return new Response(indexHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }
    
    if (path === '/writing/advice.html' || path === '/writing/advice') {
      return new Response(adviceHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (path === '/writing/life.html' || path === '/writing/life') {
      return new Response(lifeHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    // Resume page
    if (path === '/resume.html' || path === '/resume') {
      return new Response(resumeHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    // Favorites: images and music
    if (path === '/favorites/images.html' || path === '/favorites/images') {
      return new Response(imagesHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (path === '/favorites/music.html' || path === '/favorites/music') {
      return new Response(musicHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (path === '/favorites/books.html' || path === '/favorites/books') {
      return new Response(booksHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (path === '/favorites/movies.html' || path === '/favorites/movies') {
      return new Response(moviesHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (path === '/favorites/tv_shows.html' || path === '/favorites/tv_shows') {
      return new Response(tvShowsHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }
    
    // Serve static assets
    if (path === '/src/js/main.js') {
      return new Response(mainJS, {
        headers: { 'content-type': 'application/javascript;charset=UTF-8' }
      });
    }
    
    if (path === '/src/css/styles.css') {
      return new Response(stylesCSS, {
        headers: { 'content-type': 'text/css;charset=UTF-8' }
      });
    }

    if (path === '/src/pdf/resume.pdf') {
      return new Response(resumePDF, {
        headers: { 'content-type': 'application/pdf' }
      });
    }
    
    // Serve favicons
    if (path === '/src/favicon/favicon.ico') {
      return new Response(faviconIco, {
        headers: { 'content-type': 'image/x-icon' }
      });
    }
    
    if (path === '/src/favicon/favicon-16x16.png') {
      return new Response(favicon16, {
        headers: { 'content-type': 'image/png' }
      });
    }
    
    if (path === '/src/favicon/favicon-32x32.png') {
      return new Response(favicon32, {
        headers: { 'content-type': 'image/png' }
      });
    }
    
    if (path === '/src/favicon/apple-touch-icon.png') {
      return new Response(appleTouchIcon, {
        headers: { 'content-type': 'image/png' }
      });
    }
    
    if (path === '/src/favicon/android-chrome-192x192.png') {
      return new Response(androidChrome192, {
        headers: { 'content-type': 'image/png' }
      });
    }
    
    if (path === '/src/favicon/android-chrome-512x512.png') {
      return new Response(androidChrome512, {
        headers: { 'content-type': 'image/png' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};