"use client";
import React, { useState, useRef, useEffect } from "react";
// import { CHATBOT_CONFIG } from "../config/chatbot";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ApiResponse {
  message: string;
  status: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Fydaa's AI assistant. Choose a topic below to get a quick answer.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  // const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousChat, setPreviousChat] = useState<Message[] | null>(null);
  const [previousChatTimestamp, setPreviousChatTimestamp] = useState<Date | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const inputRef = useRef<HTMLInputElement>(null);
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Predefined FAQ options
  const faqOptions: { id: string; question: string; answer: string }[] = [
    {
      id: "opt1",
      question: "What is fydaa?",
      answer:
        "Fydaa is a SEBI-registered investment advisory platform by Multistrato Capital Advisors Private Limited, based in Mumbai. It offers personalized wealth management through a mobile app, helping users build multi-asset portfolios . After KYC and a risk assessment, Fydaa creates tailored portfolios for long-term growth, supports goal-based planning, and provides analytics.",
    },
    {
      id: "opt2",
      question: "What is sip? ",
      answer:
        "SIP stands for Systematic Investment Plan.It’s a disciplined method of investing in mutual funds, where you invest a fixed amount regularly like monthly or quarterly instead of investing a lump sum at once.",
    },
    {
      id: "opt3",
      question: "What is mutual fund?",
      answer:
        "A Mutual Fund is a type of investment vehicle that collects money from many investors and invests it in a diversified portfolio of assets like stocks, bonds, gold, or other securities — all managed by professional fund managers.",
    },
    {
      id: "opt4",
      question: "What does Fydaa provide?",
      answer:
        "Fydaa provides personalized wealth management through a mobile app, helping users build multi-asset portfolios . After KYC and a risk assessment, Fydaa creates tailored portfolios for long-term growth, supports goal-based planning, and provides analytics.",
    },
    {
      id: "opt5",
      question: "Contact support?",
      answer:
        "You can reach Fydaa support at support@fydaa.com or call +91 9136935300.",
    },
  ];

  // // Get conversation history (last 10 messages)
  // const getConversationHistory = () => {
  //   return messages.slice(-CHATBOT_CONFIG.MAX_HISTORY).map(msg => ({
  //     role: msg.isUser ? "user" : "assistant",
  //     content: msg.text
  //   }));
  // };

  // Clear chat after 3 minutes of inactivity
  const resetClearTimeout = () => {
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
    }
    
    clearTimeoutRef.current = setTimeout(() => {
      // Store current chat as previous chat before clearing
      if (messages.length > 1) { // Only store if there's more than just the welcome message
        setPreviousChat([...messages]);
        setPreviousChatTimestamp(new Date());
      }
      
      setMessages([
        {
          id: "1",
          text: "Hello! I'm Fydaa's AI assistant. How can I help you with your financial planning today?",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      setError(null);
    }, 3 * 60 * 1000); // 3 minutes
  };

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens and reset timeout
  useEffect(() => {
    // if (isOpen && inputRef.current) {
    //   inputRef.current.focus();
    // }
    resetClearTimeout();
  }, [isOpen]);

  // const handleSendMessage = async () => {
  //   if (!inputValue.trim() || isLoading) return;
  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     text: inputValue.trim(),
  //     isUser: true,
  //     timestamp: new Date(),
  //   };
  //   setMessages((prev) => [...prev, userMessage]);
  //   const currentInput = inputValue.trim();
  //   setInputValue("");
  //   setIsTyping(true);
  //   setIsLoading(true);
  //   setError(null);
  //   resetClearTimeout();
  //   try {
  //     const controller = new AbortController();
  //     const timeoutId = setTimeout(() => controller.abort(), CHATBOT_CONFIG.TIMEOUT);
  //     const response = await fetch(CHATBOT_CONFIG.API_ENDPOINT, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         message: currentInput,
  //         conversation_history: getConversationHistory(),
  //       }),
  //       signal: controller.signal,
  //     });
  //     clearTimeout(timeoutId);
  //     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  //     const data: ApiResponse = await response.json();
  //     const aiResponse: Message = {
  //       id: (Date.now() + 1).toString(),
  //       text:
  //         data.message ||
  //         "I'm sorry, I couldn't process your request. Please try again.",
  //       isUser: false,
  //       timestamp: new Date(),
  //     };
  //     setMessages((prev) => [...prev, aiResponse]);
  //     resetClearTimeout();
  //   } catch (error) {
  //     console.error("Error calling chatbot API:", error);
  //     let errorMessage =
  //       "I'm sorry, I'm having trouble connecting right now. Please try again later or contact our support team.";
  //     if (error instanceof Error) {
  //       if (error.name === "AbortError") {
  //         errorMessage = "Request timed out. Please try again with a shorter message.";
  //       } else if (error.message.includes("Failed to fetch")) {
  //         errorMessage =
  //           "Unable to connect to the server. Please check your internet connection.";
  //       } else if (error.message.includes("HTTP error")) {
  //         errorMessage = "Server error occurred. Please try again later.";
  //       }
  //     }
  //     setError(errorMessage);
  //     const errorResponse: Message = {
  //       id: (Date.now() + 1).toString(),
  //       text: errorMessage,
  //       isUser: false,
  //       timestamp: new Date(),
  //     };
  //     setMessages((prev) => [...prev, errorResponse]);
  //     resetClearTimeout();
  //   } finally {
  //     setIsTyping(false);
  //     setIsLoading(false);
  //   }
  // };

  // const handleKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter" && !e.shiftKey && !isLoading) {
  //     e.preventDefault();
  //     handleSendMessage();
  //   }
  // };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const startNewChat = () => {
    // Store current chat as previous chat before starting new
    if (messages.length > 1) { // Only store if there's more than just the welcome message
      setPreviousChat([...messages]);
      setPreviousChatTimestamp(new Date());
    }
    
    setMessages([
      {
        id: "1",
        text: "Hello! I'm Fydaa's AI assistant. How can I help you with your financial planning today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setError(null);
    resetClearTimeout();
  };

  const selectOption = (option: { question: string; answer: string }) => {
    const userMessage: Message = {
      id: `${Date.now()}-q`,
      text: option.question,
      isUser: true,
      timestamp: new Date(),
    };
    const aiMessage: Message = {
      id: `${Date.now()}-a`,
      text: option.answer,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage, aiMessage]);
    resetClearTimeout();
  };

  const restorePreviousChat = () => {
    if (previousChat && previousChatTimestamp) {
      const timeDiff = Date.now() - previousChatTimestamp.getTime();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (timeDiff <= fiveMinutes) {
        setMessages(previousChat);
        setError(null);
        resetClearTimeout();
      } else {
        // Previous chat is older than 5 minutes, clear it
        setPreviousChat(null);
        setPreviousChatTimestamp(null);
      }
    }
  };

  const canRestorePreviousChat = () => {
    if (!previousChat || !previousChatTimestamp) return false;
    const timeDiff = Date.now() - previousChatTimestamp.getTime();
    const fiveMinutes = 5 * 60 * 1000;
    return timeDiff <= fiveMinutes;
  };

  return (
    <div className="fixed bottom-4 right-4 z-[1000] sm:bottom-6 sm:right-6">
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 w-full h-full bg-white/30 backdrop-blur-lg border-0 rounded-none sm:relative sm:inset-auto sm:mb-4 sm:w-80 sm:h-96 sm:rounded-[20px] sm:border sm:border-white/20 shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white/20 backdrop-blur-sm px-4 py-3 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="/Fydaalogo.webp"
                    alt="Fydaa Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-black font-semibold text-sm font-gilroy">
                    Fydaa Assistant
                  </h3>
                  <p className="text-gray-600 text-xs">Online now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {canRestorePreviousChat() && (
                  <button
                    onClick={restorePreviousChat}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                    title="Restore previous chat"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={startNewChat}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                  title="Start new chat"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                  title="Close chat"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-[12px] ${
                    message.isUser
                      ? "bg-black text-white rounded-br-[4px]"
                      : "bg-white/40 text-black rounded-bl-[4px]"
                  }`}
                >
                  <p className="text-sm font-inter">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/40 text-black rounded-[12px] rounded-bl-[4px] px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <span className="text-xs text-gray-500">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex justify-start">
                <div className="bg-red-100/80 text-red-800 rounded-[12px] rounded-bl-[4px] px-3 py-2 max-w-[80%]">
                  <p className="text-sm font-inter">{error}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Options - compact, in a row, wrapping */}
          <div className="px-4 py-2 border-t border-white/20 bg-white/10">
            <div className="grid grid-cols-2 gap-2">
              {faqOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => selectOption(opt)}
                  className="w-full px-2 py-1 text-[10px] sm:text-[11px] bg-white/70 text-black border border-white/40 rounded-[10px] hover:bg-white transition-colors duration-200 text-left whitespace-normal break-words leading-tight min-w-0"
                  title={opt.question}
                >
                  {opt.question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className={`w-12 h-12 sm:w-14 sm:h-14 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center ${
          isOpen ? "hidden" : ""
        }`}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    </div>
  );
};

export default Chatbot;
