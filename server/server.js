import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();
app.use(cors());

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
    const currentUser = getCurrentUser(socket.id);
    io.to(currentUser.roomName).emit("chatMessage",formateMessage(currentUser.userName,payload));
    console.log("chat-message", payload);
  });
  socket.on("joinRoom", ({ roomName, userName }) => {
    const user = joinRoom(roomName, userName, socket.id, "add_user");
    socket.join(user.roomName);
    socket.broadcast
      .to(user.roomName)
      .emit(
        "chatMessage",
        `${user.userName} has joined the ${user.roomName} chat room`
      );

    console.warn(`${payload.userName} joind ${payload.roomName}`);
  });
  socket.on("disconnect", () => {
    const currentUser = getCurrentUser(socket.id);
    io.to(currentUser.roomName).emit("chatMessage", `${currentUser.userName} has left the chat and room..`);
  });
  // console.log(socket.id);
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => console.log(`server is running on ${PORT}`));

const joinRoom = (roomName, userName, id, query) => {
  let userData = localStorage.getItem("USER_CHAT_DATA");
  if (query === "add_user") {
    const user = { roomName, userName, id };
    if (!userData)
      localStorage.setItem("USER_CHAT_DATA", JSON.stringify([user]));
    else
      localStorage.setItem(
        "USER_CHAT_DATA",
        JSON.stringify([...userData, user])
      );
    return user;
  } else if (query === "leave_user") {
    const leaveUser = userData.find((user) => user.id === id);
    localStorage.setItem(
      "USER_CHAT_DATA",
      JSON.stringify(userData.filter((user) => user.id === id))
    );
    return leaveUser;
  }
};

const getCurrentUser = (id) => {
  return JSON.parse(localStorage.getItem("USER_CHAT_DATA")).find(
    (user) => user.id === id
  );
};

const formateMessage = (userName, msg) => {
  return {
    userName,
    msg,
    time: moment().format("h:mm a"),
  };
};
