# FixMyArea v2.0 🗺️

A modern civic infrastructure reporting platform where citizens can report public issues and municipal authorities can track and resolve them.

## ✨ Features

### Citizens
- 📸 Report issues with photo upload in 60 seconds
- 📋 9 issue categories (Potholes, Street Lights, Sewage, etc.)
- 🎯 Priority levels: Low → Critical
- 👍 Vote on issues to signal importance
- 💬 Comment on issues
- 📊 Personal dashboard to track your reports
- 🔔 Official notes from authorities on your submissions

### Municipal Authorities
- 🗂️ View all citizen-reported issues with filters
- 🔄 Update issue status (Pending → In Progress → Resolved → Rejected)
- 📝 Add official notes for citizens
- 👤 Assign issues to departments/officers
- 📊 Stats overview

### Admin
- 👥 Full user management
- 🔑 Assign/revoke municipal roles
- 📈 Platform-wide analytics by category and priority

## 🚀 Tech Stack

**Frontend:** React 18 + Vite + TailwindCSS + Framer Motion + React Hot Toast  
**Backend:** Node.js + Express 5 + MongoDB + Mongoose + JWT + Multer  
**UI Design:** Liquid Glass aesthetic — dark background with frosted glass cards, indigo/violet gradient accents

## 📦 Setup & Commands

### Local Development Setup

#### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

#### Backend Setup
```bash
cd Backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

#### Frontend Setup
```bash
cd Frontend
npm install
cp .env.example .env
# Edit .env — VITE_API_BASE_URL should point to your backend (default is port 4009)
npm run dev
```

### 🐳 Docker Setup (Recommended)
You can run the entire stack (Frontend, Backend, MongoDB) inside Docker with a single command.

#### Run in Production Mode
```bash
docker compose up --build
```
- Frontend will be accessible at: `http://localhost:8080`
- Backend will be accessible at: `http://localhost:4009`
- API documentation (Swagger UI) is available at: `http://localhost:4009/api/docs`

#### Run in Development Mode (with Hot Reloading)
```bash
docker compose -f docker-compose.dev.yml up --build
```
- Frontend will be accessible at: `http://localhost:5173`
- Backend will be accessible at: `http://localhost:4009`

### 🧪 Testing & Code Quality

#### Run Backend Tests
```bash
cd Backend
npm test
```

#### Run Backend Linter & Formatter
```bash
cd Backend
npm run lint      # Check for style and semantic issues
npm run format    # Format code with Prettier
```

## ⚙️ Environment Variables

**Backend `.env`:**
```
PORT=4009
MONGO_URI=mongodb://localhost:27017/fixmyarea
JWT_SECRET=your_super_secret_key
DB_NAME=fixmyareaOne
```

**Frontend `.env`:**
```
VITE_API_BASE_URL=http://localhost:4009/v1/api
```

## 🔐 Roles

| Role | Access |
|------|--------|
| `citizen` | Report issues, vote, comment, view own dashboard |
| `municipal` | View all issues, update status, add official notes |
| `admin` | Everything + manage users and roles |

**First admin:** Manually set `role: "admin"` in MongoDB for a user, then use the Admin Dashboard to promote others to `municipal`.

## 📡 API Endpoints

### Auth
| Method | Path | Access |
|--------|------|--------|
| POST | `/v1/api/auth/register` | Public |
| POST | `/v1/api/auth/login` | Public |
| GET | `/v1/api/auth/me` | Authenticated |
| PUT | `/v1/api/auth/assign-role` | Admin |
| GET | `/v1/api/auth/users` | Admin |

### Issues
| Method | Path | Access |
|--------|------|--------|
| GET | `/v1/api/issues/public` | Public |
| GET | `/v1/api/issues/stats` | Public |
| POST | `/v1/api/issues` | Citizen |
| GET | `/v1/api/issues/my` | Citizen |
| POST | `/v1/api/issues/:id/vote` | Authenticated |
| POST | `/v1/api/issues/:id/comment` | Authenticated |
| GET | `/v1/api/issues` | Municipal/Admin |
| PUT | `/v1/api/issues/:id/status` | Municipal/Admin |
| GET | `/v1/api/issues/:id` | Authenticated |

## 🎨 Design System

The UI uses a **Liquid Glass** aesthetic:
- Dark background: `#030712`
- Frosted glass cards with `backdrop-filter: blur(20px)`
- Primary accent: Indigo/Violet gradient (`#6366f1 → #a78bfa`)
- Status colors: Yellow (Pending), Blue (In Progress), Green (Resolved), Red (Rejected)

---

Built with ❤️ by Yogesh Jangid
