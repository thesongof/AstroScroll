import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { DocumentGrid } from '../components/document/DocumentGrid';
import { useDocumentStore } from '../stores/documentStore';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { searchQuery, setSearchQuery } = useDocumentStore();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams, setSearchQuery]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-gold/30 to-accent-red/30 flex items-center justify-center">
            <SearchIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">搜索结果</h1>
            <p className="text-sm text-white/60">
              {searchQuery ? (
                <>关键词: "<span className="text-accent-gold">{searchQuery}</span>"</>
              ) : (
                '请输入搜索关键词'
              )}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="relative max-w-2xl">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文献、作者、关键词..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/30 outline-none focus:border-accent-gold/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {searchQuery && <DocumentGrid />}
    </div>
  );
};
