# Quick CRM 🚀

A powerful, self-hosted CRM platform with intelligent email campaign management. Built for solo founders, sales professionals, and small teams who need **enterprise-grade personalization without enterprise costs**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?logo=nestjs)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)

## ✨ Key Features

### 🎯 Smart Mail Merge
- **Primary Inbox Delivery**: Send personalized emails that bypass spam filters and land in the Primary inbox
- **Intelligent Rate Limiting**: Automatically throttles emails (30s intervals) to mimic human behavior
- **Variable Replacement**: Dynamic personalization with `{{name}}`, `{{company}}`, and custom fields
- **Queue Management**: BullMQ-powered background processing for reliable, scalable campaigns

### 📊 Contact Management
- Import contacts via JSON
- Organize contacts with tags and custom fields
- Track email engagement per contact

### 📧 Template System
- Rich text editor (WYSIWYG) for email templates
- Reusable templates with variable placeholders
- Template versioning and management

### 📈 Campaign Analytics
- Real-time campaign status tracking
- Success/failure metrics
- Email delivery monitoring

## 🏗️ Architecture

**Backend**: NestJS + TypeScript + MongoDB + Redis  
**Frontend**: React + Vite + TailwindCSS  
**Queue System**: BullMQ (Redis-based job queue)  
**Email Provider**: Gmail SMTP (with App Password support)

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **MongoDB** 5.x or higher ([Installation Guide](https://www.mongodb.com/docs/manual/installation/))
- **Redis** 6.x or higher ([Installation Guide](https://redis.io/docs/getting-started/installation/))
- **Gmail Account** with 2FA enabled ([Setup App Password](https://support.google.com/accounts/answer/185833))

### Quick Setup for Prerequisites

**Windows (with Chocolatey):**
```powershell
choco install mongodb redis-64 nodejs
```

**macOS (with Homebrew):**
```bash
brew install mongodb-community redis node
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install mongodb redis-server nodejs npm
```

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/quick-crm.git
cd quick-crm
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment template
cp .env.example .env
```

**Edit `backend/.env`** with your credentials:
```env
MONGODB_URI=mongodb://localhost:27017/quick-crm
REDIS_HOST=localhost
REDIS_PORT=6379
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-gmail-app-password
PORT=3000
```

> ⚠️ **Important**: Use a Gmail **App Password**, not your regular password.  
> Generate one here: https://myaccount.google.com/apppasswords

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Copy environment template
cp .env.example .env
```

**Edit `frontend/.env`**:
```env
VITE_API_URL=http://localhost:3000
```

### 4. Start Services

**Start MongoDB** (if not running as a service):
```bash
mongod
```

**Start Redis** (if not running as a service):
```bash
redis-server
```

**Start Backend** (from `/backend`):
```bash
npm run start:dev
```

**Start Frontend** (from `/frontend`):
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## 📖 Usage Guide

### 1. Import Contacts
Navigate to **Contacts** → **Import** and upload a JSON file:

```json
[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "customField1": "Value"
  }
]
```

### 2. Create a Template
Go to **Templates** → **New Template**:

```
Subject: Hi {{name}}, quick question about {{company}}

Hi {{name}},

I noticed {{company}} recently expanded into...
```

### 3. Launch a Campaign
1. Select your contacts and template
2. Preview the merge
3. Click **Launch**
4. Monitor progress in **Campaigns**

### 4. Monitor Queue
The system automatically:
- Queues all emails
- Sends at a rate of **1 email per 30 seconds**
- Retries failed sends
- Updates campaign status in real-time

## 🔧 Development

### Project Structure
```
quick-crm/
├── backend/
│   ├── src/
│   │   ├── campaigns/      # Campaign management
│   │   ├── contacts/       # Contact CRUD
│   │   ├── mail/           # Email processor & queue
│   │   │   ├── mail.controller.ts  # API endpoints
│   │   │   ├── mail.processor.ts   # BullMQ worker
│   │   │   └── mail.module.ts      # Module setup
│   │   ├── schemas/        # MongoDB schemas
│   │   └── templates/      # Template management
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── api/            # API client
│   └── .env.example
└── docker-compose.yml      # (Optional) Docker setup
```

### Key Components

**Mail Processor** (`backend/src/mail/mail.processor.ts`):
- Consumes jobs from the `email-queue`
- Performs variable replacement
- Sends via Gmail SMTP
- 30-second rate limit between sends

**Mail Controller** (`backend/src/mail/mail.controller.ts`):
- Receives campaign launch requests
- Enqueues individual email jobs
- Returns immediately to the frontend

### Adding Custom Variables
1. Add field to `Contact` schema
2. Include in template using `{{fieldName}}`
3. Processor automatically replaces during send

## 🐳 Docker Deployment (Optional)

```bash
docker-compose up -d
```

This starts MongoDB, Redis, Backend, and Frontend in containers.

## 🛡️ Security Best Practices

### ✅ What's Protected:
- `.env` files are gitignored
- No credentials in source code
- App Passwords instead of Gmail passwords

### ⚠️ Before Production:
1. Enable HTTPS/TLS
2. Add authentication (JWT/OAuth)
3. Implement rate limiting on API endpoints
4. Use dedicated SMTP service (SendGrid, Mailgun) instead of Gmail
5. Add input validation and sanitization
6. Enable CORS restrictions

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Roadmap

See [`future_ideas.md`](./future_ideas.md) for planned enhancements:

- 🔮 **AI-Powered Data Enrichment** (Domain → CEO Name)
- ⏸️ **Queue Dashboard** (Pause/Edit pending emails)
- 🎲 **Smart Spintax** (Randomized variations for spam avoidance)
- 🤖 **Free-Tier AI Arbiter** (Multi-model data enrichment)

## 🐛 Troubleshooting

### "Error: listen EADDRINUSE: address already in use :::3000"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### "ECONNREFUSED ::1:6379" (Redis not running)
```bash
# Start Redis
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:alpine
```

### Emails not sending
1. Verify Gmail App Password is correct
2. Check Redis is running
3. Check backend logs for errors
4. Ensure 2FA is enabled on Gmail account

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- UI powered by [React](https://react.dev/) + [TailwindCSS](https://tailwindcss.com/)
- Queue system by [BullMQ](https://docs.bullmq.io/)

---

**Made with ❤️ for the indie hacker community**

*Questions? Open an issue or reach out!*
