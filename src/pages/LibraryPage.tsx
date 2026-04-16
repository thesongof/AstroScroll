import React from 'react';
import { motion } from 'framer-motion';
import { Library as LibraryIcon, BookOpen, Clock, TrendingUp, Database } from 'lucide-react';
import { DocumentGrid } from '../components/document/DocumentGrid';
import { useDocumentStore } from '../stores/documentStore';
import { databases } from '../data/documents';

export const LibraryPage: React.FC = () => {
  const { documents, selectedDatabase, setSelectedDatabase } = useDocumentStore();

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/30 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-gold/30 to-accent-red/30 flex items-center justify-center">
              <LibraryIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">文献库</h1>
              <p className="text-sm text-white/60">浏览全部历史文献资源</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { icon: BookOpen, label: '文献总数', value: documents.length, color: 'text-accent-gold' },
              { icon: Clock, label: '最近更新', value: '2024-01', color: 'text-accent-red' },
              { icon: TrendingUp, label: '总浏览量', value: '66K+', color: 'text-surface-dark' }
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl glass-light">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <div>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-white/40">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-accent-gold" />
          <h2 className="text-lg font-bold text-white">选择数据库</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {databases.map((db) => (
            <button
              key={db.id}
              onClick={() => setSelectedDatabase(db.id)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedDatabase === db.id
                  ? 'bg-gradient-to-br from-accent-gold/30 to-accent-red/30 border-2 border-accent-gold/50'
                  : 'glass-light hover:bg-white/10 border-2 border-transparent'
              }`}
            >
              <div className="text-2xl mb-2">{db.icon}</div>
              <p className="text-sm font-medium text-white">{db.name}</p>
              <p className="text-xs text-white/50 mt-1">{db.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      <DocumentGrid />
    </div>
  );
};
