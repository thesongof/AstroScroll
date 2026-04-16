import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Trash2, Copy, CheckCheck } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useUIStore } from '../../stores/uiStore';
import { useDocumentStore } from '../../stores/documentStore';

export const ChatDrawer: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { messages, addMessage, isLoading, setIsLoading, clearMessages } = useChatStore();
  const { setChatOpen } = useUIStore();
  const { selectedDocument } = useDocumentStore();
  const [inputValue, setInputValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage('user', userMessage);
    setIsLoading(true);

    setTimeout(() => {
      let response = '';
      if (selectedDocument) {
        if (userMessage.includes('摘要') || userMessage.includes('总结')) {
          response = `关于《${selectedDocument.title}》的摘要：\n\n${selectedDocument.summary}\n\n该文献属于${selectedDocument.dynasty}时期的${selectedDocument.type}，作者为${selectedDocument.author}。主要涉及${selectedDocument.tags.join('、')}等主题。`;
        } else if (userMessage.includes('人物') || userMessage.includes('人物关系')) {
          response = `根据《${selectedDocument.title}》的内容分析，涉及的主要人物包括：\n\n${selectedDocument.tags.slice(0, 3).map((tag, i) => `${i + 1}. ${tag}`).join('\n')}\n\n如需更详细的人物关系分析，请告诉我具体想了解哪位人物。`;
        } else if (userMessage.includes('时间') || userMessage.includes('年代')) {
          response = `《${selectedDocument.title}》所属朝代：${selectedDocument.dynasty}\n\n该时期是中国历史上重要的时期，相关历史事件和人物在当时都有重要影响。`;
        } else {
          response = `我正在分析《${selectedDocument.title}》中的相关内容...\n\n根据文献记载，${selectedDocument.author}在此文献中详细描述了${selectedDocument.tags[0]}等相关内容。这些记述对于研究${selectedDocument.dynasty}时期的历史具有重要价值。\n\n您可以问我更多关于摘要、人物、时间线等方面的问题。`;
        }
      } else {
        response = `您好！我可以帮您：\n\n1. 分析您当前查看的文献\n2. 解答历史问题\n3. 梳理历史人物关系\n4. 生成文献摘要\n\n请先选择一篇文献，或直接向我提问。`;
      }

      addMessage('assistant', response);
      setIsLoading(false);
    }, 1500);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickQuestions = [
    '请总结这篇文献的主要内容',
    '提取文中出现的主要人物',
    '这篇文献属于哪个历史时期？',
    '生成文献摘要报告'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-96 glass z-50 flex flex-col border-l border-white/10"
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-gold to-accent-red flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">AI 智能助手</h3>
                <p className="text-xs text-white/50">
                  {selectedDocument ? `正在分析: ${selectedDocument.title}` : '选择文献开始分析'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-accent-red/80 to-accent-gold/80 text-white rounded-br-md'
                      : 'glass-light text-white/90 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                  <div className={`flex items-center gap-2 mt-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 rounded hover:bg-white/10 transition-colors opacity-50 hover:opacity-100"
                    >
                      {copiedId === msg.id ? (
                        <CheckCheck className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <span className="text-xs opacity-40">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="glass-light rounded-2xl px-4 py-3 rounded-bl-md">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-accent-gold rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                        className="w-2 h-2 bg-accent-red rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                        className="w-2 h-2 bg-surface-dark rounded-full"
                      />
                    </div>
                    <span className="text-xs text-white/50">AI 正在思考...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {!selectedDocument && messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-white/40 text-center mb-4">快捷问题</p>
                {quickQuestions.map((q, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInputValue(q)}
                    className="w-full text-left px-4 py-2 rounded-xl glass-light hover:bg-white/10 transition-colors text-sm text-white/70"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={clearMessages}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                title="清空对话"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入您的问题..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-accent-gold/50 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="p-2 rounded-xl bg-gradient-to-r from-accent-gold to-accent-red text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
