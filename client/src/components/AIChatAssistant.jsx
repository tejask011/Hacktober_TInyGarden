import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../utils/api';
import { Bot, User, Send, Trash2, Sparkles, HelpCircle, MessageSquare } from 'lucide-react';

export default function AIChatAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your 1-on-1 TinyGarden AI Assistant. Ask me any questions about plant care, organic pest control, soil mix, indoor foliage, or tree plantation.'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    'Suggest small indoor plants for modern architectural space',
    'What is the growing duration of sugarcane in months?',
    'How can I prepare rich organic compost at home?',
    'How to prevent pest attacks on tomato plants organically?'
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const historyPayload = updatedMessages.map(m => ({ sender: m.sender, text: m.text }));
      const response = await sendChatMessage(query, historyPayload);
      
      if (response.success && response.reply) {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'assistant', text: response.reply }
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now() + 1, 
          sender: 'assistant', 
          text: 'Local AI model unavailable. Ensure Ollama is running or check system settings.' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Chat history cleared. What plant or gardening topic would you like to discuss?'
      }
    ]);
  };

  return (
    <div className="bg-white border border-[#b8d5b2] rounded-2xl shadow-xl flex flex-col h-[650px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-[#294a23] bg-[#172d13] text-white flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center space-x-2 font-heading text-white">
            <MessageSquare className="w-5 h-5 text-[#6bb77b]" />
            <span>1-on-1 AI Gardening Chat</span>
            <span className="text-xs bg-[#6bb77b] text-white border border-[#529c61] px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live AI Model</span>
            </span>
          </h2>
          <p className="text-xs text-[#a8d3b0] mt-0.5 font-medium">
            Interactive AI conversation for customized plant & tree guidance
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="text-xs font-bold text-white px-3.5 py-1.5 bg-[#6bb77b] hover:bg-[#d76f30] rounded-lg border border-[#529c61] transition flex items-center space-x-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 no-scrollbar bg-[#eaf1e9]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#d76f30] text-white font-semibold shadow-md'
                  : 'bg-white border border-[#b8d5b2] text-[#172d13] shadow-sm'
              }`}
            >
              <div className={`text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5 ${msg.sender === 'user' ? 'text-white/90' : 'text-[#6bb77b]'}`}>
                {msg.sender === 'user' ? (
                  <>
                    <User className="w-3.5 h-3.5" />
                    <span>You</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>TinyGarden AI Assistant</span>
                  </>
                )}
              </div>
              <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#b8d5b2] rounded-2xl p-4 text-xs sm:text-sm text-[#3d5a37] flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#d76f30] rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-[#d76f30] rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-[#d76f30] rounded-full animate-bounce delay-200"></span>
              <span className="ml-2 font-semibold">AI is generating response...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 bg-[#dfebd9] border-t border-[#b8d5b2] flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold text-[#172d13] uppercase tracking-wider whitespace-nowrap flex items-center space-x-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#d76f30]" />
          <span>Quick Questions:</span>
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="whitespace-nowrap text-xs bg-white hover:bg-[#d76f30] text-[#172d13] hover:text-white px-3.5 py-1.5 rounded-full border border-[#b8d5b2] transition disabled:opacity-50 font-bold shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 bg-white border-t border-[#b8d5b2] flex items-center space-x-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a plant or tree question (e.g. Which indoor plant needs minimal light?)..."
          className="flex-1 bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl px-4 py-3 text-[#172d13] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#d76f30] placeholder-[#3d5a37]/70"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-[#d76f30] hover:bg-[#bf5c20] disabled:opacity-50 text-white font-extrabold px-5 py-3 rounded-xl text-xs sm:text-sm transition shadow-md font-heading flex items-center space-x-1.5"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
