const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 8000;
require('dotenv').config();



const app = express();
require('./db');


// routes
const todoRoutes = require('./Routes/TodoRoutes');


app.use(bodyParser.json());
app.use(cors());
app.use('/todo', todoRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'API Working'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})