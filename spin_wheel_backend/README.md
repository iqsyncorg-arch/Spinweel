# 🎡 Spin Wheel Backend API (`spin_wheel_backend`)

Full-featured, production-ready REST API backend for the **MY SPECZ Spectacle Spin Wheel** customer engagement and lead capture application.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd spin_wheel_backend
npm install
```

### 2. Start the Server
- **Development Mode** (with native Node `--watch` auto-restart):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

The server starts by default at: **`http://localhost:5001`** *(Note: on macOS, port 5000 is occupied by ControlCenter/AirPlay Receiver by default, so 5001 is used with automatic fallback)*

---

## 🗄️ Architecture & Database

- **Database**: **MongoDB Atlas** via **Mongoose**.
- **Connection URI**: Configured in `.env`:
  ```
  MONGODB_URI=mongodb+srv://iqsyncorg_db_user:sPH4yzdzDnALN2FU@cluster0.o2huthd.mongodb.net/spectacle_spin_wheel?retryWrites=true&w=majority
  ```
- **Auto-Seeded**: On first connection, automatically creates and seeds:
  - `prizes` collection: All 7 festival wheel prizes.
  - `leads` collection: Customer lead records & prize vouchers.
  - `settings` collection: Forced target segment & store rules.

---

## 📡 REST API Reference

### 1. Healthcheck
- **`GET /api/health`**
  ```json
  {
    "status": "healthy",
    "service": "spin-wheel-backend",
    "timestamp": "2026-11-24T07:40:00.000Z",
    "uptime": 12.4
  }
  ```

---

### 2. Leads Management (`/api/leads`)

#### • **Get All Leads**
- **`GET /api/leads`**
- **Query Params**:
  - `search` (optional): Filter by customer name, mobile, email, or prize code.
  - `spectaclesUser` (optional): Filter by `yes`, `sunglasses_only`, or `no`.
  - `sort` (optional): `desc` (default, newest first) or `asc`.
- **Response**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "id": "lead-sanjay-sn-1",
        "name": "Sanjay S N",
        "mobile": "7868000645",
        "email": "snsanjay2002@gmail.com",
        "spectaclesUser": "yes",
        "whatsappUpdates": true,
        "wonPrize": {
          "id": "msc-70-off",
          "headline": "70%",
          "subline": "Discount on Spectacle",
          "code": "MSC70OFF"
        },
        "submittedAt": "2026-11-24T15:38:00.000Z"
      }
    ]
  }
  ```

#### • **Create / Register Lead**
- **`POST /api/leads`**
- **Body**:
  ```json
  {
    "name": "Rahul Verma",
    "mobile": "9876543210",
    "email": "rahul.verma@example.com",
    "spectaclesUser": "yes",
    "whatsappUpdates": true
  }
  ```
- **Validation Rules**:
  - `name`: Min 2 characters.
  - `mobile`: Exactly 10 digits.
  - `email`: Valid RFC email.
  - `spectaclesUser`: `yes` | `sunglasses_only` | `no`.

#### • **Export Leads to CSV**
- **`GET /api/leads/export/csv`**
- Returns a downloadable spreadsheet file (`myspecz_leads_<timestamp>.csv`) formatted with headers and escaped values.

#### • **Update Lead Details**
- **`PUT /api/leads/:id`**

#### • **Delete Lead**
- **`DELETE /api/leads/:id`**

#### • **Reset All Leads to Initial State**
- **`DELETE /api/leads/reset`**

---

### 3. Spin & Voucher Mechanics (`/api/spin`)

#### • **Execute Server-Side Spin Resolution**
- **`POST /api/spin`**
- Evaluates the winning wheel segment based on:
  1. Explicit simulation parameter (`forceIndex`), OR
  2. Active Admin Target setting (`targetPrizeIndex`), OR
  3. Fair probabilistic weighted distribution across the 7 segments.
- Generates a unique 7-day valid voucher code (e.g. `MSC70OFF-9XK2P`) and attaches it to the lead.
- **Body**:
  ```json
  {
    "leadId": "lead-sanjay-sn-1",
    "mobile": "7868000645",
    "forceIndex": null
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "targetPrizeIndex": 0,
    "prize": {
      "id": "msc-70-off",
      "headline": "70%",
      "subline": "Discount on Spectacle",
      "code": "MSC70OFF"
    },
    "voucher": {
      "code": "MSC70OFF-9XK2P",
      "expiresAt": "2026-12-01T07:40:00.000Z"
    },
    "lead": { ... }
  }
  ```

#### • **Verify Voucher at Store Billing Counter**
- **`POST /api/spin/verify`**
- **Body**:
  ```json
  {
    "code": "MSC70OFF-9XK2P"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "valid": true,
    "message": "Voucher verified successfully",
    "data": {
      "customerName": "Sanjay S N",
      "customerMobile": "7868000645",
      "prize": { ... },
      "voucherCode": "MSC70OFF-9XK2P"
    }
  }
  ```

---

### 4. Admin Target & Analytics (`/api/admin`)

#### • **Get Current Target Mode**
- **`GET /api/admin/target`**
- Returns whether current spins follow fair probability or a forced prize segment.

#### • **Set Forced Target Outcome**
- **`POST /api/admin/target`**
- **Body**:
  ```json
  {
    "targetIndex": 0
  }
  ```
  *(Pass `null` to restore fair random distribution)*

#### • **Get Analytics & Conversion Stats**
- **`GET /api/admin/stats`**
- Returns:
  - Total captured leads count.
  - Spectacles user demographics breakdown (Yes / Sunglasses only / Non-wearers).
  - Prize distribution counts.
  - 5 most recent leads.

---

### 5. Prizes Configuration (`/api/prizes`)
- **`GET /api/prizes`**: List all 7 wheel prizes with colors, descriptions, terms, probabilities.
- **`GET /api/prizes/:id`**: Single prize details.
- **`PUT /api/prizes/:id`**: Update prize terms, description, or probability.

---

## 🔌 Connecting to the Frontend

Set the API base URL in the frontend or use `src/services/api.js`:
```js
export const API_BASE_URL = 'http://localhost:5001/api';
```
All endpoints support permissive CORS for frontend dev servers on ports `5173`, `3000`, `4173`, and `5174`.

