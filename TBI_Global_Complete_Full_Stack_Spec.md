# TBI Global — Complete Full-Stack Website Specification

## 1. PROJECT OBJECTIVE

Build a **fully functional, production-style web application** for discovering Technology Business Incubators (TBIs), university incubation centres, and startup/innovation incubators.

The application must include:

- React frontend
- HTML/CSS
- Tailwind CSS
- JavaScript
- Node.js + Express backend
- MongoDB database
- Real authentication
- Login
- Signup
- Logout
- JWT-based protected routes
- Admin panel
- Real search
- Filters
- Location-based discovery
- TBI detail pages
- University directory
- Incubator/category directory
- Favorites/saved TBIs
- TBI suggestion form
- Dataset import
- Responsive UI
- Proper loading, empty and error states

This is NOT a static frontend project.

Every major UI feature must be connected to the backend and database.

---

# 2. SOURCE DATASET

The initial dataset is:

```text
TBI(3).xlsx
```

The uploaded workbook contains:

```text
Sheet: Sheet1
Records: 521
Columns: 9
```

Columns:

```text
S.No
University
City
University Type
Incubator / TBI Name
Incubator Type
Official Email ID
Website
Status
```

Example records include:

```text
Chandigarh University
Technology Business Incubator (CU-TBI)
DST TBI
tbi@cumail.in
Verified
```

```text
Chitkara University
Chitkara Innovation Incubator Foundation (CIIF)
Section 8 Incubator
ciif@chitkara.edu.in
Verified
```

```text
Lovely Professional University
LPU Foundation
NIDHI-TBI
sorabh.lakhanpal@lpu.co.in
Under Verification
```

```text
Thapar Institute of Engineering & Technology
STEP TIET
STEP
karminder@thapar.edu
Verified
```

```text
I.K. Gujral Punjab Technical University
Business Incubation Centre (BIC)
University Incubator
bic@ptu.ac.in
Verified
```

### IMPORTANT DATA RULE

Do NOT fabricate information that is not present in the dataset.

The current dataset does NOT contain:

```text
Logo URL
Phone
Address
State
Country
Latitude
Longitude
Description
Services
Social links
Domain
```

Therefore:

- Do not invent these fields.
- The database schema may support them for future enrichment.
- The UI should hide unavailable fields or display `Not available`.
- Do not generate fake domains for the 521 records.

---

# 3. PRODUCT CONCEPT

The product should feel like:

> **A discovery platform for university TBIs — similar to how a directory/search platform helps users discover organizations.**

A user should be able to:

```text
Search
↓
Find TBI
↓
See university
↓
See city
↓
See incubator type
↓
See email
↓
Open verified website when available
```

Location should be a discovery feature, not a restriction.

Users should be able to discover TBIs:

- Near them
- In another city
- At a particular university
- By incubator type
- By future domain/category metadata

---

# 4. BRAND

Product name:

```text
TBI Global
```

Tagline:

```text
Find. Connect. Innovate.
```

Hero headline:

```text
Discover Where Innovation Begins.
```

Alternative:

```text
Find the right TBI for your next idea.
```

---

# 5. DESIGN DIRECTION

The website must look:

- Clean
- Professional
- Modern
- Human-designed
- Minimal
- Trustworthy
- Startup-quality

It must NOT look like an AI-generated template.

### Avoid

- Excessive gradients
- Purple "AI SaaS" styling
- Neon effects
- Giant glowing blobs
- Excessive glassmorphism
- Excessive rounded cards
- Random animations
- Huge dashboard widgets
- Stock photos everywhere
- Fake statistics
- Decorative elements with no purpose

Use whitespace, typography, borders, subtle shadows and restrained colors.

---

# 6. COLOR PALETTE

Use:

```text
Background       #F8FAFC
White            #FFFFFF

Primary Navy     #123B5D
Secondary Teal   #0F766E
Accent Amber     #F59E0B

Text             #0F172A
Muted Text       #64748B
Border           #E2E8F0

Success          #15803D
Warning          #D97706
Error            #DC2626
```

The interface should primarily be:

```text
White / Off-white
+
Navy
+
Teal
+
Small amber accents
```

