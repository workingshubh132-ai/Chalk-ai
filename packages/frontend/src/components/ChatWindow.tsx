import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Loader } from 'lucide-react';
import DocumentMenu from './DocumentMenu';

interface ChatWindowProps {
  messages: any[];
  loading: boolean;
  onSendMessage: (message: string) => void;
  onGenerateDocument: (type: string, title: string, description?: string) => void;
  conversationId?: string;
}

function ChatWindow({
  messages,
  loading,
  onSendMessage,
  onGenerateDocument,
  conversationId,
}: ChatWindowProps) {
  const [input, setInput] = useState('');
  const [showDocumentMenu, setShowDocumentMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-5xl mb-4">🎓</div>
            <p className="text-lg font-semibold">Welcome to Chalk AI</p>
            <p className="text-sm">Start a conversation to create lesson plans, sheets, and more</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md lg:max-w-2xl p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-chalk-primary text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 p-4 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Document Menu */}
      {showDocumentMenu && conversationId && (
        <DocumentMenu onSelect={(type, title) => {
          onGenerateDocument(type, title);
          setShowDocumentMenu(false);
        }} />
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowDocumentMenu(!showDocumentMenu)}
            className="btn-icon hover:bg-gray-100 text-chalk-primary"
            title="Generate Document"
          >
            <FileText className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Chalk AI anything..."
            disabled={loading}
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary hover:enabled:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;
