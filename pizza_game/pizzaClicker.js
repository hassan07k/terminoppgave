let score = 0;

        // Increment score on cookie click
        const cookie = document.getElementById('pizza');
        const scoreDisplay = document.getElementById('score');
        const resetButton = document.getElementById('reset-button');

        cookie.addEventListener('click', () => {
            score++;
            scoreDisplay.textContent = score;
        });

        // Reset the score
        resetButton.addEventListener('click', () => {
            score = 0;
            scoreDisplay.textContent = score;
        });