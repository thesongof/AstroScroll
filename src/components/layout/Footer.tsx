import React from 'react';
import { Heart, Code, Coffee } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass border-t border-white/10 py-6 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-gold/20 to-accent-red/20 flex items-center justify-center">
            <Heart className="w-4 h-4 text-accent-red" />
          </div>
          <p className="text-sm text-white/60">
            星卷(AstroScroll) - 数智文献处理平台
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-white/40">
          <span className="flex items-center gap-1">
            <Code className="w-4 h-4" />
            Built with React + TypeScript
          </span>
          <span className="flex items-center gap-1">
            <Coffee className="w-4 h-4" />
            Powered by AI
          </span>
        </div>

        <p className="text-xs text-white/30">
          © 2024-2026 AstroScroll. 保留所有权利.
        </p>
      </div>
    </footer>
  );
};
