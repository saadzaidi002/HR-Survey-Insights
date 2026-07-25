# 📊 HR Employee Survey Insights

![Dashboard Preview](https://img.shields.io/badge/Status-Live-success?style=for-the-badge) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) 

A highly-dense, single-screen interactive dashboard built with React, Vite, and Recharts to visualize HR Employee Survey data. Designed without scrollbars to display critical KPIs, demographic breakdowns, and trend analysis all at a glance.

🌍 **Live Demo:** [https://hr-survey-insights.vercel.app/](https://hr-survey-insights.vercel.app/)

---

## 🚀 Features

- **Single-Screen Density**: A meticulously crafted 100vh CSS Grid layout that completely eliminates vertical scrolling, ensuring maximum information density on widescreen monitors.
- **Data Filtering**: Dynamically filter data globally by **Department** and **Role** with instantaneous visual updates.
- **Top-Level KPIs**: Real-time aggregation of the Average Satisfaction Score, Trend Evaluation, and Incomplete survey tracking.
- **Interactive Visualizations**:
  - **Role Demographics**: A responsive donut pie-chart with built-in percentage calculation and an intuitive side-legend.
  - **Department Average**: Bar chart comparing the satisfaction score across 40+ departments effortlessly.
  - **Comparative Analysis**: Clustered bar charts breaking down the satisfaction scores by role within every department.
  - **Trend Analysis**: A timeline graph plotting the monthly averages to detect macro sentiment trends.

## 🧠 Data Processing Pipeline

This project was built without relying on traditional BI tools (like Power BI or Excel). The data pipeline consists of:
1. **Python / Pandas**: A custom script `generate_notebook.py` and Jupyter Notebook (`HR_Survey_Analysis.ipynb`) that ingests the raw Excel dataset, handles missing/null values, maps categories, and automatically exports the cleaned structured dataset to a lightweight JSON file.
2. **React App (Vite)**: The front-end imports this static JSON file, completely removing the need for a backend server or database API while maintaining instant load times.

## 💻 Local Development

Want to run this locally?

```bash
# 1. Clone the repository
git clone https://github.com/saadzaidi002/HR-Survey-Insights.git
cd HR-Survey-Insights/dashboard

# 2. Install Dependencies
npm install

# 3. Start the Vite Development Server
npm run dev
```

## 🛠️ Built With

* **[React 18](https://reactjs.org/)** - UI Component Library
* **[Vite](https://vitejs.dev/)** - Next-generation Frontend Tooling
* **[Recharts](https://recharts.org/)** - Composable Charting Library
* **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons
