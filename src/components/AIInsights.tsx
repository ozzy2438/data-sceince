import React from 'react';
import { MessageSquare } from 'lucide-react';
import ChatInput from './ChatInput';

interface AIInsightsProps {
  insights: string | null;
  isLoading: boolean;
  onSendMessage?: (message: string) => void;
}

export default function AIInsights({ insights, isLoading, onSendMessage }: AIInsightsProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 bg-gray-700 rounded-full mr-2" />
          <div className="h-4 bg-gray-700 rounded w-48" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-700 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center">
        <MessageSquare className="w-6 h-6 mr-3 text-indigo-400" />
        AI-Powered Insights
      </h2>
      <div className="space-y-4">
        {insights.split('\n').map((line, index) => (
          <p key={index} className="text-white font-medium leading-relaxed text-lg mb-6">
            {line}
          </p>
        ))}
      </div>
      <div className="mt-8 border-t border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Ask Questions</h3>
        <ChatInput
          onSendMessage={onSendMessage || console.log}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}