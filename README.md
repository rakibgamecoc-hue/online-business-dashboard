# Localized Business Analytics Dashboard (MERN Stack)

A localized Business Analytics Dashboard designed for businesses operating in Bangladesh. All monetary figures are in **Bangladeshi Taka (BDT ৳)**. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with a custom premium dark-themed layout using Tailwind CSS. 

This application operates completely offline with manual inputs—there are **no third-party API integrations**, making it secure and fully controlled by the owner.

---

## 🚀 Key Features

### 1. Invest Section (Manual Expense Trackers)
* **Ads Expense Log**: Record date, platform (Meta/Google), and amount spent in BDT.
* **Dollar Wallet Tracker**: Keep a manual conversion log tracking BDT spent to purchase USD for ad accounts. Includes credit entry logging (Date, BDT spent, USD received, rate). Granular transaction histories are hidden inside a collapsible accordion UI to keep the screen clean.
* **Product Sourcing Tracker**: Input product name, batch number, unit cost, and packaging cost. Total cost calculates automatically.
* **Operating Costs**: Logs for mobile recharges, poly bags, cartoons, and other daily miscellaneous expenses.

### 2. Earn Section (Manual Revenue Tracker)
* **Pathao Delivery Tracker**: Manually log courier payouts received from Pathao Courier. Tracks payout date, Order/Consignment ID, amount received in BDT, and status (`Paid` / `Pending`).

### 3. Analytics & Overview Dashboard
* Interactive summary cards calculating:
  * **Total Ads Spend** (BDT)
  * **Total Revenue / Paid Payouts** (BDT)
  * **Total Sourcing Cost** (BDT)
  * **Total Operating Cost** (BDT)
  * **Pending Payouts** (BDT)
  * **Net Profit / Loss** (calculated automatically: `Revenue (Paid) - (Ads Spend + Product Sourcing + Operating Costs)`)

---

## 🛠️ Tech Stack

* **Frontend**: React.js (Vite), Tailwind CSS (v3), React Router DOM (v6), React Icons, React Hot Toast
* **Backend**: Node.js, Express.js
* **Database**: MongoDB, Mongoose ODM

---

## 📁 Directory Structure

```text
bd-analytics-dashboard/
├── server/                     # Express Backend
│   ├── config/db.js            # Mongoose DB Connection
│   ├── models/                 # 5 Mongoose Schemas
│   ├── routes/                 # REST API endpoints
│   ├── server.js               # Express server entry point
│   └── package.json
│
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── api/axios.js        # API instance with proxy
│   │   ├── components/         # Sidebar, Metric cards, Accordion UI
│   │   ├── pages/              # Dashboard and section pages
│   │   ├── App.jsx             # Router and layout configuration
│   │   ├── index.css           # Tailwind + Custom components layers
│   │   └── main.jsx            # React client mount
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🏃 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
* **Node.js** (LTS version)
* **MongoDB Community Server** (running locally on port `27017`)

---

### Step 1: Install Backend Dependencies & Start Server
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm run dev
   ```
   *The server starts on port `5000` (`http://localhost:5000`).*

---

### Step 2: Install Frontend Dependencies & Start Client
1. Open a new terminal window and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173` in your browser to view the application.*

*Note: For Windows PowerShell environments where script execution is disabled, run installation commands using `.cmd` explicitly:*
```powershell
npm.cmd install
npm.cmd run dev
```

---

## 🔒 License
This project is open-source and free to customize. 
