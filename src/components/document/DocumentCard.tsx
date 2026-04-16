import React from 'react';
import { motion } from 'framer-motion';
import { Eye, BookOpen, Clock, FileText } from 'lucide-react';
import { Document } from '../../types';
import { Link } from 'react-router-dom';

interface DocumentCardProps {
  document: Document;
  index: number;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={`/document/${document.id}`}>
        <div className="glass rounded-2xl overflow-hidden hover-lift cursor-pointer h-full flex flex-col">
          <div className="relative h-48 overflow-hidden bg-surface-dark">
            {document.pdfUrl ? (
              <iframe
                src={`${document.pdfUrl}#toolbar=0&page=1`}
                className="w-full h-full"
                title={document.title}
              />
            ) : document.coverUrl ? (
              <img
                src={document.coverUrl}
                alt={document.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileText className="w-12 h-12 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />

            <div className="absolute top-3 right-3 flex gap-2">
              <span className="px-2 py-1 rounded-full bg-accent-gold/90 text-xs font-medium text-primary">
                {document.dynasty}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-bold text-lg text-white line-clamp-2 mb-1 group-hover:text-accent-gold transition-colors">
                {document.title}
              </h3>
              <p className="text-sm text-white/70">{document.author}</p>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <p className="text-sm text-white/60 line-clamp-2 flex-1 mb-3">
              {document.summary}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {document.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {document.viewCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {document.type}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs text-white/40">
                <Clock className="w-3 h-3" />
                {document.createdAt}
              </span>
            </div>
          </div>

          <motion.div
            className="absolute inset-0 border-2 border-transparent group-hover:border-accent-gold/30 rounded-2xl pointer-events-none transition-colors"
          />
        </div>
      </Link>
    </motion.div>
  );
};
