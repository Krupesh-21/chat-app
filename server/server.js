import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import moment from "moment";

const app = express();
app.use(cors());
let userData = [];

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POSt"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
  allowEIO3: true,
});

io.on("connection", (socket) => {
  socket.broadcast.emit("welcomeMessage", "User has joined the room");
  socket.on("chatMessage", (payload) => {
    console.log("chatMessage", payload);
    const currentUser = getCurrentUser(socket.id);
    io.to(currentUser.roomName).emit(
      "chatMessage",
      formateMessage(currentUser.userName, payload)
    );
  });
  socket.on("joinRoom", ({ roomName, userName }) => {
    console.log("joinromm");
    const user = joinRoom(roomName, userName, socket.id);
    socket.join(user.roomName);
    socket.broadcast
      .to(user.roomName)
      .emit(
        "chatMessage",
        formateMessage(
          `${user.userName} has joined the ${user.roomName} chat room`
        )
      );
      io.to(user.roomName).emit("roomUser", {
        room: user.roomName,
        users: roomUserList(user.roomName)
      })
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
    const userLeft = leaveUser(socket.id);
    console.log("userLeft", userLeft);
    if (userLeft) {
      io.to(userLeft.roomName).emit(
        "chatMessage",
        formateMessage(
          `${userLeft.userName} has left the chat and room..`
        )
      );
    }
    console.log("afterleft", userData);
  });
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => console.log(`server is running on ${PORT}`));

const joinRoom = (roomName, userName, id) => {
  const user = { roomName, userName, id };
  userData.push(user);
  console.log(userData);
  return user;
};

const getCurrentUser = (id) => {
  console.log("getCurrentuserId", id);
  console.log(
    "getCurrrentUser",
    userData.find((user) => user.id === id)
  );
  return userData.find((user) => user.id === id);
};

const formateMessage = (userName = "admin", msg) => {
  return {
    userName,
    msg,
    time: moment().format("h:mm a"),
  };
};

const leaveUser = (id) => {
  const leaveUser = userData.find((user) => user.id === id);
  const updatedUserData = userData.filter((user) => user.id !== leaveUser.id);
  userData = [...updatedUserData];
  console.log("leaveuser", leaveUser);
  return leaveUser;
};

const roomUserList = (roomName)=>{
  const users = userData.filter(user=> user.roomName === roomName).map(user=> user.userName);
  return users;
}