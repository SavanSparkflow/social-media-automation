# 🚀 Social Media Automation & AI Scheduler (SaaS)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue?style=for-the-badge&logo=vercel)](https://social-media-automation-bice-two.vercel.app/)
[![React](https://img.shields.io/badge/React%2019-Vite-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Leonardo.ai](https://img.shields.io/badge/Leonardo.ai-Visual%20Gen-FF5722?style=for-the-badge)](https://leonardo.ai/)

A high-performance, full-stack AI-driven social media management and autonomous scheduling platform. Plan, write, generate AI visuals, repurpose multi-channel content, reverse-engineer competitor virality, and schedule automated publishing across **LinkedIn, Twitter/X, Instagram, and Facebook**.

🌐 **Live Demo Website:** [https://social-media-automation-bice-two.vercel.app/](https://social-media-automation-bice-two.vercel.app/)

---

## 🌟 Key Highlights & Next-Gen AI Features

### 1. 🤖 AI Post Composer & Visual Generator
- **Multi-Tone AI Writing**: Generate viral captions tailored for custom tones (*Professional, Creative, Funny, Minimalist, Excited*) powered by **Google Gemini 2.5 Flash**.
- **Leonardo.ai Visual Studio**: Automated high-resolution graphic generation with instant Cloudinary cloud uploads.
- **Tone Filtering & Pagination**: Filter past generations by tone, search records, and delete or schedule directly in 1 click.

### 2. 🔄 1-Click Multi-Platform Content Repurposer
- Transform any **Blog URL, YouTube video link, or raw article text** into 5 distinct, platform-optimized formats in seconds:
  - 🧵 **Twitter/X Viral Thread**: 5–7 hook-driven tweets.
  - 💼 **LinkedIn Story / Carousel**: Formatted slide-ready breakdown.
  - 📸 **Instagram Caption + Image Prompt**: High-engagement post with hashtag clouds.
  - 👥 **Facebook Discussion Post**: Community-driven discussion starters.
  - 🎬 **Short-form Video Hook / Script**: TikTok & Reels ready script outline.

### 3. 📅 30-Day Auto-Pilot Campaign Planner
- Input a simple 2-sentence brand summary (e.g. *"Organic Skincare Direct-to-Consumer Brand"*).
- Generates a full **30-Day multi-channel social media roadmap** with themes, post copy, visual recommendations, and optimal publishing time slots.
- **1-Click Batch Scheduler**: Auto-schedules all 30 posts straight into your calendar queue.

### 4. 🕵️ Competitor Post "Reverse-Engineer" (Viral Decoder)
- Paste any viral post link or copy from competitors.
- AI deconstructs the **Psychological Hook Formula**, **Engagement Triggers**, and **Format Architecture**.
- Automatically produces **3 unique, ready-to-publish variations** tailored specifically to your brand.

### 5. 🎁 "Comment & Get" Auto-Lead Magnet Funnel Studio
- Turn public comments into hot direct message leads automatically.
- **AI Funnel Copilot**: Generates high-converting post copy with CTA, trigger keywords (e.g. `GUIDE`, `PDF`), 4 rotating natural comment replies, and personalized DM blueprints.
- **Interactive Live Simulator**: Test triggers and watch live keyword detection, public replies, and DM deliveries in real-time.
- **Captured Leads CRM**: Search, filter, and 1-click **Export Leads to CSV**.

### 6. 💳 Razorpay Payments & Subscription Gating
- **Tier-Based Access Control**:
  - 🆓 **Free Starter**: 50 Credits, 1 Social Account, Composer & Basic Scheduler.
  - 🚀 **Pro Creator (₹499/mo or ₹4,999/yr)**: 500 Credits, 5 Accounts, Repurposer, 30D Autopilot, Viral Decoder.
  - 👑 **Agency / Business (₹1,499/mo or ₹14,999/yr)**: 2,000 Credits, Unlimited Accounts, Lead Magnet Funnel Studio & CRM.
  - 🪙 **Add-On Credit Packs**: Instant top-up packs starting from ₹99.
- **Razorpay Checkout SDK**: Instant activation with UPI (GPay, PhonePe, Paytm), Cards, and NetBanking with HMAC-SHA256 signature verification.
- **Graceful Feature Gating**: Non-subscribers get informative preview cards with 1-click Razorpay upgrade triggers.

### 7. 💳 Real-Time AI Credit & API Health Inspector
- **Free Credit System**: Built-in 50-credit starter quota with real-time UI credit meters and low-credit notifications.
- **BYOK (Bring Your Own Key)**: Input your own Gemini API Key for **Unlimited 100% Free Generations**.
- **Live Multi-API Inspector**: In Settings, verify connection health and live balance for:
  - 🟣 **Google Gemini**: Real-time RPM/TPM quota validation.
  - 🎨 **Leonardo.ai**: Live token balance query via `GET /api/rest/v1/me`.
  - 🔗 **Zernio Social API**: Social account sync and scheduling status.

### 8. 🔗 Multi-Platform Social OAuth & Autonomous Scheduler
- Connect accounts seamlessly: **LinkedIn, Twitter/X, Instagram, and Facebook**.
- Autonomous background scheduler powered by `node-cron` ensuring zero missed posting windows.

### 9. 📄 Complete Marketing & Legal Suite
- **Product Pages**: `/features`, `/how-it-works`, `/pricing`, `/changelog`
- **Company Pages**: `/about`, `/blog`, `/careers`, `/press`
- **Legal Compliance**: `/privacy`, `/terms`, `/security`, `/cookies`

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Simple Icons, Axios, React Hot Toast, React Router v7 |
| **Backend** | Node.js, Express 5, TypeScript (`tsx` / `nodemon`), Mongoose, Node-Cron, Cheerio (web scraping), Multer |
| **Database** | MongoDB & MongoDB Atlas |
| **AI Engines** | Google Gemini 2.5 Flash (`@google/genai`), Leonardo.ai REST API |
| **Social API & Media** | Zernio Social OAuth Engine (`@zernio/node`), Cloudinary CDN |
| **Security** | JWT Authentication, Bcrypt Password Hashing, Masked API Key Storage |

---

## 📂 Project Structure

```plaintext
social-media-automation/
├── client/                          # React + TypeScript Frontend
│   ├── src/
│   │   ├── api/                     # Axios instance & interceptors
│   │   ├── assets/                  # Platform configs & branding
│   │   ├── components/
│   │   │   ├── AICreditBadge.tsx    # Real-time token meter & low-credit warnings
│   │   │   ├── Home/                # Landing Navbar, Hero, Features, Footer, PublicLayout
│   │   │   ├── Layout/              # Dashboard Sidebar, Header, Navigation
│   │   │   └── ...                  # Modals, forms, badges
│   │   ├── context/                 # AuthContext (Auth & live credit state)
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx        # Analytics & quick launch
│   │   │   ├── AIComposer.tsx       # AI prompt composer & Leonardo studio
│   │   │   ├── ContentRepurposer.tsx# 1-Click 5-in-1 multi-format repurposer
│   │   │   ├── CampaignPlanner.tsx  # 30-Day Auto-Pilot campaign planner
│   │   │   ├── CompetitorDecoder.tsx# Competitor viral post reverse-engineer
│   │   │   ├── Scheduler.tsx        # Post scheduler & calendar view
│   │   │   ├── Accounts.tsx         # Social OAuth account manager
│   │   │   ├── Settings.tsx         # Profile, BYOK & Live API Health Inspector
│   │   │   ├── ...                  # Marketing & Legal pages
│   │   ├── App.tsx                  # Client routing structure
│   │   └── main.tsx                 # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                          # Express + TypeScript Backend
│   ├── config/                      # MongoDB, Cloudinary, Multer, Zernio configs
│   ├── controllers/
│   │   ├── authController.ts        # Auth, BYOK keys, live credit & API health inspector
│   │   ├── postController.ts        # AI generation & post scheduling
│   │   ├── repurposeController.ts   # URL scraping & 5-format AI repurposing
│   │   ├── campaignController.ts    # 30-day campaign planning & batch scheduling
│   │   ├── competitorController.ts  # Viral post deconstruction & brand variations
│   │   ├── accountsController.ts    # Connected social account management
│   │   ├── socialAuthController.ts  # Zernio OAuth URL generation & sync
│   │   └── activityController.ts    # Audit logs & history
│   ├── middlewares/                 # JWT Authentication & error handlers
│   ├── models/                      # User, Post, Account, Generation, Activity models
│   ├── routes/                      # Express route endpoints
│   ├── services/                    # Autonomous background scheduler (node-cron)
│   ├── server.ts                    # Backend entry point
│   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Variables

Create `.env` in the `server` directory (`server/.env`):

```env
PORT=3000
MONGODB_URL=mongodb://127.0.0.1:27017/scheduler
JWT_SECRECT=your_jwt_secret_key

# Social OAuth & Autonomous Publishing
ZERNIO_API_KEY=your_zernio_api_key

# AI Content Generation Engines (System Defaults)
GEMINI_API_KEY=your_google_gemini_api_key
LEONARDO_API_KEY=your_leonardo_ai_api_key

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create `.env` in the `client` directory (`client/.env`):

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas)

### 1. Run the Backend Server
```bash
cd server
npm install
npm run server
```
Server runs on `http://localhost:3000`.

### 2. Run the Frontend App
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`.

---

## 📡 Core API Endpoints

| Category | Method | Endpoint | Description | Auth |
|---|---|---|---|:---:|
| **Auth & Credits** | `POST` | `/api/auth/register` | Register new user account | ❌ |
| | `POST` | `/api/auth/login` | Log in and receive JWT token | ❌ |
| | `GET` | `/api/auth/credits` | Get remaining AI credits & BYOK status | ✅ |
| | `POST` | `/api/auth/api-keys/check-status`| Live quota & balance check for Gemini, Leonardo, Zernio | ✅ |
| **Content & AI** | `POST` | `/api/posts/generate` | Generate AI caption & Leonardo.ai visual | ✅ |
| | `POST` | `/api/posts/repurpose` | 1-Click repurpose link/text into 5 platform formats | ✅ |
| | `POST` | `/api/posts/campaign/generate-30-days`| Generate complete 30-day marketing plan | ✅ |
| | `POST` | `/api/posts/campaign/batch-schedule` | 1-Click batch schedule all 30 campaign posts | ✅ |
| | `POST` | `/api/posts/competitor/reverse-engineer`| Deconstruct viral post and get 3 brand variations | ✅ |
| **Lead Magnet Funnels** | `GET` | `/api/lead-magnets` | Fetch all active campaigns & lead stats | ✅ |
| | `POST` | `/api/lead-magnets` | Create new Lead Magnet automation | ✅ |
| | `POST` | `/api/lead-magnets/ai-draft` | AI Copilot draft of post, keywords & DM | ✅ |
| | `PUT` | `/api/lead-magnets/:id` | Update or pause/activate campaign | ✅ |
| | `DELETE`| `/api/lead-magnets/:id` | Delete lead magnet campaign | ✅ |
| | `POST` | `/api/lead-magnets/:id/test-trigger` | Live simulation trigger & DM test | ✅ |
| **Scheduling** | `POST` | `/api/posts` | Schedule single post (with custom media) | ✅ |
| | `GET` | `/api/posts` | Fetch scheduled / published post list | ✅ |
| **Social Accounts**| `GET` | `/api/oauth/:platform/url` | Generate OAuth connection link | ✅ |
| | `GET` | `/api/oauth/sync` | Sync active connected accounts from Zernio | ✅ |
| | `GET` | `/api/accounts` | Get list of user's connected social channels | ✅ |

---

## 📬 Contact & Support

For queries, business collaborations, or enterprise feature requests:

- 👤 **Founder / Developer:** Savan
- 📧 **Email:** [asavant151@gmail.com](mailto:asavant151@gmail.com)
- 📞 **Phone / WhatsApp:** [+91 9737531475](tel:+919737531475)
- 🌐 **Project Live URL:** [https://social-media-automation-bice-two.vercel.app/](https://social-media-automation-bice-two.vercel.app/)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
