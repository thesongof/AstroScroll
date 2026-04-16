import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Share2,
  Copy,
  CheckCheck
} from 'lucide-react';
import { useDocumentStore } from '../stores/documentStore';
import { Document } from '../types';

export const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { documents, setSelectedDocument } = useDocumentStore();
  const [copied, setCopied] = useState(false);

  const document = documents.find((d) => d.id === id);

  useEffect(() => {
    if (document) {
      setSelectedDocument(document);
    }
    return () => setSelectedDocument(null);
  }, [document, setSelectedDocument]);

  if (!document) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl text-white/70">文献未找到</h2>
        <Link to="/library" className="text-accent-gold hover:underline mt-4 inline-block">
          返回文献库
        </Link>
      </div>
    );
  }

  const handleCopyContent = () => {
    navigator.clipboard.writeText(document.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedDocs = documents
    .filter((d) => d.id !== document.id && (d.dynasty === document.dynasty || d.type === document.type))
    .slice(0, 3);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          to="/library"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          返回文献库
        </Link>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-accent-gold/90 text-xs font-medium text-primary">
                {document.dynasty}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs text-white">
                {document.type}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              {document.title}
            </h1>
            <p className="text-lg text-white/70">{document.author}</p>
          </div>

          <div className="p-6">
            <p className="text-white/80 leading-relaxed mb-6">
              {document.summary}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-accent-gold" />
                    <h3 className="font-bold text-white">PDF 原文</h3>
                  </div>
                  <a
                    href={document.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-light hover:bg-white/10 text-white/60 transition-all text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    新窗口打开
                  </a>
                </div>
                <div className="p-4">
                  <div className="bg-white rounded-xl overflow-hidden" style={{ height: '70vh' }}>
                    {document.pdfUrl ? (
                      <iframe
                        src={`${document.pdfUrl}#toolbar=0`}
                        className="w-full h-full"
                        title={document.title}
                      />
                    ) : (
                      <div className="text-center text-gray-400 p-8">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-base">暂无 PDF</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-accent-red" />
                    <h3 className="font-bold text-white">文字稿</h3>
                  </div>
                  <button
                    onClick={handleCopyContent}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-light hover:bg-white/10 text-white/60 transition-all text-sm"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="w-4 h-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制全文
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 overflow-y-auto" style={{ maxHeight: '600px' }}>
                  <p className="whitespace-pre-wrap text-white/90 leading-relaxed text-base">
                    {document.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {relatedDocs.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">相关文献</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedDocs.map((doc, index) => (
              <RelatedDocumentCard key={doc.id} document={doc} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const RelatedDocumentCard: React.FC<{ document: Document; index: number }> = ({ document, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/document/${document.id}`}>
        <div className="glass rounded-xl overflow-hidden hover-lift cursor-pointer">
          <div className="flex gap-4 p-4">
            <img
              src={document.coverUrl}
              alt={document.title}
              className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white line-clamp-2 mb-1 hover:text-accent-gold transition-colors">
                {document.title}
              </h3>
              <p className="text-sm text-white/60 mb-2">{document.author}</p>
              <span className="text-xs text-accent-gold">{document.dynasty}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
