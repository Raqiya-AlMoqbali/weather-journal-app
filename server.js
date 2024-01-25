
// Setup empty JS object to act as API endpoint
projectData = {};

// Require and configure Express, Body-Parser, and Cors
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Start up an instance of app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// GET route that returns the projectData object
app.get('/all', (req, res) => {
    res.send(projectData);
});

// POST route to add incoming data to projectData
app.post('/add', (req, res) => {
    try {
        const newData = {
            date: req.body.date,
            temperature: req.body.temperature,
            content: req.body.content
        };

        // Store the new data in the projectData object
        projectData = newData;

        // Send the updated projectData as the response
        res.status(200).json(projectData);
    } catch (error) {
        // Handle any errors that occur during the processing of the request
        res.status(500).json({ error: 'Error processing the request' });
    }
});

// Setup Server
const port = 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

