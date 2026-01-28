(function() {
    const container = document.getElementById('interactive-garden');
    if (!container) return; // Should exist if HTML was injected

    const canvas = document.getElementById('garden-canvas');
    const ctx = canvas.getContext('2d');
    const label = container.querySelector('div'); // The "click to plant" text

    let plants = [];
    let animationId;

    // Configuration
    const CONFIG = {
        color: 'rgba(26, 26, 26, 0.7)',
        branchWidth: 2,
        maxDepth: 6, // Reduced depth to keep compact
        growthSpeed: 0.1,
    };

    function resize() {
        // Force a taller container for better visuals without editing HTML
        container.style.height = '300px'; // Increased from 150px
        
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        redraw();
    }
    
    window.addEventListener('resize', resize);
    
    // Initial size
    setTimeout(resize, 0);

    class Plant {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.age = 0;
            this.maxAge = 120;
            this.seed = Math.random();
            this.hue = Math.floor(Math.random() * 40) + 10; // slightly warm/cool variation if later colored
            this.done = false;
        }

        grow() {
            if (this.age < this.maxAge) {
                this.age += 1;
            } else {
                this.done = true;
            }
        }

        draw(ctx) {
            const progress = Math.min(this.age / this.maxAge, 1);
            // Reduced base size to fit in new height naturally
            const size = 45 + Math.sin(this.seed * 10) * 15; 
            
            // Draw
            this.drawBranch(ctx, this.x, this.y, size * progress, -Math.PI / 2, 0);
        }

        drawBranch(ctx, x, y, len, angle, depth) {
            if (depth > 6) {
                // Draw leaf/flower at tip
                const r = 2 * (len / 10) + 1;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI*2);
                ctx.fillStyle = `rgba(50, 50, 50, ${0.5 + Math.random()*0.2})`;
                ctx.fill();
                return;
            }

            // Pseudo-random based on depth & seed to keep frame-stable
            const r1 = Math.sin(this.seed * 232 + depth * 11); 
            const r2 = Math.cos(this.seed * 912 + depth * 23); 

            // Calculate end point with curve
            const endX = x + Math.cos(angle) * len;
            const endY = y + Math.sin(angle) * len;
            
            // Control point for subtle curve
            const curveStrength = len * 0.2 * r1;
            const cpX = (x + endX) / 2 - Math.sin(angle) * curveStrength;
            const cpY = (y + endY) / 2 + Math.cos(angle) * curveStrength;

            // Draw Limb
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(cpX, cpY, endX, endY);
            ctx.strokeStyle = `rgba(26, 26, 26, ${0.8 - depth * 0.1})`; // Fade out near top
            ctx.lineWidth = Math.max(0.5, (6 - depth) * 0.4);
            ctx.stroke();

            // Next Branches
            const subLen = len * (0.7 + r2 * 0.1);
            const spread = 0.4 + r1 * 0.1;

            this.drawBranch(ctx, endX, endY, subLen, angle - spread, depth + 1);
            this.drawBranch(ctx, endX, endY, subLen, angle + spread, depth + 1);
            
            // Occasional 3rd branch for lushness
            if (depth < 3 && r2 > 0.5) {
                 this.drawBranch(ctx, endX, endY, subLen * 0.8, angle, depth + 1);
            }
        }
    }


    function loop() {
        // Optimization: Only loop if something is growing
        if (plants.every(p => p.done)) {
            animationId = null;
            return; 
        }

        ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio||1), canvas.height / (window.devicePixelRatio||1));
        
        plants.forEach(p => {
            p.grow();
            p.draw(ctx);
        });

        animationId = requestAnimationFrame(loop);
    }

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Logical coords? No, scale is set.
        // Actually, with scale(dpr,dpr), clearRect needs logical coords
        const rect = container.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        
        plants.forEach(p => p.draw(ctx));
    }

    container.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = rect.height; // Always grow from bottom

        plants.push(new Plant(x, y));
        
        // Hide help text
        if (label) {
            label.style.transition = 'opacity 0.5s ease';
            label.style.opacity = 0;
        }

        if (!animationId) loop();
    });
    
    // Plant one initial flower in center so its not empty
    setTimeout(() => {
        if (plants.length === 0) {
            const rect = canvas.getBoundingClientRect();
            if (rect.width > 0) {
                plants.push(new Plant(rect.width / 2, rect.height));
                loop();
            }
        }
    }, 500);

})();