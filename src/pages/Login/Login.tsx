import GoogleSignInButton from './GoogleSignInButton';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { currentUser } = useAuth();
  
  // If user is already logged in, redirect to home
  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Left side - Hero content */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
        <div className="max-w-lg">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-transparent border border-blue-600 rounded-xl flex items-center justify-center mr-2">
                <img
                  src="./premail.png"
                  alt="PreMail Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="tracking-tighter text-5xl font-bold text-blue-700 tracking-tight">
                Pre<span className="text-blue-400 font-instrument">mail</span>
              </div>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Schedule your Gmail messages with precision and never miss the perfect timing again.
            </p>
          </div> 

          <div className="space-y-6 mb-12">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Smart Scheduling</h3>
                <p className="text-gray-600">Schedule emails to be sent at the optimal time across different time zones</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Gmail Integration</h3>
                <p className="text-gray-600">Seamlessly connects with your Gmail account using Google's secure API</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Boost Productivity</h3>
                <p className="text-gray-600">Write emails when it's convenient, send them when it's effective</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Popular use cases:</span>
            </p>
            <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                <span>Send follow-ups during business hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                <span>Schedule international communications</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                <span>Plan newsletter campaigns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-16 bg-white shadow-2xl">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img
              src="./premail.png"
              alt="PreMail Logo"
              className="mr-auto ml-auto mb-4 w-12 h-12 object-contain"
            />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Premail
            </h2>
            <p className="text-gray-600 text-lg">
              Sign in with Google to get started
            </p>
          </div>

          <div className="mb-16 mr-auto ml-auto">
            <div className="mb-8 flex justify-center">
              <GoogleSignInButton />
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure</span>
              </span>
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Trusted</span>
              </span>
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Fast</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs text-gray-400">
            PreMail uses Gmail API to securely access your email
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;