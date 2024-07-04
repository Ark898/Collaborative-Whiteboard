const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let connections = [];

io.on("connect", (socket) => {
  connections.push(socket);
  console.log(`${socket.id} has connected`);

  socket.on('draw', (data) => {
    connections.forEach(con => {
      if(con.id !== socket.id) {
        con.emit("ondraw", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("down", (data) => {
    connections.forEach((con) => {
      if(con.id !== socket.id) {
        con.emit("ondown", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} is disconnected`);
    connections = connections.filter((con) => con.id !== socket.id);
  });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8080;

// Export the server handler for Vercel
module.exports = (req, res) => {
  server.emit('request', req, res);
};

if (!module.parent) {
  server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
