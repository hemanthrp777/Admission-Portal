# 🎓 Admission Portal — Full-Stack Application

A complete college admission portal built with **React**, **Node.js**, **Express**, and **Supabase**. Features email OTP authentication, a 6-step application form with merit-based programme filtering, and an admin dashboard.

---

## 📌 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Authentication Flow](#-authentication-flow)
- [Application Form (6 Steps)](#-application-form-6-steps)
- [Merit Score Calculation](#-merit-score-calculation)
- [Backend API](#-backend-api)
- [Database Schema](#-database-schema)
- [Key Concepts & Learnings](#-key-concepts--learnings)
- [How to Run](#-how-to-run)

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI framework + fast dev server |
| **Routing** | React Router v6 | Client-side page navigation |
| **Styling** | Vanilla CSS | Custom responsive design system |
| **Backend** | Node.js + Express | REST API server |
| **Database** | Supabase (PostgreSQL) | Cloud-hosted relational database |
| **Authentication** | Supabase Auth (Email OTP) | Passwordless login with email codes |
| **Validation** | express-validator | Server-side input validation |
| **Security** | Helmet, CORS | HTTP headers & cross-origin protection |
| **Logging** | Morgan | HTTP request logging |

---

## 📁 Project Structure

```
Admission/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── applicationController.js  # CRUD logic for applications
│   │   ├── db/
│   │   │   ├── supabase.js               # Supabase client setup
│   │   │   └── schema.sql                # Database table definition
│   │   ├── middleware/
│   │   │   ├── auth.js                   # JWT token verification
│   │   │   ├── validate.js               # Request validation handler
│   │   │   └── errorHandler.js           # Global error handler
│   │   ├── routes/
│   │   │   └── applications.js           # API routes + validation rules
│   │   └── server.js                     # Express app entry point
│   ├── .env                              # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── steps/
│   │   │   │   ├── Step1Personal.jsx      # Personal information form
│   │   │   │   ├── Step2Academic.jsx      # 10th + 12th academic history
│   │   │   │   ├── Step3Program.jsx       # Programme selection (filtered)
│   │   │   │   ├── Step4Documents.jsx     # Documents & declarations
│   │   │   │   ├── Step5Payment.jsx       # Payment placeholder
│   │   │   │   └── Step4Review.jsx        # Final review before submit
│   │   │   ├── ui/
│   │   │   │   ├── InputField.jsx         # Reusable text input
│   │   │   │   ├── SelectField.jsx        # Reusable dropdown
│   │   │   │   └── StepIndicator.jsx      # Progress bar (6 steps)
│   │   │   ├── FilterPanel.jsx            # Admin filters
│   │   │   └── ProtectedRoute.jsx         # Auth guard for routes
│   │   ├── context/
│   │   │   └── AuthContext.jsx            # Authentication state management
│   │   ├── pages/
│   │   │   ├── ApplyPage.jsx              # Main application form
│   │   │   ├── AdminPage.jsx              # Admin dashboard
│   │   │   └── LoginPage.jsx              # Email OTP login
│   │   ├── services/
│   │   │   ├── api.js                     # API helper (axios)
│   │   │   └── supabaseClient.js          # Frontend Supabase client
│   │   ├── utils/
│   │   │   └── validators.js              # Client-side validation
│   │   ├── App.jsx                        # Root component + routing
│   │   ├── main.jsx                       # React entry point
│   │   └── index.css                      # All styles
│   ├── .env                               # Frontend env vars
│   └── vite.config.js                     # Vite config with API proxy
└── README.md
```

---

## ⚙ How It Works

### High-Level Flow

```
User → Login (Email OTP) → Fill 6-Step Form → Submit → Stored in Supabase DB → Admin Reviews
```

1. **User visits** `localhost:5173` → redirected to `/login` (protected route)
2. **Enters email** → Supabase sends an 8-digit OTP code to their inbox
3. **Enters OTP** → Supabase verifies → JWT session created
4. **Fills the form** (6 steps with validation at each step)
5. **Submits** → Frontend sends POST request with JWT token in header
6. **Backend verifies** JWT → validates fields → inserts into Supabase PostgreSQL
7. **Admin** visits `/admin` → views all applications with filters, search, pagination

---

## 🔐 Authentication Flow

We use **Supabase Auth with Email OTP** (passwordless authentication):

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  Browser  │────>│ Supabase │────>│  User Email  │
│  (React)  │     │  Auth    │     │  (Gmail etc) │
└──────────┘     └──────────┘     └──────────────┘
     │                                    │
     │  1. signInWithOtp(email)           │
     │──────────────────────>             │
     │                        2. Send OTP │
     │                        ──────────> │
     │  3. User reads code               │
     │  4. verifyOtp(email, code)         │
     │──────────────────────>             │
     │  5. JWT session returned           │
     │<──────────────────────             │
     │  6. Store session, redirect        │
     └───────────────────────────────────>│
```

### Key Files:
- **`supabaseClient.js`** — Creates the Supabase client with project URL and anon key
- **`AuthContext.jsx`** — React Context that manages auth state globally using `onAuthStateChange`
- **`ProtectedRoute.jsx`** — Wrapper that redirects to `/login` if not authenticated
- **`LoginPage.jsx`** — UI with email input → OTP verification (8 separate input boxes)
- **`auth.js` (backend)** — Middleware that extracts JWT from `Authorization: Bearer <token>` header and verifies it with Supabase

### What is a JWT?
A **JSON Web Token** is a signed token that contains user info (email, role, expiry). The backend doesn't need to call Supabase to verify — it can validate the token's signature locally using the Supabase secret key.

---

## 📝 Application Form (6 Steps)

| Step | Component | Required? | Description |
|------|-----------|-----------|-------------|
| 1 | `Step1Personal` | ✅ Yes | Name, email, phone, DOB, gender, address |
| 2 | `Step2Academic` | ✅ Yes | 10th school/board/year/% + 12th school/board/year/%/stream |
| 3 | `Step3Program` | ✅ Yes | Programme (filtered by stream), intake year, study mode |
| 4 | `Step4Documents` | ❌ Optional | Document upload placeholders + declaration checkbox |
| 5 | `Step5Payment` | ❌ Optional | Pay Later / Already Paid with reference number |
| 6 | `Step6Review` | — | Read-only summary of all entered data |

### How Validation Works:
- **Client-side** (`validators.js`): Each step is validated before allowing "Next". Errors show inline under fields.
- **Server-side** (`applications.js` routes): `express-validator` re-validates all fields before database insert. Never trust the client!

---

## 📊 Merit Score Calculation

```
Merit Score = (10th Percentage × 0.4) + (12th Percentage × 0.6)
```

- Calculated **live** on the frontend in Step 2 as user enters percentages
- Also calculated **automatically** in the database using a PostgreSQL `GENERATED ALWAYS AS ... STORED` column
- Used for sorting and filtering in the admin dashboard

### Stream-Based Programme Filtering

When the user selects their 12th stream, Step 3 only shows relevant programmes:

| Stream | Available Programmes |
|--------|---------------------|
| Science (PCM) | B.Tech CS, B.Tech ECE, B.Sc Maths, B.Sc Data Science |
| Science (PCB) | MBBS, BDS, B.Sc Nursing, B.Pharm |
| Commerce | B.Com, BBA, BCA |
| Arts / Humanities | BA English, BA Psychology, BA Journalism |

---

## 🌐 Backend API

### Endpoints

| Method | Route | Auth? | Description |
|--------|-------|-------|-------------|
| `POST` | `/api/applications` | 🔒 Yes | Submit new application |
| `GET` | `/api/applications` | 🔓 No | List all (with filters & pagination) |
| `GET` | `/api/applications/:id` | 🔓 No | Get single application |
| `PATCH` | `/api/applications/:id/status` | 🔓 No | Update application status |
| `GET` | `/health` | 🔓 No | Server health check |

### Query Parameters for GET `/api/applications`:
- `status` — Filter by Pending/Under Review/Accepted/Rejected
- `program` — Filter by program name
- `intake_year` — Filter by year
- `search` — Search across name and email
- `page` & `limit` — Pagination
- `sort_by` & `order` — Sorting (supports `merit_score`, `created_at`, etc.)

### Security Layers:
1. **Helmet** — Sets secure HTTP headers (XSS protection, content-type sniffing, etc.)
2. **CORS** — Only allows requests from `http://localhost:5173`
3. **JSON limit** — Request body capped at 10KB to prevent oversized payloads
4. **JWT Auth** — Protected routes verify the Bearer token
5. **express-validator** — Server-side validation on all input fields

---

## 🗄 Database Schema

The `applications` table in Supabase (PostgreSQL):

```sql
-- Personal Info
first_name, last_name, email (UNIQUE), phone, date_of_birth, gender, address

-- 10th / SSLC
tenth_school, tenth_board, tenth_year, tenth_percentage, tenth_subjects

-- 12th / PUC
twelfth_school, twelfth_board, twelfth_year, twelfth_percentage, twelfth_stream, twelfth_subjects

-- Auto-calculated
merit_score  (GENERATED: 40% × 10th + 60% × 12th)

-- Programme
program, intake_year, study_mode

-- Optional
documents_submitted, declaration_agreed, payment_status, payment_reference

-- Meta
status (Pending/Under Review/Accepted/Rejected), created_at, updated_at (auto-updated via trigger)
```

### PostgreSQL Features Used:
- **`GENERATED ALWAYS AS ... STORED`** — Auto-calculates merit score, no manual updates needed
- **Triggers** — `update_updated_at_column()` auto-sets `updated_at` on every row update
- **CHECK constraints** — Ensures percentages stay between 0-100
- **Indexes** — On status, program, year, email, and merit_score for fast queries

---

## 🧠 Key Concepts & Learnings

### Frontend (React)
- **React Context API** — Global state management for auth (avoids prop drilling)
- **React Router v6** — `BrowserRouter`, `Routes`, `Route`, `Navigate` for SPA routing
- **Protected Routes** — Component wrapper that checks auth before rendering
- **Controlled Components** — Form inputs bound to React state via `useState`
- **Multi-step Forms** — Step state management, per-step validation, conditional rendering
- **Reusable Components** — `InputField`, `SelectField` used across all steps
- **Vite** — Modern build tool, faster than Webpack, with Hot Module Replacement (HMR)
- **Environment Variables** — `VITE_` prefix required for client-side env vars in Vite

### Backend (Node.js + Express)
- **Express Middleware** — Functions that run before route handlers (auth, validation, error handling)
- **MVC Pattern** — Routes → Controllers → Database (separation of concerns)
- **express-validator** — Declarative validation chains (`body('email').isEmail()`)
- **Error Handling** — Global error handler middleware catches all thrown errors
- **ES Modules** — Using `import/export` instead of `require()` (`"type": "module"` in package.json)
- **Nodemon** — Auto-restarts server on file changes during development

### Database (Supabase / PostgreSQL)
- **Supabase** — Firebase alternative with PostgreSQL, Auth, and REST API built-in
- **Row Level Security** — Supabase's security model (we use service_role key to bypass)
- **Generated Columns** — Computed columns that auto-update (merit_score)
- **Database Triggers** — Auto-execute functions on INSERT/UPDATE/DELETE
- **Indexing** — B-tree indexes for faster WHERE clause filtering

### Authentication
- **Passwordless Auth** — No passwords to store/hash, more secure against breaches
- **OTP (One-Time Password)** — Time-limited codes sent via email
- **JWT (JSON Web Tokens)** — Stateless auth tokens containing user claims
- **Bearer Token Pattern** — `Authorization: Bearer <jwt>` header convention
- **Session Management** — Supabase handles refresh tokens automatically

### DevOps & Tooling
- **Environment Variables** — Secrets stored in `.env`, never committed to git
- **API Proxy** — Vite proxies `/api` requests to backend, avoiding CORS in development
- **CORS** — Cross-Origin Resource Sharing controls which origins can call the API

---

## 🚀 How to Run

### Prerequisites
- Node.js 18+
- A Supabase project (free at [supabase.com](https://supabase.com))

### 1. Database Setup
- Go to Supabase SQL Editor
- Run the contents of `backend/src/db/schema.sql`

### 2. Backend
```bash
cd backend
cp .env.example .env   # or create .env manually
# Edit .env with your SUPABASE_URL and SUPABASE_SERVICE_KEY
npm install
npm run dev             # Starts on http://localhost:5001
```

### 3. Frontend
```bash
cd frontend
# Edit .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev             # Starts on http://localhost:5173
```

### 4. Supabase Config
- **Authentication → Email Templates → Magic Link**: Include `{{ .Token }}` to show OTP code
- **Authentication → Auth Settings**: Set OTP expiry to 600 seconds
- **Authentication → URL Configuration**: Set Site URL to `http://localhost:5173`

---

## 📚 Resources to Learn More

- [React Docs](https://react.dev) — Official React documentation
- [Vite Guide](https://vite.dev/guide/) — Vite build tool docs
- [Express.js](https://expressjs.com) — Express framework docs
- [Supabase Docs](https://supabase.com/docs) — Database, Auth, and API
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com) — SQL fundamentals
- [JWT.io](https://jwt.io) — Understanding JSON Web Tokens
- [MDN Web Docs](https://developer.mozilla.org) — HTML, CSS, JavaScript reference

---

*Built with ❤️ as a learning project for full-stack web development.*
