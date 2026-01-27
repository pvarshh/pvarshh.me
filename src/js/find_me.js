document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const timerElement = document.getElementById('timer');
    const resultModal = document.getElementById('result-modal');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const restartBtn = document.getElementById('restart-btn');

    let width, height;
    let target = { x: 0, y: 0 };
    let startTime;
    let isGameOver = false;
    let timerInterval;
    
    // Config
    const itemCount = 2000; // More dense for "code salad"
    const distractions = [];
    const codeChars = ['{', '}', ';', '</', '>', '_', '*', '&', '%', '$', '#', '@', '()', '=>', '[]', 'func', 'var', 'let', 'const', 'if', 'for'];
    const fonts = ['14px "IBM Plex Mono"', '12px "Courier New"', '16px "Consolas"', '10px "Monaco"'];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);
        
        if (!isGameOver) drawScene();
    }

    window.addEventListener('resize', resize);

    function initGame() {
        isGameOver = false;
        resultModal.classList.remove('visible');
        
        // Reset timer
        if (timerInterval) clearInterval(timerInterval);
        timerElement.textContent = "0.0s time";
        
        resize();
        
        // Generate Distractions (Code Salad)
        distractions.length = 0;
        for (let i = 0; i < itemCount; i++) {
            distractions.push({
                x: Math.random() * width,
                y: Math.random() * height,
                color: getRandomColor(),
                char: codeChars[Math.floor(Math.random() * codeChars.length)],
                font: fonts[Math.floor(Math.random() * fonts.length)],
                rotation: (Math.random() - 0.5) * 0.5 // slight tilt
            });
        }

        // Place target (ensure not too close to edges)
        const padding = 60;
        target.x = padding + Math.random() * (width - 2 * padding);
        target.y = padding + Math.random() * (height - 2 * padding);
        
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 100);
        drawScene();
    }

    function getRandomColor() {
        // Muted tech colors
        const colors = [
            'rgba(26, 26, 26, 0.4)', // Dark grey
            'rgba(80, 80, 80, 0.3)', // Medium grey
            'rgba(140, 120, 100, 0.3)', // Brownish
            'rgba(85, 107, 47, 0.3)', // Olive
            'rgba(70, 130, 180, 0.2)' // Steel blue
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function drawScene() {
        // Clear screen
        ctx.clearRect(0, 0, width, height);
        
        // Draw Distractions
        distractions.forEach(d => {
            ctx.save();
            ctx.translate(d.x, d.y);
            ctx.rotate(d.rotation);
            ctx.fillStyle = d.color;
            ctx.font = d.font;
            ctx.fillText(d.char, 0, 0);
            ctx.restore();
        });

        // Draw Target: "Mini Pranav" (Customized Waldo)
        drawTarget(target.x, target.y);
    }

    function drawTarget(x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.fillStyle = '#b22222'; // Distinct red color
        ctx.font = 'bold 20px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('parney', 0, 0);

        ctx.restore();
    }

    function updateTimer() {
        if (isGameOver) return;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        timerElement.textContent = elapsed + 's time';
    }

    canvas.addEventListener('click', (e) => {
        if (isGameOver) return;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Check distance to target
        const dist = Math.hypot(mouseX - target.x, mouseY - target.y);
        
        // Tolerance radius around the small drawing
        if (dist < 40) {
            endGame(true);
        }
    });

    function endGame(won) {
        isGameOver = true;
        clearInterval(timerInterval);
        
        const time = ((Date.now() - startTime) / 1000).toFixed(2);
        
        resultTitle.textContent = "You found me!";
        // Inject Contact Info
        resultMessage.innerHTML = `
            <div style="margin-bottom: 1rem; color: #666; font-size: 0.9rem;">Found in ${time} seconds</div>
            <ul class="contact-list">
                <li><span>Instagram</span> <a href="https://www.instagram.com/pranav_v2704/" target="_blank">@pranav_v2704</a></li>    
                <li><span>X</span> <a href="https://x.com/pvarshh" target="_blank">@pvarshh</a></li>
                <li><span>YouTube</span> <a href="https://www.youtube.com/@pvarshh" target="_blank">@pvarshh</a></li>
                <li><span>TikTok</span> <a href="https://www.tiktok.com/@pvarshh" target="_blank">@pvarshh</a></li>
                <li><span>LeetCode</span> <a href="https://leetcode.com/u/pvarshh/" target="_blank">@pvarshh</a></li>
            </ul>
        `;
        
        resultModal.classList.add('visible');
        
        // Draw a circle around target to show where it was
        if (won) {
            ctx.save();
            ctx.strokeStyle = '#b22222';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(target.x, target.y, 40, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    restartBtn.addEventListener('click', initGame);

    // Initial Start
    initGame();
});
