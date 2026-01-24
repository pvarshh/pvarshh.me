
document.addEventListener('DOMContentLoaded', () => {
    // Inject river container into body if it doesn't exist
    if (!document.getElementById('river-container')) {
        const riverContainer = document.createElement('div');
        riverContainer.id = 'river-container';
        
        // Define structure
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
        
        // Add some water flow lines
        const stream = riverContainer.querySelector('.river-stream');
        for (let i = 0; i < 5; i++) {
            const line = document.createElement('div');
            line.className = 'water-line';
            line.style.left = Math.random() * 80 + 10 + '%';
            line.style.animationDelay = Math.random() * 3 + 's';
            line.style.animationDuration = (Math.random() * 2 + 2) + 's';
            stream.appendChild(line);
        }

        startRiverFlow();
    }
});

function startRiverFlow() {
    const itemsContainer = document.getElementById('river-items-container');
    
    // Resume items based on the user's index.html content
    const resumeItems = [
        { year: '2024', role: 'Teaching Assistant (131)', company: 'CompFor 131', link: '/pages/experience/ta.html', side: 'right-bank' },
        { year: '2025', role: 'Research (Self-Op)', company: 'Self-Op Networks', link: '/pages/experience/networks.html', side: 'left-bank' },
        { year: '2025', role: 'Research (Healthcare)', company: 'Healthcare AI', link: '/pages/experience/healthcare.html', side: 'left-bank' },
        { year: '2025', role: 'Intern @ AWS', company: 'Sagemaker', link: '/pages/experience/aws.html', side: 'right-bank' },
        { year: '2025', role: 'Intern @ Scale AI', company: 'Eval Pipelines', link: '/pages/experience/scale.html', side: 'left-bank' },
        { year: '2026', role: 'Intern @ Uber', company: 'Uber', link: '/pages/experience/uber.html', side: 'right-bank' }
    ];

    let currentIndex = 0;

    function spawnItem() {
        if (document.hidden) return; // Don't spawn if tab is hidden

        const itemData = resumeItems[currentIndex];
        const item = document.createElement('div');
        
        // assign side or center
        const posClass = itemData.side || 'right-bank';
        
        item.className = `river-item ${posClass}`;
        
        item.innerHTML = `
            <a href="${itemData.link}" class="river-link">
                <span class="year">${itemData.year}</span>
                <span class="role">${itemData.role}</span>
            </a>
        `;

        
        // Start position (above view)
        item.style.top = '-50px';
        
        itemsContainer.appendChild(item);

        // Animate down
        let pos = -50;
        const speed = 0.7; // Very slow for easy clicking
        
        function animate() {
            pos += speed;
            item.style.top = pos + 'px';
            
            // Fade in/out
            if (pos > 50 && pos < window.innerHeight - 100) {
                item.style.opacity = 0.8;
            } else if (pos > window.innerHeight - 50) {
                item.style.opacity = 0;
            }

            // Remove when off screen
            if (pos > window.innerHeight + 50) {
                item.remove();
            } else {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);

        // Next item
        currentIndex = (currentIndex + 1) % resumeItems.length;
    }

    // Spawn an item every 3 seconds
    setInterval(spawnItem, 8000);
    
    // Initial spawn
    setTimeout(spawnItem, 1000);
}
