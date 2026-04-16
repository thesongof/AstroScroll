import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Document } from '../types';
import { mockDocuments } from '../data/documents';

interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  searchQuery: string;
  selectedDynasty: string;
  selectedType: string;
  selectedDatabase: string;
  viewMode: 'grid' | 'list';
  tags: string[];
  filteredDocuments: () => Document[];
  setSelectedDocument: (doc: Document | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedDynasty: (dynasty: string) => void;
  setSelectedType: (type: string) => void;
  setSelectedDatabase: (database: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  addDocument: (doc: Document) => void;
  updateDocument: (id: string, data: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  addTag: (tag: string) => void;
  deleteTag: (tag: string) => void;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: mockDocuments,
      selectedDocument: null,
      searchQuery: '',
      selectedDynasty: '全部',
      selectedType: '全部',
      selectedDatabase: 'all',
      viewMode: 'grid',
      tags: ['秦始皇', '统一六国', '郡县制', '三国', '赤壁之战', '曹操', '孙权', '刘备', '儒家', '仁义', '修身', '教育', '诸葛亮', '蜀汉', '北伐', '宋代', '都市生活', '民俗', '汴京', '道家', '无为', '哲学', '宇宙观', '辛弃疾', '豪放派', '爱国', '怀古', '科技', '石油', '沈括', '宋代科学'],

      filteredDocuments: () => {
        const { documents, searchQuery, selectedDynasty, selectedType, selectedDatabase } = get();
        return documents.filter(doc => {
          const matchesSearch = searchQuery === '' ||
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
          const matchesDynasty = selectedDynasty === '全部' || doc.dynasty === selectedDynasty;
          const matchesType = selectedType === '全部' || doc.type === selectedType;
          const matchesDatabase = selectedDatabase === 'all' || doc.database === selectedDatabase;
          return matchesSearch && matchesDynasty && matchesType && matchesDatabase;
        });
      },

      setSelectedDocument: (doc) => set({ selectedDocument: doc }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedDynasty: (dynasty) => set({ selectedDynasty: dynasty }),
      setSelectedType: (type) => set({ selectedType: type }),
      setSelectedDatabase: (database) => set({ selectedDatabase: database }),
      setViewMode: (mode) => set({ viewMode: mode }),

      addDocument: (doc) => set((state) => ({
        documents: [doc, ...state.documents]
      })),

      updateDocument: (id, data) => set((state) => ({
        documents: state.documents.map(doc =>
          doc.id === id ? { ...doc, ...data } : doc
        )
      })),

      deleteDocument: (id) => set((state) => ({
        documents: state.documents.filter(doc => doc.id !== id)
      })),

      addTag: (tag) => set((state) => {
        if (state.tags.includes(tag)) return state;
        return { tags: [...state.tags, tag] };
      }),

      deleteTag: (tag) => set((state) => ({
        tags: state.tags.filter(t => t !== tag)
      })),
    }),
    {
      name: 'astro-scroll-documents',
    }
  )
);
