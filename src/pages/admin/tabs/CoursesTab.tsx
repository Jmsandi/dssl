import { useState } from 'react'
import { Plus, X, Pencil, Trash2, Loader2, BookOpen, Check } from 'lucide-react'
import { Course } from '../types'
import { fmtCurrency, toSlug } from '../utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { db, storage } from '@/lib/firebase'
import { doc, updateDoc, addDoc, collection, serverTimestamp, deleteDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

interface CoursesTabProps {
    courses: Course[]
}

const EMPTY_COURSE = { name: '', description: '', price: 0, currency: 'SLE', duration: '', format: 'In-Person & Online', isActive: true, slug: '', imageUrl: '' }

export function CoursesTab({ courses }: CoursesTabProps) {
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<Course | null>(null)
    const [form, setForm] = useState(EMPTY_COURSE)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploadingImage, setUploadingImage] = useState(false)

    const openNew = () => { setEditing(null); setForm(EMPTY_COURSE); setImageFile(null); setImagePreview(null); setShowForm(true) }
    const openEdit = (c: Course) => {
        setEditing(c);
        setForm({ name: c.name, description: c.description, price: c.price, currency: c.currency, duration: c.duration, format: c.format, isActive: c.isActive, slug: c.slug || toSlug(c.name), imageUrl: c.imageUrl || '' })
        setImageFile(null)
        setImagePreview(c.imageUrl || null)
        setShowForm(true)
    }
    const closeForm = () => { setShowForm(false); setEditing(null); setImageFile(null); setImagePreview(null) }

    const handleSave = async () => {
        if (!form.name) return alert('Course name is required')
        if (form.price === undefined || form.price === null) return alert('Price is required')

        setSaving(true)
        try {
            let imageUrl = form.imageUrl || ''

            // Upload image if one was selected
            if (imageFile) {
                setUploadingImage(true)
                try {
                    // Sanitize filename to avoid character issues
                    const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
                    const storageRef = ref(storage, `course-images/${Date.now()}-${safeName}`)

                    // Add metadata for content type
                    const metadata = { contentType: imageFile.type }

                    console.log('Uploading image...', safeName, imageFile.type)
                    await uploadBytes(storageRef, imageFile, metadata)
                    imageUrl = await getDownloadURL(storageRef)
                    console.log('Image uploaded successfully:', imageUrl)
                } catch (err: any) {
                    console.error('Storage upload failed:', err)
                    throw new Error(`Image upload failed: ${err.message || 'Unknown storage error'}`)
                } finally {
                    setUploadingImage(false)
                }
            }

            const slug = form.slug || toSlug(form.name)
            const payload = { ...form, price: Number(form.price), slug, imageUrl }

            if (editing) {
                await updateDoc(doc(db, 'courses', editing.id), { ...payload, updatedAt: serverTimestamp() })
                alert('Course updated successfully!')
            } else {
                await addDoc(collection(db, 'courses'), { ...payload, createdAt: serverTimestamp() })
                alert('Course created successfully!')
            }
            closeForm()
        } catch (error: any) {
            console.error('Error saving course:', error)
            alert('Failed to save course: ' + (error.message || 'Unknown error'))
        } finally { setSaving(false) }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this course?')) return
        setDeleting(id)
        await deleteDoc(doc(db, 'courses', id))
        setDeleting(null)
    }

    const fc = (f: string) => `w-full h-9 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white`

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-navy">Courses</h1>
                    <p className="text-slate-500 text-xs sm:text-sm">{courses.length} courses configured</p>
                </div>
                <Button onClick={openNew} className="bg-navy hover:bg-navy/90 text-white rounded-xl shadow-lg shadow-navy/10 w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-1" /> <span className="text-sm font-bold">Add Course</span>
                </Button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
                    <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up sm:animate-in sm:fade-in sm:zoom-in">
                        <div className="flex items-center justify-between p-5 border-b border-border">
                            <h2 className="font-bold text-navy">{editing ? 'Edit Course' : 'New Course'}</h2>
                            <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            {/* Course Image Upload */}
                            <div className="space-y-1.5">
                                <Label className="text-slate-700 font-semibold">Course Image</Label>
                                <div className="flex items-center gap-3">
                                    {imagePreview && (
                                        <img src={imagePreview} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0" />
                                    )}
                                    <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition text-sm text-slate-500">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={e => {
                                                const file = e.target.files?.[0] || null
                                                setImageFile(file)
                                                setImagePreview(file ? URL.createObjectURL(file) : null)
                                            }}
                                        />
                                        📷 {imagePreview ? 'Change image' : 'Upload course image'}
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-700 font-semibold">Course Name</Label>
                                <input
                                    className={fc('')}
                                    value={form.name}
                                    onChange={e => {
                                        const name = e.target.value
                                        setForm(f => ({
                                            ...f,
                                            name,
                                            slug: toSlug(name) // Auto-generate slug from name
                                        }))
                                    }}
                                    placeholder="e.g. Data Analytics"
                                />
                            </div>
                            {/* Slug (auto-generated, but editable) */}
                            <div className="space-y-1.5">
                                <Label className="text-slate-700 font-semibold text-xs sm:text-sm">URL Slug <span className="text-slate-400 font-normal text-[10px]">(auto-generated)</span></Label>
                                <div className="flex items-center border border-border rounded-lg overflow-hidden bg-slate-50">
                                    <span className="px-2 text-slate-400 text-[10px] sm:text-xs border-r border-border py-2 bg-slate-100 whitespace-nowrap">/payment?program=</span>
                                    <input
                                        className="flex-1 h-9 px-2 text-xs sm:text-sm focus:outline-none bg-slate-50 text-slate-600"
                                        value={form.slug}
                                        onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                        placeholder="data-analytics"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-700 font-semibold">Description</Label>
                                <textarea className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white resize-none" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short course description…" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-slate-700 font-semibold">Price</Label>
                                    <input className={fc('')} type="number" min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} placeholder="500" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-700 font-semibold">Currency</Label>
                                    <select className={fc('')} value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                                        <option value="SLE">SLE</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-slate-700 font-semibold">Duration</Label>
                                    <input className={fc('')} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="12 Weeks" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-700 font-semibold">Format</Label>
                                    <select className={fc('')} value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))}>
                                        <option>In-Person & Online</option>
                                        <option>In-Person</option>
                                        <option>Online</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="active" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="accent-primary" />
                                <Label htmlFor="active" className="text-slate-700 font-semibold cursor-pointer">Published (visible to students)</Label>
                            </div>
                        </div>
                        <div className="p-5 border-t border-border flex gap-2 justify-end">
                            <Button variant="outline" onClick={closeForm}>Cancel</Button>
                            <Button onClick={handleSave} disabled={saving || uploadingImage} className="bg-navy hover:bg-navy/90 text-white">
                                {(saving || uploadingImage) ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                                {editing ? 'Save Changes' : 'Create Course'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Grid */}
            {courses.length === 0 ? (
                <div className="bg-white border border-border rounded-2xl p-16 text-center">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No courses yet. Add your first course.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map(c => (
                        <div key={c.id} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition">
                            {c.imageUrl && (
                                <div className="w-full h-32 overflow-hidden">
                                    <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-4 sm:p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="font-bold text-navy break-words text-sm sm:text-base">{c.name}</h3>
                                            <span className={`text-[10px] sm:text-xs rounded-full px-2 py-0.5 font-bold uppercase tracking-tight ${c.isActive ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                                                {c.isActive ? 'Active' : 'Draft'}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{c.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                                    <span>{c.duration}</span>
                                    <span>·</span>
                                    <span>{c.format}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-black text-navy">{fmtCurrency(c.price, c.currency)}</span>
                                    <div className="flex gap-1">
                                        <Button size="sm" variant="outline" onClick={() => openEdit(c)} className="h-8 px-2">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleDelete(c.id)} disabled={deleting === c.id} className="h-8 px-2 text-red-500 hover:bg-red-50 hover:border-red-200">
                                            {deleting === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
