import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { sendMessageToAI, getAppointmentChat } from "../api";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import userAvatar from "../assets/user.png";
import doctorAvatar from "../assets/doctor.png";
import { useTranslation } from 'react-i18next';
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/outline';

export default function ChatPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAppointmentChat(id)
      .then(res => {
        console.log("Chat history:", res.data);
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        } else {
          setMessages([]);
        }
      })
      .catch(err => {
        console.error("Failed to load chat history:", err);
        setMessages([]);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      });
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    
    const userMessage = { sender: "USER", message: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    setSending(true);
    
    try {
      const res = await sendMessageToAI(id, { message: userMessage.message });
      setMessages(prev => {
        const aiResponses = res.data.filter(msg => msg.sender === "AI");
        return [...prev, ...aiResponses];
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [
        ...prev, 
        { 
          sender: "AI", 
          message: t('chat.error')
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  };

  const groupedMessages = messages.reduce((acc, message, i) => {
    if (i === 0 || messages[i - 1].sender !== message.sender) {
      return [...acc, [message]];
    }
    acc[acc.length - 1].push(message);
    return acc;
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 py-4">
          <Breadcrumb
            items={[
              { to: "/", label: t('navbar.home') },
              { to: "/appointments", label: t('navbar.appointments') },
              { label: t('chat.title') }
            ]}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={doctorAvatar}
                  alt="Dr. Copad"
                  className="h-10 w-10 rounded-full border-2 border-indigo-100"
                />
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">{t('chat.title')}</h1>
                <p className="text-xs text-gray-500">
                  {t('chat.subtitle')} • <span className="text-green-600">{t('chat.status.online')}</span>
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
        >
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-indigo-200 rounded-full mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{t('chat.empty.title')}</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {t('chat.empty.description')}
              </p>
            </div>
          ) : (
            groupedMessages.map((group, groupIndex) => (
              <div 
                key={groupIndex} 
                className={`flex ${group[0].sender === "USER" ? "justify-end" : "justify-start"}`}
              >
                {group[0].sender === "AI" && (
                  <img 
                    src={doctorAvatar} 
                    alt="AI" 
                    className="h-10 w-10 rounded-full border-2 border-indigo-100 mr-3 mt-1" 
                  />
                )}
                <div className="max-w-[75%]">
                  {group.map((message, messageIndex) => (
                    <div 
                      key={messageIndex} 
                      className={`${messageIndex === 0 ? 'rounded-t-2xl' : ''} ${
                        messageIndex === group.length - 1 ? (
                          message.sender === "USER" ? 'rounded-bl-2xl rounded-br-sm' : 'rounded-br-2xl rounded-bl-sm'
                        ) : ''
                      } ${messageIndex !== 0 ? 'mt-1' : ''} px-4 py-3 ${
                        message.sender === "USER" 
                          ? "bg-indigo-600 text-white" 
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {message.message}
                      </div>
                      {message.timestamp && (
                        <div className={`text-xs mt-1 ${message.sender === "USER" ? "text-indigo-200" : "text-gray-400"} text-right`}>
                          {formatTime(message.timestamp)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {group[0].sender === "USER" && (
                  <img 
                    src={userAvatar} 
                    alt="You" 
                    className="h-10 w-10 rounded-full border-2 border-indigo-100 ml-3 mt-1" 
                  />
                )}
              </div>
            ))
          )}
          
          {/* Typing indicator */}
          {sending && (
            <div className="flex justify-start">
              <img 
                src={doctorAvatar} 
                alt="AI" 
                className="h-10 w-10 rounded-full border-2 border-indigo-100 mr-3" 
              />
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[75%]">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-gray-200 p-4 sm:px-6">
          <form onSubmit={handleSend} className="relative">
            <input
              ref={inputRef}
              className="w-full border border-gray-300 py-3 pl-5 pr-16 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-600 placeholder-gray-400 shadow-sm"
              placeholder={t('chat.input.placeholder')}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={sending}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className={`p-2 ml-1 rounded-full ${
                  !input.trim() || sending
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {t('chat.security.hipaa')}
            </div>
            <button className="text-xs text-gray-400 hover:text-indigo-600 transition-colors">
              {t('chat.security.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}