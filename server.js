const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true 
});

const { v4: uuidv4} = require('uuid');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);
app.get('/', (req,res) => {
    // res.status(200).send('Hello World');
    // res.render('room');
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req,res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) =>{
        // console.log("Joined Room");
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('User-Connected', userId);
    })
})

server.listen(3030);