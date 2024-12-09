let score = 0;

// Increment score on pizza click
const cookie = document.getElementById('pizza');
const scoreDisplay = document.getElementById('scoreDisplay');

cookie.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = "Score: " + score;
});

// Function to save clicks to the server
function saveClicks() {
    const saveStatus = document.getElementById('saveStatus');
    saveStatus.textContent = "Saving...";

    fetch('/save_clicks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score: score }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            saveStatus.textContent = "Saved!";
            setTimeout(() => {
                saveStatus.textContent = ""; // Clear the message after 2 seconds
            }, 2000);
        } else {
            saveStatus.textContent = "Error saving score!";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        saveStatus.textContent = "Error saving score!";
    });
}

// Automatically save clicks every 10 seconds
setInterval(() => {
    saveClicks();
}, 10000); // 10000ms = 10 seconds

// Fetch and display the score on page load
function displayScore() {
    fetch('/get_score', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch the score');
        }
        return response.json();
    })
    .then(data => {
        if (data.score !== undefined) {
            // Update the score display on the page
            document.getElementById('scoreDisplay').textContent = "Score: " + data.score;

            // Sync the JavaScript score variable with the database value
            score = parseInt(data.score, 10);
        } else {
            console.error("Error retrieving score:", data.error);
        }
    })
    .catch(error => console.error('Error fetching score:', error));
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', displayScore);