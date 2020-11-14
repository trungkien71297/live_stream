const express = require('express')
const socketio = require('socket.io')
const app = express()
const path = require('path')
var cors = require('cors')

app.use(cors())
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.json({"stat": "ok"})
})
app.get('/test2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test2.html'))
})
app.get('/broadcast', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'broadcast.html'))
})
app.get('/4', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test2.html'))
})
const server = app.listen(process.env.PORT||3000, () => {
  console.log("Reader server")
})
const io = socketio(server, {
  serveClient: true,
  cors: {
    origin: "https://livetreamthanh.herokuapp.com",
    credentials: true
  }
})

var rooms = new Map()

io.on('connection', socket => {
  console.log("New user connected")
  socket.on("broadcaster", (args) => {
    rooms[args.room_id] = socket.id
    console.log("Total class: " + rooms[args.room_id])
    // socket.broadcast.emit("broadcaster", socket.id);
  });
  socket.on("watcher", (args) => {
    console.log("Total class 1: " + args.roomid)
    console.log("Total class 1: " + rooms[args.room_id])

    socket.to(rooms[args.room_id]).emit("watcher", socket.id);
  });
  // socket.on("disconnect", () => {
  //   socket.to(classes[0].socket_id).emit("disconnectPeer", socket.id);
  // });


  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
})