# 🥭 Parth Mango Records

**Personal Mango Record Management System**  
A modern, responsive React + Tailwind CSS dashboard to manage customer mango deliveries and payments.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- FastAPI backend running (see Backend section)

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and configure backend URL
cp .env.example .env
# Edit .env: set REACT_APP_API_URL=http://localhost:8000

# 3. Start development server
npm start
```

App opens at **http://localhost:3000**

---

## 🔐 Login

Default secret code: **`PARTH123`**  
*(Set in backend `core/config.py` → `SECRET_CODE`)*

---

## 📁 Project Structure

```
parth-mango-records/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── mangoApi.js          # All Axios API calls
│   ├── components/
│   │   ├── AddRecordForm.jsx    # Add new record form
│   │   ├── DashboardCards.jsx   # Summary stat cards
│   │   ├── DashboardHeader.jsx  # Top navbar
│   │   ├── EditModal.jsx        # Edit record modal
│   │   ├── LoadingSpinner.jsx   # Spinner + skeleton + empty state
│   │   ├── RecordsTable.jsx     # Main data table
│   │   ├── SearchFilter.jsx     # Search & filter bar
│   │   └── Toast.jsx            # Notification system
│   ├── pages/
│   │   ├── LoginPage.jsx        # Login screen
│   │   └── DashboardPage.jsx    # Main dashboard
│   ├── App.jsx                  # Root component + auth gate
│   ├── index.js                 # React entry point
│   └── index.css                # Global styles + Tailwind
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .env.example
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | Amber/Orange (`#f59e0b` → `#f97316`) |
| Font (Display) | Sora |
| Font (Body) | Plus Jakarta Sans |
| Border Radius | `rounded-xl` / `rounded-2xl` |
| Shadow | Custom `shadow-card` / `shadow-cardHover` |

---

## 🔌 Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Login with secret code |
| `GET` | `/auth/forgot` | Get owner contact number |
| `POST` | `/mango/` | Create new mango record |
| `GET` | `/mango/` | Fetch all records |
| `GET` | `/mango/search/{name}` | Search by customer name |
| `GET` | `/mango/pending` | Get pending payment records |
| `PUT` | `/mango/payment/{id}` | Mark payment complete |
| `PUT` | `/mango/delivery/{id}` | Mark delivery complete |
| `DELETE` | `/mango/{id}` | Delete a record |

---

## 📦 Build for Production

```bash
npm run build
```

Builds to `build/` folder. Deploy to Vercel, Netlify, or any static host.

---

## 🔧 Configuration

Edit `src/api/mangoApi.js` to change:
- Base URL
- Request timeout
- Auth headers (if added later)

---

## ✨ Features

- 🔐 Secret code login with session persistence
- 📊 Real-time dashboard stats (total, pending, delivered)
- ➕ Add records with auto-calculated total payment
- 🔍 Search by customer name (API + client-side fallback)
- 🎛️ Quick filters (pending payment, pending delivery, delivered)
- ✅ One-click mark payment / delivery done
- ✏️ Edit existing records
- 🗑️ Delete with confirmation dialog
- 📱 Fully mobile responsive
- 💀 Skeleton loading states
- 🪄 Toast notifications
- 🥭 Demo mode when backend is offline

---

*Built with React 18, Tailwind CSS 3, Axios, React Icons*
