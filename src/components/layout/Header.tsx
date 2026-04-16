import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Menu,
  X,
  User,
  Bell,
  MessageCircle,
  ChevronDown,
  LogIn,
  LogOut,
  Shield,
  Settings
} from 'lucide-react';
import { useDocumentStore } from '../../stores/documentStore';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';

export const Header: React.FC = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const { searchQuery, setSearchQuery } = useDocumentStore();
  const { toggleSidebar, toggleChat } = useUIStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-accent-gold to-accent-red flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform">
                星卷
              </h1>
              <p className="text-xs text-white/50">数智文献处理平台</p>
            </div>
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            searchFocused
              ? 'w-96 glass-light glow-gold'
              : 'w-64 glass-light hover:w-80'
          }`}
        >
          <Search className="w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="搜索文献、作者、关键词..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent border-none outline-none flex-1 text-sm text-white placeholder-white/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 hover:bg-white/10 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className={`p-2 rounded-lg transition-all ${
              location.pathname === '/chat'
                ? 'bg-accent-red/20 text-accent-red'
                : 'hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>

          <button className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full" />
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-4 border-l border-white/10">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="p-2 rounded-lg hover:bg-accent-gold/20 text-accent-gold transition-colors"
                  title="管理后台"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              )}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-surface-dark to-accent-red flex items-center justify-center">
                {user?.role === 'admin' ? (
                  <Shield className="w-4 h-4 text-accent-gold" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-white/50">
                  {user?.role === 'admin' ? '管理员' : '在线'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                title="退出登录"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-accent-gold to-accent-red text-white font-medium hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">登录</span>
            </Link>
          )}
        </div>
      </div>

      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2 px-4 py-2 rounded-full glass-light">
          <Search className="w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="搜索文献..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-sm text-white placeholder-white/30"
          />
        </form>
      </div>
    </header>
  );
};
