import { ProgramPageTemplate } from "@/components/program-page-template"
import type { ProgramData } from "@/components/program-page-template"

const program: ProgramData = {
    title: "Data Analytics",
    duration: "12 Weeks",
    format: "Hybrid",
    price: "2,500",
    description: "Harness Excel, SQL, Power BI, and Python Programming to tell compelling stories with data. Build confidence and credibility to power insight-driven strategy on the job.",
    heroImage: "/data-analytics.jpg",
    introImages: [
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    ],
    eligibility: [
        "A good working laptop (8gb RAM or above, 1TB HDD or 256 SSD)",
        "A stable internet connection",
        "A serene environment for virtual sessions",
        "Ability to pursue the program on a full-time basis",
        "Prior expression of leadership potential",
    ],
    jobRoles: ["Data Analyst", "Financial Analyst", "Business Analyst", "Health Analyst", "Database Administrator", "Data Engineer", "Market Research Analyst, etc."],
    admissionSteps: [
        { title: "Step 1 → Apply", description: "Submit your application. Share a bit about yourself and what's driving you to start a career in data science." },
        { title: "Step 2 – Admissions Assessment", description: "Complete a technical assessment to demonstrate your aptitude and readiness for the program." },
        { title: "Step 3 – Admissions Interview", description: "Meet with our admissions team to discuss your goals, experience, and leadership potential." },
        { title: "Step 4 – Admissions Decision", description: "Receive your admissions decision and scholarship details if applicable." },
        { title: "Step 5 → Prework", description: "Begin your journey with essential prework to prepare for the intensive fellowship." },
    ],
    whoItsFor: "Aspiring data analysts, business professionals wanting to leverage data, and career changers looking to enter the tech industry.",
    whatYouLearn: "Excel mastery, SQL querying, Power BI dashboard design, Python for data analysis, and end-to-end analytical workflows.",
    careerOutcomes: "Graduates have been placed in data analyst, business analyst, and BI developer roles across top organizations in Sierra Leone and beyond.",
    tools: ["Excel", "SQL (MySQL/PostgreSQL)", "Power BI", "Python", "Jupyter Notebook", "GitHub"],
    modules: [
        { title: "Module 1: Foundations of Data & Excel Mastery", weeks: "Weeks 1-2", outcomes: ["Clean and prepare datasets", "Build pivot tables and charts", "Apply advanced formulas"], topics: ["Data types", "Excel productivity", "Data cleaning", "Pivot tables", "Functions & formulas"] },
        { title: "Module 2: Database Management & SQL", weeks: "Weeks 3-5", outcomes: ["Write complex SQL queries", "Design relational databases", "Manage data integrity"], topics: ["SELECT statements", "Joins & unions", "Aggregations", "Subqueries", "Database design"] },
        { title: "Module 3: Data Visualization with Power BI", weeks: "Weeks 6-8", outcomes: ["Create interactive dashboards", "Tell stories with data", "Apply design principles"], topics: ["Power Query", "DAX formulas", "Visual best practices", "Report publishing"] },
        { title: "Module 4: Python for Data Analysis", weeks: "Weeks 9-11", outcomes: ["Automate analysis tasks", "Perform statistical analysis", "Handle large datasets"], topics: ["NumPy & Pandas", "Data wrangling", "Matplotlib & Seaborn", "Statistical tests"] },
        { title: "Module 5: Capstone Project", weeks: "Week 12", outcomes: ["Apply all skills to a real project", "Present findings to stakeholders"], topics: ["Project scoping", "End-to-end analysis", "Presentation skills", "Portfolio building"] },
    ],
    capstone: { description: "A comprehensive real-world analytics project where you'll clean, analyze, and visualize a complex dataset to solve a business problem.", tools: ["SQL", "Python", "Power BI"], deliverables: ["Technical report", "Interactive dashboard", "Executive presentation"] },
    jobTitles: ["Data Analyst", "Business Analyst", "BI Developer", "Reporting Analyst", "Junior Analytics Manager"],
    slug: "data-analytics",
}

export default function DataAnalyticsPage() {
    return <ProgramPageTemplate program={program} />
}
