// components/SupportChat.js
import { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare } from "lucide-react";

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you today?" }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (message.trim() === "") return;
    setMessages((prev) => [...prev, { from: "user", text: message }]);
    const reply = await fakeApiResponse(message);
    setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const fakeApiResponse = async () => {
    return "Thanks for your message! We'll get back to you soon.";
  };

  return (
    <div className="fixed bottom-4 right-1 sm:right-4 z-50 w-72 sm:w-80 max-w-full">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-96">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-t-2xl flex justify-between items-center">
            <span className="font-semibold">Support</span>
            <X className="cursor-pointer hover:text-gray-200" onClick={() => setIsOpen(false)} size={20} />
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] px-3 py-2 rounded-lg break-words transition transform ${
                  msg.from === "user"
                    ? "bg-blue-500 text-white self-end animate-slide-right"
                    : "bg-gray-100 text-gray-800 self-start animate-slide-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center border-t border-gray-200">
            <input
              className="flex-1 p-2 text-sm outline-none rounded-bl-2xl"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button className="p-2 text-blue-600 hover:text-blue-800" onClick={handleSend}>
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button
          className="bg-blue-600 text-white p-3 rounded-full shadow-xl hover:scale-110 transition fixed right-1 sm:right-4 bottom-4"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare size={20} />
        </button>
      )}
      <style jsx>{`
        .animate-slide-right {
          animation: slideRight 0.3s ease forwards;
        }
        .animate-slide-left {
          animation: slideLeft 0.3s ease forwards;
        }
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}