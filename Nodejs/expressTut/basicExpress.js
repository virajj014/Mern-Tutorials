const express = require('express');
const app = express();
const port = 8000;


app.get('/',(req,res)=>{
    res.status(200).json({message:'Hello from myBackend1',data:{
        name:'John',
        age:30
    }})
})
app.get('/about',(req,res)=>{
    res.json({message:'Hello from about',data:{
        name:'Billy',
        age:30
    }})
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})