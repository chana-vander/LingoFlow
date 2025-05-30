"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  Loader,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ChatMessage } from "../models/chat";
import "../css/chat.css";
import { Avatar } from "@mui/material";
import userStore from "../stores/userStore";

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChat = ({ isOpen, onClose }: AIChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "שלום! אני העוזר שלך ללימוד שפות. איך אפשר לעזור לך היום?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const avatarRef = useRef(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current && !isMinimized && isOpen) {
      inputRef.current.focus();
    }
  }, [isMinimized, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const messageHistory = [
        ...messages.filter((msg) => msg.id !== "welcome"),
        userMessage,
      ].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("http://localhost:5092/api/ChatAi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messageHistory }),
      });

      const data = await response.json();

      if (response.status === 418) {
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: "נטפרי לא מרשה לי לדבר איתך על זה",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        return;
      }

      if (!response.ok) {
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: data?.content || "לא הצלחתי להבין את השאלה. נסה שוב.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        return;
      }

      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.content || "לא בטוח איך לענות על זה.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("AI chat error:", error);
      setError(`שגיאה בקבלת תשובה: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`ai-chat-container ${isMinimized ? "minimized" : ""}`}>
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <Bot size={20} />
          <span>Lingo Assistant</span>
        </div>
        <div className="ai-chat-controls">
          <button className="ai-chat-control-button" onClick={toggleMinimize}>
            {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button className="ai-chat-control-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="ai-chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-chat-message ${message.role}`}
              >
                {/* <div className="ai-chat-message-avatar">
                  {message.role === "assistant" ? (
                    <Bot size={20} />
                  ) : (
                    <User size={20} />
                  )}
                </div> */}
                <div className="ai-chat-message-avatar">
                  {message.role === "assistant" ? (
                    <Bot size={20} />
                  ) : (
                    <Avatar
                      ref={avatarRef}
                      sx={{
                        bgcolor: userStore.isAdmin ? "#FFD700" : "#1976d2",
                        width: 35,
                        height: 35 ,
                        fontSize: "1rem",
                        cursor: "pointer",
                        border: "2px solid red",
                      }}
                    >
                      {userStore.userName}
                    </Avatar>
                  )}
                </div>

                <div className="ai-chat-message-content">
                  <div className="ai-chat-message-text">{message.content}</div>
                  <div className="ai-chat-message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="ai-chat-message assistant">
                <div className="ai-chat-message-avatar">
                  <Bot size={20} />
                </div>
                <div className="ai-chat-message-content">
                  <div className="ai-chat-message-text typing">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="ai-chat-error">
                <p>{error}</p>
                <p>נסה שוב או שאל שאלה שונה.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-chat-input-container">
            <textarea
              ref={inputRef}
              className="ai-chat-input"
              placeholder="שאל אותי כל דבר שקשור ללימוד שפה..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />
            <button
              className="ai-chat-send-button"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader size={18} className="spinner" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AIChat;