Do not use every color on every component.

---

# 7. TYPOGRAPHY

Use:

```text
Inter
```

or:

```text
Manrope
```

Recommended hierarchy:

```text
Hero heading:      36–48px
Page heading:      28–36px
Section heading:   20–24px
Body:              14–16px
Metadata:          12–14px
```

---

# 8. TECHNOLOGY STACK

## Frontend

```text
React.js
Vite
JavaScript
HTML
CSS
Tailwind CSS
React Router DOM
Axios
Lucide React
```

Optional:

```text
Zustand
TanStack Query
```

## Backend

```text
Node.js
Express.js
```

Packages:

```text
mongoose
bcryptjs
jsonwebtoken
cors
dotenv
express-validator
helmet
express-rate-limit
xlsx
multer
```

## Database

```text
MongoDB
```

Support:

```text
MongoDB Local
MongoDB Atlas
```

---

# 9. HIGH-LEVEL ARCHITECTURE

```text
┌──────────────────────────────────────────┐
│              React Frontend              │
│      Vite + Tailwind + JavaScript        │
└───────────────────┬──────────────────────┘
                    │
                  Axios
                    │
                    ▼
┌──────────────────────────────────────────┐
│           Node + Express API             │
│                                          │
│ Auth | TBI | Search | Admin | Favorites │
└───────────────────┬──────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│                 MongoDB                  │
│                                          │
│ Users | TBIs | Favorites | Suggestions  │
└──────────────────────────────────────────┘
```

---

# 10. FRONTEND FOLDER STRUCTURE

```text
client/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SearchSuggestions.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── TbiCard.jsx
│   │   ├── TbiGrid.jsx
│   │   ├── UniversityCard.jsx
│   │   ├── CategoryCard.jsx
│   │   ├── StatsCard.jsx
│   │   ├── Pagination.jsx
│   │   ├── SkeletonCard.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Toast.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   │
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Explore.jsx
│   │   ├── Nearby.jsx
│   │   ├── Universities.jsx
│   │   ├── Categories.jsx
│   │   ├── Saved.jsx
│   │   ├── TbiDetails.jsx
│   │   ├── SuggestTbi.jsx
│   │   ├── Settings.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminTbis.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── AdminImport.jsx
│   │   └── NotFound.jsx
│   │
│   ├── layouts/
│   │   ├── DashboardLayout.jsx
│   │   └── AuthLayout.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── tbiService.js
│   │   ├── userService.js
│   │   └── adminService.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useDebounce.js
│   │
│   ├── store/
│   │   └── authStore.js
│   │
│   ├── utils/
│   │   └── helpers.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js
```

---

# 11. BACKEND FOLDER STRUCTURE

```text
server/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── TBI.js
│   │   ├── Favorite.js
│   │   └── Suggestion.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tbiController.js
│   │   ├── userController.js
│   │   ├── universityController.js
│   │   ├── categoryController.js
│   │   ├── suggestionController.js
│   │   └── adminController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tbiRoutes.js
│   │   ├── userRoutes.js
│   │   ├── universityRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── suggestionRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── rateLimiter.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── normalizeData.js
│   │   └── distance.js
│   │
│   └── server.js
│
├── scripts/
│   ├── importTBI.js
│   └── seedAdmin.js
│
├── package.json
└── .env.example
```

---

# 12. DATABASE COLLECTIONS

Create these MongoDB collections:

```text
users
tbis
favorites
suggestions
```

---

# 13. TBI DATABASE SCHEMA

Use a flexible schema:

```javascript
{
    serialNumber: Number,

    university: {
        type: String,
        required: true,
        index: true
    },

    city: {
        type: String,
        index: true
    },

    universityType: {
        type: String,
        index: true
    },

    name: {
        type: String,
        required: true,
        index: true
    },

    incubatorType: {
        type: String,
        index: true
    },

    email: String,

    website: String,

    status: {
        type: String,
        enum: [
            "Verified",
            "Under Verification",
            "Unverified"
        ],
        default: "Unverified"
    },

    // Future enrichment fields
    domains: [String],

    description: String,

    phone: String,

    address: String,

    state: String,

    country: String,

    latitude: Number,

    longitude: Number,

    logo: String,

    services: [String],

    socialLinks: {
        linkedin: String,
        instagram: String,
        twitter: String
    },

    createdAt: Date,

    updatedAt: Date
}
```

