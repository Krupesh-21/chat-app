import React, { useState,useEffect } from "react";
import { useHistory } from "react-router";
import { createRoom } from "../socket";

const RoomCreate = () => {
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [err,setErr] = useState("")
  const history = useHistory();
  useEffect(() => {
    window.addEventListener("click", ()=> setErr(""))
    return () => {
     window.removeEventListener("click", ()=> setErr(""));
     console.log("executed");
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName !== "" && userName !== "") {
      const name = userName[0].toUpperCase() + userName.slice(1);
      createRoom({roomName,userName:name});
      history.push(`/${roomName}`);
    } else{
        setErr("Please Fill up the details!");
    }
  };
  const errShow=()=>{
    setTimeout(()=> setErr(""),5000);
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
