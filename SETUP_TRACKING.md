## Quick Setup: Make Tracking Work with ngrok

### Step 1: Download ngrok
1. Go to https://ngrok.com/download
2. Download for Windows
3. Extract the .exe file

### Step 2: Run ngrok
Open a new PowerShell terminal and run:
```bash
ngrok http 4000
```

You'll see something like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:4000
```

### Step 3: Update your .env file
Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`) and add to `backend/.env`:

```
BASE_URL=https://abc123.ngrok-free.app
```

### Step 4: Restart your backend
Press Ctrl+C in your backend terminal, then run:
```bash
npm run start:dev
```

### Step 5: Send a new test email
Launch a new campaign - the tracking pixel will now use your public ngrok URL instead of localhost!

### Step 6: Open the email
When you open it in Gmail, the tracking will work because Gmail can reach your ngrok URL!

---

## Alternative: Test Manually (What You're Doing Now)

Visit this URL in your browser:
```
http://localhost:4000/track/open?campaignId=697b1dddd7f806c0eff6892b&contactId=697b023cd5639730c4e21245
```

Then refresh your campaign page - the open count should increase!
