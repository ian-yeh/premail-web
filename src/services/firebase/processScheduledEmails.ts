// Testing module for processScheduledEmails function
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { updateDoc, doc } from 'firebase/firestore';

// Process pending scheduled emails - Testing Version
const processScheduledEmails = async () => {
  try {
    const now = Timestamp.now();
    
    // Query for emails that are scheduled and due
    const q = query(
      collection(db, 'emails'),
      where('status', '==', 'scheduled'),
      where('scheduledDate', '<=', now)
    );

    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return [];
    
    const emailsToProcess: any[] = [];
    
    // Process each email
    snapshot.docs.forEach((doc) => {
      const emailData = doc.data();
      const emailId = doc.id;
      
      console.log(`\n📮 Email ID: ${emailId}`);
      console.log(`📅 Scheduled for: ${emailData.scheduledDate?.toDate()}`);
      console.log(`📧 Email data:`, {
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body?.substring(0, 100) + '...', // First 100 chars
        status: emailData.status,
        userId: emailData.userId
      });
      
      emailsToProcess.push({
        id: emailId,
        ...emailData,
      });
    });
    
    console.log(`\n✨ Total emails ready to send: ${emailsToProcess.length}`);
    return emailsToProcess;
    
  } catch (error) {
    console.error('❌ Error processing scheduled emails:', error);
    throw error;
  }
};

const fetchScheduledEmails = async (userId: string) => {
  console.log('🚀 Starting scheduled email sending...\n');
  
  try {
    const results = await processScheduledEmails();
    
    console.log('\n📋 Summary of emails to send:');
    if (results.length > 0) {
      results.forEach((email, index) => {
        console.log(`${index + 1}. ${email.subject} -> ${email.to}`);
        sendScheduledEmail(userId, email);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

const sendScheduledEmail = async (userId: string, email: any) => {
  console.log(email);

  try {
    //sending request
    const response = await fetch('http://127.0.0.1:5001/premail-app/us-central1/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        emailData: {
          to: email.to,
          subject: email.subject,
          textBody: email.body,
        }
      })
    });

    const result = await response.json();
    console.log(result);

    markEmailAsSent(email.id);

  } catch (error) {
    console.log(error);
  }
}
// Mark email as sent
const markEmailAsSent = async (emailId: string) => {
  try {
    await updateDoc(doc(db, 'emails', emailId), {
      status: 'sent',
    });
    return true;
  } catch (error) {
    console.error('Error marking email as sent:', error);
    throw error;
  }
};

let processStart: boolean = false;

const startLoop = (userId: string) => {
  
  const loop = async () => {
    console.log('\n' + '='.repeat(50));
    await fetchScheduledEmails(userId);

    setTimeout(loop, 60000)
  };
  
  if (!processStart) loop();

  console.log(processStart);

  processStart = true;
};


export { startLoop };