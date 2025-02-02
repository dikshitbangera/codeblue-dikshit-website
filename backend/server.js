// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const functions = require("firebase-functions");
const jwt = require('jsonwebtoken'); // Make sure to install via npm install jsonwebtoken

// Create an Express app
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

const SECRET_KEY = 'gokuvegeta'; // Use environment variables in production

// Mock user database
const users = [
    { username: 'dikshit', password: 'password123' },
    { username: 'admin', password: 'admin123' }
];

// Example route
app.get("/", (req, res) => {
    res.send("Hello from Firebase Functions!");
  });

// Export the app as a Firebase Function
exports.api = functions.https.onRequest(app);

// Login API endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Check if user exists in the database
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        // Successful login
        return res.status(200).json({ success: true, token });
    } else {
        // Invalid credentials
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('Login API is running...');
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Unauthorized: No token provided' });
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        req.user = decoded;
        next();
    });
}


app.post('/api/logout', verifyToken, (req, res) => {
    // try {
    //     // Example: Clear cookies or handle token-based logout logic
    //     res.clearCookie('connect.sid'); // Optional if you're using cookies
    //     return res.status(200).json({ message: 'Logout Successful' });
    // } catch (error) {
    //     console.error('Logout error:', error);
    //     return res.status(500).json({ message: 'An error occurred during logout' });
    // }

    return res.status(200).json({ message: 'Logout successful' });

});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

