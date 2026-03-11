import React, { createContext, useContext, useEffect, useState } from 'react'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { auth, db } from './firebase'

export interface UserProfile {
    uid: string
    email: string
    name: string
    phone: string
    program: string
    role: 'student' | 'admin'
}

interface AuthContextType {
    user: User | null
    profile: UserProfile | null
    isLoading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (data: RegisterData) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}

export interface RegisterData {
    email: string
    password: string
    name: string
    phone: string
    program: string
}

const googleProvider = new GoogleAuthProvider()
const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Helper to fetch or create a user profile
    const fetchOrCreateProfile = async (firebaseUser: User) => {
        try {
            const userRef = doc(db, 'users', firebaseUser.uid)
            const snap = await getDoc(userRef)

            if (snap.exists()) {
                setProfile(snap.data() as UserProfile)
            } else {
                // Determine role based on email or default to student
                const newProfile: UserProfile = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email ?? '',
                    name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'Student',
                    phone: '',
                    program: '',
                    role: 'student', // Default role
                }

                await setDoc(userRef, { ...newProfile, createdAt: serverTimestamp() })
                await setDoc(doc(db, 'students', firebaseUser.uid), { ...newProfile, createdAt: serverTimestamp() })

                setProfile(newProfile)
            }
        } catch (error) {
            console.error('Error fetching/creating profile:', error)
            setProfile(null)
        }
    }

    useEffect(() => {
        let unsubscribeProfile: (() => void) | null = null

        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser)

            if (unsubscribeProfile) {
                unsubscribeProfile()
                unsubscribeProfile = null
            }

            if (firebaseUser) {
                const userRef = doc(db, 'users', firebaseUser.uid)
                const studentRef = doc(db, 'students', firebaseUser.uid)
                let unsubscribeStudent: (() => void) | null = null

                unsubscribeProfile = onSnapshot(userRef, (userSnap: any) => {
                    if (userSnap.exists()) {
                        const userData = userSnap.data() as UserProfile

                        // Cleanup previous student listener if exists
                        if (unsubscribeStudent) {
                            unsubscribeStudent()
                            unsubscribeStudent = null
                        }

                        if (userData.role === 'student') {
                            unsubscribeStudent = onSnapshot(studentRef, (studentSnap: any) => {
                                if (studentSnap.exists()) {
                                    setProfile({ ...userData, ...studentSnap.data() } as UserProfile)
                                } else {
                                    setProfile(userData)
                                }
                                setIsLoading(false)
                            })
                        } else {
                            setProfile(userData)
                            setIsLoading(false)
                        }
                    } else {
                        // Create initial profile if missing
                        const newProfile: UserProfile = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email ?? '',
                            name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'Student',
                            phone: '',
                            program: '',
                            role: 'student',
                        }
                        setDoc(userRef, { ...newProfile, createdAt: serverTimestamp() })
                        setDoc(studentRef, { ...newProfile, createdAt: serverTimestamp() })
                        setProfile(newProfile)
                        setIsLoading(false)
                    }
                }, (error: Error) => {
                    console.error('Error listening to profile:', error)
                    setIsLoading(false)
                })

                // Extend clean up for nested listener
                const originalUnsubProfile = unsubscribeProfile
                unsubscribeProfile = () => {
                    originalUnsubProfile()
                    if (unsubscribeStudent) unsubscribeStudent()
                }
            } else {
                setProfile(null)
                setIsLoading(false)
            }
        })

        return () => {
            unsubscribeAuth()
            if (unsubscribeProfile) unsubscribeProfile()
        }
    }, [])

    const signIn = async (email: string, password: string) => {
        const result = await signInWithEmailAndPassword(auth, email, password)
        // Await profile so ProtectedRoute sees it immediately on navigate()
        await fetchOrCreateProfile(result.user)
    }

    const signUp = async ({ email, password, name, phone, program }: RegisterData) => {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        const userProfile: UserProfile = {
            uid: result.user.uid,
            email,
            name,
            phone,
            program,
            role: 'student',
        }
        await setDoc(doc(db, 'users', result.user.uid), { ...userProfile, createdAt: serverTimestamp() })
        await setDoc(doc(db, 'students', result.user.uid), { ...userProfile, createdAt: serverTimestamp() })
        setProfile(userProfile)
        // onAuthStateChanged will handle the user update
    }

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider)
        // Await profile so ProtectedRoute sees it immediately on navigate()
        await fetchOrCreateProfile(result.user)
    }

    const signOut = async () => {
        await firebaseSignOut(auth)
        setProfile(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, profile, isLoading, signIn, signUp, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
    return ctx
}
