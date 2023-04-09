const startBtn = document.getElementById('startBtn');
const hitBtn = document.getElementById('hitBtn');
const standBtn = document.getElementById('standBtn');
const message = document.getElementById('message');
const dealerCards = document.querySelector('.dealer-cards .cards');
const playerCards = document.querySelector('.player-cards .cards');
const playerScoreElement = document.getElementById('playerScore');
const dealerScoreElement = document.getElementById('dealerScore');

// Game variables
let deck = [];
let dealer = [];
let player = [];

// Game functions
function createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }

    return deck;
}

function updatePlayerScore() {
    const score = calculateScore(player);
    playerScoreElement.textContent = `Score: ${score}`;
}


function updateDealerScore() {
    const score = calculateScore(dealer);
    dealerScoreElement.textContent = `Score: ${score}`;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCard(player) {
    const card = deck.pop();
    player.push(card);
    return card;
}

function renderCard(card, element, target) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.textContent = `${card.value} of ${card.suit}`;
    element.appendChild(cardDiv);
}

function calculateScore(hand) {
    let score = 0;
    let hasAce = false;

    for (let card of hand) {
        let value = card.value;

        if (value === 'A') {
            hasAce = true;
            value = 11;
        } else if (['K', 'Q', 'J'].includes(value)) {
            value = 10;
        } else {
            value = parseInt(value);
        }

        score += value;
    }

    if (hasAce && score > 21) {
        score -= 10;
    }

    return score;
}

function startGame() {
    
    startBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
    message.textContent = '';

    deck = createDeck();
    shuffleDeck(deck);

    dealer = [dealCard(dealer)];
    player = [dealCard(player), dealCard(player)];

    dealerCards.innerHTML = '';
    playerCards.innerHTML = '';

    dealer.forEach((card) => renderCard(card, dealerCards, 'dealer'));
    player.forEach((card) => renderCard(card, playerCards, 'player'));

    updateDealerScore();

    updatePlayerScore();
}

function hit() {
    const card = dealCard(player);
    renderCard(card, playerCards);

    updatePlayerScore();

    if (calculateScore(player) > 21) {
        endGame('Player busts! Dealer wins!');
    }
}

function stand() {
    while (calculateScore(dealer) < 17) {
        const card = dealCard(dealer);
        renderCard(card, dealerCards, 'dealer');
        updateDealerScore();
    }

    const playerScore = calculateScore(player);
    const dealerScore = calculateScore(dealer);

    if (dealerScore > 21 || playerScore > dealerScore) {
        endGame('Player wins!');
    } else if (playerScore === dealerScore) {
        endGame('It\'s a tie!');
    } else {
        endGame('Dealer wins!');
    }

    updatePlayerScore();
}

function endGame(result) {
    message.textContent = result;
    startBtn.disabled = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;
}

// Event listeners
startBtn.addEventListener('click', startGame);
hitBtn.addEventListener('click', hit);
standBtn.addEventListener('click', stand);

