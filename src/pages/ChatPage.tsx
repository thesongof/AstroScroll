import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Trash2, Copy, CheckCheck, BookOpen } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useDocumentStore } from '../stores/documentStore';
import { Link } from 'react-router-dom';

const quickActions = [
  { label: '总结文献要点', prompt: '请总结当前文献的主要内容和核心观点' },
  { label: '提取关键人物', prompt: '请分析文献中提到的重要人物及其关系' },
  { label: '梳理历史时间线', prompt: '请根据文献内容梳理相关历史事件的时间顺序' },
  { label: '分析文献背景', prompt: '请分析这篇文献产生的历史背景和时代意义' },
  { label: '对比同类文献', prompt: '请将这篇文献与其他同类型文献进行对比分析' },
  { label: '提出研究问题', prompt: '基于这篇文献，有哪些值得深入研究的问题？' }
];

export const ChatPage: React.FC = () => {
  const { messages, addMessage, isLoading, setIsLoading, clearMessages } = useChatStore();
  const { selectedDocument } = useDocumentStore();
  const [inputValue, setInputValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage('user', userMessage);
    setIsLoading(true);

    setTimeout(() => {
      let response = '';
      if (selectedDocument) {
        const keywords = ['总结', '摘要', '概括'];
        const isSummary = keywords.some(k => userMessage.includes(k));

        if (isSummary) {
          response = `## 《${selectedDocument.title}》文献摘要

### 基本信息
- **作者**: ${selectedDocument.author}
- **朝代**: ${selectedDocument.dynasty}
- **类型**: ${selectedDocument.type}

### 内容概要
${selectedDocument.summary}

### 核心主题
${selectedDocument.tags.map(tag => `- ${tag}`).join('\n')}

### 学术价值
该文献是研究${selectedDocument.dynasty}历史的重要一手资料，对于了解当时的社会制度、思想文化具有重要的参考价值。

---
*以上内容由AI自动生成，仅供参考*`;
        } else if (userMessage.includes('人物')) {
          response = `## 《${selectedDocument.title}》人物分析

根据文献内容分析，主要涉及以下人物：

${selectedDocument.tags.slice(0, 4).map((tag, i) => `### ${i + 1}. ${tag}
- 身份：文献中的重要提及对象
- 相关情节：与${selectedDocument.tags[0]}密切相关
`).join('\n')}

### 人物关系
文献中的人物关系以${selectedDocument.tags[0]}为核心，呈现 出复杂的社会网络和历史背景。

---
*分析结果由AI生成*`;
        } else if (userMessage.includes('时间') || userMessage.includes('历史')) {
          response = `## 历史背景分析

**所属时代**: ${selectedDocument.dynasty}

${selectedDocument.dynasty}时期是中国历史上重要的阶段，这一时期的政治、经济、文化发展对后世产生了深远影响。

《${selectedDocument.title}》正是诞生于这一历史时期的重要文献，记录了当时的社会风貌和思想动态。

### 历史意义
1. 为研究${selectedDocument.dynasty}提供了珍贵的第一手资料
2. 反映了当时的思想潮流和文化特征
3. 对于理解中国历史发展脉络具有重要价值

---
*分析结果由AI生成*`;
        } else {
          response = `## AI 分析结果

关于您的提问："${userMessage}"

根据《${selectedDocument.title}》的内容，我提供以下分析：

### 文本解读
${selectedDocument.content.substring(0, 200)}...

### 相关背景
该文献属于${selectedDocument.dynasty}时期的${selectedDocument.type}，由${selectedDocument.author}创作。主要涉及${selectedDocument.tags.join('、')}等主题。

### 延伸思考
建议结合同类型的其他文献进行对比分析，以获得更全面的认识。

---
*分析结果由AI生成*`;
        }
      } else {
        response = `## 欢迎使用 星卷(AstroScroll) AI 助手

您好！我是您的历史文献研究助手。我可以帮您：

### 功能概览
1. **文献分析** - 分析文献内容、提取关键信息
2. **人物关系** - 梳理历史人物及其相互关系
3. **时间线梳理** - 整理历史事件的时间脉络
4. **背景研究** - 分析文献产生的历史背景
5. **对比研究** - 将同类文献进行对比分析

### 使用方式
- 在左侧选择一篇文献后，直接向我提问
- 或使用下方的快捷问题开始分析

请先选择一篇文献，或直接输入您的问题！`;
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

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl flex-1 flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-gold to-accent-red flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI 智能对话</h1>
            <p className="text-sm text-white/50">
              {selectedDocument
                ? `正在分析: ${selectedDocument.title}`
                : '请先选择一篇文献开始分析'}
            </p>
          </div>
          <button
            onClick={clearMessages}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl glass-light hover:bg-white/10 text-white/60 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            清空对话
          </button>
        </div>

        {!selectedDocument && (
          <div className="px-6 py-4 border-b border-white/10 bg-accent-gold/5">
            <div className="flex items-center gap-3 text-sm text-white/70">
              <BookOpen className="w-4 h-4 text-accent-gold" />
              <span>建议先选择文献以获得更精准的分析</span>
              <Link to="/library" className="text-accent-gold hover:underline ml-2">
                去选择文献 →
              </Link>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-accent-red/80 to-accent-gold/80 text-white rounded-br-md'
                    : 'glass-light text-white/90 rounded-bl-md'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                    <Sparkles className="w-4 h-4 text-accent-gold" />
                    <span className="text-xs text-white/50 font-medium">AI 助手</span>
                  </div>
                )}
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>
                <div className={`flex items-center gap-2 mt-3 pt-2 border-t border-white/10 ${msg.role === 'user' ? 'justify-end' : ''}`}>
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
              <div className="glass-light rounded-2xl px-6 py-4 rounded-bl-md">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <motion.span
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2.5 h-2.5 bg-accent-gold rounded-full"
                    />
                    <motion.span
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                      className="w-2.5 h-2.5 bg-accent-red rounded-full"
                    />
                    <motion.span
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                      className="w-2.5 h-2.5 bg-surface-dark rounded-full"
                    />
                  </div>
                  <span className="text-sm text-white/50">AI 正在分析...</span>
                </div>
              </div>
            </motion.div>
          )}

          {messages.length === 1 && (
            <div className="space-y-3 mt-6">
              <p className="text-xs text-white/40 text-center">快捷操作</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInputValue(action.prompt)}
                    className="text-left px-4 py-3 rounded-xl glass-light hover:bg-white/10 transition-colors text-sm text-white/70"
                  >
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={selectedDocument ? "输入您的问题..." : "请先选择文献再开始对话"}
              disabled={isLoading}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-white placeholder-white/30 outline-none focus:border-accent-gold/50 transition-colors disabled:opacity-50"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 rounded-2xl bg-gradient-to-r from-accent-gold to-accent-red text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
