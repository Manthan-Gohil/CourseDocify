# 📚 CourseDocify - The Course File Generator 🛠️  

CourseDocify is a smart and efficient web application designed to help faculty members **automatically generate structured course files** by uploading multiple document types. It brings consistency, reduces manual effort, and even analyzes uploaded student data (like Excel marksheets) to **identify slow learners**.

---

## 🚀 Overview

- 📁 Upload multiple files: PDFs, Excel sheets, Quiz questions, Assignments, etc.  
- 📄 Automatically merges them into a **formatted course file PDF**  
- 🧠 Identifies **slow learners** from Excel mark sheets  
- 📝 Adds course metadata and a **Table of Contents**  
- 🔐 Secure user login and registration for faculty  
- 📤 Final PDF viewable from user dashboard  

---

## ⚙️ Tech Stack

### 💻 Frontend:
- React.js
- Tailwind CSS
- Axios

### 🧠 Backend:
- Node.js
- Express.js

### 🗃️ Database:
- MongoDB (via Mongoose)

### 📦 Additional Libraries / Tools:
- `multer` – File uploads
- `xlsx` – Excel file parsing
- `pdf-lib` – PDF generation and manipulation
- `jsonwebtoken (JWT)` – Authentication
- `bcryptjs` – Password encryption
- `cors`, `dotenv`, `cookie-parser`, `express-validator`

---

## 🧰 Features

- 🔐 **User Authentication**
  - Faculty can register/login securely using JWT tokens  
  - Encrypted password storage using bcrypt

- 📁 **Multi-file Upload**
  - Upload multiple document formats simultaneously  
  - Backend logic auto-classifies based on file title  

- 📊 **Slow Learner Identification**
  - Extracts student marks from Excel sheets  
  - Automatically flags slow learners using thresholds  

- 📄 **PDF Generator**
  - Creates a professional course file with:
    - Cover page (course name, code, session, etc.)
    - Auto-generated table of contents  
    - Merged sections for each uploaded document  

---

## 🧑‍💻 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Manthan-Gohil/CourseDocify.git
cd CourseDocify
```
### 2. Install Backend Dependencies

```bash
cd backend
npm install
```
### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```
### 4. Run the Project

```bash
# Start backend server
cd backend
npm run dev

# Open another terminal and start frontend
cd ../frontend
npm start
```
---

## ✍️ Future Enhancements

- ✅ **AI-generated summaries and quiz difficulty estimations**
- 📊 **Dashboard for performance analytics**
- ☁️ **Google Drive & Dropbox integration**
- 📱 **Mobile App support for on-the-go uploads**
- 🧠 **Advanced ML-based student classification**

---

## ✨ Contributors

- **Manthan Gohil** – [GitHub Profile](https://github.com/Manthan-Gohil)

---
   