---

# 14. EXCEL → DATABASE MAPPING

Map the uploaded dataset exactly:

```text
S.No
→ serialNumber

University
→ university

City
→ city

University Type
→ universityType

Incubator / TBI Name
→ name

Incubator Type
→ incubatorType

Official Email ID
→ email

Website
→ website

Status
→ status
```

Normalize:

```text
✅ Verified
```

to:

```text
Verified
```

and:

```text
🟡 Under Verification
```

to:

```text
Under Verification
```

---

# 15. DATA IMPORTER

Create:

```text
server/scripts/importTBI.js
```

Install:

```bash
npm install xlsx
```

Importer flow:

```text
TBI(3).xlsx
      ↓
Read Sheet1
      ↓
Validate required columns
      ↓
Normalize values
      ↓
Detect duplicates
      ↓
Insert/update MongoDB
      ↓
Print import report
```

The importer should report:

```text
Total rows
Valid rows
Invalid rows
Duplicate rows
Inserted rows
Updated rows
```

Do not silently discard records.

---

# 16. USER MODEL

```javascript
{
    name: String,

    email: {
        type: String,
        unique: true,
        lowercase: true
    },

    password: String,

    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdAt: Date,

    updatedAt: Date
}
```

Never store plaintext passwords.

---

# 17. FAVORITE MODEL

```javascript
{
    user: {
        type: ObjectId,
        ref: "User"
    },

    tbi: {
        type: ObjectId,
        ref: "TBI"
    },

    createdAt: Date
}
```

Create a unique compound index:

```text
user + tbi
```

so the same TBI cannot be saved twice.

---

# 18. SUGGESTION MODEL

```javascript
{
    submittedBy: {
        type: ObjectId,
        ref: "User"
    },

    university: String,

    city: String,

    universityType: String,

    tbiName: String,

    incubatorType: String,

    email: String,

    website: String,

    description: String,

    status: {
        type: String,
        enum: [
            "Pending",
            "Approved",
            "Rejected"
        ],
        default: "Pending"
    },

    createdAt: Date
}
```

---

# 19. AUTHENTICATION

Implement:

```text
Signup
Login
Logout
Get Current User
JWT authentication
Password hashing
Protected routes
Admin authorization
```

Use:

```text
bcryptjs
jsonwebtoken
```

---

# 20. SIGNUP PAGE

Design:

```text
                TBI GLOBAL

           Create your account

Full Name
[________________________]

Email
[________________________]

Password
[________________________]

Confirm Password
[________________________]

[      Create Account     ]

Already have an account?
Login
```

Validation:

```text
Name required
Valid email
Minimum 8-character password
Passwords must match
Unique email
```

---

# 21. LOGIN PAGE

Design:

```text
                TBI GLOBAL

             Welcome back

Email
[________________________]

Password
[________________________]

[          Login          ]

Forgot password?

Don't have an account?
Create account
```

---

# 22. AUTH FLOW

```text
Signup
   ↓
Validate
   ↓
bcrypt hash
   ↓
MongoDB
   ↓
Login
   ↓
JWT
   ↓
Protected Dashboard
```

Never trust a frontend-provided role.

Backend must decode and validate the JWT.

---

# 23. ROUTE ACCESS

## Public

```text
/
 /login
 /signup
 /explore
 /tbi/:id
 /universities
 /categories
```

## Authenticated

```text
/saved
/suggest
/settings
```

## Admin

```text
/admin
/admin/tbis
/admin/users
/admin/import
```

---

# 24. SIDEBAR

Left navigation:

```text
TBI GLOBAL
──────────────────

Dashboard

Explore TBIs

Nearby

Universities

Categories

Saved TBIs

Suggest a TBI

──────────────────

Admin Panel
(admin only)

──────────────────

Settings

Logout
```

Use Lucide icons:

```text
LayoutDashboard
Search
MapPin
University
Layers
Bookmark
PlusCircle
Shield
Settings
LogOut
```

