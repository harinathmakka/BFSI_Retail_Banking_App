---

# **BFSI Retail Banking Application 🏦💻**

A full-stack **Retail Banking System** built with **Flask + MySQL + React**, featuring secure authentication, OTP verification, account operations, fund transfers, bill payments, loans, support tickets, admin screens, and detailed transaction logs.

A production-grade demo of a modern BFSI workflow with strong security patterns and clean architecture.

---

## 📌 **Table of Contents**

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Project Architecture](#project-architecture)
4. [Tech Stack](#tech-stack)
5. [Folder Structure](#folder-structure)
6. [Setup Instructions](#setup-instructions)
7. [.env Configuration](#env-configuration)
8. [Database & Migrations](#database--migrations)
9. [API Endpoints](#api-endpoints)
10. [Frontend Details](#frontend-details)
11. [Testing Workflow](#testing-workflow)
12. [Screenshots & Visuals](#screenshots--visuals)
13. [Production Deployment](#production-deployment)
14. [Troubleshooting](#troubleshooting)
15. [Preparing Repository for GitHub](#preparing-repository-for-github)
16. [Commit Guide](#commit-guide)
17. [License](#license)
18. [Author](#author)
19. [Project Report (PDF)](#project-report)

---

<a name="overview"></a>

# **Overview 🚀**

This project is a **secure BFSI Retail Banking system** that simulates real-world banking operations end-to-end:

✔️ Customer onboarding with OTP
✔️ JWT-based login & protected routes
✔️ Account operations (deposit/withdraw)
✔️ Fund transfer with payer/payee logs
✔️ Bill payment & loan application workflows
✔️ Support ticketing module
✔️ Transaction history with balance tracking
✔️ MySQL relational database with migrations
✔️ React dashboard with Axios integration

The goal is to create a **production-style** system with proper architecture, modular backend components, and scalable frontend structure.

---

<a name="key-features"></a>

# **Key Features ✨**

### 🔐 **Authentication & Onboarding**

* User registration
* OTP verification through backend
* Login via JWT
* Auto-session management
* Protected routes (dashboard cannot open without token)

### 💳 **Banking Operations**

* **Deposit**
* **Withdraw** (up to ₹0.0 allowed)
* **Fund Transfer**
* Automatic **dual transactions** for transfer
* Transaction logs with:

  * Timestamp
  * Type (credit/debit)
  * Amount
  * Payer email
  * Payee email
  * Description

### 🧾 **Bills & Payments**

* Bill payments
* Bill history + payment transaction entries

### 📝 **Loans**

* Loan application
* Loan status tracking
* Transactions captured for loan requests

### 💬 **Support**

* Create support tickets
* List user support history

### 🧮 **Admin (Optional)**

* Admin loan dashboard
* Admin transaction views

### 🎨 **Frontend**

* Modern React UI
* React Router
* Axios interceptor for JWT
* Clean componentized structure

---

<a name="project-architecture"></a>

# **Project Architecture 🧱**

```
                    ┌─────────────────────┐
                    │     FRONTEND        │
                    │  React + Axios      │
                    │  Pages & Components │
                    └─────────┬───────────┘
                              │ HTTP / JSON
                              ▼
                    ┌─────────────────────┐
                    │      BACKEND        │
                    │ Flask REST API      │
                    │ Blueprints:         │
                    │  - auth             │
                    │  - account          │
                    │  - transaction      │
                    │  - loan             │
                    │  - bill             │
                    │  - support          │
                    └─────────┬───────────┘
                              │ SQLAlchemy ORM
                              ▼
                    ┌─────────────────────┐
                    │      DATABASE       │
                    │   MySQL / PyMySQL   │
                    │   Flask-Migrate     │
                    └─────────────────────┘
```

---

<a name="tech-stack"></a>

# **Tech Stack 🧰**

### **Backend**

* Python 3.x
* Flask
* SQLAlchemy
* Flask-Migrate
* PyJWT
* MySQL (with `pymysql`)
* Werkzeuge hashing
* Flask-CORS

### **Frontend**

* React (Vite)
* React Router DOM
* Axios
* Modern ES Modules

### **Dev Tools**

* Virtualenv
* Git
* Node.js
* MySQL Workbench

---

<a name="folder-structure"></a>

# **Folder Structure 📂**

```
BFSI_Retail_Banking_App/
│
├── backend/
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # Blueprints
│   │   └── __init__.py
│   ├── migrations/         # Alembic migration history
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── axios.js
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docs/                   # Screenshots, diagrams
├── scripts/                # setup scripts
├── tests/                  # placeholder test folder
├── README.md
├── LICENSE
└── .gitignore
```

---

<a name="setup-instructions"></a>

# **Setup Instructions ⚡**

## **1️⃣ Backend Setup**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## **2️⃣ Create MySQL Database**

```sql
CREATE DATABASE bfsi_db;
```

## **3️⃣ Run Migrations**

```bash
flask db upgrade
```

## **4️⃣ Start Backend Server**

```bash
python run.py
```

Backend runs at: **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

<a name="frontend-setup"></a>

# **5️⃣ Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **[http://localhost:5173](http://localhost:5173)**

---

<a name="env-configuration"></a>

# **.env Configuration 🔐**

Create `backend/.env` (DO NOT COMMIT IT):

```
SECRET_KEY=supersecretkey
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/bfsi_db
FLASK_APP=run.py
FLASK_ENV=development
```

Also provide `.env.example` for others.

---

<a name="database--migrations"></a>

# **Database & Migrations 🗄️**

Using **Flask-Migrate (Alembic)**.

### Autogenerate:

```bash
flask db migrate -m "message"
```

### Apply:

```bash
flask db upgrade
```

---

<a name="api-endpoints"></a>

# **API Endpoints 📡**

## **Auth**

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| POST   | `/api/register`   | Register user & send OTP |
| POST   | `/api/verify-otp` | OTP verification         |
| POST   | `/api/login`      | Login & get JWT          |

---

## **Account Operations**

| Method | Endpoint                    | Description      |
| ------ | --------------------------- | ---------------- |
| POST   | `/api/account/transaction`  | deposit/withdraw |
| POST   | `/api/account/transfer`     | transfer funds   |
| GET    | `/api/account/balance`      | fetch balance    |
| GET    | `/api/account/transactions` | all transactions |

---

## **Bills**

| Method | Endpoint            |
| ------ | ------------------- |
| POST   | `/api/bill/pay`     |
| GET    | `/api/bill/mybills` |

---

## **Loans**

| Method | Endpoint            |
| ------ | ------------------- |
| POST   | `/api/loan/apply`   |
| GET    | `/api/loan/myloans` |

---

## **Support**

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | `/api/support/submit`    |
| GET    | `/api/support/mytickets` |

---

<a name="frontend-details"></a>

# **Frontend Details 🖥️**

### **Axios Interceptor**

Automatically injects:

```
Authorization: Bearer <token>
```

### **Main Components**

* BalanceInfo
* Transactions
* AllTransactions
* DepositWithdraw
* FundTransfer
* BillPayment
* Loan
* Support
* AdminLoans

### **Pages**

* Login
* Register
* Verify OTP
* Dashboard

---

<a name="testing-workflow"></a>

# **Testing Workflow ✔️**

### Manual Tests

1. Register → Verify OTP → Login
2. Deposit money
3. Withdraw money
4. Transfer between two accounts
5. Pay bill
6. Apply loan
7. Create support ticket
8. Verify transaction logs update correctly

---

<a name="screenshots--visuals"></a>

# **Screenshots & Visuals 🎨**

Place images inside `/docs/`.

Suggested names:

* `dashboard.png`
* `transactions.png`
* `fund_transfer.png`
* `bill_payment.png`
* `loan_application.png`

---

<a name="production-deployment"></a>

# **Production Deployment 🚀**

### Recommended:

* Server: Ubuntu + Gunicorn + Nginx
* DB: AWS RDS MySQL
* Environment: `.env` using system variables
* SSL via Let's Encrypt
* Reverse proxy with Nginx

### Docker (optional):

* `Dockerfile` for backend
* `docker-compose.yml` for backend + MySQL + frontend

---

<a name="troubleshooting"></a>

# **Troubleshooting 🛠️**

### **Token Not Found**

Check localStorage key `token`.

### **CORS Error**

Ensure Flask-CORS enabled in backend.

### **Balance Not Updating**

Check:

* `account.balance` update
* commit session
* React refresh trigger

### **Migrations Not Running**

Ensure:

```
export FLASK_APP=run.py
flask db upgrade
```

---

<a name="preparing-repository-for-github"></a>

# **Preparing Repository for GitHub 🔒**

### Include (commit these):

* backend/app
* backend/migrations
* frontend/src
* README.md
* LICENSE
* docs/

### Exclude:

* backend/venv
* frontend/node_modules
* .env
* .DS_Store
* **pycache**

---

<a name="commit-guide"></a>

# **Commit Guide ✍️**

Use conventional commits:

| Type      | Meaning               |
| --------- | --------------------- |
| feat:     | new feature           |
| fix:      | bug fix               |
| chore:    | maintenance           |
| docs:     | documentation updates |
| refactor: | code improvement      |

Example commits:

```
feat: add loan application API
fix: fund transfer payer/payee logging
docs: update README with setup instructions
```

---

<a name="license"></a>

# **License 📝**

This project is licensed under the **MIT License**.
See the `LICENSE` file for full details.

---

<a name="author"></a>

# **Author ✨**

**HARINATH MAKKA**
Developer • BFSI Enthusiast • Full-Stack Engineer

---

<a name="project-report"></a>

# **Project Report (PDF)** 📄

**Report PDF:** [report.pdf](./report.pdf)

---
