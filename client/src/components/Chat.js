import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  disconnectSocket,
  sendMessage,
  subscribeToChat,
  userListRoom,
} from "../socket";
import { Virtuoso } from "react-virtuoso";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState("");
  const history = useHistory();
  useEffect(() => {
    subscribeToChat((err, data) => {
      console.log("subtochat");
      if (err) return;
      setChat([...chat, data]);
    });
  }, [chat]);
  useEffect(() => {
    userListRoom((err, userList) => {
      console.log("userList", userList);
      if (err) return;
      const upUserList = userList.users.filter(
        (userName) => userName !== "admin"
      );
      console.log("upuser", upUserList);
      const room = userList.room[0].toUpperCase() + userList.room.slice(1);
      setRoom(room);
      setUsers(upUserList);
    });
  }, [users]);
  const handleMessage = (e) => {
    setMessage(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };
  const leaveRoom = (e) => {
    disconnectSocket();
    history.push("/");
  };
  console.log(chat);
  console.log(users);
  // const renderChatMessage = (cMessage, index) => {
  //   // console.log(i);
  //   //
  //   return (
  //     <div className="message" key={index}>
  //       <p className="user-name">{cMessage.userName}</p>
  //       <div className="uName">
  //         <p className="user-message">{cMessage.msg}</p>
  //       </div>
  //       <div className="msg-time">
  //         <p className="user-time">{cMessage.time}</p>
  //       </div>
  //     </div>
  //   );
  // };
  const renderChatMessage = (i) => {
    const cMessage = chat[i];
    return (
      <div className="message" key={i}>
        <p className="user-name">{cMessage.userName}</p>
        <div className="uName">
          <p className="user-message">{cMessage.msg}</p>
        </div>
        <div className="msg-time">
          <p className="user-time">{cMessage.time}</p>
        </div>
      </div>
    );
  };
  const renderChatMember = (user, index) => {
    return <p key={index}><i class="fas fa-user"></i>{user}</p>;
  };
  // const renderChatMember = (i) => {
  //   console.log(users[i]);
  //   const member = users[i];
  //   console.log(member);
  //   return (
  //     <p key={i}>
  //       <i class="fas fa-user"></i>
  //       {member}
  //     </p>
  //   );
  // };
  return (
    <div className="container">
      <div className="chat-container">
        <div className="chat-room-name">{room && <p>{room}</p>}</div>
        <div className="chat-leave-btn">
          <button onClick={leaveRoom}>Leave</button>
        </div>
        <div className="chat-friends">
          <h2>Members</h2>
          <div className="chat-usernames-list">
            {users.length !== 0 &&
              users.map((user, index) => renderChatMember(user, index))}
            {/* {users.length !== 0 && (
              <Virtuoso
                data={users}
                totalCount={users.length}
                itemContent={(i) => renderChatMember(i)}
              />
            )} */}
          </div>
        </div>
        <div className="chat-display">
          {/* {chat.length !== 0 &&
            chat.map((cMessage, index) => renderChatMessage(cMessage, index))} */}
          {chat.length !== 0 && (
            <Virtuoso
              data={chat}
              totalCount={chat.length}
              itemContent={(i) => renderChatMessage(i)}
            />
          )}
        </div>
        <form className="chat-send-box" onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={handleMessage}
            placeholder="Send Message.."
          />
          <button type="submit">
            <i class="far fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
