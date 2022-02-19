const express = require('express')
const http = require('http');
const path = require('path')
const { Server } = require('socket.io')
const cors = require('cors')

// USE AND OTHER STUFF
const app = express()
app.use(cors())
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, '../client/build')));

// CREATE IO SERVER CONNECTION
const io = new Server(server, {
    cors:{
        // origin: 'http://localhost:3000',
        methods: ['GET','POST']
    }
})

// IO ON CONNECTON 
io.on('connection',(socket)=>{
    console.log('user connect',socket.id);

    // ON JOIN ROOM
    socket.on('join_room',(roomId)=>{
        socket.join(roomId)
        console.log(`[${socket.id}] has joined in [${roomId}]`)
    })

    // ON DISCONNECT 
    socket.on('disconnect', ()=>{
        console.log('[X] user disconnected', socket.id)
    })

    // SEND MESSAGE 
    socket.on('send_msg',(data)=>{
        socket.to(data.roomId).emit('receive_msg', data)
    })
})

// HOME PAGE
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, './client/build'));
})

// SERVER LISTEN
server.listen(5000,()=> console.log("listening 5000"))
