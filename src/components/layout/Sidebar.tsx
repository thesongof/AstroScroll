import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Library,
  Search,
  MessageCircle,
  BarChart3,
  BookOpen,
  Star,
  Clock,
  Settings,
  HelpCircle,
  Sparkles
} from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: '首页', description: '文献库' },
  { path: '/library', icon: Library, label: '文献库', description: '浏览全部' },
  { path: '/search', icon: Search, label: '搜索', description: '检索文献' },
  { path: '/chat', icon: MessageCircle, label: 'AI对话', description: '智能助手' },
  { path: '/analysis', icon: BarChart3, label: '文献分析', description: '可视化' },
];

const quickLinks = [
  { icon: Star, label: '我的收藏', count: 12 },
  { icon: Clock, label: '最近阅读', count: 5 },
  { icon: BookOpen, label: '阅读笔记', count: 23 },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-72 h-full glass flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-gold to-accent-red flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold">导航菜单</h2>
            <p className="text-xs text-white/50">快速访问</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2 mb-8">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-4 px-3">
            主要功能
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="block"
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-accent-red/20 to-transparent border-l-2 border-accent-red'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-accent-red' : 'text-white/60'
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        isActive ? 'text-white' : 'text-white/80'
                      }`}
                    >
                      {item.label}
                    </p>
                    <p className="text-xs text-white/40">{item.description}</p>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="w-2 h-2 rounded-full bg-accent-red"
                    />
                  )}
                </motion.div>
              </NavLink>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-4 px-3">
            快捷入口
          </p>
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
              >
                <Icon className="w-5 h-5 text-white/60 group-hover:text-accent-gold transition-colors" />
                <div className="flex-1">
                  <p className="text-sm text-white/80">{item.label}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/50">
                  {item.count}
                </span>
              </motion.div>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
          <HelpCircle className="w-5 h-5 text-white/60 group-hover:text-accent-gold transition-colors" />
          <span className="text-sm text-white/80">帮助与反馈</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group mt-2">
          <Settings className="w-5 h-5 text-white/60 group-hover:text-accent-gold transition-colors" />
          <span className="text-sm text-white/80">设置</span>
        </div>
      </div>
    </aside>
  );
};