Sidebar:

- Fixed on desktop.
- Collapsible on smaller screens.
- Mobile hamburger menu.
- Active route highlighted using navy/teal.
- No excessive icons.

---

# 25. DASHBOARD

The dashboard is the main logged-in page.

Top:

```text
Good morning, User

Discover innovation around you.
```

Then a large search bar:

```text
┌────────────────────────────────────────────────────────────┐
│ 🔍 Search TBI, university, city or incubator type...      │
└────────────────────────────────────────────────────────────┘
```

Filter button beside it.

---

# 26. SEARCH REQUIREMENTS

Search must support:

```text
TBI name
University
City
University Type
Incubator Type
Email
Website
Future domains
```

Endpoint:

```http
GET /api/tbis/search?q=...
```

Use case-insensitive matching.

---

# 27. SEARCH RANKING

Prioritize:

```text
1. Exact TBI name
2. University
3. Incubator type
4. City
5. University type
6. Email
7. Website
8. Future metadata
```

---

# 28. SEARCH DEBOUNCING

Use:

```text
300ms
```

debounce.

Do not call the API for every character.

---

# 29. SEARCH SUGGESTIONS

When user types:

```text
Chan
```

show:

```text
Chandigarh University

TBIs in Chandigarh

TBIs associated with Chandigarh
```

Suggestions should be generated from real database values.

Do not invent suggestions.

---

# 30. FILTERS

Filter drawer:

```text
University
City
University Type
Incubator Type
Status
```

Future:

```text
Domain
Country
State
Verified
```

Buttons:

```text
Apply Filters
Clear Filters
```

---

# 31. TBI CARDS

Below the search bar display cards.

Example:

```text
┌─────────────────────────────────────────┐
│                                         │
│  [T]                              ♡     │
│                                         │
│  Technology Business Incubator          │
│  Chandigarh University                  │
│                                         │
│  DST TBI                                │
│                                         │
│  📍 Mohali                              │
│  ✉ tbi@cumail.in                       │
│                                         │
│  ✓ Verified                             │
│                                         │
│  [View Details]     [Website ↗]         │
└─────────────────────────────────────────┘
```

---

# 32. LOGOS

The current dataset does not provide logo URLs.

Therefore:

Use a clean generated fallback avatar.

Example:

```text
┌──────┐
│  T   │
└──────┘
```

Use the first meaningful letter of the TBI name.

When a legitimate logo URL is added later, automatically display it.

Never use random stock logos.

---

# 33. WEBSITE BUTTON

Important:

The current dataset's `Website` field may contain labels such as:

```text
CU-TBI
CIIF
LPU Foundation
STEP TIET
PTU BIC
```

These are not necessarily valid URLs.

Therefore:

### If the field is a valid URL:

Show:

```text
Visit Website ↗
```

and open it in a new tab.

### If it is not a valid URL:

Show:

```text
Website information available
```

but DO NOT fabricate:

```text
https://cu-tbi.example.com
```

Admin should be able to update the actual URL later.

---

# 34. EMAIL BUTTON

If email is valid:

```text
✉ tbi@cumail.in
```

make it:

```text
mailto:tbi@cumail.in
```

If unavailable:

```text
Email not available
```

---

# 35. TBI DETAILS PAGE

Route:

```text
/tbi/:id
```

Display:

```text
TBI Name
University
University Type
Incubator Type
City
Email
Website
Status
```

Layout:

```text
← Back to Explore

[TBI Avatar]

Technology Business Incubator

Chandigarh University

✓ Verified

────────────────────────

University
Chandigarh University

University Type
Private

Location
Mohali

Incubator Type
DST TBI

Email
tbi@cumail.in

Website
CU-TBI

────────────────────────

[Visit Official Website]
[Save TBI]
```

Only show actual available data.

---

# 36. UNIVERSITIES PAGE

Route:

```text
/universities
```

Automatically derive unique universities from MongoDB.

Card:

```text
University Name
City
University Type
Number of TBIs
```

Example:

```text
Chandigarh University

Mohali
Private University

1 TBI

[View TBIs]
```

Clicking it should filter the TBI directory.

---

# 37. CATEGORIES PAGE

