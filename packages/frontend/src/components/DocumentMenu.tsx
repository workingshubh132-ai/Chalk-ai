import React, { useState, useEffect } from 'react';
import { documentService } from '../services/api';
import { X } from 'lucide-react';

interface DocumentMenuProps {
  onSelect: (type: string, title: string) => void;
}

function DocumentMenu({ onSelect }: DocumentMenuProps) {
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDocumentTypes();
  }, []);

  const loadDocumentTypes = async () => {
    try {
      const response = await documentService.getTypes();
      setDocumentTypes(response.data.types);
      if (response.data.types.length > 0) {
        setSelectedType(response.data.types[0].id);
      }
    } catch (error) {
      console.error('Failed to load document types:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedType) return;
    setLoading(true);
    onSelect(selectedType, title);
    setTitle('');
    setDescription('');
  };

  const selectedDocType = documentTypes.find((t) => t.id === selectedType);

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-2xl mx-auto">
        <h3 className="font-semibold text-gray-900 mb-4">Generate Document</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Document Type Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {documentTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`p-3 rounded-lg text-center transition-all ${
                  selectedType === type.id
                    ? 'bg-chalk-primary text-white border-2 border-chalk-primary'
                    : 'bg-gray-100 text-gray-900 border-2 border-gray-200 hover:border-chalk-primary'
                }`}
              >
                <div className="text-xl mb-1">{type.icon}</div>
                <div className="text-xs font-medium truncate">{type.label}</div>
              </button>
            ))}
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedDocType?.label} Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 'Grade 10 Math Final Exam'"
              className="input-field"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any specific requirements or details..."
              className="input-field resize-none h-20"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button type="submit" disabled={loading || !title.trim()} className="btn-primary flex-1">
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DocumentMenu;
