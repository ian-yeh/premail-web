// src/pages/Editor/Editor.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmails } from '../../contexts/EmailContext';
import { Email } from '../../services/firebase/emailService';

import DatePicker from '../Editor/DatePicker.tsx';
import { dateToTimestamp } from './editorUtils.ts';

const Editor = () => {
  const { emailId } = useParams();
  const navigate = useNavigate();
  const { createNewEmail, getEmail, updateExistingEmail } = useEmails();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [email, setEmail] = useState<Partial<Email>>({
    subject: '',
    body: '',
    to: '',
    cc: '',
    bcc: '',
    status: 'draft',
    scheduledDate: undefined, 
  });

  
  // Load email data if editing an existing email
  useEffect(() => {
    const loadEmail = async () => {
      if (emailId && emailId !== 'new') {
        try {
          const existingEmail = await getEmail(emailId);
          setEmail(existingEmail);
        } catch (err: any) {
          setError(err.message || 'Failed to load email');
        }
      }
      setLoading(false);
    };
    
    loadEmail();
  }, [emailId, getEmail]);

  console.log(email.scheduledDate)
  console.log(email.scheduledDate?.constructor.name)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmail(prev => ({ ...prev, [name]: value }));
  };

  // Handle date picker change
  const handleDateChange = (selectedDate: Date | undefined) => {
    const timestamp = dateToTimestamp(selectedDate);

    setEmail(prev => ({ 
      ...prev, 
      scheduledDate: timestamp,
      // Update status based on whether a date is selected
      status: timestamp ? 'scheduled' : 'draft'
    }));
  };

  // Clear scheduled date
  const handleClearSchedule = () => {
    setEmail(prev => ({ 
      ...prev, 
      scheduledDate: undefined,
      status: 'draft'
    }));
  };
  
  const handleSave = async () => {
    setSaving(true);
    try {
      if (emailId === 'new') {
        const newEmail = await createNewEmail(email as Omit<Email, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
        navigate(`/editor/${newEmail.id}`);
      } else {
        await updateExistingEmail(emailId!, email);
      }

      navigate('/Home');
    } catch (err: any) {
      setError(err.message || 'Failed to save email');
    } finally {
      setSaving(false);
    }
  };
  
  const handleBack = () => {
    navigate('/home');
  };
  
  if (loading) return <div className="text-center p-8">Loading...</div>;
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-900"
        >
          &larr; Back to Emails
        </button>
        
        <div className="space-x-2">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {saving ? 'Saving...' : email.scheduledDate ? 'Schedule Email' : 'Save Draft'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {/* Show scheduled status */}
      {email.scheduledDate && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded mb-4 flex justify-between items-center">
          <span>
            📅 This email is scheduled to be sent on {/** adding space */}
            {email.scheduledDate.toDate().toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
          <button 
            onClick={handleClearSchedule}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Clear Schedule
          </button>
        </div>
      )}
      
      <div className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input
            type="text"
            name="to"
            value={email.to}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="recipient@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CC</label>
          <input
            type="text"
            name="cc"
            value={email.cc || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="cc@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">BCC</label>
          <input
            type="text"
            name="bcc"
            value={email.bcc || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="bcc@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={email.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Email Subject"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
          <textarea
            name="body"
            value={email.body}
            onChange={handleChange}
            rows={12}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Write your email content here..."
          />
        </div>

        <div>
          <DatePicker 
            label="Schedule Email (Optional)"
            onChange={handleDateChange}
            value={email.scheduledDate}
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to save as draft, or select a date to schedule the email
          </p>
        </div>
      </div>
    </div>
  );
};

export default Editor;
