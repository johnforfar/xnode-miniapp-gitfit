"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  fallback?: boolean;
}

export default function AIChatCard() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI fitness coach. I can analyze your workout data and suggest new exercises, provide form tips, or help you plan your next workout. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check Ollama status on component mount
    const checkOllamaStatus = async () => {
      try {
        const response = await fetch('/api/ollama/chat');
        const data = await response.json();
        setOllamaStatus(data.available ? 'available' : 'unavailable');
      } catch (error) {
        console.error('Failed to check Ollama status:', error);
        setOllamaStatus('unavailable');
      }
    };

    checkOllamaStatus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ollama/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          workoutContext: true
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        fallback: data.fallback
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
        fallback: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Suggest a new workout",
    "How am I doing?",
    "What should I focus on?",
    "Form tips for deadlifts"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-6 border border-blue-700 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
          🤖 AI Fitness Coach
        </h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            ollamaStatus === 'available' ? 'bg-green-400' : 
            ollamaStatus === 'unavailable' ? 'bg-red-400' : 
            'bg-yellow-400'
          }`}></div>
          <span className="text-xs text-blue-300">
            {ollamaStatus === 'available' ? 'Ollama Ready' : 
             ollamaStatus === 'unavailable' ? 'Mock Mode' : 
             'Checking...'}
          </span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-blue-900/50 rounded-lg p-4 h-64 overflow-y-auto mb-4 border border-blue-600">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-700 text-blue-100'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                {message.fallback && (
                  <p className="text-xs text-blue-300 mt-1 italic">
                    (Using mock responses - Ollama not available)
                  </p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-blue-700 text-blue-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions */}
      <div className="mb-4">
        <p className="text-blue-300 text-xs mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuestion(question)}
              className="bg-blue-700 border-blue-600 text-blue-200 hover:bg-blue-600 text-xs px-2 py-1"
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about workouts, form, or get suggestions..."
          className="flex-1 bg-blue-700 border border-blue-600 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2"
        >
          {isLoading ? "..." : "Send"}
        </Button>
      </div>

      <div className="mt-3 text-center">
        <p className="text-blue-300 text-xs">
          Powered by {ollamaStatus === 'available' ? 'Ollama Llama3.2' : 'Mock AI'} • Analyzes your workout data
        </p>
      </div>
    </div>
  );
}
