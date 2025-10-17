const http = require('http');
const url = require('url');
// Import the messages constant from the separate file
const MESSAGES = require('./messages'); 

// **Data Store and Counters**
let dictionary = [];
let requestCount = 0; 

// **Configuration**
const PORT = 8888; // Use environment variable for hosting
const API_ROOT = '/api/definitions';

// **Helper function for sending JSON response**
function sendJsonResponse(res, statusCode, payload) {
    res.setHeader('Content-Type', 'application/json');
    // CORS Headers (Crucial for communication between Server 1 and Server 2)
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Accept');

    res.statusCode = statusCode;
    const responseData = {
        totalRequestsServed: requestCount,
        ...payload
    };
    res.end(JSON.stringify(responseData));
}

// **Input Validation Helper**
function isValidInput(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        return false;
    }
    // Disallow strings that are only numeric
    if (!isNaN(Number(value)) && value.trim() === String(Number(value))) {
        return false;
    }
    return true;
}

// **Server Request Handler**
const server = http.createServer((req, res) => {
    
    // 1. Handle Pre-flight OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Accept');
        res.writeHead(204); // 204 No Content
        return res.end();
    }

    requestCount++; 

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // **Path validation**
    if (pathname !== API_ROOT && pathname !== API_ROOT + '/') {
        return sendJsonResponse(res, 404, MESSAGES.ERROR_INVALID_PATH(requestCount, pathname));
    }

    // --- 2. GET Request: Retrieve Definition ---
    if (req.method === 'GET') {
        const word = parsedUrl.query.word;

        // **Input Validation**
        if (!isValidInput(word)) {
            return sendJsonResponse(res, 400, MESSAGES.ERROR_INVALID_INPUT(requestCount, 'Word'));
        }

        const normalizedWord = word.trim().toLowerCase();
        const entry = dictionary.find(item => item.word.toLowerCase() === normalizedWord);

        if (entry) {
            // Success: 200 OK
            sendJsonResponse(res, 200, MESSAGES.GET_SUCCESS(requestCount, entry.word, entry.definition));
        } else {
            // Not Found: 404 Not Found
            sendJsonResponse(res, 404, MESSAGES.ERROR_NOT_FOUND(requestCount, word));
        }

    // --- 3. POST Request: Create New Definition ---
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            let requestData;
            try {
                requestData = JSON.parse(body);
            } catch (error) {
                // Bad Request: 400 - Invalid JSON or body
                return sendJsonResponse(res, 400, MESSAGES.ERROR_INVALID_INPUT(requestCount, 'Request body (expected JSON)'));
            }
            
            const word = requestData.word;
            const definition = requestData.definition;
            
            // **Input Validation**
            if (!isValidInput(word)) {
                return sendJsonResponse(res, 400, MESSAGES.ERROR_INVALID_INPUT(requestCount, 'Word'));
            } 
            if (!isValidInput(definition)) {
                return sendJsonResponse(res, 400, MESSAGES.ERROR_INVALID_INPUT(requestCount, 'Definition'));
            }
            
            const normalizedWord = word.trim().toLowerCase();
            const entryExists = dictionary.some(item => item.word.toLowerCase() === normalizedWord);

            if(entryExists === "car")
                return sendJsonResponse(res, 409, MESSAGES.CAR(requestCount, word.trim()));

            else if (entryExists) {
                // Conflict: 409 Conflict (Word already exists)
                return sendJsonResponse(res, 409, MESSAGES.WARNING_EXISTS(requestCount, word.trim()));
            } else {
                // Create New Entry
                const newEntry = {
                    word: word.trim(), 
                    definition: definition.trim()
                };
                dictionary.push(newEntry);
                
                // Success: 201 Created
                return sendJsonResponse(res, 201, MESSAGES.POST_SUCCESS(
                    requestCount, 
                    dictionary.length, 
                    newEntry.word, 
                    newEntry.definition
                )); 
            }
        });
        
        req.on('error', (err) => {
            console.error('Request error:', err);
            sendJsonResponse(res, 500, MESSAGES.ERROR_INTERNAL_SERVER(requestCount));
        });

    // --- 4. Other Methods ---
    } else {
        // Method Not Allowed: 405 Method Not Allowed
        sendJsonResponse(res, 405, MESSAGES.ERROR_INVALID_METHOD(requestCount, req.method));
    }
});

server.listen(PORT, () => {
    console.log(`Server 2 (Dictionary API) is running on port ${PORT}`);
    console.log(`Service root: http://localhost:${PORT}${API_ROOT}`);
});