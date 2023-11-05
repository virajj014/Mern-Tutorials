const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// __dirname + ../UserDataBase.json

const dataFilePath = path.join(__dirname, '../UserDataBase.json');


function readDataFromFile() {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}


function writeDataFromFile(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data));
}

// function appendDataFromFile(data){
//     fs.appendFileSync(dataFilePath,JSON.stringify(data));
// }

router.get('/test', (req, res) => {
    // console.log(dataFilePath);
    res.json({
        message: "User test route"
    })
})



//GET ALL USERS
router.get('/users', (req, res) => {
    const users = readDataFromFile();
    res.json(
        {
            message: "All users data",
            data: users
        }
    )
})
// GET SINGLE USER
router.get('/users/:id', (req, res) => {
    const users = readDataFromFile();
    const userId = req.params.id;
    const user = users.find(user => user.id == userId);


    if (user) {
        res.json({
            message: "User found",
            data: user
        })
    }
    else {
        res.json({
            message: "User not found"
        })
    }
})
// ADD USER
router.post('/users', (req, res) => {
    const user = req.body;
    user.id = new Date().getTime();
    console.log(user);
    const users = readDataFromFile();
    users.push(user);
    writeDataFromFile(users);
    res.json({
        message: "User added successfully",
        data: user
    })




})
// DELETE USER
router.delete('/users/:id', (req, res) => {
    const users = readDataFromFile();
    const userId = req.params.id;
    const userIndex = users.findIndex(user => user.id == userId);

    if (userIndex == -1) {
        res.json({
            message: "User not found"
        })
    }

    users.splice(userIndex, 1);
    writeDataFromFile(users);
    res.json({
        message: "User deleted successfully"
    })
})
// UPDATE USER

// {
//     "id": 2,
//     "name": "Jane Smith",
//     "email": "jane@example.com",
//     "age": 25,
//     "address": "456 Park Avenue"
//   },


router.put('/users/:id', (req, res) => {
    const users = readDataFromFile();
    const userId = req.params.id;
    const updateUser = req.body;

// {
//     "age": 35,
//   },

    const userIndex = users.findIndex(user => user.id == userId);

    if (userIndex == -1) {
        res.json({
            message: "User not found"
        })
    }

    users[userIndex] = {
        ...users[userIndex],
        ...updateUser
    }

    writeDataFromFile(users);
    res.json({
        message: "User updated successfully"
    })
})

module.exports = router;