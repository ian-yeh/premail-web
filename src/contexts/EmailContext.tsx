// src/contexts/EmailContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  createEmail, 
  getUserEmails, 
  getEmailById, 
  updateEmail, 
  deleteEmail,
  Email 
} from '../services/firebase/emailService';

interface EmailContextType {
  emails: Email[];
  loading: boolean;
  error: string | null;
  createNewEmail: (emailData: Omit<Email, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Email>;
  getEmail: (emailId: string) => Promise<Email>;
  updateExistingEmail: (emailId: string, emailData: Partial<Email>) => Promise<Email>;
  deleteExistingEmail: (emailId: string) => Promise<boolean>;
  refreshEmails: () => Promise<void>;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const useEmails = () => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmails must be used within an EmailProvider');
  }
  return context;
};

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Load emails when user changes
  useEffect(() => {
    const loadEmails = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const userEmails = await getUserEmails(currentUser.uid);
          setEmails(userEmails);
          setError(null);
        } catch (err: any) {
          setError(err.message || 'Failed to load emails');
        } finally {
          setLoading(false);
        }
      } else {
        setEmails([]);
        setLoading(false);
      }
    };

    loadEmails();
  }, [currentUser]);

  // Create a new email
  const createNewEmail = async (emailData: Omit<Email, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    const newEmail = await createEmail({
      ...emailData,
      userId: currentUser.uid,
    });
    
    setEmails(prevEmails => [newEmail, ...prevEmails]);
    return newEmail;
  };

  // Get a specific email
  const getEmail = async (emailId: string) => {
    return await getEmailById(emailId);
  };

  // Update an existing email
  const updateExistingEmail = async (emailId: string, emailData: Partial<Email>) => {
    const updatedEmail = await updateEmail(emailId, emailData);
    
    setEmails(prevEmails => 
      prevEmails.map(email => 
        email.id === emailId ? { ...email, ...updatedEmail } : email
      )
    );
    
    return updatedEmail;
  };

  // Delete an email
  const deleteExistingEmail = async (emailId: string) => {
    const result = await deleteEmail(emailId);
    
    if (result) {
      setEmails(prevEmails => prevEmails.filter(email => email.id !== emailId));
    }
    
    return result;
  };

  // Refresh emails list
  const refreshEmails = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const userEmails = await getUserEmails(currentUser.uid);
      setEmails(userEmails);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh emails');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    emails,
    loading,
    error,
    createNewEmail,
    getEmail,
    updateExistingEmail,
    deleteExistingEmail,
    refreshEmails
  };

  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  );
};
