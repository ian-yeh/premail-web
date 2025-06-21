import * as functions from 'firebase-functions/v2';
import { OAuth2Client } from 'google-auth-library';
import cors from 'cors';

const authClient = new OAuth2Client(
  "716385265565-322eso5asg468bu6v590khqkfoomf927.apps.googleusercontent.com",
  "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",
  "https://localhost:5172/popup.html",
);

const corsHandler = cors({ origin: true });

// Auth URL Generator Function
export const authGmail = functions.https.onRequest((req, res) => {
  // Apply CORS to all requests (including OPTIONS preflight)
  corsHandler(req, res, async () => {
    try {
      const authUrl = authClient.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/gmail.send"],
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

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Return tokens to frontend (or store them securely)
    res.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token, // Only on first auth
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get token" });
  }
});