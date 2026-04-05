import { useState, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Globe, Upload, Download, CheckCircle2, XCircle,
  LogOut, Eye, EyeOff, FileArchive, AlertTriangle,
  Loader2, ChevronRight, RotateCcw, ArrowLeft
} from 'lucide-react'

// ─── Config ───────────────────────────────────────────────────────────────────

const DEMO_USER = 'demo'
const DEMO_PASS = 'Rastera$!GeoAI'
const SESSION_KEY = 'geoconvert_demo_auth'
const API_URL = (import.meta.env.VITE_DEMO_API_URL || 'http://localhost:8000').replace(/\/$/, '')

const CRS_OPTIONS = [
  { value: 4326,  label: 'EPSG:4326 — WGS 84 (Geographic)' },
  { value: 3857,  label: 'EPSG:3857 — Web Mercator' },
  { value: 32614, label: 'EPSG:32614 — UTM Zone 14N' },
  { value: 32615, label: 'EPSG:32615 — UTM Zone 15N' },
  { value: 32616, label: 'EPSG:32616 — UTM Zone 16N' },
  { value: 32617, label: 'EPSG:32617 — UTM Zone 17N' },
  { value: 32618, label: 'EPSG:32618 — UTM Zone 18N' },
  { value: 26914, label: 'EPSG:26914 — UTM Zone 14N (NAD83)' },
  { value: 26915, label: 'EPSG:26915 — UTM Zone 15N (NAD83)' },
  { value: 26916, label: 'EPSG:26916 — UTM Zone 16N (NAD83)' },
  { value: 27700, label: 'EPSG:27700 — British National Grid' },
  { value: 25832, label: 'EPSG:25832 — ETRS89 UTM Zone 32N' },
  { value: 2163,  label: 'EPSG:2163 — US National Atlas Equal Area' },
]

const STEPS = [
  'Uploading file to processor',
  'Extracting layers from DWG',
  'Detecting coordinate system',
  'Cleaning layer names & structure',
  'Repairing geometries',
  'Reprojecting to target CRS',
  'Packaging geodatabase & report',
]

// ─── Shared input styles ──────────────────────────────────────────────────────

const inputCls = [
  'w-full rounded-xl px-4 py-3 text-sm',
  'bg-slate-800 border border-slate-700',
  'text-slate-100 placeholder-slate-500',
  'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30',
  'transition-colors duration-150',
].join(' ')

const labelCls = 'block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5'

// ─── Auth gate ────────────────────────────────────────────────────────────────

function AuthGate({ onAuth }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (username.trim() === DEMO_USER && password === DEMO_PASS) {
        sessionStorage.setItem(SESSION_KEY, '1')
        onAuth()
      } else {
        setError('Incorrect credentials. Try again.')
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div
      style={{ background: '#080c18' }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Globe size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">GeoConvert</span>
        </div>

        {/* Card */}
        <div
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          className="rounded-2xl p-8"
        >
          <h1 className="text-white font-bold text-xl mb-1">Demo access</h1>
          <p className="text-slate-400 text-sm mb-7">Enter your credentials to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            {/* Username */}
            <div>
              <label htmlFor="demo-username" className={labelCls}>Username</label>
              <input
                id="demo-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="demo"
                required
                className={inputCls}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="demo-password" className={labelCls}>Password</label>
              <div className="relative">
                <input
                  id="demo-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={inputCls + ' pr-11'}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/30
                border border-red-700/40 rounded-xl px-3 py-2.5">
                <AlertTriangle size={13} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-2
                bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                text-white font-semibold py-3 rounded-xl
                transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Signing in…</>
                : <><span>Enter demo</span><ChevronRight size={15} /></>
              }
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="inline-flex items-center gap-1.5 text-slate-500
            hover:text-slate-300 text-sm transition-colors">
            <ArrowLeft size={13} /> Back to site
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Process log ──────────────────────────────────────────────────────────────

function ProcessLog({ steps }) {
  return (
    <div className="space-y-2 font-mono text-xs">
      {steps.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`flex items-center gap-2.5 ${
            s.state === 'done'   ? 'text-emerald-400' :
            s.state === 'active' ? 'text-white'       :
            s.state === 'error'  ? 'text-red-400'     :
                                   'text-slate-600'
          }`}
        >
          {s.state === 'done'   && <CheckCircle2 size={12} className="flex-shrink-0" />}
          {s.state === 'active' && <Loader2 size={12} className="flex-shrink-0 animate-spin" />}
          {s.state === 'error'  && <XCircle size={12} className="flex-shrink-0" />}
          {s.state === 'idle'   && <span className="w-3 flex-shrink-0" />}
          {s.label}
        </motion.div>
      ))}
    </div>
  )
}

