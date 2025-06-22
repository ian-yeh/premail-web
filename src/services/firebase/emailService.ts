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
    const emailsRef = collection(db, 'emails');
    const docRef = await addDoc(emailsRef, {
      ...emailData,
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

// Process pending scheduled emails

// Process pending scheduled emails
//const processScheduledEmails = async () => {
//  try {
//    const now = Timestamp.now();
//    console.log('Processing scheduled emails at:', now.toDate());
//    
//    // Query for emails that are scheduled and due
//    const q = query(
//      collection(db, 'emails'),
//      where('status', '==', 'scheduled'),
//      where('scheduledDate', '<=', now)
//    );
//    
//    const snapshot = await getDocs(q);
//    console.log(`Found ${snapshot.docs.length} emails to process`);
//    
//    if (snapshot.empty) {
//      console.log('No scheduled emails to process');
//      return [];
//    }
//    
//    const results = [];
//    
//    // Process each email
//    for (const doc of snapshot.docs) {
//      try {
//        const emailData = doc.data();
//        const emailId = doc.id;
//        
//        console.log(`Processing email ${emailId}:`, emailData);
//        
//        // Update status to 'sending' to prevent duplicate processing
//        await updateDoc(doc.ref, {
//          status: 'sending',
//          processedAt: Timestamp.now()
//        });
//        
//        // Send the email (you'll need to implement sendEmail function)
//        const sendResult = await sendEmail(emailData);
//        
//        // Update status based on send result
//        if (sendResult.success) {
//          await updateDoc(doc.ref, {
//            status: 'sent',
//            sentAt: Timestamp.now(),
//            messageId: sendResult.messageId || null
//          });
//          console.log(`Email ${emailId} sent successfully`);
//        } else {
//          await updateDoc(doc.ref, {
//            status: 'failed',
//            failedAt: Timestamp.now(),
//            error: sendResult.error || 'Unknown error'
//          });
//          console.error(`Email ${emailId} failed to send:`, sendResult.error);
//        }
//        
//        results.push({
//          id: emailId,
//          status: sendResult.success ? 'sent' : 'failed',
//          ...emailData
//        });
//        
//      } catch (emailError) {
//        console.error(`Error processing email ${doc.id}:`, emailError);
//        
//        // Mark as failed
//        try {
//          await updateDoc(doc.ref, {
//            status: 'failed',
//            failedAt: Timestamp.now(),
//            error: emailError.message
//          });
//        } catch (updateError) {
//          console.error(`Error updating failed email ${doc.id}:`, updateError);
//        }
//        
//        results.push({
//          id: doc.id,
//          status: 'failed',
//          error: emailError.message,
//          ...doc.data()
//        });
//      }
//    }
//    
//    console.log(`Processed ${results.length} emails`);
//    return results;
//    
//  } catch (error) {
//    console.error('Error processing scheduled emails:', error);
//    throw error;
//  }
//};
//
//// Example sendEmail function (you'll need to implement this with Gmail API)
//const sendEmail = async (emailData) => {
//  try {
//    // This is where you'd integrate with Gmail API
//    // Example structure:
//    
//    // 1. Get user's OAuth tokens from Firestore
//    // 2. Create Gmail API client with tokens
//    // 3. Send email using gmail.users.messages.send()
//    // 4. Return success/failure result
//    
//    console.log('Sending email:', emailData);
//    
//    // Placeholder - replace with actual Gmail API implementation
//    return {
//      success: true,
//      messageId: 'fake-message-id-' + Date.now()
//    };
//    
//  } catch (error) {
//    return {
//      success: false,
//      error: error.message
//    };
//  }
//};
//
//
//const startEmailProcessor = () => {
//  setInterval(async () => {
//    try {
//      await processScheduledEmails();
//    } catch (error) {
//      console.error('Error in email processor interval:', error);
//    }
//  }, 60000); // Run every minute
//};
//
//startEmailProcessor();
//