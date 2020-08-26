const PORT = 8000;

// Setup empty JS object to act as endpoint for all routes
projectData = {
    values: []
};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const server = app.listen(PORT, listening);
function listening() {
    console.log (`Server is running on port ${PORT}`);
};

//Get 
app.get('/get',(req, res) => {
    res.send(projectData.values);
});

//Post
app.post('/addData',(req,res) => {
    let data = req.body; 
    projectData.values.unshift(data);
    res.send(projectData);
});