import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmails } from '../../contexts/EmailContext';
import { format } from 'date-fns';

const Email = ({ email }) => {
  const [drop, setDrop] = useState(false);

  return (
    <div 
      className="p-4 hover:bg-gray-50 cursor-pointer"
      onClick={() => handleEditEmail(email.id!)}
    >
      <div className="flex justify-between">
        <h3 className="font-medium">{email.subject || '(No subject)'}</h3>
        <span className="text-sm text-gray-500">
          {email.updatedAt ? format(email.updatedAt.toDate(), 'MMM d, yyyy') : 'Draft'}
        </span>
      </div>

      <button onClick={() => setDrop(prev => !prev)} className="text-xs hover:text-gray-500 py-3">
        {drop ? "Hide" : "View"} Content...
      </button>

      {drop && 
        <p className="text-gray-600 text-sm mt-1 overflow-y-hidden">{email.body}</p>
      }
      <div className="mt-2 flex gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {email.status}
        </span>
        <span className="text-xs text-gray-500">To: {email.to}</span>
      </div>
    </div>
  )

};

const EmailList = () => {
  const { emails, loading, error, refreshEmails } = useEmails();
  const navigate = useNavigate();
  
  useEffect(() => {
    refreshEmails();
  }, []);
  
  const handleCreateNew = () => {
    navigate('/editor/new');
  };
  
  const handleEditEmail = (emailId: string) => {
    navigate(`/editor/${emailId}`);
  };
  
  if (loading) return <div className="text-center p-8">Loading emails...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Emails</h2>
        <button 
          onClick={handleCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create New Email
        </button>
      </div>
      
      {emails.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No emails yet. Create your first email!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {emails.map(email => (
            <Email 
              email={email}
              key={email.id} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailList;
