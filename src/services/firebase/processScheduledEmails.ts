// Testing module for processScheduledEmails function
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Process pending scheduled emails - Testing Version
const processScheduledEmails = async () => {
  try {
    const now = Timestamp.now();
    //console.log('🕐 Current time:', now.toDate());
    //console.log('🕐 Current timestamp:', now);
    
    // Query for emails that are scheduled and due
    const q = query(
      collection(db, 'emails'),
      where('status', '==', 'scheduled'),
    );

    
      //where('scheduledDate', '<=', now)
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }
    
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

// Test runner function
const runTest = async () => {
  console.log('🚀 Starting scheduled email test...\n');
  
  try {
    const results = await processScheduledEmails();
    
    console.log('\n📋 Summary of emails to send:');
    if (results.length > 0) {
      results.forEach((email, index) => {
        console.log(`${index + 1}. ${email.subject} -> ${email.to}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// For continuous testing - run every 30 seconds
const startLoop = () => {
  console.log('🔄 Starting test loop (every 30 seconds)...\n');
  
  const loop = async () => {
    console.log('\n' + '='.repeat(50));
    await runTest();
    setTimeout(loop, 30000);
  };
  
  loop();
};

export { startLoop };