Because the current dataset has no real domain column, categories should initially be based on:

```text
Incubator Type
University Type
```

Examples:

```text
DST TBI
NIDHI-TBI
STEP
Section 8 Incubator
University Incubator
Private University
State University
Deemed University
```

Later, if legitimate domain data is added, support:

```text
AI
FinTech
HealthTech
AgriTech
EdTech
DeepTech
Cybersecurity
IoT
CleanTech
```

Do not fabricate those domains for current records.

---

# 38. NEARBY PAGE

Route:

```text
/nearby
```

Ask the user for browser location permission.

If allowed:

```text
User coordinates
↓
MongoDB geospatial query
↓
Nearest TBIs
```

If the dataset has no coordinates:

```text
Fall back to city-based discovery.
```

Never display fake distances.

Example:

```text
TBIs Near You

Based on:
Mohali
```

or, if coordinates genuinely exist:

```text
2.8 km away
```

---

# 39. LOCATION UX

Location should never block the website.

If denied:

```text
Location access unavailable.

Select your city manually.
```

Allow:

```text
City selector
```

---

# 40. FAVORITES

Users can save TBIs.

Button:

```text
♡
```

Saved:

```text
♥
```

API:

```http
GET    /api/users/favorites
POST   /api/users/favorites/:tbiId
DELETE /api/users/favorites/:tbiId
```

Page:

```text
/saved
```

---

# 41. SUGGEST TBI

Route:

```text
/suggest
```

Form:

```text
University
City
University Type
TBI Name
Incubator Type
Email
Website
Description
```

Submit:

```text
Pending
```

Admin reviews it.

---

# 42. ADMIN DASHBOARD

Route:

```text
/admin
```

Only:

```text
role === "ADMIN"
```

can access it.

Cards:

```text
Total TBIs
Verified
Under Verification
Universities
Cities
Users
Pending Suggestions
```

All values must come from MongoDB.

---

# 43. ADMIN TBI MANAGEMENT

Route:

```text
/admin/tbis
```

Table:

```text
Logo
TBI Name
University
City
Incubator Type
Email
Status
Actions
```

Actions:

```text
Edit
Delete
Verify
Unverify
```

---

# 44. ADMIN EDIT FORM

Admin can edit:

```text
TBI Name
University
City
University Type
Incubator Type
Email
Website
Status
Logo
Description
Domains
Phone
Address
State
Country
Coordinates
Services
Social Links
```

This allows future enrichment.

---

# 45. ADMIN USER MANAGEMENT

Route:

```text
/admin/users
```

Display:

```text
Name
Email
Role
Status
Created Date
```

Actions:

```text
Change Role
Activate
Deactivate
```

Do not allow an admin to accidentally remove their own admin access.

---

# 46. ADMIN DATASET IMPORT

Route:

```text
/admin/import
```

Upload:

```text
.xlsx
.csv
.json
```

Process:

```text
Upload
↓
Validate
↓
Preview
↓
Detect duplicates
↓
Import
↓
Show report
```

Example report:

```text
Total rows: 521

Valid: 518

Invalid: 2

Duplicates: 1

Inserted: 500

Updated: 18

Skipped: 3
```

Numbers must be calculated dynamically.

---

# 47. PAGINATION

Never load every record into the browser.

Use:

```http
GET /api/tbis?page=1&limit=20
```

Response:

```json
{
    "success": true,
    "data": [],
    "page": 1,
    "limit": 20,
    "total": 521,
    "totalPages": 27
}
```

UI:

```text
Previous
1
2
3
4
5
...
Next
```

---

# 48. DATABASE INDEXING

Create indexes for:

```text
name
university
city
universityType
incubatorType
status
email
```

Text index:

```javascript
TBISchema.index({
    name: "text",
    university: "text",
    city: "text",
    universityType: "text",
    incubatorType: "text",
    email: "text"
});
```

Future:

```text
domains
country
state
```

---

# 49. GEOSPATIAL DATABASE SUPPORT

Prepare for:

```javascript
location: {
    type: {
        type: String,
        enum: ["Point"]
    },
    coordinates: [Number]
}
```

Index:

