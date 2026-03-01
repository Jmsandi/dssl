import { ProgramPageTemplate } from "@/components/program-page-template"
import type { ProgramData } from "@/components/program-page-template"

const program: ProgramData = {
    title: "Data Engineering Fellowship",
    duration: "16 Weeks",
    format: "Hybrid",
    price: "3,500",
    description: "Build robust data pipelines, master cloud platforms, and work with big data tools to power data-driven organizations.",
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600",
    introImages: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    ],
    eligibility: [
        "Strong foundation in at least one programming language (Python/Java/Scala)",
        "Understanding of relational database concepts",
        "Computer with 16GB RAM recommended for local cluster simulations",
        "Commitment to intensive technical training",
    ],
    jobRoles: ["Data Engineer", "Big Data Developer", "Cloud Data Architect", "ETL Developer", "Database Engineer"],
    admissionSteps: [
        { title: "Step 1: Application", description: "Apply online with your background and interests." },
        { title: "Step 2: Coding Challenge", description: "Small project or challenge to test programming logic." },
        { title: "Step 3: Systems Interview", description: "Discuss databases and system design." },
        { title: "Step 4: Offer", description: "Conditional offer based on assessment results." },
    ],
    whoItsFor: "Software developers transitioning into data, aspiring data engineers, and IT professionals wanting to specialize in data infrastructure.",
    whatYouLearn: "Database design, ETL pipelines, workflow orchestration, cloud platforms (AWS/Azure), and distributed computing with Apache Spark.",
    careerOutcomes: "Graduates enter roles as data engineers, ETL developers, and cloud data specialists at top tech organizations.",
    tools: ["SQL & NoSQL", "Apache Airflow", "Apache Spark", "AWS/Azure", "Python", "GitHub"],
    modules: [
        { title: "Module 1: Databases & Architecture", weeks: "Weeks 1-3", outcomes: ["Design database schemas", "Optimize SQL queries", "Build data models"], topics: ["SQL & NoSQL", "Data modeling", "Indexing"] },
    ],
    capstone: { description: "Design and build an end-to-end data pipeline from ingestion to processing to storage, deployed on a cloud platform.", tools: ["Python", "Apache Airflow", "AWS/Azure", "Spark"], deliverables: ["Deployed data pipeline", "Architecture documentation", "Technical presentation"] },
    jobTitles: ["Data Engineer", "ETL Developer", "Cloud Data Specialist", "Platform Engineer", "Database Administrator", "Analytics Engineer"],
    slug: "data-engineering",
}

export default function DataEngineeringPage() {
    return <ProgramPageTemplate program={program} />
}
