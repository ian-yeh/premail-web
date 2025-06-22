import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import EmailList from './EmailList.tsx';
import { startTestLoop } from '../../services/firebase/processScheduledEmails.ts';

const Home = () => {
  const [time, setTime] = useState(new Date());

  const { currentUser } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleTest = () =>  {
    startTestLoop();
  }

  return (
    <div className="font-display p-10">

      <div className="flex flex-direction">
        <div className="w-1/2">
          <h1 className="text-5xl font-bold text-zinc-900">
            {currentUser ? `Hi, ${currentUser.displayName || ''} 👋` : 'Welcome 👋'}
          </h1>
          <h3 className="text-3xl font-bold mt-3 text-zinc-600">How are you doing today?</h3>

        </div>
        <div className="grid grid-flow-col justify-items-end w-1/2">
          <div className="">
            {currentUser ? (
              <img 
              src={currentUser.photoURL? currentUser.photoURL : undefined} 
              alt="Profile" 
              className="w-20 h-20 rounded-full"
              />
            ): (<div>NO PHOTO</div>)
            }
          </div>
        </div>
      </div>

      <div className="flex flex-direction mt-16">
        <div className="">
          <h1 className="text-5xl font-bold text-zinc-600">TODAY IS <span className="text-blue-600">
            {time.toLocaleDateString("en-US", { month: 'short', weekday: 'short', day: 'numeric' })}
          </span></h1>
          <h1 
            className="text-5xl font-bold text-zinc-900 mt-4" 
          >
            {time.toLocaleTimeString()}
          </h1>
        </div>
      </div>

      <div className="mt-16">
        <EmailList />
      
      </div>

      <div>
        <button onClick={handleTest}>TestMe</button>
      </div>

    </div>
  );
}

export default Home;
