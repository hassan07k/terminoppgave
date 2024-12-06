let score = 0;

// Increment score on cookie click
const cookie = document.getElementById('pizza');
const scoreDisplay = document.getElementById('scoreDisplay');
const resetButton = document.getElementById('reset-button');

// let clickCount = 0;

cookie.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
});




// function incrementClick() {
//     clickCount++;
//     document.getElementById('clickCount').innerText = clickCount;
// }

function saveClicks() {
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
                alert("Clicks saved successfully!");
            } else {
                alert("Error saving clicks: " + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
}
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
        return response.json(); // Parse JSON response
    })
    .then(data => {
        if (data.score !== undefined) {
            // Update the score display on the HTML page
            document.getElementById('scoreDisplay').textContent =  + data.score;

            // Update the global score variable
            score = parseInt(data.score, 10);
        } else {
            alert("Error retrieving score: " + (data.error || "Unknown error"));
        }
    })
    .catch(error => {
        console.error('Error fetching score:', error);
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', displayScore);



