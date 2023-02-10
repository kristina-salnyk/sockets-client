import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = {
  current: io("https://sockets-jh4u.onrender.com"),
};

const Chat = () => {
  const [onlineUsers, setOnlineUsers] = useState();

  useEffect(() => {
    socket.current.on("changedOnline", (data) => {
      setOnlineUsers(data);
    });
  }, []);

  return (
    <div>
      <p>Users online: {onlineUsers}</p>
    </div>
  );
};

export default Chat;