```javascript
TBISchema.index({
    location: "2dsphere"
});
```

But do not add fake coordinates to the current 521 records.

---

# 50. API ROUTES

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## TBIs

```http
GET    /api/tbis
GET    /api/tbis/:id
GET    /api/tbis/search?q=
GET    /api/tbis/nearby
POST   /api/tbis
PUT    /api/tbis/:id
DELETE /api/tbis/:id
```

## Universities

```http
GET /api/universities
GET /api/universities/:universityName/tbis
```

## Categories

```http
GET /api/categories
GET /api/categories/:category
```

## Favorites

```http
GET    /api/users/favorites
POST   /api/users/favorites/:tbiId
DELETE /api/users/favorites/:tbiId
```

## Suggestions

```http
POST /api/suggestions
GET  /api/suggestions
PUT  /api/suggestions/:id
```

## Admin

```http
GET    /api/admin/stats
GET    /api/admin/users
GET    /api/admin/tbis
POST   /api/admin/import
PUT    /api/admin/tbis/:id
DELETE /api/admin/tbis/:id
```

---

# 51. API RESPONSE FORMAT

Success:

```json
{
    "success": true,
    "data": []
}
```

Error:

```json
{
    "success": false,
    "message": "TBI not found"
}
```

Never return raw stack traces.

---

# 52. SECURITY

Implement:

```text
bcryptjs
JWT
Helmet
CORS
Rate limiting
Input validation
Protected routes
Admin middleware
Environment variables
```

Never expose:

```text
MongoDB credentials
JWT secret
Passwords
```

to frontend.

---

# 53. ENVIRONMENT VARIABLES

Create:

```text
server/.env.example
```

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/tbi_global

JWT_SECRET=replace_with_secure_secret

CLIENT_URL=http://localhost:5173
```

---

# 54. ROOT PROJECT STRUCTURE

```text
tbi-global/
│
├── client/
│
├── server/
│
├── dataset/
│   └── TBI(3).xlsx
│
├── README.md
│
├── package.json
│
└── .gitignore
```

Do not commit:

```text
.env
node_modules
```

---

# 55. ROOT PACKAGE.JSON

Use `concurrently`:

```json
{
    "scripts": {
        "dev": "concurrently \"npm run server\" \"npm run client\"",
        "client": "npm run dev --prefix client",
        "server": "npm run dev --prefix server"
    }
}
```

The entire application should start using:

```bash
npm run dev
```

---

# 56. FRONTEND ROUTES

```text
/
```

Landing page.

```text
/login
```

Login.

```text
/signup
```

Signup.

```text
/dashboard
```

Main dashboard.

```text
/explore
```

TBI directory.

```text
/nearby
```

Nearby TBIs.

```text
/universities
```

University directory.

```text
/categories
```

Incubator/category directory.

```text
/saved
```

Saved TBIs.

```text
/tbi/:id
```

TBI details.

```text
/suggest
```

Suggest TBI.

```text
/settings
```

Settings.

```text
/admin
```

Admin dashboard.

```text
/admin/tbis
```

TBI management.

```text
/admin/users
```

User management.

```text
/admin/import
```

Dataset importer.

---

# 57. LANDING PAGE

Structure:

```text
Navbar
↓
Hero
↓
Search
↓
Stats
↓
Featured TBIs
↓
Popular Incubator Types
↓
Universities
↓
How It Works
↓
CTA
↓
Footer
```

Hero:

```text
Discover Where Innovation Begins.

Find technology business incubators,
university incubation centres and startup ecosystems.

[Explore TBIs]
[Browse Universities]
```

---

# 58. LANDING PAGE SEARCH

Search input:

```text
Search universities, TBIs, cities or incubator types...
```

On search:

```text
Navigate to /explore?q=...
```

---

# 59. DYNAMIC STATISTICS

Do not hardcode:

```text
521
```

as a permanent UI value.

Calculate:

```text
Total TBI records
Unique universities
Unique cities
Unique incubator types
Verified records
```

from MongoDB.

---

# 60. FEATURED TBIs

Use real records.

Possible selection logic:

```text
Verified records
```

and/or:

```text
records with complete contact information
```

Do not fabricate featured organizations.

---

# 61. FOOTER

Footer:

```text
TBI GLOBAL

