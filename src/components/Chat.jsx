import { useEffect, useState } from "react";
import io from "socket.io-client";

// const socket = {
//   current: io("http://localhost:3001"),
// };

const socket = {
  current: io("https://sockets-jh4u.onrender.com"),
};

const Chat = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.current.on("changedOnline", (data) => {
      setOnlineUsers(data);
    });

    socket.current.on("fetchedMessages", (data) => {
      setMessages(data);
    });

    socket.current.on("changedMessages", (data) => {
      setMessages((prevState) => {
        if (prevState.some((item) => item._id === data._id)) {
          return prevState;
        }
        return [...prevState, data];
      });
    });

    return () => {
      socket.current.off("disconnect", "");
    };
  }, []);

  const handleNameClick = (event) => {
    event.preventDefault();

    socket.current.emit("addUser", name);
  };

  const handleMessageClick = (event) => {
    event.preventDefault();

    socket.current.emit("addMessage", { name, text });
  };

  return (
    <div>
      <p>Users online: {onlineUsers}</p>
      <form action="">
        <label>
          Enter your name
          <input
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.currentTarget.value);
            }}
          />
        </label>

        <button type="submit" onClick={handleNameClick}>
          Submit
        </button>
      </form>
      <ul>
        {messages.map((item) => (
          <li key={item._id}>
            <span>{item.name}</span>:<span>{item.text}</span>
          </li>
        ))}
      </ul>
      <form action="">
        <label>
          Enter your message
          <input
            type="text"
            value={text}
            onChange={(event) => {
              setText(event.currentTarget.value);
            }}
          />
        </label>

        <button type="submit" onClick={handleMessageClick}>
          Sent
        </button>
      </form>
    </div>
  );
};

export default Chat;
