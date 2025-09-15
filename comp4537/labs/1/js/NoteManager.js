// NoteManager.js
class NoteManager {
    constructor(notesContainer, isWriterPage) {
        this.notesContainer = notesContainer;
        this.isWriterPage = isWriterPage;
        this.notes = this.getNotes();
        this.init();
    }

    getNotes() {
        const notesJSON = localStorage.getItem('notes');
        return notesJSON ? JSON.parse(notesJSON) : [];
    }

    saveNotes() {
        const textAreas = this.notesContainer.querySelectorAll('textarea');
        const notesToSave = Array.from(textAreas).map(textarea => {
            return { content: textarea.value };
        });
        localStorage.setItem('notes', JSON.stringify(notesToSave));
    }
    renderNotes() {
        this.notesContainer.innerHTML = '';
        const notesData = this.getNotes();
        
        notesData.forEach(noteData => {
            const newNote = new Note(noteData.content);
            newNote.createDOM(this.notesContainer, this.isWriterPage);
            
            if (this.isWriterPage) {
                // Add event listener for the dynamically created remove button
                newNote.removeButton.addEventListener('click', () => {
                    this.notesContainer.removeChild(newNote.element);
                    this.saveNotes();
                });

                // Add an input event listener to the textarea
                newNote.textArea.addEventListener('input', () => {
                    this.saveNotes();
                });
            }
        });
    }

    updateTimestamp(timestampId, message) {
        const timestampElement = document.getElementById(timestampId);
        if (timestampElement) {
            const now = new Date();
            timestampElement.textContent = `${message} ${now.toLocaleTimeString()}`;
        }
    }

    init() {
        if (this.isWriterPage) {
            const addNoteButton = document.getElementById('add-note');
            addNoteButton.addEventListener('click', () => {
                this.notes.push({ content: '' });
                this.renderNotes();
            });
            this.renderNotes();

            // Listener for storage events from other tabs
            window.addEventListener('storage', (event) => {
                if (event.key === 'notes') {
                    this.renderNotes();
                }
            });

        } else { // Reader page logic
            this.renderNotes();
            this.updateTimestamp('last-updated', messages.updatedAt);
            
            // Instant updates from other tabs
            window.addEventListener('storage', (event) => {
                if (event.key === 'notes') {
                    this.renderNotes();
                    this.updateTimestamp('last-updated', messages.updatedAt);
                }
            });
        }
    }
}