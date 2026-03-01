// Course catalog with pricing for the DSSL programs
export interface Course {
    id: string
    name: string
    slug: string
    price: number
    currency: string
    duration: string
    format: string
    description: string
    badge?: string
}

export const COURSES: Course[] = [
    {
        id: 'DSSL_DATA_ANALYTICS',
        name: 'Data Analytics',
        slug: 'data-analytics',
        price: 500,
        currency: 'SLE',
        duration: '12 Weeks',
        format: 'In-Person & Online',
        description: 'Master data analysis, visualization, and business intelligence tools.',
        badge: 'Most Popular',
    },
    {
        id: 'DSSL_DATA_SCIENCE',
        name: 'Data Science',
        slug: 'data-science',
        price: 600,
        currency: 'SLE',
        duration: '16 Weeks',
        format: 'In-Person & Online',
        description: 'Deep dive into machine learning, statistical modeling, and Python.',
    },
    {
        id: 'DSSL_DATA_ENGINEERING',
        name: 'Data Engineering',
        slug: 'data-engineering',
        price: 650,
        currency: 'SLE',
        duration: '16 Weeks',
        format: 'In-Person & Online',
        description: 'Build data pipelines, cloud infrastructure, and ETL systems.',
    },
    {
        id: 'DSSL_AI_BUSINESS',
        name: 'AI for Business Leaders',
        slug: 'ai-business-leaders',
        price: 400,
        currency: 'SLE',
        duration: '8 Weeks',
        format: 'Online',
        description: 'Leverage AI to make smarter business decisions without coding.',
        badge: 'New',
    },
    {
        id: 'DSSL_FELLOWSHIPS',
        name: 'Fellowships Program',
        slug: 'fellowships',
        price: 0,
        currency: 'SLE',
        duration: '6 Months',
        format: 'In-Person',
        description: 'Competitive fellowship for high-potential graduates. Application-based.',
        badge: 'Selective',
    },
]