// ─── Demo tool ────────────────────────────────────────────────────────────────

function DemoTool({ onLogout }) {
  const [file, setFile]           = useState(null)
  const [dragging, setDragging]   = useState(false)
  const [targetEpsg, setTarget]   = useState(4326)
  const [sourceEpsg, setSource]   = useState('')
  const [status, setStatus]       = useState('idle')   // idle | processing | done | error
  const [steps, setSteps]         = useState([])
  const [errorMsg, setErrorMsg]   = useState('')
  const [downloadUrl, setDownload]= useState(null)
  const [downloadName, setDlName] = useState('output.zip')
  const fileRef = useRef(null)

  function pickFile(f) {
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['dwg', 'dxf'].includes(ext)) {
      setErrorMsg('Only .dwg and .dxf files are accepted.')
      return
    }
    setFile(f)
    setErrorMsg('')
    setStatus('idle')
    setDownload(null)
    setSteps([])
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    pickFile(e.dataTransfer.files[0])
  }

  const advanceSteps = useCallback(() => {
    const initial = STEPS.map(label => ({ label, state: 'idle' }))
    setSteps(initial)
    let idx = 0
    function tick() {
      if (idx >= STEPS.length) return
      setSteps(prev => {
        const next = [...prev]
        if (idx > 0) next[idx - 1] = { ...next[idx - 1], state: 'done' }
        next[idx] = { ...next[idx], state: 'active' }
        return next
      })
      idx++
      if (idx < STEPS.length) setTimeout(tick, 1200)
    }
    tick()
  }, [])

  async function process() {
    if (!file) return
    setStatus('processing')
    setErrorMsg('')
    setDownload(null)
    advanceSteps()

    const form = new FormData()
    form.append('file', file)
    form.append('target_epsg', targetEpsg)
    if (sourceEpsg) form.append('source_epsg', parseInt(sourceEpsg))

    try {
      const res = await fetch(`${API_URL}/process`, { method: 'POST', body: form })
      if (!res.ok) {
        let msg = `Server error ${res.status}`
        try { const j = await res.json(); msg = j.detail || msg } catch {}
        throw new Error(msg)
      }

      // Mark all done
      setSteps(prev => prev.map(s => ({ ...s, state: 'done' })))

      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const cd   = res.headers.get('Content-Disposition') || ''
      const m    = cd.match(/filename="?([^"]+)"?/)
      const name = m ? m[1] : file.name.replace(/\.[^.]+$/, '') + '_output.zip'

      setDownload(url)
      setDlName(name)
      setStatus('done')
    } catch (err) {
      setSteps(prev => prev.map(s => s.state === 'active' ? { ...s, state: 'error' } : s))
      setErrorMsg(err.message || 'Processing failed.')
      setStatus('error')
    }
  }

  function reset() {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    setFile(null); setStatus('idle'); setSteps([])
    setErrorMsg(''); setDownload(null); setDlName('output.zip')
  }

  return (
    <div style={{ background: '#080c18' }} className="min-h-screen flex flex-col">

      {/* Header */}
      <header
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.4)' }}
        className="sticky top-0 z-10 backdrop-blur-md"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Globe size={14} className="text-white" />
            </div>
            <span className="text-white font-semibold text-sm">GeoConvert</span>
            <span className="text-slate-600 mx-1 text-sm">·</span>
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Demo</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="hidden sm:flex items-center gap-1 text-slate-500
              hover:text-slate-300 text-xs transition-colors">
              <ArrowLeft size={11} /> Back to site
            </a>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-slate-500 hover:text-red-400 text-xs
                font-medium transition-colors px-2 py-1.5 rounded-lg hover:bg-red-900/20"
            >
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex items-start justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-2xl">

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              Convert your DWG file
            </h1>
            <p className="text-slate-400 text-sm">
              Upload a .dwg or .dxf — we clean it and return a File Geodatabase ZIP.
            </p>
          </div>

          <div
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
            className="rounded-2xl p-6 sm:p-8 space-y-6"
          >

            {/* Drop zone */}
            <div>
              <label className={labelCls}>CAD File</label>
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileRef.current?.click()}
                onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                style={{
                  border: `2px dashed ${dragging ? '#6366f1' : file ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.12)'}`,
                  background: dragging ? 'rgba(99,102,241,0.08)' : file ? 'rgba(52,211,153,0.04)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                }}
                className="rounded-xl px-6 py-8 text-center transition-all duration-150 outline-none
                  focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".dwg,.dxf"
                  className="sr-only"
                  onChange={e => pickFile(e.target.files[0])}
                />
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileArchive size={20} className="text-emerald-400 flex-shrink-0" />
                    <div className="text-left min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{file.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change
                      </p>
                    </div>
                    <CheckCircle2 size={18} className="text-emerald-400 ml-auto flex-shrink-0" />
                  </div>
                ) : (
                  <>
                    <Upload size={22} className="text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">
                      <span className="text-indigo-400 font-semibold">Click to browse</span> or drag & drop
                    </p>
                    <p className="text-slate-600 text-xs mt-1">.dwg · .dxf · up to 500 MB</p>
                  </>
                )}
              </div>
            </div>

            {/* CRS row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="target-crs" className={labelCls}>Target CRS</label>
                <select
                  id="target-crs"
                  value={targetEpsg}
                  onChange={e => setTarget(Number(e.target.value))}
                  className={inputCls}
                  style={{ appearance: 'none' }}
                >
                  {CRS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="source-crs" className={labelCls}>
                  Source CRS Override{' '}
                  <span className="text-slate-600 normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  id="source-crs"
                  type="number"
                  value={sourceEpsg}
                  onChange={e => setSource(e.target.value)}
                  placeholder="Auto-detect"
                  min={1024}
                  max={32767}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2.5 text-red-400 text-sm
                    bg-red-900/20 border border-red-700/40 rounded-xl px-4 py-3"
                >
                  <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Process log */}
            <AnimatePresence>
              {steps.length > 0 && (
                <motion.div
                  key="log"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
                  className="rounded-xl px-5 py-4 overflow-hidden"
                >
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                    Processing log
                  </p>
                  <ProcessLog steps={steps} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              {status !== 'done' ? (
                <button
                  onClick={process}
                  disabled={!file || status === 'processing'}
                  className="flex-1 flex items-center justify-center gap-2
                    bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed
                    text-white font-semibold py-3 rounded-xl
                    transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {status === 'processing'
                    ? <><Loader2 size={16} className="animate-spin" />Processing…</>
                    : <><Upload size={15} />Convert file</>
                  }
                </button>
              ) : (
                <>
                  <a
                    href={downloadUrl}
                    download={downloadName}
                    className="flex-1 flex items-center justify-center gap-2
                      bg-emerald-600 hover:bg-emerald-500 text-white font-semibold
                      py-3 rounded-xl transition-all duration-150
                      hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Download size={15} /> Download {downloadName}
                  </a>
                  <button
                    onClick={reset}
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                      text-slate-400 hover:text-white hover:border-white/20
                      transition-all duration-150 text-sm font-medium"
                  >
                    <RotateCcw size={13} /> New file
                  </button>
                </>
              )}
            </div>

          </div>

          <p className="text-center text-slate-600 text-xs mt-6">
            Files processed securely · Deleted within 24 hours · Powered by GDAL
          </p>
        </div>
      </main>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Demo() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  )

  function logout() {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
  }

  return authed
    ? <DemoTool onLogout={logout} />
    : <AuthGate onAuth={() => setAuthed(true)} />
}
