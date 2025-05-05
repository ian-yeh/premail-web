import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import Editor from './pages/Editor/Editor.tsx';
import Login from './pages/Login/Login.tsx';
import Sidebar from './components/SideBar.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

import { AuthProvider } from './contexts/AuthContext.tsx';
import { EmailProvider } from './contexts/EmailContext.tsx';

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <AuthProvider>
      <EmailProvider>
        <div className="flex">
          {!isLoginPage && <Sidebar />}
          <div className={`${isLoginPage ? 'w-full' : 'flex-1'} p-6`}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }/>
              <Route path="/editor/:emailId" element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              }/>
            </Routes>
          </div>
        </div>
      </EmailProvider>
    </AuthProvider>
  );
};

export default App;
