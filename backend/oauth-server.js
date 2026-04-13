import express from 'express'
import { google } from 'googleapis'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
let refreshToken = null

// OAuth credentials from environment variables
const CLIENT_ID = process.env.GMAIL_CLIENT_ID || ''
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || ''
const CALLBACK_URL = process.env.GMAIL_REDIRECT_URL || 'http://localhost:3333/callback'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET must be set in .env file')
  process.exit(1)
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  CALLBACK_URL
)

const scopes = ['https://www.googleapis.com/auth/gmail.send']

app.get('/', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  })

  res.send(`
    <html>
      <head>
        <title>Gmail OAuth2 Authorization</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; text-align: center; }
          a { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #4285F4; color: white; text-decoration: none; border-radius: 4px; }
          a:hover { background: #1572E8; }
        </style>
      </head>
      <body>
        <h1>Gmail OAuth2 Authorization</h1>
        <p>Click the button below to authorize the EAC Email Service:</p>
        <a href="${authUrl}">Authorize with Google</a>
      </body>
    </html>
  `)
})

app.get('/callback', async (req, res) => {
  const code = req.query.code

  if (!code) {
    return res.send('Error: No authorization code provided')
  }

  try {
    const { tokens } = await oauth2Client.getToken(code)
    refreshToken = tokens.refresh_token

    res.send(`
      <html>
        <head>
          <title>Success!</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 700px; margin: 50px auto; }
            .success { background: #e8f5e9; border: 1px solid #4caf50; padding: 20px; border-radius: 4px; }
            code { background: #f5f5f5; padding: 2px 6px; font-family: monospace; }
            .token { background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0; word-break: break-all; }
            pre { background: #263238; color: #aed581; padding: 15px; border-radius: 4px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <div class="success">
            <h1>✅ Authorization Successful!</h1>
            <p>Your refresh token has been generated. Copy the value below and add it to your .env file:</p>
            
            <h3>GMAIL_REFRESH_TOKEN:</h3>
            <div class="token">${tokens.refresh_token}</div>
            
            <h3>Complete .env snippet:</h3>
            <pre># Gmail OAuth2 Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_CLIENT_ID=your-client-id-here
GMAIL_CLIENT_SECRET=your-client-secret-here
GMAIL_REFRESH_TOKEN=${tokens.refresh_token}
GMAIL_REDIRECT_URL=http://localhost:8888/api/auth/google/callback</pre>

            <h3>Next Steps:</h3>
            <ol>
              <li>Copy the GMAIL_REFRESH_TOKEN value above</li>
              <li>Edit <code>WebPage/backend/.env</code></li>
              <li>Replace <code>your-email@gmail.com</code> with your Gmail address</li>
              <li>Paste the GMAIL_REFRESH_TOKEN value</li>
              <li>Save and restart the backend server</li>
              <li>Test by creating a new user in Admin Dashboard</li>
            </ol>
          </div>
        </body>
      </html>
    `)
  } catch (err) {
    res.send(`Error: ${err.message}`)
  }
})

const port = 3333
app.listen(port, () => {
  console.log(`\n${'='.repeat(60)}`)
  console.log('Gmail OAuth2 Authorization Server')
  console.log('='.repeat(60))
  console.log(`\n🔗 Open this URL in your browser:`)
  console.log(`\n   http://localhost:${port}`)
  console.log(`\n⏳ Wait for the browser to redirect and show your refresh token`)
  console.log(`\n${'='.repeat(60)}\n`)
})
