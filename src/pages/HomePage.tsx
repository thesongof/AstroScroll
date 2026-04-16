import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, MessageCircle, BarChart3, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { DocumentCard } from '../components/document/DocumentCard';
import { useDocumentStore } from '../stores/documentStore';

const features = [
  {
    icon: BookOpen,
    title: '文献库',
    description: '海量历史文献，涵盖史书、诸子、诗词、科技等各类典籍',
    color: 'from-accent-gold/20 to-accent-red/20',
    path: '/library'
  },
  {
    icon: MessageCircle,
    title: 'AI对话',
    description: '智能助手帮您分析文献、解答问题、梳理历史脉络',
    color: 'from-accent-red/20 to-surface-dark/20',
    path: '/chat'
  },
  {
    icon: BarChart3,
    title: '文献分析',
    description: '可视化分析面板，词频统计、情感分析、时间线梳理',
    color: 'from-surface-dark/20 to-accent-gold/20',
    path: '/analysis'
  }
];

export const HomePage: React.FC = () => {
  const { documents } = useDocumentStore();

  return (
    <div className="p-6 lg:p-8 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-primary to-primary-dark" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-accent-gold/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-red/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative px-8 py-16 lg:px-16 lg:py-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent-gold" />
              <Link to="/library" className="text-sm text-white/80 hover:text-accent-gold transition-colors">
                使用指南
              </Link>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl lg:text-6xl font-bold mb-6"
            >
              <span className="text-white">星卷</span>
              <br />
              <span className="gradient-text">数智文献处理平台</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/70 mb-8 max-w-xl"
            >
              整合海量历史文献资源，运用人工智能技术，为历史研究者、学者和广大师生提供智能化的文献检索、阅读和分析服务。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/library"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-gold to-accent-red text-white font-medium hover:shadow-lg hover:shadow-accent-red/30 transition-all"
              >
                开始探索
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/chat"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 text-white/80 hover:text-white transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                AI助手
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-1/3 h-full hidden lg:block">
          <div className="absolute bottom-8 right-8 w-64 h-80 rounded-2xl glass overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <img
              src="https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400&h=600&fit=crop"
              alt="古籍"
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link to={feature.path}>
                <div className="glass rounded-2xl p-6 hover-lift cursor-pointer h-full">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/60 mb-4">{feature.description}</p>
                  <span className="text-accent-gold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    了解更多
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">精选文献</h2>
            <p className="text-sm text-white/50">浏览热门历史典籍</p>
          </div>
          <Link
            to="/library"
            className="flex items-center gap-1 text-accent-gold hover:text-accent-red transition-colors text-sm"
          >
            查看全部
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {documents.slice(0, 4).map((doc, index) => (
            <DocumentCard key={doc.id} document={doc} index={index} />
          ))}
        </div>
      </section>

      <section className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-gold/20 to-accent-red/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent-gold" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">热门标签</h2>
            <p className="text-xs text-white/50">探索最受欢迎的历史主题</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['秦始皇', '三国', '诸葛亮', '儒家', '道家', '唐诗', '宋词', '明清', '诸子百家', '史记', '资治通鉴', '本草纲目'].map((tag, i) => (
            <motion.a
              key={tag}
              href={`/search?q=${tag}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-full glass-light text-sm text-white/70 hover:text-white hover:bg-accent-gold/20 transition-all cursor-pointer"
            >
              #{tag}
            </motion.a>
          ))}
        </div>
      </section>

      <section className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-surface-dark/20 to-accent-gold/20 flex items-center justify-center">
            <Star className="w-5 h-5 text-surface-dark" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">平台数据</h2>
            <p className="text-xs text-white/50">实时统计数据</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '文献总数', value: '8+', color: 'text-accent-gold' },
            { label: '朝代跨越', value: '8', color: 'text-accent-red' },
            { label: '用户总数', value: '1.2k', color: 'text-surface-dark' },
            { label: '分析次数', value: '5.8k', color: 'text-white' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-4 rounded-xl glass-light"
            >
              <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
