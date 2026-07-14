# 📄 AI Invoice Extraction System

An AI-powered invoice processing platform built with the MERN Stack, TypeScript, and Google's Gemini AI. The application extracts structured information from PDF and image invoices, validates the extracted data, stores it in MongoDB, and provides an interactive dashboard for invoice management.

---

## 🚀 Features

- 📤 Upload invoice files (PDF, PNG, JPG, JPEG)
- 🤖 AI-powered invoice data extraction using Gemini AI
- 📑 Automatic conversion into structured JSON
- ✅ Data validation using Zod
- 💾 Store extracted invoices in MongoDB
- 📊 Dashboard with invoice analytics
- 🔍 Search and filter invoices
- 📄 View complete invoice details
- ✏️ Edit extracted invoice information
- 🗑️ Delete invoices
- 📥 Export invoice data as JSON
- 📱 Responsive modern UI
- ⚡ Fast REST API with Express & TypeScript

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Framer Motion

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Multer
- Zod
- Google Gemini AI API

---

## 📂 Project Structure

```
AI-Invoice-System
│
├── frontend
│   ├── src
│   ├── public
│   └── ...
│
├── backend
│   ├── src
│   ├── uploads
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/AI-Invoice-System.git
cd AI-Invoice-System
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection

GEMINI_API_KEY=your_api_key
```

Start Backend

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📸 Screenshots

> Add screenshots here after deployment.

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Upload Invoice

![Upload](screenshots/upload.png)

### Invoice Details

![Invoice](screenshots/invoice.png)

---

## 🔄 Application Workflow

```
Upload Invoice
        │
        ▼
PDF/Image
        │
        ▼
Gemini AI
        │
        ▼
Structured JSON
        │
        ▼
Validation (Zod)
        │
        ▼
MongoDB
        │
        ▼
Dashboard
```

---

## 📡 REST API

### Upload Invoice

```
POST /api/upload
```

### Get All Invoices

```
GET /api/invoices
```

### Get Invoice

```
GET /api/invoice/:id
```

### Update Invoice

```
PUT /api/invoice/:id
```

### Delete Invoice

```
DELETE /api/invoice/:id
```

### Dashboard Statistics

```
GET /api/stats
```

---

## 🎯 Future Improvements

- Docker Support
- User Authentication
- Multi-user Workspace
- OCR Fallback Support
- CSV / Excel Export
- Cloud Storage Integration
- Invoice Approval Workflow

---

## 🤝 Contributing

Pull requests are welcome. Feel free to fork this repository and submit improvements.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Deepak**

B.Tech Information Technology

AI | MERN Stack | TypeScript | Full Stack Developer
