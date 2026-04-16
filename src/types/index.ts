export interface Document {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  type: string;
  database: string;
  tags: string[];
  summary: string;
  content: string;
  pdfUrl: string;
  coverUrl: string;
  createdAt: string;
  viewCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AnalysisResult {
  wordFrequency: { word: string; count: number }[];
  sentiment: { positive: number; negative: number; neutral: number };
  keyPersons: { name: string; count: number }[];
  timeline: { year: string; event: string }[];
}
