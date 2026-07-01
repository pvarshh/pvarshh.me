class MazeGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        // Create canvas
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.container.appendChild(this.canvas);
        
        // Settings
        this.cellSize = 15; // Smaller cells for challenging maze
        this.cols = 0;
        this.rows = 0;
        this.grid = [];
        this.stack = [];
        this.current = null; 
        this.player = { x: 0, y: 0 };
        this.goal = { x: 0, y: 0 };
        this.path = []; 
        this.glyphs = ['λ', '∂', '∞', '?', '§', '1066', '0', '1'];

        // Styling - Matching website aesthetic
        this.colors = {
            bg: null, // Transparent
            wall: "rgba(50, 50, 50, 0.8)", // Soft Charcoal
            player: "#1a1a1a", 
            goal: "#1a1a1a",
            trail: "rgba(26, 26, 26, 0.05)" // Very subtle trail
        };

        this.init();
        this.setupInputs();

        let resizeTimer;
        window.addEventListener('resize', () => {
            if (this.solved) return;
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.init(), 150);
        });
    }

    init() {
        // Size canvas based on container width but limit height
        const rect = this.container.getBoundingClientRect();
        const availableWidth = Math.min(380, rect.width || window.innerWidth - 32);
        
        this.cols = Math.floor(availableWidth / this.cellSize);
        if (this.cols < 5) this.cols = 5;
        
        // Square-ish for lock screen aesthetics
        this.rows = Math.floor(availableWidth / this.cellSize);
        if (this.rows < 5) this.rows = 5;

        this.canvas.width = this.cols * this.cellSize;
        this.canvas.height = this.rows * this.cellSize;
        
        // Initialize Grid
        this.grid = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.grid.push(new Cell(x, y, this.cellSize));
            }
        }

        // Generate Maze (DFS)
        this.current = this.grid[0];
        this.current.visited = true;
        this.generateMaze();

        // Setup Game State
        this.player = { x: 0, y: 0 };
        this.goal = { x: this.cols - 1, y: this.rows - 1 };
        this.path = [{ x: 0, y: 0 }];
        
        // Quantum Solver State
        this.qQueue = [];
        this.qVisited = new Set();
        this.qParent = new Map();
        
        this.draw();
        
        // Animate pulsing goal
        const animGoal = () => {
            if (!this.solved) {
                this.draw();
                requestAnimationFrame(animGoal);
            }
        };
        requestAnimationFrame(animGoal);
        
        // Listen for solver button
        const solveBtn = document.getElementById("quantum-solve");
        if(solveBtn) {
            solveBtn.addEventListener("click", () => this.solveQuantum());
        }
    }
    
    solveQuantum() {
        if(this.solved) return;
        this.solved = true; // Lock player input
        
        // BFS initialization
        // We start from player position (0,0) usually
        const startNode = this.grid[this.index(this.player.x, this.player.y)];
        this.qQueue.push(startNode);
        this.qVisited.add(this.index(startNode.x, startNode.y));
        
        this.animateQuantumStep();
    }

    animateQuantumStep() {
        // Expand wavefunction
        // Process a batch of nodes to make animation reasonable speed
        const batchSize = Math.max(5, Math.floor(this.qQueue.length / 2)); 
        
        for(let i=0; i<batchSize; i++) {
            if(this.qQueue.length === 0) break;
            
            const current = this.qQueue.shift();
            
            // Check win
            if(current.x === this.goal.x && current.y === this.goal.y) {
                this.finishQuantum(current);
                return;
            }
            
            // Get neighbors based on walls
            const neighbors = this.getAccessibleNeighbors(current);
            for(let next of neighbors) {
                if(!this.qVisited.has(this.index(next.x, next.y))) {
                    this.qVisited.add(this.index(next.x, next.y));
                    this.qParent.set(this.index(next.x, next.y), current);
                    this.qQueue.push(next);
                }
            }
        }
        
        // Draw the current wavefunction state
        this.drawQuantum();
        
        if(this.qQueue.length > 0) {
            requestAnimationFrame(() => this.animateQuantumStep());
        }
    }

    getAccessibleNeighbors(cell) {
        // Based on walls: Top (0), Right (1), Bottom (2), Left (3)
        const neighbors = [];
        // Top
        if(!cell.walls[0]) neighbors.push(this.grid[this.index(cell.x, cell.y - 1)]);
        // Right
        if(!cell.walls[1]) neighbors.push(this.grid[this.index(cell.x + 1, cell.y)]);
        // Bottom
        if(!cell.walls[2]) neighbors.push(this.grid[this.index(cell.x, cell.y + 1)]);
        // Left
        if(!cell.walls[3]) neighbors.push(this.grid[this.index(cell.x - 1, cell.y)]);
        
        return neighbors.filter(n => n !== undefined);
    }

    drawQuantum() {
        // Redraw base maze
        this.draw(); 
        
        // Draw Wavefunction (Superposition)
        this.ctx.fillStyle = "rgba(0, 200, 255, 0.2)"; // Cyan glow
        for(let idx of this.qVisited) {
            // Recover x,y from index is strictly: index = x + y * cols
            const y = Math.floor(idx / this.cols);
            const x = idx % this.cols;
            this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
        }
    }

    finishQuantum(endNode) {
        // Reconstruct path
        let curr = endNode;
        const solutionPath = [];
        while(curr) {
            solutionPath.push(curr);
            curr = this.qParent.get(this.index(curr.x, curr.y));
        }
        solutionPath.reverse();
        
        // Animate the collapse (solution path)
        let step = 0;
        const drawSolution = () => {
             if(step >= solutionPath.length) {
                 setTimeout(() => this.unlockSite(), 500);
                 return;
             }
             
             // Draw up to current step
             this.ctx.fillStyle = "rgba(0, 200, 255, 0.8)";
             const n = solutionPath[step];
             this.ctx.fillRect(n.x * this.cellSize, n.y * this.cellSize, this.cellSize, this.cellSize);
             
             step++;
             requestAnimationFrame(drawSolution);
        };
        drawSolution();
    }

    index(x, y) {
        if (x < 0 || y < 0 || x > this.cols - 1 || y > this.rows - 1) return -1;
        return x + y * this.cols;
    }

    generateMaze() {
        while (true) {
            const next = this.current.checkNeighbors(this);
            if (next) {
                next.visited = true;
                this.stack.push(this.current);
                this.current.removeWalls(next);
                this.current = next;
            } else if (this.stack.length > 0) {
                this.current = this.stack.pop();
            } else {
                break; 
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Trail (Where user has been)
        this.ctx.fillStyle = this.colors.trail;
        for(let p of this.path) {
           this.ctx.fillRect(p.x * this.cellSize, p.y * this.cellSize, this.cellSize, this.cellSize);
        }

        // Draw Walls
        this.ctx.strokeStyle = this.colors.wall;
        this.ctx.lineWidth = 1.0; 
        this.ctx.lineCap = "round"; // Rounded ends

        this.ctx.beginPath();
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i].drawLines(this.ctx);
        }
        this.ctx.stroke();

        // Draw Goal (Hollow Diamond) — pulsing
        const gx = this.goal.x * this.cellSize + this.cellSize/2;
        const gy = this.goal.y * this.cellSize + this.cellSize/2;
        const goalPulse = 1 + Math.sin(Date.now() * 0.004) * 0.25;
        const goalSize = (this.cellSize / 3.5) * goalPulse;

        this.ctx.strokeStyle = this.colors.goal;
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(gx, gy - goalSize);
        this.ctx.lineTo(gx + goalSize, gy);
        this.ctx.lineTo(gx, gy + goalSize);
        this.ctx.lineTo(gx - goalSize, gy);
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Draw Player (Small solid circle)
        const px = this.player.x * this.cellSize + this.cellSize/2;
        const py = this.player.y * this.cellSize + this.cellSize/2;
        this.ctx.fillStyle = this.colors.player;
        this.ctx.beginPath();
        this.ctx.arc(px, py, this.cellSize/5, 0, Math.PI * 2);
        this.ctx.fill();

        // Faint glyphs on visited cells — other worlds bleeding through
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        for (let i = 0; i < this.path.length; i += 3) {
            const p = this.path[i];
            const gx = p.x * this.cellSize + this.cellSize / 2;
            const gy = p.y * this.cellSize + this.cellSize / 2;
            const glyph = this.glyphs[(p.x + p.y + i) % this.glyphs.length];
            this.ctx.font = `${this.cellSize * 0.55}px "IBM Plex Mono", monospace`;
            this.ctx.fillStyle = `rgba(26, 26, 26, ${0.04 + (i / this.path.length) * 0.08})`;
            this.ctx.fillText(glyph, gx, gy);
        }
    }
    
    move(dx, dy) {
        const nextX = this.player.x + dx;
        const nextY = this.player.y + dy;
        const currentCell = this.grid[this.index(this.player.x, this.player.y)];
        
        if (dx === 1 && currentCell.walls[1]) return;
        if (dx === -1 && currentCell.walls[3]) return;
        if (dy === 1 && currentCell.walls[2]) return;
        if (dy === -1 && currentCell.walls[0]) return;

        this.player.x = nextX;
        this.player.y = nextY;
        this.path.push({x: nextX, y: nextY});
        
        if (this.player.x === this.goal.x && this.player.y === this.goal.y) {
            this.draw();
            setTimeout(() => this.unlockSite(), 300);
        } else {
            this.draw();
        }
    }
    
    unlockSite() {
        document.body.classList.add('unlocked');
        sessionStorage.setItem('mazeSolved', 'true');
        this.solved = true;
        if (typeof window.storyOnUnlock === 'function') window.storyOnUnlock();
    }

    setupInputs() {
        window.addEventListener("keydown", (e) => {
            if(this.solved) return;
            if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }
            switch(e.code) {
                case "ArrowUp":    this.move(0, -1); break;
                case "ArrowRight": this.move(1,  0); break;
                case "ArrowDown":  this.move(0,  1); break;
                case "ArrowLeft":  this.move(-1, 0); break;
            }
        });

        let touchStartX = 0;
        let touchStartY = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, {passive: false});

        this.canvas.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
        }, {passive: false});
    }

    handleSwipe(sx, sy, ex, ey) {
        const dx = ex - sx;
        const dy = ey - sy;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (Math.abs(dx) > 30) { 
                if (dx > 0) this.move(1, 0);
                else this.move(-1, 0);
            }
        } else {
            if (Math.abs(dy) > 30) {
                if (dy > 0) this.move(0, 1);
                else this.move(0, -1);
            }
        }
    }
}

