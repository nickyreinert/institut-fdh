export let gameInterval;
let snake;
let food;
let direction;
let score;
let gameCanvas;
let gameCtx;

export function initGame() {

    gameCanvas = document.getElementById('snake-game');
    gameCtx = gameCanvas.getContext('2d');
    
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    
    direction = 'right';
    score = 0;
    food = generateFood();
    
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    
    gameInterval = setInterval(gameLoop, 100);
    
    document.addEventListener('keydown', handleGameInput);
}

export function endGame() {
    if (!gameInterval) return; // Don't end if game is not running
    
    clearInterval(gameInterval);
    gameInterval = null; // Clear the interval reference
    const modal = document.getElementById('game-modal');
    modal.style.display = 'none';
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * 28) + 1,
        y: Math.floor(Math.random() * 28) + 1
    };
}

function gameLoop() {
    const head = {x: snake[0].x, y: snake[0].y};
    
    switch(direction) {
        case 'right': head.x++; break;
        case 'left': head.x--; break;
        case 'up': head.y--; break;
        case 'down': head.y++; break;
    }
    
    if (head.x < 0 || head.x > 29 || head.y < 0 || head.y > 29 ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        score += 10;
    } else {
        snake.pop();
    }
    
    drawGame();
}

function drawGame() {
    gameCtx.fillStyle = '#000000';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Draw snake
    gameCtx.fillStyle = '#50FFFF';
    snake.forEach(segment => {
        gameCtx.fillRect(segment.x * 10, segment.y * 10, 9, 9);
    });
    
    // Draw food
    gameCtx.fillStyle = '#FFFF50';
    gameCtx.fillRect(food.x * 10, food.y * 10, 9, 9);
    
    // Draw score
    gameCtx.fillStyle = '#50FFFF';
    gameCtx.font = '20px Courier';
    gameCtx.fillText(`Score: ${score}`, 10, 30);
}

function handleGameInput(e) {
    // Prevent default behavior and stop propagation for game keys
    if (e.key.startsWith('Arrow') || e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Only process input if game is active
    if (!gameInterval) return;
    
    switch(e.key) {
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'Escape':
            endGame();
            break;
    }
}