Find. Connect. Innovate.

Explore
Universities
TBIs
Categories

Platform
Suggest a TBI
Saved TBIs

Admin
Admin Login

© 2026 TBI Global
```

Do not claim official government/university affiliation unless actually established.

---

# 62. RESPONSIVE DESIGN

Desktop:

```text
Sidebar + Main Content
```

Tablet:

```text
Collapsible sidebar
```

Mobile:

```text
Top bar
Hamburger menu
One-column cards
```

Search bar must remain usable on mobile.

---

# 63. UI COMPONENTS

Create reusable components:

```text
Navbar
Sidebar
SearchBar
SearchSuggestions
FilterPanel
TbiCard
TbiGrid
TbiDetails
UniversityCard
CategoryCard
StatsCard
Pagination
Modal
Input
Button
Badge
Avatar
Skeleton
EmptyState
Toast
ProtectedRoute
AdminRoute
```

---

# 64. CARD DESIGN

Use:

```text
border: 1px solid #E2E8F0
border-radius: 12px
background: #FFFFFF
```

Subtle shadow.

Hover:

```text
small elevation
border transition
```

Do not use huge shadows.

---

# 65. ANIMATIONS

Use subtle:

```text
150–250ms
```

transitions.

Examples:

```text
Card hover
Button hover
Sidebar transition
Search dropdown
Modal
```

Avoid:

```text
floating blobs
continuous background animations
excessive parallax
```

---

# 66. LOADING STATES

Use skeleton cards.

Examples:

```text
Skeleton TBI card
Skeleton university card
Skeleton statistics
Skeleton detail page
```

---

# 67. EMPTY STATES

No results:

```text
No TBIs found.

Try searching for another university,
city or incubator type.
```

Button:

```text
Clear Search
```

---

# 68. ERROR STATES

Create:

```text
404
500
401
403
```

Example 404:

```text
Page not found.

The page you're looking for doesn't exist.

[Back to Dashboard]
```

---

# 69. ACCESSIBILITY

Implement:

```text
Semantic HTML
Keyboard navigation
Visible focus
ARIA labels where required
Alt text
Accessible form labels
Good contrast
```

Do not communicate status using color alone.

---

# 70. SEO

Implement:

```text
Page title
Meta description
Open Graph metadata
```

Example:

```text
TBI Global | Discover Technology Business Incubators
```

TBI detail page:

```text
Technology Business Incubator | Chandigarh University | TBI Global
```

---

# 71. PERFORMANCE

Implement:

```text
Pagination
Debounced search
Lazy-loaded routes
Optimized images
Minimal API calls
MongoDB indexes
```

Do not request all 521+ records on initial page load.

---

# 72. NO FAKE FUNCTIONALITY

Every button must work.

Examples:

```text
Search
→ real search API

View Details
→ real TBI detail page

Website
→ valid official URL only

Email
→ mailto

Save
→ MongoDB favorite

Login
→ real authentication

Signup
→ real account creation

Logout
→ clear authentication

Admin Panel
→ protected admin route

Import
→ actual Excel/CSV/JSON import

Suggest
→ MongoDB suggestion

