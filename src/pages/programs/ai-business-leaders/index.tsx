import { ProgramPageTemplate } from "@/components/program-page-template"
import type { ProgramData } from "@/components/program-page-template"

const program: ProgramData = {
    title: "AI for Business Leaders",
    duration: "6–8 Weeks",
    format: "Online/Hybrid",
    price: "1,500",
    description: "Understand AI strategy, ethics, and digital transformation to lead your organization into the age of artificial intelligence.",
    heroImage: "/ai-business.jpg",
    introImages: ["/ai-business.jpg", "/ai-business.jpg"],
    eligibility: [
        "Management or leadership experience",
        "Decision-making authority within an organization",
        "Strategic mindset and interest in digital transformation",
    ],
    jobRoles: ["AI Strategy Lead", "Digital Transformation Manager", "Chief Data Officer", "Innovation Director", "Product Manager (AI)"],
    admissionSteps: [
        { title: "Step 1: Application", description: "Brief overview of professional background." },
        { title: "Step 2: Executive Chat", description: "Brief call to align program goals with career objectives." },
        { title: "Step 3: Registration", description: "Complete payment and secure your cohort spot." },
    ],
    whoItsFor: "Executives, managers, entrepreneurs, and decision-makers wanting to understand how AI can transform their organizations.",
    whatYouLearn: "AI concepts, business use cases, data strategy, ethical AI principles, and how to lead digital transformation initiatives.",
    careerOutcomes: "Leaders who complete this program drive AI adoption, build data strategies, and lead digital transformation at their organizations.",
    tools: ["Notion / Miro", "AI Demo Tools", "Case Study Datasets", "Presentation Tools"],
    modules: [
        { title: "Module 1: Understanding AI", outcomes: ["Explain AI concepts", "Identify AI opportunities"], topics: ["AI fundamentals", "Machine learning overview", "Natural language processing", "Computer vision"] },
    ],
    capstone: { description: "Develop a comprehensive AI strategy and digital transformation roadmap for a real organization or business scenario.", tools: ["Notion/Miro", "Presentation tools"], deliverables: ["AI strategy document", "Transformation roadmap", "Executive presentation"] },
    jobTitles: ["AI Strategy Lead", "Digital Transformation Manager", "Chief Data Officer", "Innovation Director", "Technology Advisor", "Product Manager (AI)"],
    slug: "ai-business-leaders",
}

export default function AIBusinessLeadersPage() {
    return <ProgramPageTemplate program={program} />
}
