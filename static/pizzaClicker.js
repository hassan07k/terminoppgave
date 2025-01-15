// Initialiserer score-variabelen
let score = 0;

// Henter pizza-elementet og score-display-elementet
const pizza = document.getElementById('pizza');
const scoreDisplay = document.getElementById('scoreDisplay');

// Legger til en klikk-hendelse for å øke scoren
pizza.addEventListener('click', () => {
    score++; // Øker score med 1
    scoreDisplay.textContent = score; // Oppdaterer score på skjermen
});

// Funksjon for å lagre scoren på serveren
function saveClicks() {
    const saveStatus = document.getElementById('saveStatus');
    saveStatus.textContent = "Saving..."; // Viser melding om lagring

    fetch('/save_pizza', {
        method: 'POST', // Sender en POST-forespørsel
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score: score }), // Sender scoren i JSON-format
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                saveStatus.textContent = "Saved the game!"; // Viser suksessmelding
                setTimeout(() => {
                    saveStatus.textContent = ""; // Fjerner melding etter 3 sekunder
                }, 3000);
            } else {
                saveStatus.textContent = "Error saving score!"; // Viser feilmelding
            }
        })
        .catch(error => {
            console.error('Error:', error); // Logger feil
            saveStatus.textContent = "Error saving score!";
        });
}

// Automatisk lagring av scoren hvert 30. sekund
setInterval(() => {
    saveClicks();
}, 30000);

// Funksjon for å hente scoren fra serveren ved sideinnlasting
function displayScore() {
    fetch('/get_score', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.score !== undefined) {
                scoreDisplay.textContent = data.score; // Oppdaterer scoren i UI
                score = parseInt(data.score, 10); // Synkroniserer JavaScript-score med serveren
            }
        })
        .catch(error => console.error('Error fetching score:', error));
}




function clickme() {

    console.log('hello world')
}