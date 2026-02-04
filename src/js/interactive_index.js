document.addEventListener('DOMContentLoaded', () => {
    const listItems = document.querySelectorAll('ul li');

    listItems.forEach((item, index) => {
        item.classList.add('interactive-item');
        
        // Set index for staggered animation (extends beyond CSS limit)
        item.style.setProperty('--li-index', index + 1);
        
        // Mouse move spotlight effect
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        });

        // Make the whole list item clickable
        item.addEventListener('click', (e) => {
            // If the user clicked a link directly, let it be
            if (e.target.tagName === 'A') return;

            const link = item.querySelector('a');
            if (link) {
                link.click();
            }
        });
        
        // Cursor style
        item.style.cursor = 'pointer';
    });
});
