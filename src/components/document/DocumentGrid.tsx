import React from 'react';
import { motion } from 'framer-motion';
import { Grid, List, Search, Filter, X } from 'lucide-react';
import { useDocumentStore } from '../../stores/documentStore';
import { DocumentCard } from './DocumentCard';
import { Document } from '../../types';
import { dynasties, documentTypes } from '../../data/documents';

export const DocumentGrid: React.FC = () => {
  const {
    filteredDocuments,
    viewMode,
    setViewMode,
    selectedDynasty,
    setSelectedDynasty,
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery
  } = useDocumentStore();

  const documents = filteredDocuments();

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/50" />
              <span className="text-sm text-white/70">筛选:</span>
            </div>

            <select
              value={selectedDynasty}
              onChange={(e) => setSelectedDynasty(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/80 outline-none focus:border-accent-gold/50 transition-colors cursor-pointer"
            >
              {dynasties.map((d) => (
                <option key={d} value={d} className="bg-primary">
                  {d}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/80 outline-none focus:border-accent-gold/50 transition-colors cursor-pointer"
            >
              {documentTypes.map((t) => (
                <option key={t} value={t} className="bg-primary">
                  {t}
                </option>
              ))}
            </select>

            {(selectedDynasty !== '全部' || selectedType !== '全部' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedDynasty('全部');
                  setSelectedType('全部');
                  setSearchQuery('');
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent-red/20 text-accent-red text-xs hover:bg-accent-red/30 transition-colors"
              >
                <X className="w-3 h-3" />
                清除筛选
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-white/50">
              共 {documents.length} 篇文献
            </span>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-accent-gold/20 text-accent-gold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-accent-gold/20 text-accent-gold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {documents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-12 text-center"
        >
          <Search className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white/70 mb-2">未找到相关文献</h3>
          <p className="text-sm text-white/40">
            尝试调整筛选条件或搜索关键词
          </p>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map((doc, index) => (
            <DocumentCard key={doc.id} document={doc} index={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <DocumentListItem key={doc.id} document={doc} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

const DocumentListItem: React.FC<{ document: Document; index: number }> = ({ document, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ x: 4 }}
      className="glass rounded-xl overflow-hidden hover-lift"
    >
      <a href={`/document/${document.id}`} className="flex gap-4 p-4">
        <img
          src={document.coverUrl}
          alt={document.title}
          className="w-24 h-32 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="font-bold text-white hover:text-accent-gold transition-colors">
                {document.title}
              </h3>
              <p className="text-sm text-white/60">{document.author}</p>
            </div>
            <span className="px-2 py-1 rounded-full bg-accent-gold/20 text-accent-gold text-xs">
              {document.dynasty}
            </span>
          </div>
          <p className="text-sm text-white/50 line-clamp-2 mb-3">
            {document.summary}
          </p>
          <div className="flex flex-wrap gap-2">
            {document.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </a>
    </motion.div>
  );
};
