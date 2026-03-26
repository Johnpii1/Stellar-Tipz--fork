import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/shared/ScrollToTop';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import ToastContainer from '@/components/shared/ToastContainer';
import { routes } from './routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <div className="flex-1">
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </div>
          <Footer />
        </div>
      </ErrorBoundary>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
