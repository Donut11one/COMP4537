// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Determine the current page
    const isWriterPage = window.location.pathname.includes('writer.html');
    console.log(isWritePage)

    const notesContainer = document.getElementById('notes-container');

    // Instantiate the NoteManager to run the application logic
    new NoteManager(notesContainer, isWriterPage);
});