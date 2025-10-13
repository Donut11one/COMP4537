// messages.js

const MESSAGES = {
    // Success Messages
    POST_SUCCESS: (reqNum, totalEntries, word, definition) => ({
        message: `Request # ${reqNum}. New entry recorded. Total entries: ${totalEntries}.`,
        word: word,
        definition: definition,
        entry: `${word} : ${definition}` 
    }),
    GET_SUCCESS: (reqNum, word, definition) => ({
        message: `Request # ${reqNum}. Definition found.`,
        word: word,
        definition: definition
    }),
    // Warning/Error Messages (Using 409 Conflict for "exists")
    WARNING_EXISTS: (reqNum, word) => ({
        message: `Warning! '${word}' already exists.`,
        word: word,
        requestNumber: reqNum, 
        exists: true 
    }),
    ERROR_NOT_FOUND: (reqNum, word) => ({
        message: `Request # ${reqNum}, word '${word}' not found!`,
        requestNumber: reqNum
    }),
    ERROR_INVALID_METHOD: (reqNum, method) => ({
        message: `Request # ${reqNum}. Invalid method: ${method}. Only GET and POST are supported on this endpoint.`,
        requestNumber: reqNum
    }),
    ERROR_INVALID_PATH: (reqNum, path) => ({
        message: `Request # ${reqNum}. Invalid path: ${path}. Service root is '/api/definitions'.`,
        requestNumber: reqNum
    }),
    ERROR_INVALID_INPUT: (reqNum, type) => ({
        message: `Request # ${reqNum}. Invalid input. ${type} must be a non-empty string and not just a number.`,
        requestNumber: reqNum
    }),
    ERROR_INTERNAL_SERVER: (reqNum) => ({
        message: `Request # ${reqNum}. Internal Server Error.`,
        requestNumber: reqNum
    })
};

// Export the constant for use in app.js
module.exports = MESSAGES;