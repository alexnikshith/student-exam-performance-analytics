# 🎓 EduAnalytics: Student Performance Analysis Platform

[![Live demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://eduanalysis.vercel.app/)

**EduAnalytics** is a high-fidelity, professional SaaS dashboard designed for educators to transform raw student data into actionable insights. Built with a matte-maroon institutional aesthetic, it provides both macroscopic class-level analytics and granular individual student performance reports.

---

## 🌟 Key Features

### 📊 Comprehensive Class Analytics
*   **Executive Summary**: AI-generated insights highlighting top performers, at-risk students, and attendance correlations.
*   **Visual Data Visualization**: 6+ interactive charts covering grade distribution, pass/fail ratios, and subject-wise averages.
*   **Section-wise Comparison**: Compare performance across different classes and sections.

### 🎯 Subject Deep-Dive
*   Isolate specific subjects to view **Pass Rates**, **Class Averages**, and **Score Distributions**.
*   View subject-specific leaderboards to identify top-performing students in each category.

### 👤 Individual Student Report Cards
*   **Interactive Radar Charts**: Visualizing a student's strengths and weaknesses against the class average.
*   **AI-Powered Feedback**: Personalized remarks generated based on student performance and attendance.
*   **One-Click Print/PDF**: Professional, single-page report cards ready for distribution to parents or students.

### 🛠️ Data Management
*   **Dynamic Column Detection**: Automatically identifies Student ID, Name, and Subject columns from any CSV.
*   **Persistence**: Automatically saves your work to local storage so you never lose your analysis.
*   **CSV Export**: Export augmented student data with calculated ranks, grades, and status.

---

## 🚀 Tech Stack

*   **Frontend**: React.js, Vite, Tailwind CSS (v4)
*   **Backend**: Python FastAPI (Serverless)
*   **Data Science**: Pandas, NumPy
*   **Visuals**: Recharts (High-fidelity interactive charts)
*   **AI Integration**: Groq LPU (Fast inference for student remarks)
*   **Deployment**: Vercel (Native Monorepo Support)

---

## 📖 How to Use

1.  **Prepare your CSV**: Ensure your file has columns like `Student_Name` and subject marks (e.g., `Math_Total` or `Math_Internal` + `Math_External`).
2.  **Upload**: Drag and drop your file into the dashboard.
3.  **Explore**: Navigate between **Class Insights**, **Subject Analysis**, and **Student Profiles**.
4.  **Export**: Use the **Print** buttons to save PDF reports or the **Export CSV** button for raw data.

---

## 💻 Installation (Local Development)

```bash
# Clone the repository
git clone https://github.com/alexnikshith/student-exam-performance-analytics.git

# Install Frontend dependencies
cd frontend
npm install

# Install Backend dependencies
cd ../api
pip install -r requirements.txt

# Run Frontend
cd ../frontend
npm run dev
```

---


