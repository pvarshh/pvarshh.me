// Maze Game for Pranav's Website
// Minimalist, keyboard + touch friendly

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
    }

    init() {
        // Size canvas based on container width but limit height
        const rect = this.container.getBoundingClientRect();
        // Slightly smaller max width for elegance on lock screen
        const availableWidth = Math.min(380, rect.width);
        
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
        
        this.draw();
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

        // Draw Goal (Hollow Diamond)
        const gx = this.goal.x * this.cellSize + this.cellSize/2;
        const gy = this.goal.y * this.cellSize + this.cellSize/2;
        const goalSize = this.cellSize / 3.5;

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
            setTimeout(() => {
                this.unlockSite(); 
            }, 300);
        } else {
            this.draw();
        }
    }
    
    unlockSite() {
        document.body.classList.add('unlocked');
        // Stop listening to inputs to prevent scrolling issues or weird behavior after unlock
        // But removing listeners is hard without named functions. 
        // We can just set a flag.
        this.solved = true;
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
    if(document.getElementById("maze-container")) {
        new MazeGame("maze-container");
    }
});
