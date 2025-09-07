//Gemini was used to create the random color function

'use strict';

//schedules the an event after ms miliseconds so the code dosent pause
//this delay function is enforcing a timed pause between each set of button placements.
const delay = ms => new Promise(res => setTimeout(res, ms));

/**
 * Class to manage a collection of buttons.
 */
class ButtonManager {
    #buttons = [];
    #container;

    constructor(container) {
        this.#container = container;
    }

    /**
     * Creates a specified number of buttons and displays them in a row.
     * @param {number} count The number of buttons to create.
     */
    createButtons(count) {
        this.removeAllButtons();
        const initialRow = document.createElement('div');
        initialRow.classList.add('button-row');

        for (let i = 1; i <= count; i++) {
            //randomises color first by multiplying random with 16777215 which is FFFFFF in hexa decimal
            //then it floors the number to remove decimals
            //converts it to a string the 16 means its to a hexa decimal form
            // ie 255 becomes the string 'ff'
            //then it ads any 0's to the front if its less than length of 6 
            // so we wrap that in a #${} so the final result is #000000 format
            const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`; 
            const button = new Button(i, color);
            this.#buttons.push(button);
            initialRow.appendChild(button.getElement());
        }

        this.#container.appendChild(initialRow);
    }

    /**
     * Scrambles the position of the buttons 'count' times with a 2-second delay.
     * @param {number} count The number of times to scramble.
     */
    async scrambleButtons(count) {
        // Remove the row container so buttons can be positioned absolutely
        //button-row created in createButton
        const rowContainer = this.#container.querySelector('.button-row');
        if (rowContainer) {
            rowContainer.remove();
        }

        // Add buttons back to the main container for absolute positioning
        this.#buttons.forEach(button => {
            if (!this.#container.contains(button.getElement())) {
                this.#container.appendChild(button.getElement());
            }
        });
        
        for (let i = 0; i < count; i++) {
            this.moveButtonsNonOverlapping();
            await delay(2000);
        }
    }

    /**
     * Moves all buttons to a new random, non-overlapping location within the window.
     */
    moveButtonsNonOverlapping() {
        const containerRect = this.#container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        //Grab the first button Div and set its width as the total layout width in pixels so it works with different sizes ***should***
        const buttonWidthPx = this.#buttons[0].getElement().offsetWidth;
        const buttonHeightPx = this.#buttons[0].getElement().offsetHeight;
        
        const placedPositions = [];

        this.#buttons.forEach(button => {
            let newPosition;
            let overlap = true;
            
            // Find a non-overlapping position
            while (overlap) {
                console.log(containerWidth)
                const x = Math.random() * (containerWidth - buttonWidthPx);
                const y = Math.random() * (containerHeight - buttonHeightPx);
                
                //JS Object that sets a temporary new location for the button
                newPosition = {
                    x: x, 
                    y: y, 
                    width: buttonWidthPx, 
                    height: buttonHeightPx
                };

                overlap = false;
                for (const pos of placedPositions) {
                    if (this.#checkOverlap(newPosition, pos)) {
                        overlap = true;
                        break;
                    }
                }
            }

            // If a valid position was found, set it
            if (!overlap) {
                button.setPosition(newPosition.x, newPosition.y);
                placedPositions.push(newPosition);
            }
        });
    }

    /**
     * Helper function to check for an overlap between two rectangles.
     * @param {object} rect1
     * @param {object} rect2
     * @returns {boolean} True if they overlap, false otherwise.
     */
    #checkOverlap(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    /**
     * Hides the numbers on all buttons.
     */
    hideAllNumbers() {
        this.#buttons.forEach(button => button.hideId());
    }

    /**
     * Reveals the numbers on all buttons.
     */
    revealAllNumbers() {
        this.#buttons.forEach(button => button.showId());
    }

    /**
     * Toggles the clickable state for all buttons.
     * @param {boolean} isClickable
     */
    setAllButtonsClickable(isClickable) {
        this.#buttons.forEach(button => button.setClickable(isClickable));
    }

    /**
     * Removes all button elements from the DOM and clears the internal array.
     */
    removeAllButtons() {
        this.#buttons.forEach(button => button.getElement().remove());
        this.#buttons = [];
    }
    
    /**
     * Gets the ordered array of button elements.
     * @returns {Array<HTMLElement>}
     */
    getOrderedElements() {
        return this.#buttons.map(button => button.getElement());
    }
}