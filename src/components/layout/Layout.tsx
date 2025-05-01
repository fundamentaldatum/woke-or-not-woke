import React, { ReactNode } from 'react';
import { UI } from '../../constants';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout component with header and content area
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: UI.BACKGROUND.GRADIENT,
      }}
    >
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start w-full px-2">
        <div className="w-full max-w-2xl mx-auto mt-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
