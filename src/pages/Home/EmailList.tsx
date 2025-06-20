import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmails } from '../../contexts/EmailContext';
import { format } from 'date-fns';
import { Email } from '../../services/firebase/emailService';

interface EmailProps {
  email: Partial<Email>;
  onDelete?: (emailId: string) => void;
}

const EmailDisplay = ({ email, onDelete }: EmailProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleEditEmail = (emailId: string) => {
    navigate(`/editor/${emailId}`);
  };

  const handleDelete = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    if (onDelete) onDelete(emailId);
  };

  const formatScheduledDate = (date?: any) => {
    if (!date) return '';
    try {
      const jsDate = date.toDate ? date.toDate() : new Date(date);
      return format(jsDate, 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const statusColors = {
    draft: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Draft'
    },
    scheduled: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Scheduled'
    },
    sent: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Sent'
    }
  };

  const currentStatus = email.status || 'draft';
  const statusConfig = statusColors[currentStatus] || statusColors.draft;

  return (
    <div 
      className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 relative group"
      onClick={() => handleEditEmail(email.id!)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Delete button (appears on hover) */}
      {isHovered && onDelete && (
        <button
          onClick={(e) => handleDelete(e, email.id!)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
          aria-label="Delete email"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}

      <div className="flex justify-between items-start pr-8"> {/* Added padding for delete button */}
        <div>
          <h3 className="font-medium text-gray-900">
            {email.subject || '(No subject)'}
          </h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {email.body}
          </p>
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
          {email.updatedAt ? format(email.updatedAt.toDate(), 'MMM d, yyyy') : 'Unsaved'}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
          {statusConfig.label}
          {currentStatus === 'scheduled' && email.scheduledDate && (
            <span className="ml-1">• {formatScheduledDate(email.scheduledDate)}</span>
          )}
        </span>

        {email.to && (
          <span className="text-xs text-gray-500">
            To: {Array.isArray(email.to) ? email.to.join(', ') : email.to}
          </span>
        )}
      </div>
    </div>
  );
};

const EmailList = () => {
  const { emails, loading, error, refreshEmails, deleteExistingEmail } = useEmails();
  const navigate = useNavigate();
  
  useEffect(() => {
    refreshEmails();
  }, []);
  
  const handleCreateNew = () => {
    navigate('/editor/new');
  };

  const handleOnDelete = (id: string | undefined) => {
    try {
      if (id) deleteExistingEmail(id);  
    } catch (error) {
      console.log(error); 
    }
  }
  
  
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
            <EmailDisplay 
              email={email}
              onDelete={() => handleOnDelete(email.id)}
              key={email.id} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailList;
