const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 40;
canvas.width = 600;
canvas.height = 600;

// Game variables
let dogSize = 40; // Size of the dog
let snacksSize = 30; // Size of the snacks
let dog = [{ x: 300, y: 300 }];
let direction = { x: 0, y: 0 };
let snacks = spawnSnack();
let score = 0;

const dogImage = new Image();
dogImage.src = './Dog.png'; // Path to dog image

const snackImage = new Image();
snackImage.src = './Snack.png'; // Path to snack image

// Main game loop
function gameLoop() {
    setTimeout(() => {
        clearCanvas();
        moveDog();
        drawDog();
        drawSnack();

        if (checkCollision()) {
            alert(`Game Over! Your score: ${score}`);
            resetGame();
        } else {
            requestAnimationFrame(gameLoop);
        }
    }, 150);
}

// Reset game
function resetGame() {
    dog = [{ x: 300, y: 300 }];
    direction = { x: 0, y: 0 };
    snacks = spawnSnack();
    score = 0;
}

// Clear canvas
function clearCanvas() {
    ctx.fillStyle = '#e8f5e9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw the dog
function drawDog() {
    for (let i = 0; i < dog.length; i++) {
        ctx.drawImage(dogImage, dog[i].x, dog[i].y, dogSize, dogSize);
    }
}

// Move the dog
function moveDog() {
    const head = { x: dog[0].x + direction.x, y: dog[0].y + direction.y };
    dog.unshift(head);

    document.addEventListener('keydown', (event) => {
        console.log('Key pressed:', event.key);
        switch (event.key) {
            case 'ArrowUp':
                if (direction.y === 0) direction = { x: 0, y: -gridSize };
                break;
            case 'ArrowDown':
                if (direction.y === 0) direction = { x: 0, y: gridSize };
                break;
            case 'ArrowLeft':
                if (direction.x === 0) direction = { x: -gridSize, y: 0 };
                break;
            case 'ArrowRight':
                if (direction.x === 0) direction = { x: gridSize, y: 0 };
                break;
        }
    });
    
    // Check if dog eats snacks
    if (head.x === snacks.x && head.y === snacks.y) {
        score++;
        snacks = spawnSnack();
    } else {
        dog.pop();
    }
}

// Draw the snack
function drawSnack() {
    ctx.drawImage(snackImage, snacks.x, snacks.y, snacksSize, snacksSize);
}
// Spawn snacks at random position
function spawnSnack() {
    const x = Math.floor((Math.random() * canvas.width) / gridSize) * gridSize;
    const y = Math.floor((Math.random() * canvas.height) / gridSize) * gridSize;
    return { x, y };

}


// Check for collision
function checkCollision() {
    const head = dog[0];
    if (head.x === snacks.x && head.y === snacks.y) {
        score++;
        console.log('Snack eaten!');
        snacks = spawnSnack();
    }
    
    // Wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    // Self collision
    for (let i = 1; i < dog.length; i++) {
        if (head.x === dog[i].x && head.y === dog[i].y) {
            return true;
        }
    }

    return false;
}

// Change direction
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
});

// Start the game
dogImage.onload = () => {
    snackImage.onload = () => {
        gameLoop();
    };
};
function drawDog() {
    for (let i = 0; i < dog.length; i++) {
        console.log(`Drawing dog at (${dog[i].x}, ${dog[i].y})`);
        ctx.drawImage(dogImage, dog[i].x, dog[i].y, dogSize, dogSize);
    }
}

function drawSnack() {
    console.log(`Drawing snack at (${snacks.x}, ${snacks.y})`);
    ctx.drawImage(snackImage, snacks.x, snacks.y, snacksSize, snacksSize);
}

