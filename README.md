# SecureAI ExamGuard ???

**An Advanced Anti-Malpractice Online Assessment Platform**

SecureAI ExamGuard is a full-stack, highly secure online examination platform designed to enforce academic integrity in remote learning environments. Built with a modern React frontend and a robust Java Spring Boot backend, the system actively monitors students during exams and automatically flags or submits exams if malpractice is detected.

## ?? Live Demo
- **Frontend Application:** [https://ai-secured-assesment.vercel.app](https://ai-secured-assesment.vercel.app)
- *(Note: Initial backend requests may take 30-50 seconds to wake up the free-tier server).*

---

## Key Features ??

### ????? For Students
* **Strict Full-Screen Enforcement:** Exams cannot be taken unless the browser is locked in full-screen mode.
* **Server-Synced Timers:** Real-time countdowns that automatically submit the exam the moment time expires.
* **Dynamic Warning System:** Students receive instant visual popups when they commit a violation, displaying their remaining attempts.
* **Seamless Exam Interface:** An intuitive UI to mark questions for review, clear responses, and navigate easily.

###  For Faculty & Proctors ?????
* **Live Global Monitoring:** An administrative dashboard that tracks all active exams and categorizes students by risk level (High/Medium/Low).
* **Real-Time Proctoring Feed:** Uses WebSockets to stream live webcam snapshots and behavioral alerts directly to the admin without refreshing.
* **Auto-Submission on Violations:** If a student switches tabs, attempts to copy-paste, or exits full-screen beyond their allowed threshold, the system instantly flags and auto-submits their exam.
* **Question Bank Management:** Easily create, edit, and organize exam questions.

---

##  Technical Architecture  ???

* **Frontend:** React.js, Vite, Tailwind CSS, Axios
* **Backend:** Java, Spring Boot, Spring Security (JWT)
* **Real-Time Communication:** WebSockets (STOMP)
* **Database:** H2 In-Memory Database (for lightning-fast, lightweight storage)
* **Deployment:** Vercel (Frontend) & Render via Docker (Backend)

---

##  Running Locally ??

To run this project on your local machine:

**1. Start the Backend:**
`ash
cd backend
./mvnw spring-boot:run
`

**2. Start the Frontend:**
`ash
cd frontend
npm install
npm run dev
`

The application will be available at http://localhost:3000.
