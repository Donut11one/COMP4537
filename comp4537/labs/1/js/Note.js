// Note.js
class Note {
    constructor(content) {
        this.content = content;
        this.element = null;
        this.textArea = null;
        this.removeButton = null;
    }

    createDOM(container, isWriterPage) {
        // Create the main div for a note item
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        this.element = noteItem;

        // Create the textarea for the note content
        const textArea = document.createElement('textarea');
        textArea.value = this.content;
        this.textArea = textArea;
        
        // Create the remove button
        if (isWriterPage) {
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-button';
            removeButton.textContent = messages.removeButtonText;
            this.removeButton = removeButton;
            noteItem.appendChild(textArea);
            noteItem.appendChild(removeButton);
        } else {
            // For the reader page, just display the text area
            textArea.readOnly = true;
            noteItem.appendChild(textArea);
        }

        container.appendChild(noteItem);
    }
}