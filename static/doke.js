const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 50;
canvas.width = 500;
canvas.height = 500;

// Game variables
let dogSize = 80; // Størrelse på hunden, endret fra 40 til 80
let snacksSize = 30; // Size of the snacks
let direction = { x: 0, y: 0 };
let snacks = spawnSnack();
let score = 0;

const dogImage = new Image();
dogImage.src = '../static/img/dogim/Dog_game.png'; // Path to dog image

const snackImage = new Image();
snackImage.src = '../static/img/dogim/Snack.png'; // Path to snack image

const bodyImage = new Image();
bodyImage.src = '../static/img/dogim/dog_back.png'; // Path to the new body image


// Main game loop
function gameLoop() {
    setTimeout(() => {
        clearCanvas();
        moveDog();
        drawDog();
        drawSnack();
        
        if (checkCollision()) {
            showPopup(score);
        } else {
            requestAnimationFrame(gameLoop);
        }
        
        
    }, 150);
}

// Function to save the high score to the server
function saveHighscore(score) {
    fetch('/save_doke', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Highscore: score }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("High score saved successfully!");
            fetchHighscore(); // Fetch and update the high score after saving
        } else {
            console.error("Error saving high score:", data.error);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}



// Update showPopup to save high score
function showPopup(score) {
    // const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    const popupScore = document.getElementById('popupScore');

    popupScore.textContent =  score; // Show the score
    popupMessage.style.display = 'block'; // Show popup
    overlay.style.display = 'block'; // Show overlay

    // Save the high score
    saveHighscore(score);
    // Restart the game when the user clicks the restart button
    document.getElementById('restartButton').onclick = () => {  
        hidePopup();
        resetGame();
        gameLoop();
    };
}


function hidePopup() {
    document.getElementById('popupMessage').style.display = 'none';

}


// Reset game
function resetGame() {
    
    dog = [{ x: 300, y: 300 }];
    direction = { x: 0, y: 0 };
    snacks = spawnSnack();
    score = 0;
    
}
// Tegn rutenett
function drawGrid() {
    ctx.strokeStyle = '#cccccc'; // Farge på rutene
    ctx.lineWidth = 1; // Tykkelse på linjene

    // Tegn horisontale linjer
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Tegn vertikale linjer
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
}

// Oppdatert clearCanvas-funksjon til å inkludere rutenettet
function clearCanvas() {
    ctx.fillStyle = '#e8f5e9';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fyll bakgrunnen
    drawGrid(); // Tegn rutenett over bakgrunnen
}

// Retning for rotasjon av hunden
let dogDirection = 0; // 0 = høyre, 90 = ned, 180 = venstre, -90 = opp

// Tegn hunden med rotasjon
function drawDog() {
    for (let i = 0; i < dog.length; i++) {
        const segment = dog[i];
        ctx.save();
        ctx.translate(segment.x + gridSize / 2, segment.y + gridSize / 2); // Center on the grid
        ctx.rotate((segment.direction * Math.PI) / 180);

        if (i === 0) {
            // Draw head
            ctx.drawImage(dogImage, -dogSize / 2, -dogSize / 2, dogSize, dogSize);
        } else {
            // Draw body
            ctx.drawImage(bodyImage, -dogSize / 2, -dogSize / 2, dogSize, dogSize);
        }

        ctx.restore();
    }
}


// Move the dog
let dog = [{
    x: Math.floor(canvas.width / (2 * gridSize)) * gridSize + gridSize / 2 - dogSize / 2,
    y: Math.floor(canvas.height / (2 * gridSize)) * gridSize + gridSize / 2 - dogSize / 2,
    direction: 0
}];
 // Hver del av hunden har nå en retning

function moveDog() {
    // Kopier forrige posisjon og retning for hvert segment
    let prevPositions = dog.map(segment => ({ x: segment.x, y: segment.y, direction: segment.direction }));

    // Oppdater hodet
    dog[0].x += direction.x;
    dog[0].y += direction.y;
    dog[0].direction = dogDirection;

    // Oppdater kroppen
    for (let i = 1; i < dog.length; i++) {
        dog[i].x = prevPositions[i - 1].x;
        dog[i].y = prevPositions[i - 1].y;
        dog[i].direction = prevPositions[i - 1].direction; // Arver retningen til segmentet foran
    }

    // Hvis hodet overlapper med snacks, legg til nytt segment
    if (isSamePosition(dog[0], snacks)) {
        score++;
        snacks = spawnSnack();
        popupScore.textContent = + score;
        dog.push({ ...prevPositions[prevPositions.length - 1] }); // Legg til nytt segment bakerst
    }
}

// Draw the snack
function drawSnack() {
    ctx.drawImage(snackImage, snacks.x, snacks.y, snacksSize, snacksSize);
}

// Spawn snacks at random position
function spawnSnack() {
    const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize + gridSize / 2 - snacksSize / 2;
    const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize + gridSize / 2 - snacksSize / 2;
    return { x, y }; // Snacksens posisjon er nå sentrert
}



// Check for collision
function checkCollision() {
    const head = dog[0];

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

// Check if positions overlap
function isSamePosition(pos1, pos2) {
    return (
        Math.abs(pos1.x - pos2.x) < gridSize / 2 &&
        Math.abs(pos1.y - pos2.y) < gridSize / 2
    );
}

// Endre retning basert på tastetrykk
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) {
                direction = { x: 0, y: -gridSize };
                dogDirection = 90; // Opp
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = { x: 0, y: gridSize };
                dogDirection = -90; // Ned
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = { x: -gridSize, y: 0 };
                dogDirection = 0; // Venstre
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = { x: gridSize, y: 0 };
                dogDirection = 180; // Høyre
            }
            break;
    }
});

// Fetch the current high score from the server
function fetchHighscore() {
    fetch('/get_doke', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.Highscore !== undefined) {
            // Ensure we update an existing element
            let highscoreDisplay = document.getElementById('highscoreDisplay');
            if (!highscoreDisplay) {
                highscoreDisplay = document.createElement('div');
                highscoreDisplay.id = 'highscoreDisplay';
                document.body.insertBefore(highscoreDisplay, document.body.firstChild);
            }
            highscoreDisplay.textContent = `Highscore: ${data.Highscore}`;
        } else {
            console.error("Error fetching high score:", data.error);
        }
    })
    .catch(error => {
        console.error("Error fetching high score:", error);
    });
}


// Call this function when the page loads
document.addEventListener('DOMContentLoaded', fetchHighscore);

// Start the game
dogImage.onload = () => {
    snackImage.onload = () => {
        hidePopup();
        resetGame();
        gameLoop();
    };
};