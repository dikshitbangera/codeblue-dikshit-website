// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express app
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Mock user database
const users = [
    { username: 'dikshit', password: 'password123' },
    { username: 'admin', password: 'admin123' }
];

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
        // Successful login
        return res.status(200).json({ success: true, message: 'Login successful!' });
    } else {
        // Invalid credentials
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('Login API is running...');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
