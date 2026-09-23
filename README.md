# TBI Global — Technology Business Incubator Discovery Platform

A modern, production-grade discovery platform for Technology Business Incubators (TBIs), university incubation centres, and startup/innovation ecosystems across institutions in India.

Built with **React, Vite, Tailwind CSS, Node.js, Express, and MySQL (Sequelize ORM)**.

---

## 🌟 Key Features

- **Real Database Integration**: Seeded and synchronized with 521 verified institutional records mapped from official datasets.
- **Search & Auto-Discovery**:
  - Multi-field ranked search across TBI names, universities, incubator categories, cities, and email IDs.
  - 300ms debounced queries and live suggestions dropdown populated dynamically from MySQL records.
- **Multi-Field Filtering Drawer**:
  - Filter by University, City, Incubator Type (DST TBI, NIDHI-TBI, STEP, Section 8, etc.), University Type, and Verification Status.
- **Location Discovery (Nearby)**:
  - Browser Geolocation API integration calculating distance with the Haversine formula.
  - Fallback to manual city discovery without displaying fabricated distances.
- **University & Category Directories**:
  - Aggregated university profiles with real-time TBI counts.
  - Category directories grouped by institutional and accreditation models.
- **User Authentication & Saved Ecosystems**:
  - JWT authentication with secure password hashing (`bcryptjs`).
  - Personal saved incubators (favorites) stored in MySQL with composite unique constraints.
  - Community TBI suggestion submission pipeline.
- **Full Administrator Control Center**:
  - Protected admin routes with role-based authorization.
  - Dynamic platform analytics (Total TBIs, Verified, Under Review, Universities, Cities, Users, Pending Suggestions).
  - Complete TBI CRUD management with metadata enrichment (logos, coordinates, focus domains, social links).
  - User management (role changes, active status toggles, self-protection guards).
  - Dataset importer supporting `.xlsx`, `.csv`, and `.json` uploads with duplicate detection (update or skip) and real-time validation reports.
- **Polished, Human-Designed UI**:
  - Clean corporate palette: Background `#F8FAFC`, Navy `#123B5D`, Teal `#0F766E`, Amber `#F59E0B`.
  - Accessible, responsive layouts for desktop, tablet, and mobile with skeleton loaders and empty states.

---

## 🏗️ Project Architecture

```
tbi-global/
├── client/                     # Vite + React 18 + Tailwind CSS + Lucide Icons
│   ├── src/
│   │   ├── components/         # SearchBar, TbiCard, FilterPanel, Pagination, Navbar, Sidebar...
│   │   ├── context/            # AuthContext (JWT state management)
│   │   ├── layouts/            # DashboardLayout, AuthLayout
│   │   ├── pages/              # Landing, Explore, Dashboard, Universities, Categories, Admin...
│   │   └── services/           # Axios API services (api, auth, tbi, user, admin)
├── server/                     # Node.js + Express + Sequelize + MySQL 8.0
│   ├── src/
│   │   ├── config/             # MySQL connection & auto-database initializer
│   │   ├── controllers/        # auth, tbi, university, category, user, suggestion, admin
│   │   ├── middleware/         # authMiddleware, adminMiddleware, rateLimiter, errorMiddleware
│   │   ├── models/             # TBI, User, Favorite, Suggestion (Sequelize models)
│   │   └── routes/             # Express route endpoints
│   └── scripts/
│       ├── importTBI.js        # CLI dataset importer for Excel/JSON
│       └── seedAdmin.js        # Default administrator seeder
├── dataset/                    # Source Excel workbook and JSON dataset (521 records)
└── package.json                # Root package with concurrently launcher
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js**: v18+ (Tested on Node v24)
- **MySQL Server**: Running on `localhost:3306`

### 2. Environment Variables
Configure your database credentials in `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tbi_global

# JWT Configuration
JWT_SECRET=tbi_global_super_secret_jwt_key_2026_innovation
JWT_EXPIRES_IN=7d
```

### 3. Installation & Seeding
```bash
# Install root dependencies
npm install

# Install server & client dependencies
cd server && npm install
cd ../client && npm install
cd ..

# Import the 521-record TBI dataset into MySQL
cd server && npm run import-data

# Seed the default admin user
npm run seed
```

### 4. Running the Application
From the project root:
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Default Administrator Credentials

- **Email**: `admin@tbiglobal.org`
- **Password**: `Admin@12345`
- **Role**: `ADMIN`

---

## 🧪 Testing Checklist

- [x] **Authentication**: Signup, login, JWT protection, password hashing, and logout.
- [x] **Search & Filters**: Debounced search, multi-field filters, and real-time database autocomplete.
- [x] **Database Accuracy**: 521 genuine institutional records loaded with zero fabricated data.
- [x] **Favorites & Suggestions**: User bookmarking and suggestion submission.
- [x] **Admin Panel**: Role management, dataset import (.xlsx/.csv/.json), and TBI CRUD.
- [x] **Responsive Design**: Mobile drawer, tablet viewports, and desktop layouts.

---

## 📄 License
MIT © 2026 TBI Global