Filter
→ real database filtering
```

---

# 73. DATA ACCURACY RULE

If the source dataset says:

```text
Website = CU-TBI
```

do NOT convert it to an invented URL.

If:

```text
Official Email ID = tbi@cumail.in
```

display exactly that.

If:

```text
Status = Verified
```

display:

```text
✓ Verified
```

If a value is missing:

```text
Not available
```

or hide the field.

---

# 74. ADMIN ENRICHMENT

The admin panel should allow future data enrichment.

Admins can add:

```text
Logo
Official URL
Phone
Address
State
Country
Latitude
Longitude
Description
Domains
Services
Social links
```

This makes the application extensible beyond the initial Excel dataset.

---

# 75. IMPORT VALIDATION

Required fields:

```text
University
Incubator / TBI Name
```

Optional:

```text
City
University Type
Incubator Type
Official Email ID
Website
Status
```

If required fields are missing:

```text
Mark row invalid.
```

Show the row number and reason.

---

# 76. DUPLICATE DETECTION

Primary duplicate key:

```text
University
+
City
+
TBI Name
```

If duplicate:

```text
Show in import report.
```

Allow admin to choose:

```text
Skip
Update existing
```

---

# 77. BUILD ORDER

Implement in this exact sequence:

```text
1. Create React/Vite frontend
2. Configure Tailwind CSS
3. Create Express backend
4. Connect MongoDB
5. Create TBI model
6. Build Excel importer
7. Import TBI(3).xlsx
8. Verify 521 records
9. Create User model
10. Implement signup
11. Implement login
12. Implement JWT
13. Build dashboard layout
14. Build sidebar
15. Build TBI cards
16. Build search API
17. Build search UI
18. Build filters
19. Build TBI details
20. Build universities
21. Build categories
22. Build nearby
23. Build favorites
24. Build suggestion system
25. Build admin dashboard
26. Build admin CRUD
27. Build admin import
28. Add responsive design
29. Add loading/empty/error states
30. Add security
31. Test complete user flow
32. Prepare deployment
33. Write README
```

---

# 78. TESTING CHECKLIST

## Authentication

- [ ] Signup works
- [ ] Duplicate email rejected
- [ ] Password hashed
- [ ] Login works
- [ ] Wrong password rejected
- [ ] JWT generated
- [ ] Protected route works
- [ ] Logout works

## Search

- [ ] Search by TBI name
- [ ] Search by university
- [ ] Search by city
- [ ] Search by incubator type
- [ ] Search by email
- [ ] Debouncing works
- [ ] Pagination works

## TBI

- [ ] Details page works
- [ ] Email link works
- [ ] Valid website works
- [ ] Missing website handled
- [ ] Status displayed correctly
- [ ] Favorites work

## Admin

- [ ] Admin route protected
- [ ] Normal user cannot access admin
- [ ] Admin can edit TBI
- [ ] Admin can delete TBI
- [ ] Admin can verify/unverify
- [ ] Admin can import dataset
- [ ] Admin can manage users

## Location

- [ ] Permission requested
- [ ] Permission denied handled
- [ ] Manual city fallback
- [ ] No fake distance
- [ ] Geospatial support ready

---

# 79. DEPLOYMENT

Frontend:

```text
Vercel
```

Backend:

```text
Render
```

Database:

```text
MongoDB Atlas
```

Production variables:

```text
MONGO_URI
JWT_SECRET
CLIENT_URL
PORT
```

---

# 80. FINAL PRODUCT REQUIREMENT

The final product should feel like a real platform that could eventually serve:

```text
Students
Researchers
Entrepreneurs
Startups
Universities
Incubators
Investors
Innovation ecosystems
```

It should NOT feel like:

```text
College mini-project
Static HTML page
Generic CRUD dashboard
AI-generated UI template
Fake demo
```

---

# 81. FINAL DEVELOPER INSTRUCTION

Build the entire application from this specification.

Do NOT just generate frontend screens.

Build:

```text
React frontend
+
JavaScript
+
HTML
+
CSS
+
Tailwind CSS
+
Node.js
+
Express.js
+
MongoDB
+
JWT Authentication
+
Admin Panel
+
Excel Dataset Import
+
Search
+
Filters
+
Location Discovery
+
Favorites
+
TBI Details
+
University Directory
+
Category Directory
+
Suggestion System
```

Use the uploaded:

```text
TBI(3).xlsx
```

as the initial source of truth.

The uploaded dataset contains **521 records and 9 columns**.

Do not fabricate missing data.

The final application must run locally with:

```bash
npm install
npm run dev
```

and should be deployment-ready for:

```text
Vercel
+
Render
+
MongoDB Atlas
```

Most important priorities:

```text
1. REAL FUNCTIONALITY
2. DATA ACCURACY
3. CLEAN UX
4. PROFESSIONAL DESIGN
5. SEARCH QUALITY
6. AUTHENTICATION
7. SECURITY
8. RESPONSIVENESS
9. MAINTAINABLE CODE
10. EXTENSIBILITY
```

The website should look like a polished, human-designed **global TBI discovery platform**, not an AI-generated template.
