// src/pages/Login/Login.tsx
import GoogleSignInButton from '../../components/GoogleSignInButton';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { currentUser } = useAuth();
  
  // If user is already logged in, redirect to home
  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex h-screen w-full justify-center items-center">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">PreMail, for the Web</h1>  
        <p className="text-gray-600 mb-8">Your email productivity solution</p>
        <GoogleSignInButton />
      </div>
    </div>
  );
};

export default Login;
