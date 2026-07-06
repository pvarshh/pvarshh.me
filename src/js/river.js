
document.addEventListener('DOMContentLoaded', () => {
    if (!document.body.classList.contains('page-home')) return;

    if (!document.getElementById('river-container')) {
        const riverContainer = document.createElement('div');
        riverContainer.id = 'river-container';

        riverContainer.innerHTML = `
            <div class="river-stream"></div>
            <div class="rower-container">
                <div class="oar left"></div>
                <div class="oar right"></div>
                <div class="boat"></div>
                <div class="rower-person"></div>
            </div>
            <div id="river-items-container"></div>
        `;

        document.body.appendChild(riverContainer);

        const rowerContainer = riverContainer.querySelector('.rower-container');
        rowerContainer.style.cursor = 'pointer';
        rowerContainer.title = 'View all experiences';
        rowerContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = '/pages/experience/index.html';
        });

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
    const itemsContainer = document.getElementById('river-items-container');
    if (!itemsContainer) return;

    const resumeItems = [
        { year: '2023', role: 'Intern @ RGT', company: 'Ratna Global Tech', link: '/pages/experience/rgt.html', side: 'right-bank' },
        { year: '2024', role: 'Intern @ UWM', company: 'United Wholesale Mortgage', link: '/pages/experience/uwm.html', side: 'right-bank' },
        { year: '2024', role: 'Teaching Assistant (131)', company: 'CompFor 131', link: '/pages/experience/ta.html', side: 'right-bank' },
        { year: '2025', role: 'Research (Networks)', company: 'Self-Op Networks', link: '/pages/experience/networks.html', side: 'left-bank' },
        { year: '2025', role: 'Research (Healthcare)', company: 'Healthcare AI', link: '/pages/experience/healthcare.html', side: 'left-bank' },
        { year: '2025', role: 'Intern @ AWS', company: 'Sagemaker', link: '/pages/experience/aws.html', side: 'right-bank' },
        { year: '2025', role: 'Intern @ Scale AI', company: 'Eval Pipelines', link: '/pages/experience/scale.html', side: 'left-bank' },
        { year: '2026', role: 'Intern @ Uber', company: 'Uber', link: '/pages/experience/uber.html', side: 'right-bank' }
    ];

    const SPEED = 0.28;
    const START_Y = -50;
    const ITEM_SPACING = 220;
    const SPAWN_THRESHOLD = START_Y + ITEM_SPACING;

    let currentIndex = 0;
    const active = [];

    function createItem(itemData) {
        const el = document.createElement('div');
        const posClass = itemData.side || 'right-bank';
        el.className = `river-item ${posClass}`;
        el.innerHTML = `
            <a href="${itemData.link}" class="river-link">
                <span class="year">${itemData.year}</span>
                <span class="role">${itemData.role}</span>
            </a>
        `;
        return el;
    }

    function spawnItem() {
        const itemData = resumeItems[currentIndex];
        const el = createItem(itemData);
        el.style.top = START_Y + 'px';
        itemsContainer.appendChild(el);
        active.push({ el, y: START_Y });
        currentIndex = (currentIndex + 1) % resumeItems.length;
    }

    function updateOpacity(item) {
        const { y, el } = item;
        const h = window.innerHeight;
        if (y > 50 && y < h - 100) {
            el.style.opacity = '0.8';
        } else if (y >= h - 50) {
            el.style.opacity = String(Math.max(0, 0.8 * (1 - (y - (h - 50)) / 50)));
        } else if (y <= 50) {
            el.style.opacity = String(Math.max(0, 0.8 * (y - START_Y) / (50 - START_Y)));
        }
    }

    function tick() {
        if (!document.hidden) {
            for (let i = active.length - 1; i >= 0; i--) {
                const item = active[i];
                item.y += SPEED;
                item.el.style.top = item.y + 'px';
                updateOpacity(item);

                if (item.y > window.innerHeight + 50) {
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

    spawnItem();
    requestAnimationFrame(tick);
}
