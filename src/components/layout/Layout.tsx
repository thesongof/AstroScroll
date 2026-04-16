import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ChatDrawer } from '../chat/ChatDrawer';
import { useUIStore } from '../../stores/uiStore';

export const Layout: React.FC = () => {
  const { chatOpen } = useUIStore();
  const location = useLocation();

  const isDocumentPage = location.pathname.startsWith('/document/');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {!isDocumentPage && <Sidebar />}

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>

        <ChatDrawer isOpen={chatOpen} />
      </div>

      <Footer />
    </div>
  );
};
