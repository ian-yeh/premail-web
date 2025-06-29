import * as functions from 'firebase-functions/v2';
import { OAuth2Client } from 'google-auth-library';
import cors from 'cors';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { defineString } from 'firebase-functions/params';
import { google } from 'googleapis';


// Initialize Firebase Admin (only once)
initializeApp();
const db = getFirestore();

const clientId = defineString('GMAIL_CLIENT_ID');
const clientSecret = defineString('GMAIL_CLIENT_SECRET');
const redirectURI = defineString('GMAIL_REDIRECT_URI');

const corsHandler = cors({ origin: true });

// Auth URL Generator Function
export const authGmail = functions.https.onRequest((req, res) => {
  // creating auth client
  const authClient = new OAuth2Client(
    clientId.value(),
    clientSecret.value(),
    redirectURI.value()
  );
  // Apply CORS to all requests (including OPTIONS preflight)
  corsHandler(req, res, async () => {
    try {
      const authUrl = authClient.generateAuthUrl({
        access_type: "offline",
        prompt: 'consent',
        scope: [
          "https://www.googleapis.com/auth/gmail.send",
          "https://www.googleapis.com/auth/gmail.readonly"
        ],
      });

      // Return JSON (better for frontend)
      res.json({ authUrl });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate auth URL" });
    }
  });
});

export const oauthCallback = functions.https.onRequest(async (req, res) => {
  const { code } = req.query; // From ?code=...

  const { userId } = req.body;

  const authClient = new OAuth2Client(
    clientId.value(),
    clientSecret.value(),
    "https://localhost:5173/popup.html",
  );

  try {
    // Exchange code for tokens
    const { tokens } = await authClient.getToken(code);
    authClient.setCredentials(tokens);

    console.log(tokens.access_token, tokens.refresh_token)

    await db.collection('users').doc(userId).update({
      gmailAccessToken: tokens.access_token,
      gmailRefreshToken: tokens.refresh_token,
      gmailTokenExpiresAt: tokens.expiry_date || (Date.now() + (tokens.expires_in * 1000)),
      gmailConnectedAt: Date.now(),
      gmailConnected: true
    });

    // Return tokens to frontend (or store them securely)
    res.json({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      userId,
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to get token" });
  }
});

// Email sending function
export const sendEmail = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { userId, emailData } = req.body;

    // Validate required fields
    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    if (!emailData || !emailData.to || !emailData.subject || (!emailData.htmlBody && !emailData.textBody)) {
      res.status(400).json({ 
        error: 'emailData with to, subject, and htmlBody or textBody is required' 
      });
      return;
    }

    try {
      // Get user data with Gmail tokens
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      const userData = userDoc.data();
      if (!userData.gmailAccessToken || !userData.gmailRefreshToken) {
        res.status(400).json({ error: 'No Gmail tokens found for user' });
        return;
      }

      // Create OAuth2 client for this request
      const oauth2Client = new OAuth2Client(
        clientId.value(),
        clientSecret.value(),
        "https://localhost:5173/popup.html"
      );

      // Set credentials
      oauth2Client.setCredentials({
        access_token: userData.gmailAccessToken,
        refresh_token: userData.gmailRefreshToken
      });

      // Handle token refresh
      oauth2Client.on('tokens', async (newTokens) => {
        console.log('Token refreshed, updating Firestore...');
        
        const updateData = {};
        if (newTokens.access_token) {
          updateData.gmailAccessToken = newTokens.access_token;
        }
        if (newTokens.refresh_token) {
          updateData.gmailRefreshToken = newTokens.refresh_token;
        }
        if (newTokens.expiry_date) {
          updateData.gmailTokenExpiresAt = newTokens.expiry_date;
        }
        
        await db.collection('users').doc(userId).update(updateData);
      });

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      // Create email message
      const { to, subject, htmlBody, textBody } = emailData;
      
      const emailLines = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=utf-8',
        '',
        htmlBody || textBody
      ];

      const email = emailLines.join('\r\n');
      
      // Encode email in base64url format
      const encodedEmail = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send the email
      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedEmail
        }
      });

      res.json({
        success: true,
        messageId: response.data.id,
        message: 'Email sent successfully'
      });

    } catch (error) {
      console.error('Error sending email:', error);
      
      if (error.code === 401) {
        res.status(401).json({
          success: false,
          error: 'Authentication failed - tokens may be invalid or expired'
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    }
  });
});

