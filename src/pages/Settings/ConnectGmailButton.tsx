import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { User } from "firebase/auth";
import { db } from "../../services/firebase/firebaseConfig";

export const ConnectGmailButton = () => {
  const [status, setStatus] = useState("idle");
  const { currentUser } = useAuth();

  const handleConnect = async () => {
    try {
      const authResponse = await fetch('http://localhost:5001/premail-app/us-central1/authGmail');
      const { authUrl } = await authResponse.json();

      const timestamp = Date.now();

      let popup = window.open(
        authUrl,
        `gmailAuth_${timestamp}`,
        "width=600,height=600"
      );

      const messageHandler = (event: MessageEvent) => {
        // SECURITY CHECK - verify origin
        //if (event.origin !== "https://accounts.google.com") return;

        setTimeout(() => {
          console.log("EVENT ORIGIN", event.origin)

          if (event.data.code) {
            console.log("CODE", event.data.code)

            if (!currentUser) return;
            exchangeCodeForToken(event.data.code, currentUser);
            window.removeEventListener('message', messageHandler);

            popup = null;
          }
        }, 6000)

      };
      window.addEventListener('message', messageHandler);

    } catch (error) {
      console.error("Auth failed:", error);
    }
  };

  //`https://localhost:5001/premail-app/us-central1/oauthCallback?code=${code}`
  const exchangeCodeForToken = async (code: string, currentUser: User) => {

    try {

      const tokenResponse = await fetch(
        `http://127.0.0.1:5001/premail-app/us-central1/oauthCallback?code=${code}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: currentUser.uid ,
            db: db
          })
        }
      );
      const { accessToken, refreshToken, userId } = await tokenResponse.json();
      console.log("ACCESS TOKEN:", accessToken);
      console.log("REFRESH TOKEN:", refreshToken);
      console.log("USERID:", userId)
      setStatus('success');
    } catch (error) {
      console.error("Token exchange failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={handleConnect}
        disabled={status === 'loading' || status === 'success'}
        className={`px-4 py-2 rounded-md text-white font-medium flex items-center space-x-2
          ${status === 'loading' ? 'bg-blue-400 cursor-not-allowed' : 
            status === 'error' ? 'bg-red-500 hover:bg-red-600' : 
            status === 'success' ? 'bg-green-500 cursor-default' : 
            'bg-blue-500 hover:bg-blue-600'}`}
      >
        {status === 'loading' && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {status === 'success' && (
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === 'error' && (
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {status === 'idle' && (
          <img 
            src="https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_32dp.png" 
            alt="Google" 
            className="w-4 h-4 mr-2" 
          />
        )}
        {status === 'loading' ? 'Connecting...' : 
         status === 'success' ? 'Connected!' : 
         status === 'error' ? 'Try Again' : 'Connect Gmail'}
      </button>
    </div>
  );
};

export default ConnectGmailButton;
