'use strict';

const buttonWidth = 10; // in em
const buttonHeight = 5; // in em

/**
 * Class to represent a single button.
 */
class Button {
    #element;
    #id;
    #color;

    constructor(id, color) {
        this.#id = id;
        this.#color = color;

        this.#element = document.createElement('div');
        this.#element.classList.add('game-button');
        this.#element.style.backgroundColor = this.#color;
        this.#element.dataset.id = this.#id;
        this.#element.textContent = this.#id;
    }

    /**
     * Reveals the number on the button.
     */
    showId() {
        this.#element.textContent = this.#id;
    }

    /**
     * Hides the number on the button.
     */
    hideId() {
        this.#element.textContent = '';
    }

    /**
     * Sets a random position for the button within the window.
     * @param {number} x The new x coordinate.
     * @param {number} y The new y coordinate.
     */
    setPosition(x, y) {
        this.#element.style.left = `${x}px`;
        this.#element.style.top = `${y}px`;
    }

    /**
     * Toggles the clickable state of the button.
     * @param {boolean} isClickable
     */
    setClickable(isClickable) {
        if (isClickable) {
            this.#element.classList.add('clickable');
        } else {
            this.#element.classList.remove('clickable');
        }
    }

    /**
     * Gets the HTML element.
     * @returns {HTMLElement} The button's HTML element.
     */
    getElement() {
        return this.#element;
    }
}