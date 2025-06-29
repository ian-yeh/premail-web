import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import Editor from './pages/Editor/Editor.tsx';
import Login from './pages/Login/Login.tsx';
import { Landing } from './pages/Landing/Landing.tsx';

import Header from './pages/Landing/Header.tsx'
import Footer from './pages/Landing/Footer.tsx' 
import Sidebar from './components/SideBar.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

import { AuthProvider } from './contexts/AuthContext.tsx';
import { EmailProvider } from './contexts/EmailContext.tsx';

import { Settings } from './pages/Settings/Settings.tsx';

import { AnimatePresence } from 'framer-motion';

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';
  
  return (
    <AuthProvider>
      <EmailProvider>
        {isLoginPage ? (
          // Login page layout - vertical stack
          <div className="min-h-screen flex flex-col">
            <div className='sticky top-0 w-full'>
              <Header />
            </div>
            <div className="flex-1 p-6 scrollbar-hide">
              <AnimatePresence mode='wait'>
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </AnimatePresence>
            </div>
            <Footer />
          </div>
        ) : (
          // App layout - horizontal flex
          <div className="flex h-screen">
            <div className="sticky top-0 left-0 h-screen">
              <Sidebar />
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <Routes>
                <Route path="/home" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="/editor/:emailId" element={
                  <ProtectedRoute>
                    <Editor />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
        )}
      </EmailProvider>
    </AuthProvider>
  );
};

export default App;