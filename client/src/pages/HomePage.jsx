import React from 'react';
import Sidebar from '@/components/custom/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

function HomePage() {
  const location = useLocation();

  // Show offcanvas on any sub-route (except root "/")
  const isOffcanvasActive = location.pathname !== '/';

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Sidebar (Always visible on desktop, visible as base on mobile) */}
      <div className="w-full md:w-1/4 h-full overflow-y-auto z-10 bg-white border-r">
        <Sidebar />
      </div>

      {/* Desktop Content */}
      <div className="hidden md:block w-3/4 h-full overflow-y-auto bg-white">
        <Outlet />
      </div>

      {/* Offcanvas for ALL routes on mobile (except "/") */}
      <div
        className={`
          fixed top-0 left-0 w-full h-full bg-white z-50
          transform transition-transform duration-300 ease-in-out
          md:hidden
          ${isOffcanvasActive ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default HomePage;
