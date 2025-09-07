'use strict';

/**
 * Main game class to control the game flow.
 */
class Game {
    #buttonManager;
    #userInput;
    #goButton;
    #messageDisplay;
    #correctlyClickedCount = 0;
    #currentOrder = [];

    constructor() {
        this.#buttonManager = new ButtonManager(document.getElementById('buttons-container'));
        this.#userInput = document.getElementById('num-buttons');
        this.#goButton = document.getElementById('go-button');
        this.#messageDisplay = document.getElementById('message-display');

        // Set initial messages from the lang file
        document.getElementById('num-buttons-label').textContent = MESSAGES.HOW_MANY_BUTTONS;
        this.#goButton.textContent = MESSAGES.GO;

        this.#goButton.addEventListener('click', () => this.startGame());
    }

    async startGame() {
        const numButtons = parseInt(this.#userInput.value);
        this.clearMessage();

        // 1. Input Validation
        if (isNaN(numButtons) || numButtons < 3 || numButtons > 7) {
            this.displayMessage(MESSAGES.INVALID_INPUT);
            return;
        }

        // Reset game state
        this.#buttonManager.removeAllButtons();
        this.#correctlyClickedCount = 0;
        this.#currentOrder = [];

        //Create and display buttons
        this.#userInput.disabled = true;
        this.#goButton.disabled = true;

        this.#buttonManager.createButtons(numButtons);
        
        await delay(numButtons * 1000); // Pause for n seconds

        //Scramble buttons
        await this.#buttonManager.scrambleButtons(numButtons);

        //Hide numbers and make buttons clickable
        this.#buttonManager.hideAllNumbers();
        this.#buttonManager.setAllButtonsClickable(true);
        this.#addClickListeners();
    }

    #addClickListeners() {
        const buttons = this.#buttonManager.getOrderedElements();
        buttons.forEach((button, index) => {
            // Keep track of the original order
            this.#currentOrder[index] = button.dataset.id; 
            button.addEventListener('click', this.#handleButtonClick.bind(this));
        });
    }

    #handleButtonClick(event) {
        const clickedButton = event.target;
        const clickedId = clickedButton.dataset.id;
        
        // Correct button logic
        if (clickedId === this.#currentOrder[this.#correctlyClickedCount]) {
            const buttonInstance = this.#buttonManager.getOrderedElements().find(btn => btn.dataset.id === clickedId);
            
            if (buttonInstance) {
                buttonInstance.textContent = clickedId; // Reveal the number
            }
            
            this.#correctlyClickedCount++;

            // Check for victory
            if (this.#correctlyClickedCount === this.#currentOrder.length) {
                this.displayMessage(MESSAGES.EXCELLENT_MEMORY);
                this.#endGame();
            }
        } else {
            // Wrong button logic
            this.displayMessage(MESSAGES.WRONG_ORDER);
            this.#buttonManager.revealAllNumbers();
            this.#endGame();
        }
    }

    #endGame() {
        this.#buttonManager.setAllButtonsClickable(false);
        this.#userInput.disabled = false;
        this.#goButton.disabled = false;
        
        // Remove all event listeners to prevent memory leaks and issues on new game
        const buttons = this.#buttonManager.getOrderedElements();
        buttons.forEach(button => {
            button.removeEventListener('click', this.#handleButtonClick);
        });
    }

    displayMessage(message) {
        this.#messageDisplay.textContent = message;
    }

    clearMessage() {
        this.#messageDisplay.textContent = '';
    }
}

// Start the game when the DOM is loaded
window.addEventListener('load', () => new Game());