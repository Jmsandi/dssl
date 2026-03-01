import { ProgramPageTemplate } from "@/components/program-page-template"
import type { ProgramData } from "@/components/program-page-template"

const program: ProgramData = {
    title: "Data Science Fellowship",
    duration: "16 Weeks",
    format: "Hybrid",
    price: "3,500",
    description: "Master statistics, machine learning, and model deployment. Build predictive solutions that solve real-world problems and drive innovation.",
    heroImage: "/data-science.jpg",
    introImages: ["/data-science.jpg", "/data-science.jpg"],
    eligibility: [
        "Foundational knowledge of Python or similar programming languages",
        "Prior experience with data analysis or statistics",
        "Access to a computer with at least 8GB RAM",
        "Stable internet connection for virtual hybrid sessions",
        "Dedication to a 16-week intensive learning journey",
    ],
    jobRoles: ["Data Scientist", "Machine Learning Engineer", "Research Scientist", "AI Specialist", "Quantitative Analyst", "Deep Learning Engineer"],
    admissionSteps: [
        { title: "Step 1 → Application", description: "Submit your resume and project portfolio. Tell us why you want to become a data scientist." },
        { title: "Step 2 – Technical Quiz", description: "A timed assessment covering Python, statistics, and basic linear algebra." },
        { title: "Step 3 – Technical Interview", description: "Live coding and problem-solving session with our lead data scientists." },
        { title: "Step 4 – Faculty Review", description: "Final review of your application by our fellowship faculty." },
        { title: "Step 5 → Enrollment", description: "Receive your offer letter and join the cohort." },
    ],
    whoItsFor: "Aspiring data scientists, Python programmers looking to specialize, and professionals wanting to build ML solutions.",
    whatYouLearn: "Python for data science, statistical analysis, machine learning algorithms, model evaluation, and deployment workflows.",
    careerOutcomes: "Graduates land roles as data scientists, ML engineers, and research analysts at leading organizations.",
    tools: ["Python", "Pandas, NumPy", "Scikit-learn", "Jupyter Notebook", "Matplotlib, Seaborn", "Flask/FastAPI", "GitHub"],
    modules: [
        { title: "Module 1: Python for Data Science", weeks: "Weeks 1-3", outcomes: ["Write Python scripts for data analysis", "Perform exploratory data analysis (EDA)", "Clean and preprocess datasets"], topics: ["Python fundamentals", "Data structures", "Pandas & NumPy"] },
    ],
    capstone: { description: "Develop and deploy a machine learning model to solve a real-world predictive analytics problem.", tools: ["Python", "Scikit-Learn", "FastAPI", "Docker"], deliverables: ["Deployed ML Model", "API Documentation", "Final Report"] },
    jobTitles: ["Data Scientist", "ML Engineer", "Data Analyst", "Statistician"],
    slug: "data-science",
}

export default function DataSciencePage() {
    return <ProgramPageTemplate program={program} />
}
