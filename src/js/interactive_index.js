document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('ul li').forEach((item, index) => {
        if (item.closest('.story-panel')) {
            return;
        }

        item.classList.add('interactive-item');
        item.style.setProperty('--li-index', index + 1);

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            item.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            item.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });

        item.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') return;
            const link = item.querySelector('a');
            if (link) link.click();
        });

        item.style.cursor = 'pointer';
    });

    document.querySelectorAll('.story-panel').forEach((panel) => {
        panel.querySelectorAll('ul li').forEach((item, i) => {
            item.style.setProperty('--li-index', i + 1);
        });
    });
});
