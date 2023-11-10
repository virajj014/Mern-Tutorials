const express = require('express');
const Task = require('../models/TaskSchema');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const errorMiddleware = require('../middlewares/errorMiddleware');
const authTokenHandler = require('../middlewares/checkAuthToken');


const createResponse = (ok, message, data) => {
    return {
        ok,
        message,
        data
    }
}


router.get('/test', (req, res) => {
    res.send('Task routes are working!');
});

// CRUD
router.post('/', authTokenHandler, async (req, res, next) => {
    // console.log(req.userId);
    // res.json({
    //     ok: req.ok,
    // })

    try {
        const { title, description } = req.body;
        const owner = req.userId;

        const newTask = new Task({
            title,
            description,
            owner
        })

        await newTask.save();
        return res.status(201).json(
            createResponse(true, 'Task created successfully!', newTask)
        )
    }
    catch (err) {
        next(err);
    }
});


router.get('/',authTokenHandler, async (req, res, next) => {
    try{
        const tasks = await Task.find({owner: req.userId});
        return res.status(200).json(
            createResponse(true, 'Tasks fetched successfully!', tasks)
        )
    
    }
    catch(err){
        next(err);
    }
});


router.get('/:id',authTokenHandler, async (req, res, next) => {
    try{
        const {id} = req.params;
        const task = await Task.findOne({_id: id, owner: req.userId});
        return res.status(200).json(
            createResponse(true, 'Task fetched successfully!', task)
        )
    
    }
    catch(err){
        next(err);
    }
});


router.put('/:id', authTokenHandler, async (req, res, next) => {
   

    try {
       
        const owner = req.userId;
        const {id} = req.params;
        const task = await Task.findOneAndUpdate({_id: id, owner}, req.body, {new: true});

        if(!task){
            let err = new Error('Task not found!');
            err.statusCode = 404;
            throw err;
        }

        return res.status(200).json(
            createResponse(true, 'Task updated successfully!', task)
        )
    }
    catch (err) {
        next(err);
    }
});


router.delete('/:id', authTokenHandler, async (req, res, next) => {
    try{
        const {id} = req.params;
        const owner = req.userId;

        await Task.findOneAndDelete({_id: id, owner});
        return res.status(200).json(
            createResponse(true, 'Task deleted successfully!', null)
        )
    }
    catch(err){
        next(err);
    }
})


router.use(errorMiddleware)

module.exports = router;