import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Upload, SlidersHorizontal, Download, CheckCircle2,
  AlertTriangle, Clock, Layers, MapPin, Shield, Zap,
  Users, ArrowRight, Star, Lock, Database, Globe,
  Building2, Wrench, TrendingUp, FileCheck, Menu, X,
  ChevronRight, TriangleAlert, GitBranch, Repeat2,
  ServerCrash, Timer, BadgeCheck, FileX2, Workflow,
  HardDrive, Cpu, BarChart3
} from 'lucide-react'

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
}

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerParent({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function PrimaryBtn({ children, className = '', ...props }) {
  return (
    <button
      className={`group inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700
        active:bg-brand-800 text-white font-semibold px-6 py-3 rounded-xl
        shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50
        transition-all duration-200 hover:-translate-y-0.5 ${className}`}
      {...props}
    >
      {children}
      <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
    </button>
  )
}

function GhostBtn({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center gap-2 text-slate-600 hover:text-slate-900
        font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-300
        bg-white hover:bg-slate-50 transition-all duration-200 hover:-translate-y-0.5 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700
      text-xs font-semibold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
      {children}
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Features',   href: '#solution'  },
    { label: 'Pricing',    href: '#pricing'    },
    { label: 'Use Cases',  href: '#use-cases'  },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300
        ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm' : 'bg-transparent'}`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center
            group-hover:bg-brand-700 transition-colors">
            <Globe size={16} className="text-white" />
          </div>
          <span className={`font-bold text-lg tracking-tight transition-colors
            ${scrolled ? 'text-slate-900' : 'text-white'}`}>
            GeoConvert
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${scrolled
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-white/80 hover:text-white hover:bg-white/10'}`}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#pricing"
            className={`text-sm font-semibold transition-colors
              ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}
          >
            Sign in
          </a>
          <a
            href="#pricing"
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700
              text-white text-sm font-semibold px-4 py-2 rounded-xl
              shadow-md shadow-brand-600/30 transition-all duration-200 hover:-translate-y-0.5"
          >
            Get started <ChevronRight size={14} />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 rounded-lg transition-colors
            ${scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700
                    hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href="#pricing"
                  onClick={() => setOpen(false)}
                  className="text-center py-2.5 rounded-xl text-sm font-semibold text-slate-600
                    border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Sign in
                </a>
                <a
                  href="#pricing"
                  onClick={() => setOpen(false)}
                  className="text-center py-2.5 rounded-xl text-sm font-semibold text-white
                    bg-brand-600 hover:bg-brand-700 transition-colors"
                >
                  Get started free
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center
      bg-[#080c18] overflow-hidden pt-16">

      {/* Background grid */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[800px] h-[500px] bg-brand-600/20 rounded-full blur-[120px]" />
      </div>

      {/* Top badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 inline-flex items-center gap-2 bg-white/5 border border-white/10
          text-white/70 text-xs font-semibold px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Built for GIS teams, surveyors & AEC engineers
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-4xl mx-auto px-4 text-center
          text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight
          text-white leading-[1.08]"
      >
        Stop losing hours to{' '}
        <span className="bg-gradient-to-r from-brand-400 to-indigo-300 bg-clip-text text-transparent">
          broken CAD files.
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="relative z-10 mt-6 max-w-2xl mx-auto px-4 text-center
          text-lg sm:text-xl text-slate-400 leading-relaxed"
      >
        Upload any DWG or DXF file. Get a clean, CRS-correct File Geodatabase
        in under 60 seconds — with repaired geometries, standardized layers,
        and a full processing report.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-10 mt-10 flex flex-col sm:flex-row gap-4 justify-center px-4"
      >
        <a href="#pricing">
          <PrimaryBtn className="text-base px-8 py-4 rounded-2xl shadow-2xl shadow-brand-600/40">
            Try it free
          </PrimaryBtn>
        </a>
        <a href="#solution">
          <GhostBtn className="text-base px-8 py-4 rounded-2xl bg-white/5 border-white/10
            text-white/80 hover:bg-white/10 hover:text-white hover:border-white/20">
            See how it works <ChevronRight size={16} />
          </GhostBtn>
        </a>
      </motion.div>

      {/* Trust line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 mt-5 text-sm text-slate-500"
      >
        No credit card required · Files deleted within 24 hours · Free first conversion
      </motion.p>

      {/* Hero mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-16 w-full max-w-4xl mx-auto px-4"
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm
          shadow-2xl shadow-black/60 overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            <span className="ml-3 text-xs text-white/30 font-mono">geoconvert.io/process</span>
          </div>

          {/* Terminal-style processing log */}
          <div className="p-6 font-mono text-xs sm:text-sm space-y-2 text-left">
            <div className="flex items-center gap-3">
              <span className="text-slate-500">$</span>
              <span className="text-white/70">Processing</span>
              <span className="text-brand-400 font-semibold">site_survey_final_v3.dwg</span>
            </div>
            <div className="ml-4 space-y-1.5 pt-1">
              {[
                { icon: '✓', color: 'text-emerald-400', label: 'Extracted 8 layers from DWG' },
                { icon: '✓', color: 'text-emerald-400', label: 'CRS detected — EPSG:4326 (WGS 84)' },
                { icon: '✓', color: 'text-emerald-400', label: 'Removed 2 empty layers (DEFPOINTS, 0)' },
                { icon: '✓', color: 'text-emerald-400', label: 'Standardized 6 layer names' },
                { icon: '✓', color: 'text-emerald-400', label: 'Repaired 14 invalid geometries' },
                { icon: '✓', color: 'text-emerald-400', label: 'Reprojected to EPSG:32614 (UTM 14N)' },
                { icon: '✓', color: 'text-emerald-400', label: 'Written to site_survey_final_v3.gdb' },
              ].map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.12 }}
                  className="flex items-center gap-2.5 text-slate-400"
                >
                  <span className={`${line.color} font-bold`}>{line.icon}</span>
                  {line.label}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.75 }}
                className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10"
              >
                <span className="text-emerald-400 font-bold">Done</span>
                <span className="text-white/50">in</span>
                <span className="text-white font-semibold">3.2s</span>
                <span className="ml-auto text-brand-400 font-semibold underline cursor-pointer">
                  Download output.zip ↓
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}

// ─── Problem ──────────────────────────────────────────────────────────────────

const problems = [
  {
    icon: MapPin,
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-100',
    title: 'Missing or wrong CRS',
    body: "Half the time there's no coordinate system at all. The other half it's wrong. Either way, your GIS tool puts features in the ocean.",
  },
  {
    icon: Layers,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    title: 'Useless layer names',
    body: 'Layers named "0", "DEFPOINTS", and "MISC" tell you nothing. They break your schema and make the data impossible to use downstream.',
  },
  {
    icon: GitBranch,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    title: 'Invalid geometries everywhere',
    body: 'Self-intersections, slivers, and duplicate vertices. They crash analysis tools silently — or worse, produce results that look correct.',
  },
  {
    icon: Timer,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    title: '1–3 hours of cleanup, every file',
    body: "Before you can run a single query, you're already in QGIS fixing what the CAD team handed you. And it happens with every new file.",
  },
]

function Problem() {
  return (
    <section id="problem" className="py-24 sm:py-32 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-16">
          <SectionLabel>The problem</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mt-2">
            If you work with CAD data,<br className="hidden sm:block" /> you already know this pain.
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Getting DWG files from CAD teams is just the start. The real work — the cleaning, fixing,
            and reformatting — hasn't even begun.
          </p>
        </FadeIn>

        <StaggerParent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map(({ icon: Icon, color, bg, border, title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className={`rounded-2xl border ${border} ${bg} p-6 hover:-translate-y-1
                hover:shadow-lg transition-all duration-200`}
            >
              <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center
                justify-center mb-4 border ${border}`}>
                <Icon size={18} className={color} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </StaggerParent>

        {/* Divider callout */}
        <FadeIn delay={0.2} className="mt-16 text-center">
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            This isn't a niche problem. It's the default state of every DWG file that's ever been
            handed from a CAD engineer to a GIS analyst.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Solution ─────────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload your DWG',
    body: 'Drag and drop any DWG or DXF file — from AutoCAD, Civil 3D, MicroStation, wherever it came from. No plugins, no installation.',
    detail: 'Accepts .dwg and .dxf · Up to 500 MB · Processed in seconds',
  },
  {
    num: '02',
    icon: SlidersHorizontal,
    title: 'Set your target CRS',
    body: 'Choose from 10,000+ EPSG codes or let GeoConvert auto-detect the source projection. Override if needed. You stay in control.',
    detail: 'Auto-detect · 10,000+ EPSG codes · Custom overrides',
  },
  {
    num: '03',
    icon: Download,
    title: 'Download your clean GDB',
    body: 'Get a fully validated File Geodatabase with repaired geometries, standardized layer names, and a JSON processing report included.',
    detail: 'File Geodatabase (.gdb) · Processing report · ZIP archive',
  },
]

function Solution() {
  return (
    <section id="solution" className="py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-16">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mt-2">
            Three steps. Under 60 seconds.
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            No configuration files, no command line, no GIS expertise required to run it.
          </p>
        </FadeIn>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[calc(16.66%-1px)] right-[calc(16.66%-1px)]
            h-px bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />

          <StaggerParent className="grid lg:grid-cols-3 gap-8 lg:gap-6 relative">
            {steps.map(({ num, icon: Icon, title, body, detail }) => (
              <motion.div key={num} variants={fadeUp} className="relative flex flex-col">
                <div className="flex items-start gap-4 lg:flex-col lg:items-center lg:text-center">
                  {/* Icon circle */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-brand-600 flex items-center
                    justify-center shadow-lg shadow-brand-600/30 relative z-10">
                    <Icon size={22} className="text-white" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-900
                      text-white text-[10px] font-bold flex items-center justify-center">
                      {num.slice(1)}
                    </span>
                  </div>

                  <div className="lg:mt-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-3">{body}</p>
                    <p className="text-xs text-brand-600 font-medium">{detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerParent>
        </div>

        <FadeIn delay={0.3} className="mt-16 flex justify-center">
          <a href="#pricing">
            <PrimaryBtn className="text-base px-8 py-4 rounded-2xl">
              Try it free now
            </PrimaryBtn>
          </a>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Benefits ─────────────────────────────────────────────────────────────────

const benefits = [
  {
    icon: Clock,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    stat: '1–3 hrs',
    label: 'saved per file',
    body: "That's not an estimate — it's what GIS analysts actually spend on cleanup before GeoConvert.",
  },
  {
    icon: BadgeCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    stat: 'Zero',
    label: 'geometry errors',
    body: 'Every geometry is validated and repaired automatically. No more silent failures in your analysis pipeline.',
  },
  {
    icon: FileCheck,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    stat: '100%',
    label: 'consistent naming',
    body: 'Layer names are standardized to lowercase, underscore-separated conventions on every run.',
  },
  {
    icon: BarChart3,
    color: 'text-brand-600',
    bg: 'bg-brand-50',
    stat: 'Full',
    label: 'audit trail',
    body: 'Every conversion comes with a JSON report — what was cleaned, what was removed, and why.',
  },
]

function Benefits() {
  return (
    <section id="benefits" className="py-24 sm:py-32 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-16">
          <SectionLabel>Why it matters</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mt-2">
            Real time savings.<br className="hidden sm:block" /> Real fewer errors.
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Every hour spent on CAD cleanup is an hour not spent on actual analysis. GeoConvert
            gives that time back.
          </p>
        </FadeIn>

        <StaggerParent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map(({ icon: Icon, color, bg, stat, label, body }) => (
            <motion.div
              key={stat}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-slate-200 p-6
                hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80
                transition-all duration-200 group"
            >
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-5`}>
                <Icon size={20} className={color} />
              </div>
              <div className={`text-3xl font-extrabold ${color} mb-0.5`}>{stat}</div>
              <div className="text-sm font-semibold text-slate-700 mb-3">{label}</div>
              <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </StaggerParent>
      </div>
    </section>
  )
}

// ─── Use Cases ────────────────────────────────────────────────────────────────

const cases = [
  {
    icon: Database,
    title: 'GIS Teams',
    subtitle: 'At utilities, municipalities & agencies',
    body: "You receive DWG files constantly — from contractors, surveyors, CAD teams. GeoConvert turns them into GIS-ready data without you touching QGIS before you've had your coffee.",
    tags: ['Utility mapping', 'Asset management', 'Feature import'],
  },
  {
    icon: Wrench,
    title: 'CAD Technicians',
    subtitle: 'At engineering firms & EPC contractors',
    body: "Deliver GIS-compatible outputs straight from your DWG exports. No back-and-forth, no complaints from the GIS team about broken projections.",
    tags: ['DWG delivery', 'Multi-format export', 'QC automation'],
  },
  {
    icon: Globe,
    title: 'Survey Companies',
    subtitle: 'Field and office teams',
    body: "Your client needs a geodatabase, not a DWG. GeoConvert bridges the gap automatically so you can hand off clean data every single time.",
    tags: ['Client deliverables', 'Topographic data', 'CRS standardization'],
  },
  {
    icon: Building2,
    title: 'Infrastructure Projects',
    subtitle: 'Roads, pipelines, utilities',
    body: "Large infrastructure projects generate thousands of DWG files. GeoConvert lets your whole team process them consistently without a GIS expert in the loop.",
    tags: ['Pipeline GIS', 'Road networks', 'Multi-file batches'],
  },
]

function UseCases() {
  return (
    <section id="use-cases" className="py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-16">
          <SectionLabel>Use cases</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mt-2">
            Built for the people who live in CAD and GIS.
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Whether you're receiving files, delivering them, or somewhere in between.
          </p>
        </FadeIn>

        <StaggerParent className="grid sm:grid-cols-2 gap-5">
          {cases.map(({ icon: Icon, title, subtitle, body, tags }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group rounded-2xl border border-slate-200 bg-white p-7
                hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80
                hover:border-brand-200 transition-all duration-200"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100
                  flex items-center justify-center flex-shrink-0
                  group-hover:bg-brand-100 transition-colors">
                  <Icon size={20} className="text-brand-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{body}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="text-xs bg-slate-100 text-slate-600
                    font-medium px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </StaggerParent>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

const plans = [
  {
    name: 'Starter',
    price: '$19',
    period: 'per file',
    description: 'Pay only when you need it. No commitment.',
    cta: 'Buy a conversion',
    popular: false,
    features: [
      'Single DWG / DXF conversion',
      'File Geodatabase output',
      'JSON processing report',
      'Auto CRS detection',
      'Geometry repair',
      'Email delivery',
    ],
  },
  {
    name: 'Pro',
    price: '$49',
    period: 'per month',
    description: 'For professionals who process files regularly.',
    cta: 'Start free trial',
    popular: true,
    features: [
      '20 conversions / month',
      'Everything in Starter',
      'Priority processing',
      'Batch queue',
      'Custom layer naming rules',
      'API access',
    ],
  },
  {
    name: 'Team',
    price: '$99',
    period: 'per month',
    description: 'For teams with high-volume or project-based workflows.',
    cta: 'Get started',
    popular: false,
    features: [
      'Unlimited conversions',
      'Everything in Pro',
      'Up to 10 team seats',
      'Shared history & reports',
      'SSO / SAML (coming soon)',
      'Priority support',
    ],
  },
]

function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-16">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mt-2">
            Simple, honest pricing.
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Start free. Scale as you need. No hidden fees, no seat-count surprises.
          </p>
        </FadeIn>

        <StaggerParent className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map(({ name, price, period, description, cta, popular, features }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              className={`relative rounded-2xl flex flex-col transition-all duration-200
                ${popular
                  ? 'bg-brand-600 text-white shadow-2xl shadow-brand-600/40 scale-105 md:scale-105 z-10'
                  : 'bg-white border border-slate-200 hover:shadow-xl hover:shadow-slate-200/80 hover:-translate-y-1'
                }`}
            >
              {popular && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white
                    text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-orange-400/30">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8 flex-1">
                <div className={`text-sm font-semibold mb-1 ${popular ? 'text-brand-200' : 'text-slate-500'}`}>
                  {name}
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`text-5xl font-extrabold tracking-tight
                    ${popular ? 'text-white' : 'text-slate-900'}`}>
                    {price}
                  </span>
                  <span className={`text-sm mb-2 ${popular ? 'text-brand-200' : 'text-slate-400'}`}>
                    /{period}
                  </span>
                </div>
                <p className={`text-sm mb-8 ${popular ? 'text-brand-200' : 'text-slate-500'}`}>
                  {description}
                </p>

                <ul className="space-y-3 mb-8">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <CheckCircle2
                        size={16}
                        className={`mt-0.5 flex-shrink-0 ${popular ? 'text-brand-300' : 'text-emerald-500'}`}
                      />
                      <span className={popular ? 'text-brand-100' : 'text-slate-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-8 pb-8">
                <button
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
                    hover:-translate-y-0.5 active:translate-y-0
                    ${popular
                      ? 'bg-white text-brand-700 hover:bg-brand-50 shadow-lg shadow-black/10'
                      : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/30'
                    }`}
                >
                  {cta}
                </button>
              </div>
            </motion.div>
          ))}
        </StaggerParent>

        <FadeIn delay={0.3} className="mt-12 text-center text-sm text-slate-400">
          All plans include: secure HTTPS upload · automatic file deletion · JSON report · GDAL-powered processing
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    quote: "We process 30–40 DWG files a week from field survey teams. Before GeoConvert, each one took 1–2 hours of cleanup in QGIS. Now the whole batch is done before my first meeting.",
    name: 'Sarah M.',
    role: 'GIS Lead',
    company: 'Regional Utility Company',
    avatar: 'SM',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    quote: "The automatic CRS detection caught a coordinate system mismatch that would have put 6 km of pipeline in the wrong county. That one catch alone paid for a year of the Pro plan.",
    name: 'James K.',
    role: 'CAD & GIS Manager',
    company: 'EPC Engineering Firm',
    avatar: 'JK',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    quote: "Finally a tool actually built for people who deal with CAD and GIS daily. Not a generic ETL platform with a GIS plugin bolted on. It just does the thing you need it to do.",
    name: 'Priya T.',
    role: 'Geospatial Engineer',
    company: 'Infrastructure Consultancy',
    avatar: 'PT',
    color: 'bg-emerald-100 text-emerald-700',
  },
]

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-16">
          <SectionLabel>What people say</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mt-2">
            From people who actually use it.
          </h2>
        </FadeIn>

        <StaggerParent className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, role, company, avatar, color }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-slate-200 p-7
                hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80 transition-all duration-200"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              <blockquote className="text-slate-700 text-sm leading-relaxed mb-6">
                "{quote}"
              </blockquote>

              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center
                  text-xs font-bold flex-shrink-0`}>
                  {avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{name}</div>
                  <div className="text-xs text-slate-400">{role} · {company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerParent>
      </div>
    </section>
  )
}

// ─── Trust ────────────────────────────────────────────────────────────────────

const trustItems = [
  {
    icon: Lock,
    title: 'Encrypted in transit',
    body: 'All uploads and downloads use TLS 1.3. Your data never travels over plain HTTP.',
  },
  {
    icon: HardDrive,
    title: 'Deleted within 24 hours',
    body: "Files are processed and purged from our servers automatically. We don't store your data.",
  },
  {
    icon: Cpu,
    title: 'Powered by GDAL',
    body: 'The same library used by QGIS, PostGIS, and every serious GIS platform on the planet.',
  },
  {
    icon: Shield,
    title: 'No account to try',
    body: 'Your first conversion is free with just an email. No credit card, no onboarding call.',
  },
]

function Trust() {
  return (
    <section id="trust" className="py-24 sm:py-32 bg-[#080c18] relative overflow-hidden">
      <div className="absolute inset-0 dot-grid pointer-events-none opacity-60" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-16">
          <SectionLabel>
            <Shield size={12} />
            Security & trust
          </SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-2">
            Your data is yours.
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
            We built GeoConvert for professionals who handle sensitive project data.
            Security isn't an afterthought.
          </p>
        </FadeIn>

        <StaggerParent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trustItems.map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6
                hover:-translate-y-1 hover:bg-white/8 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <Icon size={18} className="text-brand-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </StaggerParent>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
            bg-brand-50 border border-brand-100 mb-8">
            <Zap size={28} className="text-brand-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Clean GIS data starts<br className="hidden sm:block" /> with one upload.
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">
            Upload your first DWG free. No credit card, no installation, no GIS cleanup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing">
              <PrimaryBtn className="text-base px-10 py-4 rounded-2xl shadow-2xl shadow-brand-600/30">
                Upload your first DWG free
              </PrimaryBtn>
            </a>
            <a href="#pricing">
              <GhostBtn className="text-base px-10 py-4 rounded-2xl">
                View pricing
              </GhostBtn>
            </a>
          </div>
          <p className="mt-5 text-sm text-slate-400">
            Free first file · No account required · Results in under 60 seconds
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const cols = [
    {
      heading: 'Product',
      links: ['Features', 'Pricing', 'API Docs', 'Changelog'],
    },
    {
      heading: 'Use Cases',
      links: ['GIS Teams', 'Survey Companies', 'EPC Contractors', 'Infrastructure'],
    },
    {
      heading: 'Company',
      links: ['About', 'Contact', 'Privacy Policy', 'Terms of Service'],
    },
  ]

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Globe size={15} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">GeoConvert</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              DWG to geodatabase conversion for GIS professionals. Built on GDAL.
            </p>
          </div>

          {cols.map(col => (
            <div key={col.heading}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row
          items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} GeoConvert. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="font-sans">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Benefits />
        <UseCases />
        <Pricing />
        <Testimonials />
        <Trust />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
