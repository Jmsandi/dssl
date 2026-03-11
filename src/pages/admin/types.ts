export interface Student { uid: string; name: string; email: string; phone: string; program: string; role: string; createdAt?: { seconds: number } }
export interface Course { id: string; name: string; description: string; price: number; currency: string; duration: string; format: string; isActive: boolean; slug?: string; imageUrl?: string; createdAt?: { seconds: number } }
export interface Payment { id: string; student_id: string; student_name: string; student_email: string; course_id: string; course_name: string; amount: number; currency: string; status: string; transaction_id: string; created_at?: { seconds: number } }
export interface Message { id: string; subject: string; body: string; recipientType: 'all' | 'single'; recipientId?: string; recipientName?: string; sentAt?: { seconds: number }; sentBy: string }
export interface HireRequest { id: string; fullName: string; email: string; phone: string; company: string; industry: string; talentType: string; skills: string[]; count: string; responsibilities: string; referral: string; status: string; createdAt?: { seconds: number } }

export type Tab = 'overview' | 'students' | 'courses' | 'payments' | 'messages' | 'hire'
