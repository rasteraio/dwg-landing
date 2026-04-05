import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, Upload, Download, CheckCircle2, XCircle,
  LogOut, Eye, EyeOff, FileArchive, AlertTriangle,
  Loader2, ChevronRight, RotateCcw, ArrowLeft
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const DEMO_USER = 'demo'
const DEMO_PASS = 'Rastera$!GeoAI'
const SESSION_KEY = 'geoconvert_demo_auth'

const API_URL = import.meta.env.VITE_DEMO_API_URL?.replace(/\/$/, '') || 'http://localhost:8000'

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

// ─── Auth gate ────────────────────────────────────────────────────────────────

function AuthGate({ onAuth }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (username === DEMO_USER && password === DEMO_PASS) {
        sessionStorage.setItem(SESSION_KEY, '1')
        onAuth()
      } else {
        setError('Invalid credentials. Contact your GeoConvert demo rep.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#080c18] dot-grid flex flex-col items-center justify-center px-4">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
            <Globe size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">GeoConvert</span>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-white font-bold text-xl mb-1">Demo access</h1>
          <p className="text-slate-400 text-sm mb-7">Enter your demo credentials to continue.</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3
                  text-white text-sm placeholder:text-slate-600 outline-none
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="demo"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 pr-11
                    text-white text-sm placeholder:text-slate-600 outline-none
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10
                  border border-red-400/20 rounded-xl px-3 py-2.5"
              >
                <AlertTriangle size={13} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500
                disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold
                py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200
                hover:-translate-y-0.5 active:translate-y-0 mt-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Enter demo'}
              {!loading && <ChevronRight size={15} />}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors
            inline-flex items-center gap-1.5">
            <ArrowLeft size={13} /> Back to site
          </a>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Processing log ───────────────────────────────────────────────────────────

const STEPS = [
  'Uploading file to processor',
  'Extracting layers from DWG',
  'Detecting coordinate system',
  'Cleaning layer names & structure',
  'Repairing geometries',
  'Reprojecting to target CRS',
  'Packaging geodatabase & report',
]

function ProcessLog({ steps }) {
  return (
    <div className="font-mono text-xs space-y-1.5 mt-4">
      {steps.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className={`flex items-center gap-2.5 ${
            s.state === 'done'    ? 'text-emerald-400' :
            s.state === 'active' ? 'text-white'       :
            s.state === 'error'  ? 'text-red-400'     :
                                   'text-slate-600'
          }`}
        >
          {s.state === 'done'   && <CheckCircle2 size={12} className="flex-shrink-0" />}
          {s.state === 'active' && <Loader2 size={12} className="flex-shrink-0 animate-spin" />}
          {s.state === 'error'  && <XCircle size={12} className="flex-shrink-0" />}
          {s.state === 'idle'   && <span className="w-3 h-3 flex-shrink-0" />}
          {s.label}
        </motion.div>
      ))}
    </div>
  )
}

// ─── Main demo tool ───────────────────────────────────────────────────────────

function DemoTool({ onLogout }) {
  const [file, setFile]           = useState(null)
  const [dragging, setDragging]   = useState(false)
  const [targetEpsg, setTarget]   = useState(4326)
  const [sourceEpsg, setSource]   = useState('')
  const [status, setStatus]       = useState('idle') // idle | processing | done | error
  const [steps, setSteps]         = useState([])
  const [errorMsg, setErrorMsg]   = useState('')
  const [downloadUrl, setDownload]= useState(null)
  const [downloadName, setDlName] = useState('output.zip')
  const fileRef = useRef(null)

  // Simulate step progression during the real API call
  const runSteps = useCallback(() => {
    const log = STEPS.map(label => ({ label, state: 'idle' }))
    setSteps([...log])

    let idx = 0
    const tick = () => {
      if (idx >= STEPS.length) return
      setSteps(prev => {
        const next = [...prev]
        if (idx > 0) next[idx - 1] = { ...next[idx - 1], state: 'done' }
        next[idx] = { ...next[idx], state: 'active' }
        return next
      })
      idx++
      if (idx < STEPS.length) setTimeout(tick, 1100)
    }
    tick()
    return () => {}
  }, [])

  const markAllDone = () =>
    setSteps(prev => prev.map(s => ({ ...s, state: 'done' })))

  const markError = () =>
    setSteps(prev => prev.map(s => s.state === 'active' ? { ...s, state: 'error' } : s))

  const onFile = (f) => {
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['dwg', 'dxf'].includes(ext)) {
      setErrorMsg('Only .dwg and .dxf files are supported.')
      return
    }
    setFile(f)
    setErrorMsg('')
    setStatus('idle')
    setDownload(null)
  }

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    onFile(e.dataTransfer.files[0])
  }

  const process = async () => {
    if (!file) return
    setStatus('processing')
    setErrorMsg('')
    setDownload(null)
    runSteps()

    const form = new FormData()
    form.append('file', file)
    form.append('target_epsg', targetEpsg)
    if (sourceEpsg) form.append('source_epsg', parseInt(sourceEpsg))

    try {
      const res = await fetch(`${API_URL}/process`, { method: 'POST', body: form })

      if (!res.ok) {
        let msg = `Error ${res.status}`
        try { const j = await res.json(); msg = j.detail || msg } catch {}
        throw new Error(msg)
      }

      markAllDone()

      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const cd   = res.headers.get('Content-Disposition') || ''
      const m    = cd.match(/filename="?([^"]+)"?/)
      const name = m ? m[1] : file.name.replace(/\.[^.]+$/, '') + '_output.zip'

      setDownload(url)
      setDlName(name)
      setStatus('done')
    } catch (err) {
      markError()
      setErrorMsg(err.message || 'Processing failed. Check server logs.')
      setStatus('error')
    }
  }

  const reset = () => {
    setFile(null); setStatus('idle'); setSteps([])
    setErrorMsg(''); setDownload(null); setDlName('output.zip')
    if (downloadUrl) URL.revokeObjectURL(downloadUrl)
  }

  return (
    <div className="min-h-screen bg-[#080c18] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/8 bg-black/30 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Globe size={14} className="text-white" />
            </div>
            <span className="text-white font-semibold text-sm">GeoConvert</span>
            <span className="text-white/20 text-sm mx-1">·</span>
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Demo</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-slate-500 hover:text-slate-300 text-xs transition-colors
              hidden sm:flex items-center gap-1">
              <ArrowLeft size={11} /> Back to site
            </a>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-slate-500 hover:text-red-400
                text-xs font-medium transition-colors px-2 py-1.5 rounded-lg hover:bg-red-400/10"
            >
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex items-start justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-2xl">

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              Convert your DWG file
            </h1>
            <p className="text-slate-400 text-sm">
              Upload a .dwg or .dxf file. We'll clean it and package a File Geodatabase for download.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6"
          >

            {/* Drop zone */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                CAD File
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`relative rounded-xl border-2 border-dashed px-6 py-8 text-center cursor-pointer
                  transition-all duration-200
                  ${dragging
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : file
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5'
                  }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".dwg,.dxf"
                  className="sr-only"
                  onChange={e => onFile(e.target.files[0])}
                />

                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileArchive size={20} className="text-emerald-400 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-white text-sm font-semibold">{file.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change
                      </p>
                    </div>
                    <CheckCircle2 size={18} className="text-emerald-400 ml-auto flex-shrink-0" />
                  </div>
                ) : (
                  <>
                    <Upload size={24} className="text-slate-500 mx-auto mb-3" />
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
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Target CRS
                </label>
                <select
                  value={targetEpsg}
                  onChange={e => setTarget(Number(e.target.value))}
                  className="w-full bg-white/8 border border-white/10 rounded-xl px-3 py-2.5
                    text-white text-sm outline-none focus:border-indigo-500
                    focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none
                    bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 fill=%22none%22%3E%3Cpath d=%22M1 1l5 5 5-5%22 stroke=%22%237a839e%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E')]
                    bg-no-repeat bg-[right_12px_center] pr-8"
                >
                  {CRS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value} className="bg-[#1a1d27]">{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Source CRS Override
                  <span className="ml-1.5 text-slate-600 normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  type="number"
                  value={sourceEpsg}
                  onChange={e => setSource(e.target.value)}
                  placeholder="Auto-detect"
                  min={1024} max={32767}
                  className="w-full bg-white/8 border border-white/10 rounded-xl px-3 py-2.5
                    text-white text-sm placeholder:text-slate-600 outline-none
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2.5 text-red-400 text-sm
                    bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3"
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
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-black/30 rounded-xl px-5 py-4 border border-white/5"
                >
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                    Processing log
                  </p>
                  <ProcessLog steps={steps} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {status !== 'done' ? (
                <button
                  onClick={process}
                  disabled={!file || status === 'processing'}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600
                    hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed
                    text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/30
                    transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {status === 'processing'
                    ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
                    : <><Upload size={16} /> Convert file</>
                  }
                </button>
              ) : (
                <>
                  <a
                    href={downloadUrl}
                    download={downloadName}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600
                      hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl
                      shadow-lg shadow-emerald-600/30 transition-all duration-200
                      hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Download size={16} /> Download {downloadName}
                  </a>
                  <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                      border border-white/10 text-slate-400 hover:text-white hover:border-white/20
                      hover:bg-white/5 transition-all duration-200 text-sm font-medium"
                  >
                    <RotateCcw size={14} /> New file
                  </button>
                </>
              )}
            </div>

          </motion.div>

          {/* Footer note */}
          <p className="text-center text-slate-600 text-xs mt-6">
            Files are processed securely and deleted within 24 hours · Powered by GDAL
          </p>
        </div>
      </main>
    </div>
  )
}

// ─── Root demo component ─────────────────────────────────────────────────────

export default function Demo() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  )

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
  }

  if (!authed) return <AuthGate onAuth={() => setAuthed(true)} />
  return <DemoTool onLogout={logout} />
}
