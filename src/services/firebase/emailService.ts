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
import { db } from './firebaseConfig';

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
    const scheduledDate = emailData.scheduledDate ? emailData.scheduledDate : null;

    const emailsRef = collection(db, 'emails');
    const docRef = await addDoc(emailsRef, {
      ...emailData,
      scheduledDate: scheduledDate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    
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