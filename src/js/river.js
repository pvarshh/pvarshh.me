document.addEventListener('DOMContentLoaded', () => {
    if (!document.body.classList.contains('page-home')) return;

    if (!document.getElementById('river-container')) {
        const riverContainer = document.createElement('nav');
        riverContainer.id = 'river-container';
        riverContainer.setAttribute('aria-label', 'Experience river');

        riverContainer.innerHTML = `
            <div class="river-stream" aria-hidden="true"></div>
            <a class="rower-container" href="/pages/experience/index.html" aria-label="View all experiences" title="View all experiences">
                <div class="oar left"></div>
                <div class="oar right"></div>
                <div class="boat"></div>
                <div class="rower-person"></div>
            </a>
            <div id="river-items-container"></div>
        `;

        document.body.appendChild(riverContainer);

        const stream = riverContainer.querySelector('.river-stream');
        for (let i = 0; i < 5; i++) {
            const line = document.createElement('div');
            line.className = 'water-line';
            line.style.left = Math.random() * 80 + 10 + '%';
            line.style.animationDelay = (i * 0.8) + 's';
            line.style.animationDuration = '4s';
            stream.appendChild(line);
        }

        startRiverFlow();
    }
});

function startRiverFlow() {
    const riverContainer = document.getElementById('river-container');
    const itemsContainer = document.getElementById('river-items-container');
    if (!itemsContainer) return;

    const resumeItems = [
        { year: '2023', role: 'Ratna Global Tech', link: '/pages/experience/rgt.html' },
        { year: '2024', role: 'UWM', link: '/pages/experience/uwm.html' },
        { year: '2024', role: 'Teaching Python', link: '/pages/experience/ta.html' },
        { year: '2025', role: 'Networks research', link: '/pages/experience/networks.html' },
        { year: '2025', role: 'AWS', link: '/pages/experience/aws.html' },
        { year: '2025', role: 'Scale AI', link: '/pages/experience/scale.html' },
        { year: '2025', role: 'Healthcare AI', link: '/pages/experience/healthcare.html' },
        { year: '2026', role: 'Uber Eats', link: '/pages/experience/uber.html' },
        { year: '2026', role: 'Google Cloud', link: '/pages/experience/google.html' }
    ];

    const SPEED = 0.28;
    const START_Y = -80;
    const ITEM_SPACING = 150;
    const SPAWN_THRESHOLD = START_Y + ITEM_SPACING;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let currentIndex = 0;
    const active = [];

    function createItem(itemData) {
        const el = document.createElement('div');
        el.className = 'river-item';
        el.innerHTML = `
            <a href="${itemData.link}" class="river-link">
                <span class="year">${itemData.year}</span>
                <span class="role">${itemData.role}</span>
            </a>
        `;
        return el;
    }

    function spawnItem(y = START_Y) {
        const itemData = resumeItems[currentIndex];
        const el = createItem(itemData);
        el.style.top = y + 'px';
        itemsContainer.prepend(el);
        const item = { el, y };
        active.push(item);
        updateOpacity(item);
        currentIndex = (currentIndex + 1) % resumeItems.length;
    }

    function updateOpacity(item) {
        const { y, el } = item;
        const h = riverContainer.clientHeight;
        const visible = y >= 24 && y + el.offsetHeight <= h - 24;
        el.style.opacity = visible ? '1' : '0';
        el.style.visibility = visible ? 'visible' : 'hidden';
    }

    function tick() {
        if (!document.hidden && riverContainer.clientHeight && !reducedMotion.matches && !riverContainer.matches(':hover, :focus-within')) {
            for (let i = active.length - 1; i >= 0; i--) {
                const item = active[i];
                item.y += SPEED;
                item.el.style.top = item.y + 'px';
                updateOpacity(item);

                if (item.y > riverContainer.clientHeight + 50) {
                    item.el.remove();
                    active.splice(i, 1);
                }
            }

            const last = active[active.length - 1];
            if (!last || last.y >= SPAWN_THRESHOLD) {
                spawnItem();
            }
        }

        requestAnimationFrame(tick);
    }

    // Populate the bank immediately, with recent work nearest the top.
    const height = riverContainer.clientHeight || window.innerHeight - 144;
    const count = Math.max(1, Math.min(resumeItems.length, Math.floor((height - 64) / ITEM_SPACING)));
    currentIndex = resumeItems.length - count;
    for (let index = 0; index < count; index++) {
        spawnItem(40 + (count - index - 1) * ITEM_SPACING);
    }
    window.addEventListener('resize', () => active.forEach(updateOpacity));
    requestAnimationFrame(tick);
}
