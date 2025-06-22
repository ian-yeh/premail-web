// Testing module for processScheduledEmails function
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
//import { Email } from './emailService';

// Initialize Firestore (adjust based on your setup)
import { db } from './firebaseConfig';

// Process pending scheduled emails - Testing Version
const processScheduledEmails = async () => {
  try {
    const now = Timestamp.now();
    console.log('🕐 Current time:', now.toDate());
    console.log('🕐 Current timestamp:', now);
    
    // Query for emails that are scheduled and due
    const q = query(
      collection(db, 'emails'),
      where('status', '==', 'scheduled'),
      where('scheduledDate', '<=', now)
    );
    
    console.log('📝 Query created for scheduled emails due before:', now.toDate());
    
    const snapshot = await getDocs(q);
    console.log(`📧 Found ${snapshot.docs.length} emails to process`);
    
    if (snapshot.empty) {
      console.log('✅ No scheduled emails to process at this time');
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
    
    console.log('\n📊 TEST RESULTS:');
    console.log('================');
    console.log(`Total emails found: ${results.length}`);
    
    if (results.length > 0) {
      console.log('\n📋 Summary of emails to send:');
      results.forEach((email, index) => {
        console.log(`${index + 1}. ${email.subject} -> ${email.to}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// For manual testing - run once
console.log('🧪 Testing processScheduledEmails function...');
runTest();

// For continuous testing - run every 30 seconds
const startTestLoop = () => {
  console.log('🔄 Starting test loop (every 30 seconds)...\n');
  
  const testLoop = async () => {
    console.log('\n' + '='.repeat(50));
    console.log('🔄 Running scheduled test...');
    await runTest();
    console.log('⏱️ Next test in 30 seconds...');
    setTimeout(testLoop, 30000);
  };
  
  testLoop();
};

console.log("HI")


// Uncomment to start continuous testing:
export { startTestLoop };