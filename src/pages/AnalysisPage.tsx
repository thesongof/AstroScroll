import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Download,
  ArrowLeft,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  RefreshCw,
  Eye,
  Heart
} from 'lucide-react';
import { useDocumentStore } from '../stores/documentStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

const COLORS = ['#d4af37', '#e94560', '#bd93f9', '#0f3460', '#16213e', '#f8f8f2'];

export const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { documents, setSelectedDocument } = useDocumentStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'wordfreq' | 'sentiment' | 'timeline'>('overview');

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
        <h2 className="text-2xl text-white/70">请先选择一篇文献</h2>
        <Link to="/library" className="text-accent-gold hover:underline mt-4 inline-block">
          返回文献库选择
        </Link>
      </div>
    );
  }

  const wordFrequencyData = [
    { word: '皇帝', count: 45 },
    { word: '天下', count: 38 },
    { word: '诸侯', count: 32 },
    { word: '战争', count: 28 },
    { word: '统一', count: 25 },
    { word: '制度', count: 22 },
    { word: '文化', count: 18 },
    { word: '经济', count: 15 }
  ];

  const sentimentData = [
    { name: '积极', value: 35, color: '#d4af37' },
    { name: '中性', value: 45, color: '#0f3460' },
    { name: '消极', value: 20, color: '#e94560' }
  ];

  const timelineData = [
    { year: '公元前221年', event: '秦统一六国', type: 'political' },
    { year: '公元前215年', event: '秦始皇北击匈奴', type: 'military' },
    { year: '公元前213年', event: '焚书坑儒', type: 'cultural' },
    { year: '公元前210年', event: '秦始皇崩', type: 'political' },
    { year: '公元前206年', event: '秦朝灭亡', type: 'political' }
  ];

  const monthlyViewsData = [
    { month: '1月', views: 1200 },
    { month: '2月', views: 1800 },
    { month: '3月', views: 2400 },
    { month: '4月', views: 2100 },
    { month: '5月', views: 2800 },
    { month: '6月', views: 3200 }
  ];

  const tabs = [
    { id: 'overview', label: '总览', icon: BarChart3 },
    { id: 'wordfreq', label: '词频统计', icon: TrendingUp },
    { id: 'sentiment', label: '情感分析', icon: Heart },
    { id: 'timeline', label: '时间线', icon: Calendar }
  ];

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

        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <img
              src={document.coverUrl}
              alt={document.title}
              className="w-full lg:w-48 h-64 object-cover rounded-xl"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-accent-gold/20 text-accent-gold text-xs">
                  {document.dynasty}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs">
                  {document.type}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{document.title}</h1>
              <p className="text-white/60 mb-4">{document.author}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl glass-light">
                  <Eye className="w-5 h-5 text-accent-gold mb-1" />
                  <p className="text-xl font-bold text-white">{document.viewCount.toLocaleString()}</p>
                  <p className="text-xs text-white/40">阅读量</p>
                </div>
                <div className="p-3 rounded-xl glass-light">
                  <Heart className="w-5 h-5 text-accent-red mb-1" />
                  <p className="text-xl font-bold text-white">328</p>
                  <p className="text-xs text-white/40">收藏数</p>
                </div>
                <div className="p-3 rounded-xl glass-light">
                  <FileText className="w-5 h-5 text-surface-dark mb-1" />
                  <p className="text-xl font-bold text-white">{document.content.length}</p>
                  <p className="text-xs text-white/40">字数</p>
                </div>
                <div className="p-3 rounded-xl glass-light">
                  <Calendar className="w-5 h-5 text-accent-red mb-1" />
                  <p className="text-xl font-bold text-white">{document.tags.length}</p>
                  <p className="text-xs text-white/40">标签数</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-accent-gold/20 to-accent-red/20 text-accent-gold border border-accent-gold/30'
                    : 'glass-light text-white/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-gold" />
                月度阅读趋势
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyViewsData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26,26,46,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#d4af37" fill="url(#colorViews)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent-red" />
                关键词分布
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={wordFrequencyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis dataKey="word" type="category" stroke="rgba(255,255,255,0.5)" fontSize={12} width={60} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26,26,46,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="url(#colorGradient)" radius={[0, 4, 4, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#e94560" />
                      <stop offset="100%" stopColor="#d4af37" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-surface-dark" />
                情感倾向分析
              </h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(26,26,46,0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {sentimentData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-white/60">{item.name} {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent-gold" />
                文献统计
              </h3>
              <div className="space-y-4">
                {[
                  { label: '文献字数', value: `${document.content.length} 字`, progress: 85 },
                  { label: '阅读完成率', value: '72%', progress: 72 },
                  { label: '平均阅读时长', value: '12 分钟', progress: 60 },
                  { label: '分享率', value: '15%', progress: 15 }
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">{stat.label}</span>
                      <span className="text-white font-medium">{stat.value}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-accent-gold to-accent-red rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'wordfreq' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent-gold" />
                  词频统计 Top 20
                </span>
                <button className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  刷新
                </button>
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={wordFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="word" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26,26,46,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {wordFrequencyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">关键词标签</h3>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-4 py-2 rounded-full text-sm"
                    style={{
                      backgroundColor: `${COLORS[i % COLORS.length]}20`,
                      color: COLORS[i % COLORS.length],
                      border: `1px solid ${COLORS[i % COLORS.length]}40`
                    }}
                  >
                    {tag} ({wordFrequencyData[i]?.count || 0})
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sentiment' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-surface-dark" />
                情感分析结果
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {sentimentData.map((item) => (
                  <div key={item.name} className="text-center p-6 rounded-2xl glass-light">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <span className="text-2xl font-bold" style={{ color: item.color }}>
                        {item.value}%
                      </span>
                    </div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-sm text-white/50 mt-1">
                      {item.name === '积极' ? '表达正向、乐观的情感' :
                       item.name === '中性' ? '客观陈述为主' : '带有忧虑或批判色彩'}
                    </p>
                  </div>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyViewsData}>
                  <defs>
                    <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e94560" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#e94560" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26,26,46,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#e94560" fill="url(#sentimentGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent-red" />
                历史时间线
              </h3>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-gold via-accent-red to-surface-dark" />

                <div className="space-y-6">
                  {timelineData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="relative flex items-start gap-6"
                    >
                      <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-accent-gold to-accent-red flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>
                      <div className="flex-1 pt-2">
                        <span className="text-accent-gold text-sm font-medium">{item.year}</span>
                        <h4 className="text-white font-bold mt-1">{item.event}</h4>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs mt-2 ${
                          item.type === 'political' ? 'bg-accent-gold/20 text-accent-gold' :
                          item.type === 'military' ? 'bg-accent-red/20 text-accent-red' :
                          'bg-surface-dark/20 text-surface-dark'
                        }`}>
                          {item.type === 'political' ? '政治' :
                           item.type === 'military' ? '军事' : '文化'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-6 flex justify-end">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-gold to-accent-red text-white font-medium hover:shadow-lg hover:shadow-accent-red/30 transition-all">
            <Download className="w-4 h-4" />
            导出分析报告
          </button>
        </div>
      </motion.div>
    </div>
  );
};
