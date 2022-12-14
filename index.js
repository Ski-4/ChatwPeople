const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const port = process.env.PORT || 3000;
const io = new Server(server);

app.use(express.static("public"));

let id = 1;
let prevId = -1;

let idList = {};

io.on("connection", (socket) => {
    console.log("a user connected");
    console.log("Client Id: ", socket.id);
    console.log("User Id: ", id);
    idList[socket.id] = id;
    id++;
    socket.on("chat message", (msg) => {
        let currTime = new Date();
        console.log("message: " + msg);
        let hour = currTime.getHours();
        let min = currTime.getMinutes();
        if (hour < 10) hour = "0" + hour;
        if (min < 10) min = "0" + min;
        res = {
            msg,
            id: socket.id,
            tag: idList[socket.id],
            prevId,
            time: hour + ":" + min,
        };
        prevId = socket.id;
        io.emit("chat message1", res);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

server.listen(port, () => {
    console.log("listening on *:3000");
});
