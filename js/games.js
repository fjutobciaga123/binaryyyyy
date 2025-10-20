/**
 * BINARY GAMES - Clicker & Snake
 */

(function() {
    'use strict';

    // ===================================
    // Game Selector
    // ===================================
    
    function initGameSelector() {
        const selectBtns = document.querySelectorAll('.game-select-btn');
        const gameContainers = document.querySelectorAll('.game-container');

        selectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const gameName = btn.dataset.game;

                // Update buttons
                selectBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update containers
                gameContainers.forEach(container => {
                    container.classList.remove('active');
                    if (container.id === gameName + 'Game') {
                        container.classList.add('active');
                    }
                });
            });
        });
    }

    // ===================================
    // BINARY CLICKER GAME
    // ===================================
    
    function initClickerGame() {
        let score = 0;
        let clickPower = 1;
        let autoPerSecond = 0;

        const upgrades = {
            upgrade1: { cost: 10, owned: 0, multiplier: 1.5, autoIncrease: 1 },
            upgrade2: { cost: 50, owned: 0, multiplier: 1.8, autoIncrease: 5 },
            upgrade3: { cost: 100, owned: 0, multiplier: 2, clickIncrease: 1 },
            upgrade4: { cost: 500, owned: 0, multiplier: 2.5, autoIncrease: 20 }
        };

        const scoreEl = document.getElementById('clickerScore');
        const perClickEl = document.getElementById('perClick');
        const perSecondEl = document.getElementById('perSecond');
        const mainClicker = document.getElementById('mainClicker');

        if (!scoreEl || !mainClicker) return;

        // Main click
        mainClicker.addEventListener('click', () => {
            score += clickPower;
            updateDisplay();
            showFloatingText('+' + clickPower);
        });

        // Floating click text
        function showFloatingText(text) {
            const floatingText = document.createElement('div');
            floatingText.textContent = text;
            floatingText.style.position = 'absolute';
            floatingText.style.color = '#000000';
            floatingText.style.fontFamily = 'Amiga4everPro, monospace';
            floatingText.style.fontSize = '2rem';
            floatingText.style.fontWeight = 'bold';
            floatingText.style.pointerEvents = 'none';
            floatingText.style.left = '50%';
            floatingText.style.top = '50%';
            floatingText.style.transform = 'translate(-50%, -50%)';
            floatingText.style.animation = 'floatUp 1s ease-out forwards';
            floatingText.style.textShadow = '0 0 2px rgba(255, 255, 255, 0.5)';
            
            mainClicker.appendChild(floatingText);
            setTimeout(() => floatingText.remove(), 1000);
        }

        // Upgrade system
        Object.keys(upgrades).forEach(upgradeId => {
            const upgradeEl = document.getElementById(upgradeId);
            if (!upgradeEl) return;

            upgradeEl.addEventListener('click', () => {
                const upgrade = upgrades[upgradeId];
                
                if (score >= upgrade.cost) {
                    score -= upgrade.cost;
                    upgrade.owned++;
                    
                    // Apply upgrade effects
                    if (upgrade.autoIncrease) {
                        autoPerSecond += upgrade.autoIncrease;
                    }
                    if (upgrade.clickIncrease) {
                        clickPower += upgrade.clickIncrease;
                    }
                    
                    // Increase cost
                    upgrade.cost = Math.floor(upgrade.cost * upgrade.multiplier);
                    
                    updateDisplay();
                    updateUpgradeDisplays();
                }
            });
        });

        function updateDisplay() {
            scoreEl.textContent = Math.floor(score);
            perClickEl.textContent = clickPower;
            perSecondEl.textContent = autoPerSecond.toFixed(1);
            updateUpgradeDisplays();
        }

        function updateUpgradeDisplays() {
            Object.keys(upgrades).forEach(upgradeId => {
                const upgradeEl = document.getElementById(upgradeId);
                if (!upgradeEl) return;

                const upgrade = upgrades[upgradeId];
                const costEl = upgradeEl.querySelector('.upgrade-cost');
                const ownedEl = upgradeEl.querySelector('.upgrade-owned');

                if (costEl) costEl.textContent = upgrade.cost;
                if (ownedEl) ownedEl.textContent = upgrade.owned;

                // Highlight if can afford
                if (score >= upgrade.cost) {
                    upgradeEl.classList.add('can-afford');
                } else {
                    upgradeEl.classList.remove('can-afford');
                }
            });
        }

        // Auto-increment
        setInterval(() => {
            if (autoPerSecond > 0) {
                score += autoPerSecond / 10;
                updateDisplay();
            }
        }, 100);

        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% { opacity: 1; transform: translate(-50%, -50%); }
                100% { opacity: 0; transform: translate(-50%, -150%); }
            }
        `;
        document.head.appendChild(style);
    }

    // ===================================
    // SNAKE GAME
    // ===================================
    
    function initSnakeGame() {
        const canvas = document.getElementById('snakeCanvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        const scoreEl = document.getElementById('snakeScore');
        const highScoreEl = document.getElementById('snakeHighScore');
        const startBtn = document.getElementById('snakeStart');
        const resetBtn = document.getElementById('snakeReset');

        if (!canvas || !ctx) return;

        const gridSize = 30;
        const tileCount = canvas.width / gridSize;

        let snake = [{ x: 10, y: 10 }];
        let food = { x: 15, y: 15 };
        let dx = 1;
        let dy = 0;
        let score = 0;
        let highScore = localStorage.getItem('snakeHighScore') || 0;
        let gameRunning = false;
        let gameLoop;

        highScoreEl.textContent = highScore;

        // Controls
        document.addEventListener('keydown', handleKeyPress);

        function handleKeyPress(e) {
            // Prevent arrow keys from scrolling when game is active
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
            
            if (!gameRunning) return;

            const key = e.key.toLowerCase();
            
            // Prevent reverse direction
            if ((key === 'arrowup' || key === 'w') && dy === 0) {
                dx = 0; dy = -1;
            } else if ((key === 'arrowdown' || key === 's') && dy === 0) {
                dx = 0; dy = 1;
            } else if ((key === 'arrowleft' || key === 'a') && dx === 0) {
                dx = -1; dy = 0;
            } else if ((key === 'arrowright' || key === 'd') && dx === 0) {
                dx = 1; dy = 0;
            }
        }

        function startGame() {
            if (gameRunning) return;
            
            gameRunning = true;
            snake = [{ x: 10, y: 10 }];
            dx = 1;
            dy = 0;
            score = 0;
            scoreEl.textContent = score;
            spawnFood();
            
            gameLoop = setInterval(update, 100);
        }

        function resetGame() {
            gameRunning = false;
            clearInterval(gameLoop);
            snake = [{ x: 10, y: 10 }];
            dx = 0;
            dy = 0;
            score = 0;
            scoreEl.textContent = score;
            draw();
        }

        function update() {
            // Move snake
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };

            // Check wall collision
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                gameOver();
                return;
            }

            // Check self collision
            for (let segment of snake) {
                if (head.x === segment.x && head.y === segment.y) {
                    gameOver();
                    return;
                }
            }

            snake.unshift(head);

            // Check food collision
            if (head.x === food.x && head.y === food.y) {
                score++;
                scoreEl.textContent = score;
                spawnFood();
            } else {
                snake.pop();
            }

            draw();
        }

        function spawnFood() {
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };

            // Make sure food doesn't spawn on snake
            for (let segment of snake) {
                if (food.x === segment.x && food.y === segment.y) {
                    spawnFood();
                    return;
                }
            }
        }

        function draw() {
            // Clear canvas
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw grid
            ctx.strokeStyle = '#2a2a2a';
            ctx.lineWidth = 1;
            for (let i = 0; i <= tileCount; i++) {
                ctx.beginPath();
                ctx.moveTo(i * gridSize, 0);
                ctx.lineTo(i * gridSize, canvas.height);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i * gridSize);
                ctx.lineTo(canvas.width, i * gridSize);
                ctx.stroke();
            }

            // Draw snake (with head indicator)
            snake.forEach((segment, index) => {
                if (index === 0) {
                    // Draw head with eyes and tongue
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(
                        segment.x * gridSize + 1,
                        segment.y * gridSize + 1,
                        gridSize - 2,
                        gridSize - 2
                    );
                    
                    // Draw eyes based on direction
                    ctx.fillStyle = '#000000';
                    const eyeSize = 4;
                    const eyeOffset = 6;
                    
                    if (dx === 1) { // Right
                        ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset - eyeSize, segment.y * gridSize + eyeOffset, eyeSize, eyeSize);
                        ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset - eyeSize, segment.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                        
                        // Tongue pointing right
                        ctx.fillStyle = '#FF1493';
                        ctx.fillRect(segment.x * gridSize + gridSize - 2, segment.y * gridSize + gridSize / 2 - 2, 6, 2);
                        ctx.fillRect(segment.x * gridSize + gridSize + 2, segment.y * gridSize + gridSize / 2 - 3, 2, 1);
                        ctx.fillRect(segment.x * gridSize + gridSize + 2, segment.y * gridSize + gridSize / 2 + 1, 2, 1);
                    } else if (dx === -1) { // Left
                        ctx.fillRect(segment.x * gridSize + eyeOffset, segment.y * gridSize + eyeOffset, eyeSize, eyeSize);
                        ctx.fillRect(segment.x * gridSize + eyeOffset, segment.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                        
                        // Tongue pointing left
                        ctx.fillStyle = '#FF1493';
                        ctx.fillRect(segment.x * gridSize - 4, segment.y * gridSize + gridSize / 2 - 2, 6, 2);
                        ctx.fillRect(segment.x * gridSize - 6, segment.y * gridSize + gridSize / 2 - 3, 2, 1);
                        ctx.fillRect(segment.x * gridSize - 6, segment.y * gridSize + gridSize / 2 + 1, 2, 1);
                    } else if (dy === -1) { // Up
                        ctx.fillRect(segment.x * gridSize + eyeOffset, segment.y * gridSize + eyeOffset, eyeSize, eyeSize);
                        ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset - eyeSize, segment.y * gridSize + eyeOffset, eyeSize, eyeSize);
                        
                        // Tongue pointing up
                        ctx.fillStyle = '#FF1493';
                        ctx.fillRect(segment.x * gridSize + gridSize / 2 - 2, segment.y * gridSize - 4, 2, 6);
                        ctx.fillRect(segment.x * gridSize + gridSize / 2 - 3, segment.y * gridSize - 6, 1, 2);
                        ctx.fillRect(segment.x * gridSize + gridSize / 2 + 1, segment.y * gridSize - 6, 1, 2);
                    } else if (dy === 1) { // Down
                        ctx.fillRect(segment.x * gridSize + eyeOffset, segment.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                        ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset - eyeSize, segment.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                        
                        // Tongue pointing down
                        ctx.fillStyle = '#FF1493';
                        ctx.fillRect(segment.x * gridSize + gridSize / 2 - 2, segment.y * gridSize + gridSize - 2, 2, 6);
                        ctx.fillRect(segment.x * gridSize + gridSize / 2 - 3, segment.y * gridSize + gridSize + 2, 1, 2);
                        ctx.fillRect(segment.x * gridSize + gridSize / 2 + 1, segment.y * gridSize + gridSize + 2, 1, 2);
                    }
                } else {
                    // Draw body
                    ctx.fillStyle = '#cccccc';
                    ctx.fillRect(
                        segment.x * gridSize + 2,
                        segment.y * gridSize + 2,
                        gridSize - 4,
                        gridSize - 4
                    );
                }
            });

            // Draw food (binary digit - static)
            const foodDigit = (food.x + food.y) % 2 === 0 ? '1' : '0'; // Deterministic based on position
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${gridSize - 8}px 'Amiga4everPro', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                foodDigit,
                food.x * gridSize + gridSize / 2,
                food.y * gridSize + gridSize / 2
            );
        }

        function gameOver() {
            gameRunning = false;
            clearInterval(gameLoop);

            if (score > highScore) {
                highScore = score;
                localStorage.setItem('snakeHighScore', highScore);
                highScoreEl.textContent = highScore;
            }

            // Draw game over text
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '30px Amiga4everPro, monospace';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Amiga4everPro, monospace';
            ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 40);
        }

        // Touch controls for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!gameRunning) return;

            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;

            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            // Determine direction based on swipe
            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal swipe
                if (diffX > 30 && dx === 0) {
                    dx = 1; dy = 0; // Right
                    touchStartX = touchEndX;
                    touchStartY = touchEndY;
                } else if (diffX < -30 && dx === 0) {
                    dx = -1; dy = 0; // Left
                    touchStartX = touchEndX;
                    touchStartY = touchEndY;
                }
            } else {
                // Vertical swipe
                if (diffY > 30 && dy === 0) {
                    dx = 0; dy = 1; // Down
                    touchStartX = touchEndX;
                    touchStartY = touchEndY;
                } else if (diffY < -30 && dy === 0) {
                    dx = 0; dy = -1; // Up
                    touchStartX = touchEndX;
                    touchStartY = touchEndY;
                }
            }
        });

        // Button events
        startBtn?.addEventListener('click', startGame);
        resetBtn?.addEventListener('click', resetGame);

        // Initial draw
        draw();
    }

    // ===================================
    // BREAKOUT GAME
    // ===================================
    
    function initBreakoutGame() {
        const canvas = document.getElementById('breakoutCanvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        const scoreEl = document.getElementById('breakoutScore');
        const livesEl = document.getElementById('breakoutLives');
        const startBtn = document.getElementById('breakoutStart');
        const resetBtn = document.getElementById('breakoutReset');

        if (!canvas || !ctx) {
            console.error('❌ Breakout: Canvas or context not found!');
            return;
        }
        
        console.log('✅ Breakout game initialized');

        let paddle = { x: 250, y: 560, width: 100, height: 15, speed: 8 };
        let ball = { x: 300, y: 300, radius: 8, dx: 4, dy: -4 };
        let bricks = [];
        let score = 0;
        let lives = 3;
        let gameRunning = false;
        let gameLoop;
        let keys = {};

        const brickRows = 5;
        const brickCols = 10;
        const brickWidth = 55;
        const brickHeight = 20;
        const brickPadding = 5;
        const brickOffsetTop = 50;
        const brickOffsetLeft = 10;

        // Create bricks
        function createBricks() {
            bricks = [];
            for (let row = 0; row < brickRows; row++) {
                for (let col = 0; col < brickCols; col++) {
                    bricks.push({
                        x: col * (brickWidth + brickPadding) + brickOffsetLeft,
                        y: row * (brickHeight + brickPadding) + brickOffsetTop,
                        width: brickWidth,
                        height: brickHeight,
                        visible: true,
                        digit: Math.random() > 0.5 ? '1' : '0'
                    });
                }
            }
        }

        // Controls
        document.addEventListener('keydown', (e) => keys[e.key] = true);
        document.addEventListener('keyup', (e) => keys[e.key] = false);
        
        canvas.addEventListener('mousemove', (e) => {
            if (!gameRunning) return;
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            paddle.x = mouseX - paddle.width / 2;
            if (paddle.x < 0) paddle.x = 0;
            if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
        });

        // Touch controls for mobile
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!gameRunning) return;
            const rect = canvas.getBoundingClientRect();
            const touchX = e.touches[0].clientX - rect.left;
            paddle.x = touchX - paddle.width / 2;
            if (paddle.x < 0) paddle.x = 0;
            if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
        });

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
        });

        // Function to display hearts
        function updateLivesDisplay() {
            livesEl.innerHTML = '';
            for (let i = 0; i < lives; i++) {
                const heart = document.createElement('img');
                heart.src = 'images/heart-minecraft.png';
                heart.className = 'heart-icon';
                heart.alt = '♥';
                livesEl.appendChild(heart);
            }
        }

        function startGame() {
            if (gameRunning) return;
            console.log('🧱 Breakout: Starting game...');
            gameRunning = true;
            score = 0;
            lives = 3;
            paddle.x = 250;
            ball = { x: 300, y: 300, radius: 8, dx: 4, dy: -4 };
            createBricks();
            scoreEl.textContent = score;
            updateLivesDisplay();
            gameLoop = setInterval(update, 1000 / 60);
        }

        function resetGame() {
            gameRunning = false;
            clearInterval(gameLoop);
            score = 0;
            lives = 3;
            scoreEl.textContent = score;
            updateLivesDisplay();
            createBricks();
            draw();
        }

        function update() {
            // Move paddle with keys
            if (keys['ArrowLeft'] && paddle.x > 0) paddle.x -= paddle.speed;
            if (keys['ArrowRight'] && paddle.x < canvas.width - paddle.width) paddle.x += paddle.speed;

            // Move ball
            ball.x += ball.dx;
            ball.y += ball.dy;

            // Wall collision
            if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
                ball.dx = -ball.dx;
            }
            if (ball.y - ball.radius < 0) {
                ball.dy = -ball.dy;
            }

            // Paddle collision
            if (ball.y + ball.radius > paddle.y && 
                ball.x > paddle.x && 
                ball.x < paddle.x + paddle.width &&
                ball.dy > 0) {
                ball.dy = -ball.dy;
                // Add spin based on where it hits paddle
                const hitPos = (ball.x - paddle.x) / paddle.width;
                ball.dx = (hitPos - 0.5) * 8;
            }

            // Brick collision
            bricks.forEach(brick => {
                if (!brick.visible) return;
                if (ball.x > brick.x && ball.x < brick.x + brick.width &&
                    ball.y > brick.y && ball.y < brick.y + brick.height) {
                    ball.dy = -ball.dy;
                    brick.visible = false;
                    score += 10;
                    scoreEl.textContent = score;
                }
            });

            // Ball falls
            if (ball.y + ball.radius > canvas.height) {
                lives--;
                updateLivesDisplay();
                if (lives <= 0) {
                    gameOver();
                } else {
                    ball = { x: 300, y: 300, radius: 8, dx: 4, dy: -4 };
                }
            }

            // Win condition
            if (bricks.every(b => !b.visible)) {
                youWin();
            }

            draw();
        }

        function draw() {
            // Clear canvas
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw bricks
            bricks.forEach(brick => {
                if (!brick.visible) return;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                ctx.fillStyle = '#000000';
                ctx.font = '16px Amiga4everPro, monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(brick.digit, brick.x + brick.width / 2, brick.y + brick.height / 2);
            });

            // Draw paddle
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

            // Draw ball
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        function gameOver() {
            gameRunning = false;
            clearInterval(gameLoop);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '30px Amiga4everPro, monospace';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        }

        function youWin() {
            gameRunning = false;
            clearInterval(gameLoop);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#28A745';
            ctx.font = '30px Amiga4everPro, monospace';
            ctx.textAlign = 'center';
            ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2);
        }

        startBtn?.addEventListener('click', startGame);
        resetBtn?.addEventListener('click', resetGame);

        createBricks();
        draw();
    }

    // ===================================
    // FLAPPY GAME
    // ===================================
    
    function initFlappyGame() {
        const canvas = document.getElementById('flappyCanvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        const scoreEl = document.getElementById('flappyScore');
        const bestEl = document.getElementById('flappyBest');
        const startBtn = document.getElementById('flappyStart');
        const resetBtn = document.getElementById('flappyReset');

        if (!canvas || !ctx) {
            console.error('❌ Flappy: Canvas or context not found!');
            return;
        }
        
        console.log('✅ Flappy game initialized');

        let bird = { x: 80, y: 250, width: 30, height: 30, velocity: 0, gravity: 0.5, jump: -8 };
        let pipes = [];
        let score = 0;
        let bestScore = localStorage.getItem('flappyBest') || 0;
        let gameRunning = false;
        let gameLoop;
        let frameCount = 0;

        bestEl.textContent = bestScore;

        const pipeWidth = 60;
        const pipeGap = 150;

        function jump() {
            if (gameRunning) {
                bird.velocity = bird.jump;
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                jump();
            }
        });

        canvas.addEventListener('click', jump);

        function startGame() {
            if (gameRunning) return;
            console.log('🐦 Flappy: Starting game...');
            gameRunning = true;
            bird = { x: 80, y: 250, width: 30, height: 30, velocity: 0, gravity: 0.5, jump: -8 };
            pipes = [];
            score = 0;
            frameCount = 0;
            scoreEl.textContent = score;
            gameLoop = setInterval(update, 1000 / 60);
        }

        function resetGame() {
            gameRunning = false;
            clearInterval(gameLoop);
            score = 0;
            scoreEl.textContent = score;
            pipes = [];
            bird = { x: 80, y: 250, width: 30, height: 30, velocity: 0, gravity: 0.5, jump: -8 };
            draw();
        }

        function update() {
            frameCount++;

            // Create pipes
            if (frameCount % 90 === 0) {
                const pipeY = Math.random() * (canvas.height - pipeGap - 100) + 50;
                pipes.push({
                    x: canvas.width,
                    topHeight: pipeY,
                    bottomY: pipeY + pipeGap,
                    scored: false,
                    digit: Math.random() > 0.5 ? '1' : '0'
                });
            }

            // Update bird
            bird.velocity += bird.gravity;
            bird.y += bird.velocity;

            // Update pipes
            pipes.forEach((pipe, index) => {
                pipe.x -= 3;

                // Score
                if (!pipe.scored && pipe.x + pipeWidth < bird.x) {
                    pipe.scored = true;
                    score++;
                    scoreEl.textContent = score;
                }

                // Remove off-screen pipes
                if (pipe.x + pipeWidth < 0) {
                    pipes.splice(index, 1);
                }

                // Collision detection
                if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth) {
                    if (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY) {
                        endGame();
                    }
                }
            });

            // Ground and ceiling collision
            if (bird.y + bird.height > canvas.height || bird.y < 0) {
                endGame();
            }

            draw();
        }

        function draw() {
            // Sky
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Pipes with digits
            pipes.forEach(pipe => {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
                ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
                
                // Draw digit on pipes
                ctx.fillStyle = '#000000';
                ctx.font = '30px Amiga4everPro, monospace';
                ctx.textAlign = 'center';
                ctx.fillText(pipe.digit, pipe.x + pipeWidth / 2, pipe.topHeight - 20);
                ctx.fillText(pipe.digit, pipe.x + pipeWidth / 2, pipe.bottomY + 20);
            });

            // Bird (square with B)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
            ctx.fillStyle = '#000000';
            ctx.font = '20px Amiga4everPro, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('B', bird.x + bird.width / 2, bird.y + bird.height / 2);
        }

        function endGame() {
            gameRunning = false;
            clearInterval(gameLoop);

            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('flappyBest', bestScore);
                bestEl.textContent = bestScore;
            }

            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '30px Amiga4everPro, monospace';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Amiga4everPro, monospace';
            ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 40);
        }

        startBtn?.addEventListener('click', startGame);
        resetBtn?.addEventListener('click', resetGame);

        draw();
    }

    // ===================================
    // TETRIS GAME
    // ===================================
    
    function initTetrisGame() {
        const canvas = document.getElementById('tetrisCanvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        const scoreEl = document.getElementById('tetrisScore');
        const linesEl = document.getElementById('tetrisLines');
        const levelEl = document.getElementById('tetrisLevel');
        const startBtn = document.getElementById('tetrisStart');
        const resetBtn = document.getElementById('tetrisReset');

        if (!canvas || !ctx) {
            console.error('❌ Tetris: Canvas or context not found!');
            return;
        }
        
        console.log('✅ Tetris game initialized');

        const rows = 20;
        const cols = 10;
        const blockSize = 30;
        let board = [];
        let currentPiece = null;
        let score = 0;
        let lines = 0;
        let level = 1;
        let gameRunning = false;
        let gameLoop;
        let dropCounter = 0;
        let dropInterval = 1000;

        const pieces = [
            [[1,1,1,1]], // I
            [[1,1],[1,1]], // O
            [[1,1,1],[0,1,0]], // T
            [[1,1,1],[1,0,0]], // L
            [[1,1,1],[0,0,1]], // J
            [[1,1,0],[0,1,1]], // S
            [[0,1,1],[1,1,0]]  // Z
        ];

        function createBoard() {
            board = Array(rows).fill().map(() => Array(cols).fill(0));
        }

        function createPiece() {
            const shape = pieces[Math.floor(Math.random() * pieces.length)];
            return {
                shape: shape,
                x: Math.floor(cols / 2) - Math.floor(shape[0].length / 2),
                y: 0,
                digit: Math.random() > 0.5 ? '1' : '0'
            };
        }

        function collision(piece, offsetX = 0, offsetY = 0) {
            for (let y = 0; y < piece.shape.length; y++) {
                for (let x = 0; x < piece.shape[y].length; x++) {
                    if (piece.shape[y][x]) {
                        const newX = piece.x + x + offsetX;
                        const newY = piece.y + y + offsetY;
                        if (newX < 0 || newX >= cols || newY >= rows) return true;
                        if (newY >= 0 && board[newY][newX]) return true;
                    }
                }
            }
            return false;
        }

        function merge() {
            currentPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        board[currentPiece.y + y][currentPiece.x + x] = currentPiece.digit;
                    }
                });
            });
        }

        function clearLines() {
            let cleared = 0;
            for (let y = rows - 1; y >= 0; y--) {
                if (board[y].every(cell => cell !== 0)) {
                    board.splice(y, 1);
                    board.unshift(Array(cols).fill(0));
                    cleared++;
                    y++;
                }
            }
            if (cleared > 0) {
                lines += cleared;
                score += cleared * 100 * level;
                level = Math.floor(lines / 10) + 1;
                dropInterval = Math.max(100, 1000 - (level - 1) * 100);
                linesEl.textContent = lines;
                scoreEl.textContent = score;
                levelEl.textContent = level;
            }
        }

        function rotate(piece) {
            const rotated = piece.shape[0].map((_, i) =>
                piece.shape.map(row => row[i]).reverse()
            );
            return { ...piece, shape: rotated };
        }

        document.addEventListener('keydown', (e) => {
            if (!gameRunning) return;
            if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
                e.preventDefault();
            }

            if (e.key === 'ArrowLeft' && !collision(currentPiece, -1, 0)) {
                currentPiece.x--;
            } else if (e.key === 'ArrowRight' && !collision(currentPiece, 1, 0)) {
                currentPiece.x++;
            } else if (e.key === 'ArrowDown') {
                if (!collision(currentPiece, 0, 1)) {
                    currentPiece.y++;
                    score += 1;
                    scoreEl.textContent = score;
                }
            } else if (e.key === 'ArrowUp') {
                const rotated = rotate(currentPiece);
                if (!collision(rotated, 0, 0)) {
                    currentPiece = rotated;
                }
            }
        });

        function startGame() {
            if (gameRunning) return;
            console.log('📦 Tetris: Starting game...');
            gameRunning = true;
            createBoard();
            currentPiece = createPiece();
            score = 0;
            lines = 0;
            level = 1;
            dropCounter = 0;
            dropInterval = 1000;
            scoreEl.textContent = score;
            linesEl.textContent = lines;
            levelEl.textContent = level;
            
            let lastTime = 0;
            function update(time = 0) {
                if (!gameRunning) return;
                
                const deltaTime = time - lastTime;
                lastTime = time;
                dropCounter += deltaTime;

                if (dropCounter > dropInterval) {
                    if (!collision(currentPiece, 0, 1)) {
                        currentPiece.y++;
                    } else {
                        merge();
                        clearLines();
                        currentPiece = createPiece();
                        if (collision(currentPiece, 0, 0)) {
                            endGame();
                            return;
                        }
                    }
                    dropCounter = 0;
                }

                draw();
                requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }

        function resetGame() {
            gameRunning = false;
            score = 0;
            lines = 0;
            level = 1;
            scoreEl.textContent = score;
            linesEl.textContent = lines;
            levelEl.textContent = level;
            createBoard();
            draw();
        }

        function draw() {
            // Clear canvas
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw grid
            ctx.strokeStyle = '#2a2a2a';
            ctx.lineWidth = 1;
            for (let x = 0; x <= cols; x++) {
                ctx.beginPath();
                ctx.moveTo(x * blockSize, 0);
                ctx.lineTo(x * blockSize, rows * blockSize);
                ctx.stroke();
            }
            for (let y = 0; y <= rows; y++) {
                ctx.beginPath();
                ctx.moveTo(0, y * blockSize);
                ctx.lineTo(cols * blockSize, y * blockSize);
                ctx.stroke();
            }

            // Draw board
            board.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(x * blockSize + 1, y * blockSize + 1, blockSize - 2, blockSize - 2);
                        ctx.fillStyle = '#000000';
                        ctx.font = '20px Amiga4everPro, monospace';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(cell, x * blockSize + blockSize / 2, y * blockSize + blockSize / 2);
                    }
                });
            });

            // Draw current piece
            if (currentPiece) {
                currentPiece.shape.forEach((row, y) => {
                    row.forEach((value, x) => {
                        if (value) {
                            const drawX = (currentPiece.x + x) * blockSize;
                            const drawY = (currentPiece.y + y) * blockSize;
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(drawX + 1, drawY + 1, blockSize - 2, blockSize - 2);
                            ctx.fillStyle = '#000000';
                            ctx.font = '20px Amiga4everPro, monospace';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(currentPiece.digit, drawX + blockSize / 2, drawY + blockSize / 2);
                        }
                    });
                });
            }
        }

        function endGame() {
            gameRunning = false;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '30px Amiga4everPro, monospace';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        }

        // Touch controls for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!gameRunning) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            const absX = Math.abs(diffX);
            const absY = Math.abs(diffY);

            // Tap to rotate
            if (absX < 20 && absY < 20) {
                const rotated = rotate(currentPiece);
                if (!collision(rotated, 0, 0)) {
                    currentPiece = rotated;
                }
                return;
            }

            // Swipe to move
            if (absX > absY) {
                // Horizontal swipe
                if (diffX > 30 && !collision(currentPiece, 1, 0)) {
                    currentPiece.x++; // Right
                } else if (diffX < -30 && !collision(currentPiece, -1, 0)) {
                    currentPiece.x--; // Left
                }
            } else {
                // Vertical swipe down
                if (diffY > 30 && !collision(currentPiece, 0, 1)) {
                    currentPiece.y++;
                    score += 1;
                    scoreEl.textContent = score;
                }
            }
        });

        startBtn?.addEventListener('click', startGame);
        resetBtn?.addEventListener('click', resetGame);

        createBoard();
        draw();
    }

    // ===================================
    // Initialize All Games
    // ===================================
    
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        initGameSelector();
        initClickerGame();
        initSnakeGame();
        initBreakoutGame();
        initFlappyGame();
        initTetrisGame();

        console.log('🎮 BINARY Games initialized!');
    }

    init();

})();
