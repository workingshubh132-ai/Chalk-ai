import React from 'react';
import { Plus, Trash2, MessageSquare } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  conversations: any[];
  currentConversation: any | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
}

function Sidebar({
  isOpen,
  conversations,
  currentConversation,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
}: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => {}}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={onNewChat}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">No conversations yet</p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation._id}
                className={`p-3 rounded-lg cursor-pointer transition-colors group flex items-start justify-between gap-2 ${
                  currentConversation?._id === conversation._id
                    ? 'bg-chalk-primary text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div
                  onClick={() => onSelectConversation(conversation._id)}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <p className="font-medium truncate text-sm">{conversation.title}</p>
                  </div>
                  {conversation.preview && (
                    <p
                      className={`text-xs truncate ${
                        currentConversation?._id === conversation._id
                          ? 'text-indigo-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {conversation.preview}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-600">
          <p>Chalk AI v1.0</p>
          <p>Made with ❤️ for teachers</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
