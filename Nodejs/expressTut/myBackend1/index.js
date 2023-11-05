const express = require('express');
const userRoutes = require('./Routes/userRoutes');
const app = express();
const PORT = 8000;
const bodyParser = require('body-parser');
const cors = require('cors');


// CORS    ->   www.google.com             127.123.124.098

app.use(bodyParser.json());
app.use(cors());



app.use('/userapis',userRoutes);

app.get('/test',(req,res)=>{
    res.json({
        message:"Index page test route"
    })
})
app.get('/',(req,res)=>{
    res.json({
        message:"Welcome to our application"
    })
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})