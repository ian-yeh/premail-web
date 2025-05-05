// src/services/firebase/emailService.ts
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig.ts';

// Email interface
export interface Email {
  id?: string;
  userId: string;
  subject: string;
  body: string;
  to: string;
  cc?: string;
  bcc?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  status: 'draft' | 'sent' | 'scheduled';
  scheduledTime?: Timestamp;
}

// Create a new email (draft)
export const createEmail = async (emailData: Omit<Email, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const emailsRef = collection(db, 'emails');
    const docRef = await addDoc(emailsRef, {
      ...emailData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...emailData
    };
  } catch (error) {
    console.error('Error creating email:', error);
    throw error;
  }
};

// Get emails for a specific user
export const getUserEmails = async (userId: string) => {
  try {
    const emailsRef = collection(db, 'emails');
    const q = query(
      emailsRef, 
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const emails: Email[] = [];
    
    querySnapshot.forEach((doc) => {
      emails.push({
        id: doc.id,
        ...doc.data()
      } as Email);
    });
    
    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
};

// Get a specific email by ID
export const getEmailById = async (emailId: string) => {
  try {
    const emailRef = doc(db, 'emails', emailId);
    const emailSnap = await getDoc(emailRef);
    
    if (emailSnap.exists()) {
      return {
        id: emailSnap.id,
        ...emailSnap.data()
      } as Email;
    } else {
      throw new Error('Email not found');
    }
  } catch (error) {
    console.error('Error fetching email:', error);
    throw error;
  }
};

// Update an existing email
export const updateEmail = async (emailId: string, emailData: Partial<Email>) => {
  try {
    const emailRef = doc(db, 'emails', emailId);
    
    // Remove fields that shouldn't be updated directly
    const { id, createdAt, ...dataToUpdate } = emailData as any;
    
    await updateDoc(emailRef, {
      ...dataToUpdate,
      updatedAt: serverTimestamp()
    });
    
    return {
      id: emailId,
      ...emailData
    };
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

// Delete an email
export const deleteEmail = async (emailId: string) => {
  try {
    const emailRef = doc(db, 'emails', emailId);
    await deleteDoc(emailRef);
    return true;
  } catch (error) {
    console.error('Error deleting email:', error);
    throw error;
  }
};
