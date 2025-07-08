import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Heart, Smile, Users } from "lucide-react";

const personas = ["Einstein", "Krishna", "Elon Musk", "Nietzsche"];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState("Krishna");
  const chatRef = useRef(null);

  const askQuestion = async () => {
    if (question.trim() === "") return;

    const newMessages = [...messages, { sender: "user", text: question }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: selectedPersona,
          topic: "General Debate",
          messages: newMessages
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: selectedPersona, text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: selectedPersona,
          text: "I'm having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const conversationStarters = [
    "Is technology helping or harming humanity?",
    "What is the role of destiny vs free will?",
    "Can AI understand consciousness?",
    "Is suffering necessary for growth?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">🧠 Clash of Minds</h1>
              <p className="text-sm text-gray-600">Debate with legends, thinkers, and minds of history</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6">
        {/* Persona Selection */}
        <div className="py-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Persona:</label>
          <select
            className="w-full p-2 border border-pink-200 rounded-md"
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
          >
            {personas.map((persona) => (
              <option key={persona} value={persona}>{persona}</option>
            ))}
          </select>
        </div>

        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-10">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Start a Mind Clash 🧠</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose a legendary thinker and engage in a deep, respectful debate on topics that matter.
              </p>
            </div>
            <div className="space-y-3 max-w-2xl mx-auto mb-8">
              {conversationStarters.map((starter, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuestion(starter)}
                  className="w-full p-4 text-left bg-white/80 hover:bg-white rounded-xl border border-pink-100 transition hover:shadow"
                >
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-pink-500" />
                    <span className="text-gray-700">{starter}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat */}
        <div ref={chatRef} className="py-8 space-y-6 min-h-[300px]">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex space-x-4">
              {msg.sender === "user" ? (
                <div className="ml-auto bg-blue-600 text-white px-4 py-3 rounded-2xl max-w-[80%] shadow">
                  {msg.text}
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Smile className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-pink-100 px-4 py-3 rounded-2xl rounded-tl-md shadow text-gray-800 max-w-[80%] whitespace-pre-wrap">
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                <Smile className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-pink-100 px-4 py-3 rounded-2xl rounded-tl-md shadow text-gray-800 max-w-[80%]">
                <span className="text-sm text-gray-500 italic">Typing a wise response...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-pink-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-end space-x-3 bg-white rounded-2xl shadow border border-pink-200">
            <textarea
              rows={1}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Ask ${selectedPersona}...`}
              className="flex-1 px-4 py-3 bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-500 text-base max-h-32"
              style={{ minHeight: "24px", height: "auto" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
            <button
              onClick={askQuestion}
              disabled={loading || !question.trim()}
              className={`m-2 w-10 h-10 rounded-xl flex items-center justify-center ${
                loading || question.trim() === ""
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600"
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