class Cell {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.visited = false;
        this.walls = [true, true, true, true];
    }

    checkNeighbors(maze) {
        const neighbors = [];
        const top    = maze.grid[maze.index(this.x, this.y - 1)];
        const right  = maze.grid[maze.index(this.x + 1, this.y)];
        const bottom = maze.grid[maze.index(this.x, this.y + 1)];
        const left   = maze.grid[maze.index(this.x - 1, this.y)];

        if (top && !top.visited) neighbors.push(top);
        if (right && !right.visited) neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited) neighbors.push(left);

        if (neighbors.length > 0) {
            const r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        } else {
            return undefined;
        }
    }

    removeWalls(next) {
        const x = this.x - next.x;
        if (x === 1) {
            this.walls[3] = false;
            next.walls[1] = false;
        } else if (x === -1) {
            this.walls[1] = false;
            next.walls[3] = false;
        }
        
        const y = this.y - next.y;
        if (y === 1) {
            this.walls[0] = false;
            next.walls[2] = false;
        } else if (y === -1) {
            this.walls[2] = false;
            next.walls[0] = false;
        }
    }

    drawLines(ctx) {
        const x = this.x * this.size;
        const y = this.y * this.size;
        
        if (this.walls[0]) { ctx.moveTo(x, y); ctx.lineTo(x + this.size, y); }
        if (this.walls[1]) { ctx.moveTo(x + this.size, y); ctx.lineTo(x + this.size, y + this.size); }
        if (this.walls[2]) { ctx.moveTo(x + this.size, y + this.size); ctx.lineTo(x, y + this.size); }
        if (this.walls[3]) { ctx.moveTo(x, y + this.size); ctx.lineTo(x, y); }
    }
}

window.addEventListener("load", () => {
    // Check if already solved in this session
    if (sessionStorage.getItem('mazeSolved') === 'true') {
        document.body.classList.add('unlocked');
        // We can optionally remove the lock screen from DOM to be cleaner
        const lockScreen = document.getElementById('lock-screen');
        if (lockScreen) lockScreen.remove();
        return;
    }

    if(document.getElementById("maze-container")) {
        new MazeGame("maze-container");
    }
});
