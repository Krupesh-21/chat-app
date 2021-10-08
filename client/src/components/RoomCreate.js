import React, { useState } from "react";
import { useHistory } from "react-router";
import { io } from "socket.io-client";

const RoomCreate = () => {
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [err,setErr] = useState("")
  const socket = io.connect("http://localhost:5000");
  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName !== "" && userName !== "") {
      socket.emit("joinRoom", { roomName, userName });
      history.push(`/${roomName}`);
    } else{
        setErr("Please Fill up the details!");
    }
  };
  const errShow=()=>{
    setTimeout(()=> setErr(""),3000);
    return <p className="create-room-error">{err}</p>;
  }
  return (
    <div className="container">
      <div className="create-room-container">
        <fieldset className="create-room-fieldset">
          <legend>Create Room</legend>
          <form onSubmit={handleSubmit}>
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="User Name..."
              id="userName"
              autoComplete="off"
            />
            <label id="roomName">Room</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Room Name..."
              id="roomName"
              autoComplete="off"
            />
            <button className="create-room-submit-btn" type="submit">
              Create Room
            </button>
          </form>
        </fieldset>
        {err && errShow()}
      </div>
    </div>
  );
};

export default RoomCreate;
