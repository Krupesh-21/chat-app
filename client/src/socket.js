import { io } from "socket.io-client";
let socket;

export const createRoom = (userData) => {
  socket = io.connect("http://localhost:5000");
  if (socket && userData) socket.emit("joinRoom", userData);
};

export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};

export const sendMessage = (message) => {
  console.log(message);
  if (socket) socket.emit("chatMessage", message);
};

export const subscribeToChat = (callBackFunction) => {
  if (!socket) return true;

  socket.on("chatMessage", (msg) => {
    console.log("scoket.js msg", msg);
    return callBackFunction(null, msg);
  });
};

export const userListRoom = (cBFunction)=>{
    if (!socket) return true;

  socket.on("roomUser", (msg) => {
    console.log("scoket.js msg", msg);
    return cBFunction(null, msg);
  });
}