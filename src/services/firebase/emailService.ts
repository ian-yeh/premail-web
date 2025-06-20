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
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, app } from './firebaseConfig';

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
  status: 'draft' | 'sent' | 'scheduled' | 'failed';
  scheduledDate?: Timestamp | undefined;
}

// CREATE: Add a new email
export const createEmail = async (emailData: Omit<Email, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const emailsRef = collection(db, 'emails');
    const docRef = await addDoc(emailsRef, {
      ...emailData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // If scheduled, trigger the scheduling process
    if (emailData.status === 'scheduled' && emailData.scheduledDate) {
      await scheduleGmailSend(docRef.id, emailData.userId);
    }
    
    return { id: docRef.id, ...emailData };
  } catch (error) {
    console.error('Error creating email:', error);
    throw error;
  }
};

// READ: Get all emails for a user
export const getUserEmails = async (userId: string) => {
  try {
    const emailsRef = collection(db, 'emails');
    const q = query(
      emailsRef, 
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Email));
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
};

// READ: Get single email by ID
export const getEmailById = async (emailId: string) => {
  try {
    const emailRef = doc(db, 'emails', emailId);
    const emailSnap = await getDoc(emailRef);
    
    if (!emailSnap.exists()) {
      throw new Error('Email not found');
    }
    
    return {
      id: emailSnap.id,
      ...emailSnap.data()
    } as Email;
  } catch (error) {
    console.error('Error fetching email:', error);
    throw error;
  }
};

// UPDATE: Modify an existing email
export const updateEmail = async (emailId: string, emailData: Partial<Email>) => {
  try {
    const emailRef = doc(db, 'emails', emailId);
    
    console.log(emailData.scheduledDate);
    const scheduledDate = emailData.scheduledDate ? emailData.scheduledDate : null;

    await updateDoc(emailRef, {
      ...emailData,
      scheduledDate: scheduledDate,
      updatedAt: serverTimestamp()
    });

    // Reschedule if needed
    if (emailData.status === 'scheduled' && emailData.scheduledDate) {
      const email = await getEmailById(emailId);
      await scheduleGmailSend(emailId, email.userId);
    }
    
    return { id: emailId, ...emailData };
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

// DELETE: Remove an email
export const deleteEmail = async (emailId: string) => {
  try {
    await deleteDoc(doc(db, 'emails', emailId));
    return true;
  } catch (error) {
    console.error('Error deleting email:', error);
    throw error;
  }
};

// GMAIL INTEGRATION FUNCTIONS

// Schedule email via Gmail
const scheduleGmailSend = async (emailId: string, userId: string) => {
  try {
    const functions = getFunctions(app);
    const scheduleEmail = httpsCallable(functions, 'scheduleEmail');
    await scheduleEmail({ emailId, userId });
  } catch (error) {
    console.error('Error scheduling email:', error);
    throw error;
  }
};

// Process pending scheduled emails
export const processScheduledEmails = async () => {
  try {
    const now = Timestamp.now();
    const q = query(
      collection(db, 'emails'),
      where('status', '==', 'scheduled'),
      where('scheduledDate', '<=', now)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Email));
  } catch (error) {
    console.error('Error processing scheduled emails:', error);
    throw error;
  }
};

// Mark email as sent
export const markEmailAsSent = async (emailId: string) => {
  try {
    await updateDoc(doc(db, 'emails', emailId), {
      status: 'sent',
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error marking email as sent:', error);
    throw error;
  }
};