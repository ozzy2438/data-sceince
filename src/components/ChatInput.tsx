import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
        placeholder="Ask a question about your data..."
        className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-lg pr-12 
                   text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                   focus:ring-indigo-400 focus:border-transparent transition-all text-lg"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="absolute right-3 top-1/2 transform -translate-y-1/2
                   text-indigo-400 hover:text-indigo-300 disabled:text-gray-600
                   transition-colors focus:outline-none disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}