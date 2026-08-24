import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatService, documentService } from '../services/api';
import ChatWindow from '../components/ChatWindow';
import Sidebar from '../components/Sidebar';
import { Menu, LogOut } from 'lucide-react';

function ChatPage() {
  const auth = React.useContext(require('../context/AuthContext').AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversation, setCurrentConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await chatService.getConversations();
      setConversations(response.data);
      if (response.data.length > 0) {
        loadConversation(response.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadConversation = async (id: string) => {
    try {
      const response = await chatService.getConversation(id);
      setCurrentConversation(response.data);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleSendMessage = async (text: string) => {
    setLoading(true);
    try {
      const response = await chatService.sendMessage(currentConversation?._id, text);
      setCurrentConversation(response.data.conversationId);
      setMessages((prev) => [
        ...prev,
        { id: 'temp', role: 'user', content: text },
        response.data.message,
      ]);
      loadConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDocument = async (type: string, title: string, description?: string) => {
    if (!currentConversation) return;
    try {
      await documentService.generate(currentConversation._id, type, title, description);
      loadConversation(currentConversation._id);
    } catch (error) {
      console.error('Failed to generate document:', error);
    }
  };

  const handleNewChat = () => {
    setCurrentConversation(null);
    setMessages([]);
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await chatService.deleteConversation(id);
      loadConversations();
      if (currentConversation?._id === id) {
        handleNewChat();
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={loadConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn-icon lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">🎓 Chalk AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{auth.user?.name}</span>
            <button
              onClick={() => {
                auth.logout();
                window.location.href = '/login';
              }}
              className="btn-icon"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Window */}
        <ChatWindow
          messages={messages}
          loading={loading}
          onSendMessage={handleSendMessage}
          onGenerateDocument={handleGenerateDocument}
          conversationId={currentConversation?._id}
        />
      </div>
    </div>
  );
}

export default ChatPage;
