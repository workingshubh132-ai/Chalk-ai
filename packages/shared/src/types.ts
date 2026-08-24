// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'admin';
  subject?: string;
  gradeLevel?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Chat types
export interface Message {
  id: string;
  userId: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  preview?: string;
  messages: Message[];
  documentGenerated?: DocumentMeta;
  createdAt: Date;
  updatedAt: Date;
}

// Document types
export interface DocumentMeta {
  id: string;
  type: 'spreadsheet' | 'presentation' | 'checklist' | 'lesson-plan' | 'worksheet';
  title: string;
  description?: string;
  conversationId: string;
  userId: string;
  downloadUrl?: string;
  createdAt: Date;
}

export interface Spreadsheet {
  id: string;
  title: string;
  headers: string[];
  rows: Record<string, string | number>[];
  format?: 'csv' | 'xlsx';
}

export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  theme?: 'light' | 'dark' | 'colorful';
}

export interface Slide {
  id: string;
  title: string;
  content: string;
  notes?: string;
  imageUrl?: string;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  category?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
}

// Attachment types
export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// API Request/Response types
export interface ChatRequest {
  conversationId?: string;
  message: string;
  attachments?: Attachment[];
}

export interface ChatResponse {
  conversationId: string;
  message: Message;
  suggestion?: string;
}

export interface GenerateDocumentRequest {
  conversationId: string;
  type: DocumentMeta['type'];
  title: string;
  description?: string;
}

export interface GenerateDocumentResponse {
  document: DocumentMeta;
  preview?: string;
}

// Error types
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}
