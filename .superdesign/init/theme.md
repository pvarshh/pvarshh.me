# Tokens
Ink #1a1a1a; paper #f5f4ef; deep paper #e8e6dc; blue #2c4a6e; muted #666; favorites realm #3d5240. Crimson Text/Georgia serif; IBM Plex Mono for small labels. Body line-height 1.4; h1 2.25rem; h2 1.5rem. Container 840px incl 20px side padding; content-centered 800px. Spacing .25/.35/.5/.75/1/1.25/1.5/2/3rem. Small 2–8px radii, pill trailer buttons. Mobile breakpoint 600px. Paper gradient, subtle grain; reduced-motion support.

# Full CSS
## src/css/styles.css
```css
:root {
    --color-ink: #1a1a1a;
    --color-paper: #f5f4ef;
    --color-paper-deep: #e8e6dc;
    --color-accent: #2c4a6e;
    --color-muted: #666;
    --font-serif: "Crimson Text", Georgia, serif;
    --font-mono: "IBM Plex Mono", monospace;
}

html {
    overflow-x: clip;
}

body {
    background: linear-gradient(135deg, var(--color-paper) 0%, var(--color-paper-deep) 50%, var(--color-paper) 100%);
    background-size: 200% 200%;
    animation: gradientShift 15s ease infinite;
    color: var(--color-ink);
    padding: 2rem 0;
    line-height: 1.4;
    font-family: var(--font-serif);
    cursor: default;
    position: relative;
    overflow-x: clip;
    -webkit-text-size-adjust: 100%;
}

/* Subtle grain texture overlay for vintage feel */
body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.03;
    z-index: -1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    pointer-events: none;
    animation: grainMove 8s steps(10) infinite;
}

@keyframes grainMove {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-5%, -10%); }
    20% { transform: translate(-15%, 5%); }
    30% { transform: translate(7%, -25%); }
    40% { transform: translate(-5%, 25%); }
    50% { transform: translate(-15%, 10%); }
    60% { transform: translate(15%, 0%); }
    70% { transform: translate(0%, 15%); }
    80% { transform: translate(3%, 35%); }
    90% { transform: translate(-10%, 10%); }
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Container */
.container {
    margin: 0 auto;
    padding: 0 20px;
    max-width: 840px;
    font-family: var(--font-serif);
    animation: fadeIn 1s ease-in;
}

.site-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    margin-bottom: 1rem;
    width: 100%;
}

.site-header > *:first-child {
    justify-self: start;
    text-align: left;
}

.site-header > *:nth-child(2) {
    justify-self: center;
    text-align: center;
    margin: 0;
}

.site-header > *:last-child {
    justify-self: end;
    text-align: right;
}

.site-header a:hover {
    color: var(--color-accent);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.content {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
}

.content-centered {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
}

.content-blog-post {
    max-width: 680px;
    margin: 0 auto;
    text-align: left;
    position: relative;
}

.content-blog-post p {
    font-size: 1.05rem;
    line-height: 1.75;
}

.content-blog-post > b {
    display: block;
    font-size: 1.15rem;
    margin-top: 1.75rem;
    margin-bottom: 0.25rem;
}

/* Subtle page number indicator effect */
.content-blog-post::before {
    content: '◦';
    position: absolute;
    left: -40px;
    top: 0;
    font-size: 2rem;
    opacity: 0.1;
    animation: fadeInOut 3s ease-in-out infinite;
}

@keyframes fadeInOut {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.3; }
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
}

h1 {
    font-weight: 700;
    font-size: 2.25rem;
    margin-bottom: 1.25rem;
}

h2 {
    font-weight: 700;
    font-size: 1.5rem;
    margin: 1rem 0;
}

p {
    font-family: var(--font-serif);
}

ol, ul, li {
    font-size: inherit;
    line-height: inherit;
}

/* Staggered fade-in for list items (not story panels) */
.content > ul li,
.content > ol li,
.content > p + ul li,
.content > p + ol li,
.content > section:not(.story-panel) ul li {
    animation: fadeInList 0.5s ease-out backwards;
    animation-delay: calc(var(--li-index, 0) * 0.05s);
}

ol li:nth-child(1), ul li:nth-child(1) { --li-index: 1; }
ol li:nth-child(2), ul li:nth-child(2) { --li-index: 2; }
ol li:nth-child(3), ul li:nth-child(3) { --li-index: 3; }
ol li:nth-child(4), ul li:nth-child(4) { --li-index: 4; }
ol li:nth-child(5), ul li:nth-child(5) { --li-index: 5; }
ol li:nth-child(6), ul li:nth-child(6) { --li-index: 6; }
ol li:nth-child(7), ul li:nth-child(7) { --li-index: 7; }
ol li:nth-child(8), ul li:nth-child(8) { --li-index: 8; }
ol li:nth-child(9), ul li:nth-child(9) { --li-index: 9; }
ol li:nth-child(10), ul li:nth-child(10) { --li-index: 10; }

@keyframes fadeInList {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

li {
    padding-left: 0.3rem;
    position: relative;
}

.serif {
    font-family: Georgia, serif;
}

.garamond {
    font-family: "Garamond", serif;
}

.georgia {
    font-family: Georgia, serif;
}


#obfuscated-text, #obfuscated-text-1, #obfuscated-text-2 {
    font-family: 'Courier New', Courier, monospace;
    font-weight: normal;
}

.obfuscated-link {
    color: inherit;
    text-decoration: none;
    background-image: none;
    border-bottom: none;
}

.obfuscated-link:hover {
    color: inherit;
    text-decoration: none;
    background-image: none;
    border-bottom: none;
    text-shadow: none;
    transform: none;
}

.obfuscated-link::after,
.obfuscated-link:hover::after {
    display: none;
}

.yc-badge {
    white-space: nowrap;
}

.yc-mark {
    width: 0.88em;
    height: 0.88em;
    vertical-align: -0.11em;
    margin-right: 0.28em;
    border-radius: 1px;
}

.site-title {
    text-decoration: none;
    color: inherit;
}

.site-title:hover {
    color: inherit;
}

.with-space {
    margin-top: 2rem; /* Add space above the line break */
    position: relative;
}

/* Decorative line animation */
.with-space::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1rem;
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, rgba(26, 26, 26, 0.2), transparent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.8s ease;
}

.with-space:hover::after {
    transform: scaleX(1);
}

.bold {
    font-weight: bold;
    transition: all 0.2s ease;
}

.bold:hover {
    letter-spacing: 0.3px;
}

.italic {
    font-style: italic;
    transition: all 0.2s ease;
}

.italic:hover {
    letter-spacing: 0.5px;
    font-style: italic;
}


/* Links */
a {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px solid rgba(26, 26, 26, 0.35);
    transition: color 0.25s ease, border-color 0.25s ease;
}

a:hover {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
}

/* Remove underline from links in h2 elements */
h2 a {
    text-decoration: none;
}

h2 a:hover {
    color: var(--color-accent);
}

/* Hover effect for h3 headings */
h3 {
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
}

h3:hover {
    transform: translateX(3px);
}

h3::before {
    content: '→';
    position: absolute;
    left: -20px;
    opacity: 0;
    transition: all 0.3s ease;
}

h3:hover::before {
    opacity: 0.5;
    left: -25px;
}

/* Fun Easter egg: konami code style effect */
@keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

/* Smooth scroll behavior */
html {
    scroll-behavior: smooth;
}

/* Selection styling */
::selection {
    background: rgba(44, 74, 110, 0.2);
    color: var(--color-ink);
}

::-moz-selection {
    background: rgba(44, 74, 110, 0.2);
    color: var(--color-ink);
}

/* Header */
.header-nav {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2rem;
}

.header-nav h1 {
    font-weight: normal;
    font-size: 2.2rem;
    margin-bottom: 0;
    position: relative;
    transition: all 0.3s ease;
}

/* Fun wiggle on header title hover */
.header-nav h1:hover {
    animation: wiggle 0.5s ease-in-out;
}

@keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-1deg); }
    75% { transform: rotate(1deg); }
}

.nav-links {
    font-size: 1rem;
    display: flex;
    gap: 1rem;
}

/* Separator dots between nav items */
.nav-links::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: -5px;
    background: linear-gradient(to right, transparent, rgba(26, 26, 26, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.5s ease;
}

.nav-links:hover::before {
    opacity: 1;
}

.nav-item {
    text-decoration: underline;
    text-underline-offset: 2px;
    color: inherit;
    border-bottom: none;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    position: relative;
}

.nav-item:hover {
    color: var(--color-accent);
}

/* Remove sparkle from nav items */
.nav-item::after {
    display: none;
}

.nav-item.current {
    border-bottom: 2px solid var(--color-accent);
    text-decoration: none;
}

.right-align {
    text-align: right;
    margin-bottom: 3rem;
    position: relative;
}

/* Decorative quote mark for right-aligned content */
.right-align::before {
    content: '"';
    position: absolute;
    left: -30px;
    top: -10px;
    font-size: 4rem;
    opacity: 0.05;
    font-family: Georgia, serif;
    transition: all 0.5s ease;
}

.right-align:hover::before {
    opacity: 0.15;
    transform: scale(1.1);
}

/* Content sections */
section {
    margin: 2rem 0;
    animation: slideInSection 0.6s ease-out backwards;
    animation-delay: calc(var(--section-index, 0) * 0.1s);
}

@keyframes slideInSection {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Assign delay variables to sections */
section:nth-of-type(1) { --section-index: 1; }
section:nth-of-type(2) { --section-index: 2; }
section:nth-of-type(3) { --section-index: 3; }
section:nth-of-type(4) { --section-index: 4; }
section:nth-of-type(5) { --section-index: 5; }

/* Blog post specific styling */
.blog-title {
    font-size: 3rem;
    font-weight: normal;
    margin: 0 0 1rem 0;
    line-height: 1.2;
    animation: fadeInTitle 1.2s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes fadeInTitle {
    from { 
        opacity: 0; 
        transform: translateY(-20px);
        letter-spacing: 5px;
    }
    to { 
        opacity: 1; 
        transform: translateY(0);
        letter-spacing: 0px;
    }
}

/* Responsive images and figures */
.wide-image, .wide-figure {
    max-width: calc(100vw - 40px);
    width: auto;
    height: auto;
    margin: 2rem 0;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.wide-image:hover, .wide-figure:hover {
    transform: scale(1.01);
    filter: contrast(1.05) brightness(1.02);
}

.content-centered .wide-image,
.content-centered .wide-figure,
.content-blog-post .wide-image,
.content-blog-post .wide-figure {
    margin-left: 50%;
    transform: translateX(-50%);
}

.wide-figure {
    text-align: center;
}

.wide-figure img {
    max-width: 100%;
    height: auto;
    border-radius: 2px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.wide-figure:hover img {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
}

.wide-figure figcaption {
    margin-top: 0.5rem;
    font-style: italic;
    font-size: 0.9rem;
    color: #666;
    opacity: 0;
    animation: fadeInCaption 0.8s ease-in 0.3s forwards;
}

@keyframes fadeInCaption {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Legacy footer (non-site-footer pages) */
footer:not(.site-footer) {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: fadeInFooter 1s ease-in 0.5s both;
}

@keyframes fadeInFooter {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.footer-left {
    font-size: 1.5rem;  /* Adjust size as needed */
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.footer-left:hover {
    transform: scale(1.05) rotate(-2deg);
}

.footer-right {
    display: flex;
    gap: 1rem;
}

.footer-right a {
    transition: all 0.3s ease;
    display: inline-block;
}

.footer-right a:hover {
    transform: translateY(-3px) rotate(5deg);
}

/* Line length control */
.content p {
    font-size: 0.95rem;
    line-height: 1.5;
}

/* First letter drop cap effect for first paragraph in blog posts */
.content-blog-post > p:first-of-type::first-letter {
    font-size: 3.5rem;
    line-height: 0.9;
    float: left;
    margin: 0.1rem 0.15rem 0 0;
    font-weight: 700;
    color: rgba(26, 26, 26, 0.75);
    font-family: var(--font-serif);
}

#edited-date {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-style: normal;
    letter-spacing: 0.04em;
    opacity: 0.45;
}

.content ol, .content ul {
    font-size: 0.95rem;
    line-height: 1.5;
}

/* .content li {
    margin-bottom: 0.5rem;
} */

/* Responsive adjustments */
@media (max-width: 600px) {
    body {
        padding: 1rem 0;
    }
    
    .container {
        padding-left: max(16px, env(safe-area-inset-left));
        padding-right: max(16px, env(safe-area-inset-right));
    }
    
    h1 {
        font-size: 1.85rem;
    }
    
    .content {
        font-size: 0.95rem;
    }

    .site-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
        margin-bottom: 1.25rem;
        text-align: center;
    }

    .site-header > *:first-child,
    .site-header > *:nth-child(2),
    .site-header > *:last-child {
        justify-self: auto;
        text-align: center;
        width: 100%;
    }

    .site-header a:first-child {
        order: 1;
        font-size: 1.05rem;
        line-height: 1.35;
        word-break: break-word;
    }

    .site-header h2 {
        order: 2;
        font-size: 0.95rem;
        margin: 0;
        font-weight: 400;
        opacity: 0.65;
    }

    .site-header .nav-item {
        order: 3;
        font-size: 0.85rem;
    }

    .content-blog-post::before,
    .right-align::before {
        display: none;
    }

    .wide-image,
    .wide-figure {
        max-width: 100%;
        margin-left: 0;
        transform: none;
    }

    .content-centered .wide-image,
    .content-centered .wide-figure,
    .content-blog-post .wide-image,
    .content-blog-post .wide-figure {
        margin-left: 0;
        transform: none;
    }

    .interactive-item {
        margin-left: 0;
        padding-left: 0.25rem;
        padding-right: 0.25rem;
    }

    .site-footer {
        padding: 0 16px 2rem;
        margin-top: 2rem;
    }

    .site-footer-quote {
        font-size: 0.82rem;
        line-height: 1.5;
        padding: 0 0.25rem;
    }

    .site-footer-marginalia {
        font-size: 0.52rem;
        padding: 0 0.15rem;
        overflow-wrap: anywhere;
        word-break: break-word;
        line-height: 1.45;
    }

    a:hover {
        transform: none;
    }
}

/* Balance layout when river sidebar is visible (homepage) */
@media (min-width: 1300px) {
    .page-home .container {
        padding-right: 20px;
    }
}

/* Fun time-based color shifts (subtle) */
@media (prefers-reduced-motion: no-preference) {
    body {
        animation: gradientShift 15s ease infinite, timeBasedTint 60s ease infinite;
    }
}

@keyframes timeBasedTint {
    0%, 100% { filter: brightness(1); }
    25% { filter: brightness(1.02) hue-rotate(2deg); }
    50% { filter: brightness(0.98); }
    75% { filter: brightness(1.02) hue-rotate(-2deg); }
}

/* Respect user preferences for reduced motion */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

.spotify-embed {
    max-width: 640px;
    width: 100%;
    margin: 0.6rem auto;
    box-sizing: border-box;
}
.spotify-embed iframe {
    width: 100%;
    height: 84px;
    border: none;
    border-radius: 8px;
    display: block;
    overflow: hidden;
}
.embed-item {
    padding: 0.75rem 1rem;
    background: transparent; /* removed white card */
    border-radius: 10px;
    box-shadow: none; /* remove raised box look */
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
}
.embed-item h3 {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.2;
}
.embed-item .spotify-meta {
    margin: 0;
    color: rgba(26,26,26,0.65);
    font-size: 0.92rem;
}

/* Trailer Modal Styles */
.trailer-btn {
    appearance: none;
    background: transparent;
    border: 1px solid rgba(26, 26, 26, 0.2);
    color: #1a1a1a;
    padding: 0.6rem 1.4rem;
    font-family: inherit; /* Inherit font from body for consistency */
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 600;
    cursor: pointer;
    border-radius: 2rem;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: inline-flex;
    align-items: center;
    margin-top: 0.5rem;
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.trailer-btn::before {
    content: '▶';
    font-size: 0.7em;
    margin-right: 0.8rem;
    transition: transform 0.3s ease;
}

/* Swipe Fill Effect */
.trailer-btn::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #1a1a1a;
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: -1;
    border-radius: 2rem;
}

.trailer-btn:hover {
    color: #f5f4ef;
    border-color: #1a1a1a;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.trailer-btn:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
}

.trailer-btn:hover::before {
    transform: translateX(3px);
}

.trailer-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.modal-content {
    width: 90%;
    max-width: 800px;
    background: transparent;
    position: relative;
    transform: scale(0.9);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-overlay.active .modal-content {
    transform: scale(1);
}

.close-btn {
    position: absolute;
    top: -40px;
    right: 0;
    background: transparent;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    transition: transform 0.3s ease;
}

.close-btn:hover {
    transform: scale(1.1) rotate(90deg);
}

.video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.summary-container {
    background: #f5f4ef;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    max-height: 70vh;
    overflow-y: auto;
    text-align: left;
    font-family: var(--font-serif);
    color: var(--color-ink);
    position: relative;
}

.summary-container h3 {
    margin-top: 0;
    font-family: 'Crimson Text', serif;
    font-size: 1.5rem;
    border-bottom: 1px solid rgba(0,0,0,0.1);
}

.summary-container p {
    line-height: 1.6;
    font-size: 1.1rem;
}

/* Principles Container for Two Columns */
.principles-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.principles-container ol {
    flex: 1;
    min-width: 250px;
    padding-left: 20px; /* Ensure bullets are visible */
    margin-top: -0.25rem;
    margin-bottom: -0.25rem;
}

.principles-container ul {
    flex: 1;
    min-width: 250px;
    padding-left: 20px; /* Ensure bullets are visible */
    margin-top: -0.25rem;
    margin-bottom: -0.25rem;
}

@media (max-width: 600px) {
    .principles-container {
        flex-direction: column;
    }
}

/* Spacing fixes for cleaner layout */


p + ul, p + ol {
    margin-top: -0.5rem; /* Pull list closer to the paragraph above it */
    margin-bottom: 0.5rem;
}

ul, ol {
    padding-left: 1.5rem;
}

li {
    margin-bottom: 0.25rem;
}

/* Reset margin for content lists that follow paragraphs */
.content-list {
    margin-top: 0 !important;
}
/* Picture Web Grid */
.picture-web {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
    width: 100%;
}

.picture-item {
    position: relative;
    overflow: hidden;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08); /* Subtle shadow fitting the theme */
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    min-width: 0; /* Prevents grid blowout with large images */
}

.picture-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
    z-index: 1;
}

.picture-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
    filter: grayscale(20%); /* Slightly vintage/muted to match site */
}

.picture-item:hover img {
    transform: scale(1.03);
    filter: grayscale(0%);
}

/* Interactive List Items */
.interactive-item {
    position: relative;
    padding: 0.5rem 0.8rem;
    margin-left: -0.8rem; /* Counteract padding to keep alignment */
    border-radius: 6px;
    margin-bottom: 0.2rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    /* Initialize vars */
    --mouse-x: 50%;
    --mouse-y: 50%;
}

.interactive-item:hover {
    background: radial-gradient(
        circle at var(--mouse-x) var(--mouse-y), 
        rgba(0, 0, 0, 0.06), 
        transparent 150px
    );
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    z-index: 2;
}

/* Site footer band */
.site-footer {
    display: block;
    margin-top: 3rem;
    max-width: 840px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 20px 3rem;
    border-top: none;
}

.site-footer-quote {
    text-align: center;
    margin: 0 0 1.25rem;
    padding-top: 0;
    border-top: none;
    opacity: 0.6;
    font-size: 0.9rem;
    font-style: italic;
    line-height: 1.45;
}

.site-footer-marginalia {
    text-align: center;
    min-height: 2.2em;
    margin: 0;
    padding: 0 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.01em;
    line-height: 1.55;
    opacity: 0.36;
    transition: opacity 0.4s ease;
    max-width: 40rem;
    margin-left: auto;
    margin-right: auto;
}

.site-footer-marginalia .marginalia-text {
    display: inline-block;
    transition: opacity 0.7s ease;
}

.site-footer-marginalia .marginalia-text.fading {
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
    .site-footer-marginalia .marginalia-text {
        transition: none;
    }
}

```
## src/css/subpage.css
```css
/* Subpage realm atmosphere */

.page-sub {
    --sub-realm-color: var(--color-accent);
}

.page-sub.realm-cs { --sub-realm-color: #2c4a6e; }
.page-sub.realm-words { --sub-realm-color: #5a4a3a; }
.page-sub.realm-world { --sub-realm-color: #3d5240; }
.page-sub.realm-path { --sub-realm-color: #1a1a1a; }

.page-sub .site-header a:first-child {
    transition: color 0.25s ease;
}

.page-sub .site-header a:first-child:hover,
.page-sub .site-header a.nav-item:hover {
    color: var(--sub-realm-color);
}

.subpage-realm {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-align: center;
    opacity: 0.38;
    margin: -0.35rem 0 1.25rem;
    color: var(--sub-realm-color);
}

#subpage-fragments {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
}

.subpage-fragment {
    position: absolute;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    opacity: 0;
    white-space: nowrap;
    color: rgba(26, 26, 26, 0.28);
    animation: subFragmentDrift var(--dur, 18s) ease-in-out infinite;
    animation-delay: var(--delay, 0s);
}

@keyframes subFragmentDrift {
    0%, 100% { opacity: 0; transform: translate(0, 0); }
    20% { opacity: var(--peak, 0.18); }
    80% { opacity: var(--peak, 0.14); }
    50% { transform: translate(var(--dx, 12px), var(--dy, -8px)); }
}

.page-sub .container,
.page-sub .content-centered {
    position: relative;
    z-index: 1;
}

@media (prefers-reduced-motion: reduce) {
    #subpage-fragments { display: none; }
}

.page-sub.realm-words #subpage-fragments {
    display: none;
}

/* ── Favorites: hover whispers ── */
.fav-pick {
    position: relative;
    list-style: none;
    margin-bottom: 2rem !important;
    cursor: default;
}

.fav-pick .fav-title {
    transition: color 0.25s ease;
}

.fav-pick:hover .fav-title,
.fav-pick:focus-within .fav-title {
    color: var(--sub-realm-color, #3d5240);
}

.fav-whisper {
    display: block;
    margin: 0.35rem 0 0;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.03em;
    line-height: 1.45;
    color: rgba(26, 26, 26, 0.55);
}

.fav-whisper.fav-aside {
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    margin: 0;
    font-style: italic;
    transition: opacity 0.3s ease, max-height 0.35s ease, margin 0.3s ease;
}

.fav-pick:hover .fav-whisper.fav-aside,
.fav-pick:focus-within .fav-whisper.fav-aside {
    opacity: 1;
    max-height: 3rem;
    margin-top: 0.45rem;
}

/* Books: shelf spine */
.fav-spine {
    padding-left: 0.85rem;
    border-left: 2px solid transparent;
    transition: border-color 0.3s ease, padding-left 0.3s ease;
}

.fav-spine:hover,
.fav-spine:focus-within {
    border-left-color: var(--sub-realm-color, #3d5240);
    padding-left: 1rem;
}

/* Movies / TV: reel timecode */
.fav-reel .fav-aside::before {
    content: '▶ ';
    opacity: 0.5;
    font-style: normal;
}

.fav-reel:hover .fav-title,
.fav-reel:focus-within .fav-title {
    letter-spacing: 0.02em;
}

.fav-category {
    position: relative;
}

.fav-category .fav-whisper {
    display: block;
    margin-left: 0;
}

.fav-photo {
    position: relative;
    cursor: crosshair;
}

.fav-photo .fav-whisper {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0.75rem;
    padding: 0.5rem 0.75rem;
    margin: 0;
    background: rgba(245, 244, 239, 0.92);
    font-size: 0.68rem;
    max-height: none;
    opacity: 0;
    pointer-events: none;
}

.fav-photo:hover .fav-whisper,
.fav-photo:focus-within .fav-whisper {
    opacity: 1;
}

.fav-photo:hover img,
.fav-photo:focus-within img {
    filter: brightness(0.92);
    transition: filter 0.35s ease;
}

.embed-item.fav-pick {
    margin-bottom: 1.5rem;
    padding: 0.25rem 0;
    border-radius: 4px;
    transition: box-shadow 0.25s ease;
}

.embed-item.fav-pick .fav-whisper {
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transition: opacity 0.3s ease, max-height 0.35s ease, margin 0.3s ease;
}

.embed-item.fav-pick:hover,
.embed-item.fav-pick:focus-within {
    box-shadow: inset 3px 0 0 var(--sub-realm-color, #3d5240);
}

.embed-item.fav-pick:hover .fav-whisper,
.embed-item.fav-pick:focus-within .fav-whisper {
    opacity: 1;
    max-height: 4rem;
    margin-top: 0.45rem;
}

.fav-category .fav-whisper {
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transition: opacity 0.3s ease, max-height 0.35s ease, margin 0.3s ease;
}

.fav-category:hover .fav-whisper,
.fav-category:focus-within .fav-whisper {
    opacity: 1;
    max-height: 3rem;
    margin-top: 0.35rem;
}

/* ── Experience index: vertical timeline ── */
.exp-vtimeline {
    list-style: none;
    margin: 1.25rem 0 0;
    padding: 0 0 0 1.1rem;
    position: relative;
}

.exp-vtimeline::before {
    content: '';
    position: absolute;
    left: 0.35rem;
    top: 0.55rem;
    bottom: 0.55rem;
    width: 1px;
    background: rgba(26, 26, 26, 0.14);
}

.exp-vtimeline-item {
    position: relative;
    padding: 0 0 1.65rem 1.1rem;
    margin: 0 !important;
    cursor: pointer;
}

.exp-vtimeline-item:last-child {
    padding-bottom: 0;
}

.exp-vtimeline-item::before {
    content: '';
    position: absolute;
    left: -0.75rem;
    top: 0.5rem;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-paper, #f5f4ef);
    border: 1.5px solid var(--sub-realm-color, #2c4a6e);
    box-sizing: border-box;
    transition: background 0.2s ease, transform 0.2s ease;
}

.exp-vtimeline-item:first-child::before {
    background: var(--sub-realm-color, #2c4a6e);
}

.exp-vtimeline-item:hover::before,
.exp-vtimeline-item:focus-within::before {
    transform: scale(1.15);
}

.exp-vtimeline-when {
    display: block;
    margin: 0 0 0.2rem;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.45;
    color: var(--sub-realm-color, #2c4a6e);
}

.exp-vtimeline-title {
    display: inline-block;
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.35;
    border-bottom: 1px solid rgba(26, 26, 26, 0.2);
    transition: color 0.2s ease, border-color 0.2s ease;
}

.exp-vtimeline-item:hover .exp-vtimeline-title,
.exp-vtimeline-item:focus-within .exp-vtimeline-title {
    color: var(--sub-realm-color, #2c4a6e);
    border-bottom-color: var(--sub-realm-color, #2c4a6e);
}

.exp-vtimeline-desc {
    margin: 0.35rem 0 0;
    font-size: 0.92rem;
    line-height: 1.5;
    opacity: 0.72;
}

/* Experience detail: scroll readout */
.exp-readout {
    position: sticky;
    top: 0.75rem;
    z-index: 5;
    display: inline-flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.3rem 0.65rem;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.06em;
    background: rgba(245, 244, 239, 0.85);
    border: 1px solid rgba(26, 26, 26, 0.08);
    border-radius: 4px;
    opacity: 0;
    transform: translateY(-4px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
}

.exp-readout.visible {
    opacity: 0.7;
    transform: translateY(0);
}

.exp-readout-pct {
    color: var(--sub-realm-color, #2c4a6e);
}

@media (max-width: 600px) {
    .subpage-realm {
        font-size: 0.58rem;
        letter-spacing: 0.1em;
        margin-bottom: 1rem;
    }

    .exp-readout,
    .learn-loss {
        font-size: 0.55rem;
        max-width: 100%;
        flex-wrap: wrap;
        gap: 0.35rem;
    }

    .exp-readout-cmd {
        overflow-wrap: anywhere;
    }

    .exp-vtimeline {
        padding-left: 0.95rem;
    }

    .exp-vtimeline-item {
        padding-bottom: 1.35rem;
    }

    .exp-vtimeline-title {
        font-size: 1rem;
    }

    .learn-stack {
        gap: 0.3rem;
    }

    .learn-stack-btn {
        min-width: calc(50% - 0.2rem);
        padding: 0.45rem 0.5rem;
    }

    .learn-stack-label {
        font-size: 0.62rem;
    }

    .fav-photo .fav-whisper {
        font-size: 0.62rem;
        padding: 0.4rem 0.5rem;
    }
}

/* Learning: depth stack */
.learn-stack {
    display: flex;
    gap: 0.35rem;
    margin: 1.25rem 0 1rem;
    flex-wrap: wrap;
}

.learn-stack-btn {
    flex: 1;
    min-width: 5.5rem;
    padding: 0.5rem 0.65rem;
    border: 1px solid rgba(26, 26, 26, 0.12);
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    text-align: left;
    font-family: var(--font-mono);
    transition: border-color 0.25s ease, background 0.25s ease;
}

.learn-stack-btn:hover,
.learn-stack-btn.active {
    border-color: var(--sub-realm-color, #2c4a6e);
    background: rgba(44, 74, 110, 0.05);
}

.learn-stack-label {
    display: block;
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.learn-stack-hint {
    display: block;
    margin-top: 0.2rem;
    font-size: 0.58rem;
    opacity: 0.45;
    letter-spacing: 0.04em;
}

body[data-learn-layer="unknown"] .learn-topics a {
    opacity: 0.55;
}

body[data-learn-layer="learning"] .learn-topics a {
    opacity: 1;
    text-decoration-thickness: 2px;
}

body[data-learn-layer="known"] .learn-topics {
    opacity: 0.35;
}

/* ML pages — training loss readout */
.learn-loss {
    position: sticky;
    top: 0.75rem;
    z-index: 5;
    display: inline-flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.3rem 0.65rem;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.06em;
    background: rgba(245, 244, 239, 0.85);
    border: 1px solid rgba(26, 26, 26, 0.08);
    border-radius: 4px;
    opacity: 0;
    transform: translateY(-4px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
}

.learn-loss.visible {
    opacity: 0.7;
    transform: translateY(0);
}

.learn-loss-val {
    color: var(--sub-realm-color, #2c4a6e);
}

@media (prefers-reduced-motion: reduce) {
    .fav-whisper.fav-aside,
    .fav-category .fav-whisper,
    .exp-readout,
    .learn-loss {
        transition: none;
    }

    .fav-pick .fav-whisper.fav-aside,
    .fav-category .fav-whisper,
    .fav-photo .fav-whisper {
        opacity: 0.85;
        max-height: none;
        transform: none;
    }
}

```
