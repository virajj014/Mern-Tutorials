const express = require('express');
const router = express.Router();
require('dotenv').config();
const Todo = require('../Models/TodoSchema');


// CREATE
router.post('/addtodo', async (req, res) => {
    const { title, description } = req.body;

    const todo = new Todo({
        title,
        description
    });

    try {
        await todo.save();
        res.json({
            message: 'Todo Added Successfully',
            data: todo
        })
    }
    catch (err) {
        res.status(400).json({
            message: 'Unable to add Todo',
            error: err.message
        })
        console.log(err);
    }
})


// READ
// router.get('/gettodos', async (req, res) => {
//     const todos = await Todo.find();
//     res.json({
//         message : 'Todos fetched Successfully',
//         data : todos
//     })
// })

// router.get('/gettodos/:id', async (req, res) => {
//     const todo = await Todo.findById(req.params.id);
//     res.json({
//         message : 'Todos fetched Successfully',
//         data : todo
//     })
// })

// UPDATE
// router.put('/updatetodo/:id', async (req, res) => {
//     const todo = await Todo.findByIdAndUpdate(  req.params.id , req.body , {new : true})
//     res.json({
//         message : 'Todo updated Successfully',
//         data : todo
//     })
// })


// DELETE
router.delete('/deletetodo/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({
        message: 'Todo deleted Successfully'
    })
})


// router.get('/test', (req, res) => {
//     res.json({
//         message: 'API Working for todo routes'
//     });
// });




module.exports = router;