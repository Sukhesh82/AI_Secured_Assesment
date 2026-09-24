# 🛡️ SecureAI ExamGuard

### An Advanced Anti-Malpractice Online Assessment Platform

SecureAI ExamGuard is a full-stack, highly secure online examination platform designed to enforce academic integrity in remote learning environments. Built with a modern React frontend and a robust Java Spring Boot backend, the system actively monitors students during exams and automatically flags or submits exams if malpractice is detected.

---

## 🚀 Live Demo

- **Website:** https://ai-secured-assesment.vercel.app
- *(Note: Initial backend requests may take 30–50 seconds to wake up, since it's hosted on a free-tier server.)*

---

## ✨ Key Features

### For Students 🎓
- **Strict Full-Screen Enforcement** — Exams cannot be taken unless the browser is locked in full-screen mode.
- **Server-Synced Timers** — Real-time countdowns that automatically submit the exam the moment time expires.
- **Dynamic Warning System** — Instant visual popups when a violation is detected, showing remaining attempts.
- **Seamless Exam Interface** — Mark questions for review, clear responses, and navigate easily via a live question palette.
- **Live AI Proctoring** — Real-time webcam monitoring streamed via WebSockets.

### For Faculty & Proctors 🧑‍🏫
- **Live Global Monitoring** — Admin dashboard tracking all active exams, categorized by risk level (High/Medium/Low).
- **Real-Time Proctoring Feed** — Live webcam snapshots and behavioral alerts streamed to the admin without refreshing.
- **Auto-Submission on Violations** — Tab-switching, copy-paste attempts, or exiting full-screen beyond the allowed threshold auto-flags and submits the exam.
- **Question Bank Management** — Create, edit, and organize exam questions easily.

---

## 🏗️ Technical Architecture

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS, Axios |
| Backend | Java, Spring Boot, Spring Security (JWT) |
| Real-Time Communication | WebSockets (STOMP) |
| Database | SQL (via Hibernate/JPA) |
| Deployment | Vercel (Frontend) & Render via Docker (Backend) |

---

## 💻 Running Locally

**1. Clone the repository**
```bash
git clone https://github.com/Sukhesh82/AI_Secured_Assesment.git
cd AI_Secured_Assesment
```

**2. Start the Backend**
```bash
cd backend
./mvnw spring-boot:run
```

**3. Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 📄 License & Usage

**© 2026 Sukhesh. All Rights Reserved.**

This project — including its source code, design, and documentation — is shared publicly for demonstration and evaluation purposes only.

You may **view** this code to evaluate the project. However:

- ❌ Copying, reproducing, or redistributing this code (in whole or in part) is **not permitted** without explicit written permission.
- ❌ This project may **not** be used for commercial purposes or repackaged as a separate project.
- ✅ You are welcome to reference this project, discuss it, or link to it with proper credit.

For permissions or inquiries, please reach out via the Contact link on the live site.

---

## 📬 Contact

For questions, feedback, or collaboration inquiries, reach out via the Contact link on the [live site](https://ai-secured-assesment.vercel.app).

