# 🚀 Social Media Automation & AI Scheduler

A modern, full-stack AI-powered social media management and post scheduling platform. Create engaging content with Google Gemini AI, generate visuals via Leonardo.ai, manage multiple social accounts (LinkedIn, Twitter/X, Instagram, Facebook), and schedule automated posts effortlessly.

---

## ✨ Features

- 🤖 **AI Post Composer**: Generate ready-to-publish social media captions tailored to specific tones (Professional, Creative, Funny, Minimalist, Excited) using **Google Gemini AI**.
- 🎨 **AI Image Generation**: Automated image generation using **Leonardo.ai** and cloud storage integration with **Cloudinary**.
- 🗂️ **Generations Management**:
  - Filter generations by tone with instant counter badges.
  - Custom pagination with configurable page size (10, 15, 20, 30, 40 per page).
  - One-click post deletion and instant scheduling.
- 🔗 **Multi-Platform Social OAuth**: Connect and sync accounts with **LinkedIn, Twitter/X, Instagram, and Facebook** powered by **Zernio API**.
- ⏰ **Automated Post Scheduler**: Schedule posts with custom media (images/videos), dates, times, and target platforms. An automated background worker publishes posts on time using `node-cron`.
- 🔑 **Bring Your Own API Keys (BYOK)**: Users can configure and securely store their own personal API keys (`GEMINI_API_KEY`, `LEONARDO_API_KEY`, `ZERNIO_API_KEY`) directly from the UI (Settings -> API Keys) with masked show/hide visibility toggles.
- ⚙️ **User Profile & Security Settings**: Full profile name customization, customizable avatar color styles, and password management.
- 🔐 **Secure Authentication**: User registration and login protected with JWT and bcrypt password hashing.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React & Simple Icons
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios
- **Routing**: React Router v7

### Backend (`/server`)
- **Runtime**: Node.js + Express 5 + TypeScript (`tsx` / `nodemon`)
- **Database**: MongoDB with Mongoose ODM
- **AI Integrations**:
  - `@google/genai` (Google Gemini 2.5 Flash)
  - Leonardo.ai REST API
- **Social Media API**: `@zernio/node` (Zernio Social API)
- **Media Storage**: Cloudinary & Multer
- **Background Tasks**: Node-Cron scheduler
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcrypt`

---

## 📂 Project Structure

```plaintext
social-media-automation/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── api/                # Axios instance & interceptors
│   │   ├── assets/             # Static assets, platform configurations
│   │   ├── components/         # Reusable UI components (Sidebar, Layout, Modal, etc.)
│   │   ├── context/            # AuthContext and state providers
│   │   ├── pages/              # Dashboard, AIComposer, Scheduler, Accounts, Login
│   │   ├── App.tsx             # Route definitions
│   │   └── main.tsx            # App entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                     # Backend Express server
│   ├── config/                 # DB, Cloudinary, Multer, Zernio configurations
│   ├── controllers/            # Auth, Accounts, Posts, Activity, SocialAuth controllers
│   ├── middlewares/            # JWT authentication middleware
│   ├── models/                 # Mongoose models (User, Post, Account, Generation, Activity)
│   ├── routes/                 # Express API routes
│   ├── services/               # Background scheduler service (node-cron)
│   ├── server.ts               # Server entry point
│   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the `server` directory (`server/.env`):

```env
PORT=3000
MONGODB_URL=mongodb://127.0.0.1:27017/scheduler
JWT_SECRECT=your_jwt_secret_key

# Social OAuth & Automation (Zernio)
ZERNIO_API_KEY=your_zernio_api_key

# AI Content Generation
GEMINI_API_KEY=your_google_gemini_api_key
LEONARDO_API_KEY=your_leonardo_ai_api_key

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally or MongoDB Atlas URI

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start server in development mode
npm run server
```

The backend will start on `http://localhost:3000`.

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The frontend will start on `http://localhost:5173`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Log in user and receive JWT | ❌ |
| `GET` | `/api/oauth/:platform/url` | Get OAuth connection URL | ✅ |
| `GET` | `/api/oauth/sync` | Sync connected accounts from Zernio | ✅ |
| `GET` | `/api/accounts` | Fetch user's connected social accounts | ✅ |
| `DELETE` | `/api/accounts/:id` | Disconnect a social account | ✅ |
| `POST` | `/api/posts/generate` | Generate AI caption & image | ✅ |
| `GET` | `/api/posts/generations` | Fetch history of AI generations | ✅ |
| `DELETE` | `/api/posts/generations/:id` | Delete an AI generation | ✅ |
| `GET` | `/api/posts` | Fetch scheduled/published posts | ✅ |
| `POST` | `/api/posts` | Schedule a new post (supports multipart media) | ✅ |
| `GET` | `/api/activity` | Get recent account activities & logs | ✅ |

---

## 📝 License

This project is licensed under the [ISC License](LICENSE).
