export const fmtDate = (ts?: { seconds: number }) => ts ? new Date(ts.seconds * 1000).toLocaleDateString('en-GB') : '—'
export const fmtCurrency = (amount: number, currency = 'SLE') => `${currency} ${amount.toLocaleString()}`

export const toSlug = (name: string) =>
    name.trim().toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
