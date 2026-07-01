import indexHTML from '../index.html';
import lifeHTML from '../pages/writing/life.html';
import egoHTML from '../pages/writing/ego.html';
import secondPickHTML from '../pages/writing/2nd-pick.html';
import martyrHTML from '../pages/writing/martyr.html';
import mainJS from './js/main.js';
import stylesCSS from './css/styles.css';
import resumeHTML from '../pages/resume.html';
// Local images (placeholders)
import imagesHTML from '../pages/favorites/images.html';
import musicHTML from '../pages/favorites/music.html';
import booksHTML from '../pages/favorites/books.html';
import moviesHTML from '../pages/favorites/movies.html';
import tvShowsHTML from '../pages/favorites/tv_shows.html';

// Import favicons
import faviconIco from './favicon/favicon.ico';
import favicon16 from './favicon/favicon-16x16.png';
import favicon32 from './favicon/favicon-32x32.png';
import appleTouchIcon from './favicon/apple-touch-icon.png';
import androidChrome192 from './favicon/android-chrome-192x192.png';
import androidChrome512 from './favicon/android-chrome-512x512.png';
import resumePDF from './pdf/resume.pdf';
import siteWebmanifest from '../site.webmanifest';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Serve HTML pages
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(indexHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (url.pathname === '/pages/writing/life.html') {
      return new Response(lifeHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (url.pathname === '/pages/writing/ego.html') {
      return new Response(egoHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (url.pathname === '/pages/writing/2nd-pick.html') {
      return new Response(secondPickHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (url.pathname === '/pages/writing/martyr.html') {
      return new Response(martyrHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    // Resume page
    if (url.pathname === '/pages/resume.html') {
      return new Response(resumeHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    // Favorites: images and music
    if (url.pathname === '/pages/favorites/images.html' || url.pathname === '/pages/favorites/images') {
      return new Response(imagesHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (url.pathname === '/pages/favorites/music.html' || url.pathname === '/pages/favorites/music') {
      return new Response(musicHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (url.pathname === '/pages/favorites/books.html' || url.pathname === '/pages/favorites/books') {
      return new Response(booksHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (url.pathname === '/pages/favorites/movies.html' || url.pathname === '/pages/favorites/movies') {
      return new Response(moviesHTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (url.pathname === '/pages/favorites/tv_shows.html' || url.pathname === '/pages/favorites/tv_shows') {
      return new Response(tvShowsHTML, {
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

    if (url.pathname === '/src/pdf/resume.pdf') {
      return new Response(resumePDF, {
        headers: { 'content-type': 'application/pdf' }
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

    if (url.pathname === '/site.webmanifest') {
      return new Response(siteWebmanifest, {
        headers: { 'content-type': 'application/manifest+json' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};
