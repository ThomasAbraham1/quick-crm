# 🚀 GitHub Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository:
   - **Name**: `quick-crm` (or your preferred name)
   - **Description**: "Self-hosted CRM with intelligent email campaigns"
   - **Visibility**: Public or Private (your choice)
   - ⚠️ **DO NOT** initialize with README, .gitignore, or license (we already have these)

## Step 2: Link Local Repository to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/quick-crm.git

# Or use SSH (recommended if you have SSH keys set up)
git remote add origin git@github.com:YOUR_USERNAME/quick-crm.git
```

## Step 3: Verify No Secrets Are Being Committed

Run this command to double-check:

```bash
git log --all --full-history --source -- backend/.env
```

**Expected output**: Nothing (empty). If you see commits, STOP and follow the "Emergency: Secret Leaked" section in `SECURITY.md`.

Also verify:
```bash
git ls-files | grep -E '\.env$'
```

**Expected output**: Nothing. Only `.env.example` files should be tracked.

## Step 4: Push to GitHub

```bash
# Set the default branch name
git branch -M main

# Push your code
git push -u origin main
```

If prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a [Personal Access Token](https://github.com/settings/tokens) (not your GitHub password)

## Step 5: Set Up Repository Settings (Recommended)

### A. Add Topics (for discoverability)
Go to your repository → About ⚙️ → Add topics:
- `crm`
- `nestjs`
- `react`
- `email-automation`
- `typescript`
- `mongodb`
- `bullmq`

### B. Enable Security Features
Repository → Settings → Security:
- ✅ Enable "Dependency graph"
- ✅ Enable "Dependabot alerts"
- ✅ Enable "Dependabot security updates"

### C. Add Description and Website
- **Description**: "Self-hosted CRM with intelligent mail merge and campaign management"
- **Website**: Your deployed URL (if applicable)

## Step 6: Create a GitHub Release (Optional)

```bash
# Tag your first version
git tag -a v1.0.0 -m "Initial release: Core CRM functionality"
git push origin v1.0.0
```

Then go to GitHub → Releases → Draft a new release:
- **Tag**: v1.0.0
- **Title**: "Quick CRM v1.0.0 - Initial Release"
- **Description**: Copy the features section from `README.md`

---

## 🌐 Optional: Deploy to Production

### Option 1: Railway (Easiest)
1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables from `.env.example`
5. Railway will auto-detect and deploy

### Option 2: Vercel (Frontend) + Render (Backend)
**Frontend:**
```bash
npm install -g vercel
cd frontend
vercel
```

**Backend:**
1. Push to GitHub
2. Go to [render.com](https://render.com)
3. "New Web Service" → Select your repo
4. Add environment variables
5. Deploy

### Option 3: DigitalOcean / AWS / Azure
Use Docker:
```bash
docker-compose up -d
```

Detailed deployment guides: See `DEPLOYMENT.md` (create if needed).

---

## 📊 Add GitHub Actions (CI/CD) - Optional

Create `.github/workflows/test.yml`:

```yaml
name: Test & Build

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Backend Dependencies
        run: cd backend && npm ci
      
      - name: Build Backend
        run: cd backend && npm run build
      
      - name: Install Frontend Dependencies
        run: cd frontend && npm ci
      
      - name: Build Frontend
        run: cd frontend && npm run build
```

---

## 🎯 Next Steps After Pushing

1. ✅ Verify your code is on GitHub
2. ✅ Update the README with your repository URL
3. ✅ Add screenshots/demo GIF (use [Gifcap](https://gifcap.dev/))
4. ✅ Share on:
   - Twitter/X with #opensource
   - Reddit (r/opensource, r/selfhosted)
   - Hacker News (Show HN)
   - Product Hunt

---

## 🤝 Accepting Contributions

If you want others to contribute:

1. Add a GitHub Issue template:
   - Go to Settings → Features → Set up templates
   - Add "Bug Report" and "Feature Request" templates

2. Add a Pull Request template:
   Create `.github/PULL_REQUEST_TEMPLATE.md`:
   ```markdown
   ## Description
   <!-- What does this PR do? -->

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update

   ## Checklist
   - [ ] Code builds without errors
   - [ ] Tested locally
   - [ ] Updated documentation
   ```

---

## 🔒 Final Security Check

Before pushing:
```bash
# Check for accidentally committed secrets
git secrets --scan

# Or manually grep
git grep -E 'password|secret|key' | grep -v '.example'
```

If you find any secrets:
1. Remove them immediately
2. Rotate the credentials
3. Follow steps in `SECURITY.md`

---

**You're all set!** 🎉 Your Quick CRM is now on GitHub and ready to share with the world.

Need help? Open an issue in this repository!
