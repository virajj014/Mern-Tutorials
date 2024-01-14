const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    cors: {
        origin: '*', 
    }
});

const cors = require('cors');



//env
require('dotenv').config();
const port = process.env.PORT || 8000;

//middleware
app.use(cors());

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message', (payload) => {
        console.log('message: ' + payload);
        io.emit('chatmessage', payload);
    });
})

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});