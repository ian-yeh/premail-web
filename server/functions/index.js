import * as functions from 'firebase-functions/v2';
import { OAuth2Client } from 'google-auth-library';
import cors from 'cors';

const corsHandler = cors({ origin: true });

const authClient = new OAuth2Client(
  "716385265566-322eso5asg468bu6v590khqkfoomf927.apps.googleusercontent.com",
  "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",
  "https://localhost:5173/popup.html"
)

// Auth URL Generator Function
export const authGmail = functions.https.onRequest((req, res) => {
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

  try {
    // Exchange code for tokens
    const { tokens } = await authClient.getToken(code);
    authClient.setCredentials(tokens);

    console.log(tokens.access_token, tokens.refresh_token)

    // Return tokens to frontend (or store them securely)
    res.json({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to get token" });
  }
});

