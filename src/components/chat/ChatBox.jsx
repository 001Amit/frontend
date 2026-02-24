import { useEffect, useState } from "react";
import socket from "../../services/socket";
import api from "../../services/api";

export default function ChatBox({ receiverId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("join", receiverId);

    api.get(`/chat/${receiverId}`).then((res) => {
      setMessages(res.data);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const send = () => {
    socket.emit("sendMessage", {
      receiver: receiverId,
      message: text,
    });
    setText("");
  };

  return (
    <div className="border p-4">
      <div className="h-64 overflow-y-scroll">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            {m.message}
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border w-full p-2 mt-2"
      />
      <button onClick={send} className="bg-black text-white px-3 py-1 mt-2">
        Send
      </button>
    </div>
  );
}
