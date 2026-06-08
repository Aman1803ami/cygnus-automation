import { useState } from 'react'
import ChatWidget from './ChatWidget'
import { supabase } from './supabaseClient'
import {
  ArrowUpRight, Bot, BrainCircuit, Cpu, Network, Sparkles, X,
  Workflow, Zap, BarChart3, Shield, MessageSquare, ChevronRight,
  Mail, Phone, MapPin, Send, Check, Star, ArrowDown,
} from 'lucide-react'


/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */

const NAV_LINKS = ['Services', 'How It Works', 'Results', 'Contact']

// - [x] Modify contact form in src/App.tsx to insert leads into Supabase
// - [/] Run local build validation (npm run build)

const SERVICES = [
  { icon: <Bot className="w-6 h-6" />,         color: '#22d3ee', bg: 'rgba(6,182,212,0.12)',    border: 'rgba(6,182,212,0.3)',   title: 'AI Agent Development',    desc: 'Custom autonomous AI agents that handle complex multi-step tasks, make decisions, and adapt to your business logic without human intervention.', features: ['Multi-agent orchestration','Tool-use & function calling','Memory & context retention'] },
  { icon: <Workflow className="w-6 h-6" />,     color: '#818cf8', bg: 'rgba(99,102,241,0.12)',   border: 'rgba(99,102,241,0.3)',  title: 'Workflow Automation',     desc: 'End-to-end intelligent pipelines that connect your existing tools, eliminate repetitive tasks, and scale operations without hiring.', features: ['No-code + custom integrations','Cross-platform orchestration','Real-time monitoring'] },
  { icon: <BrainCircuit className="w-6 h-6" />, color: '#a78bfa', bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.3)', title: 'LLM Integration',         desc: 'Embed state-of-the-art language models into your products — from internal knowledge bases to customer-facing AI assistants.', features: ['RAG pipelines & vector search','Fine-tuning & prompt engineering','GPT-4 / Claude / Gemini'] },
  { icon: <BarChart3 className="w-6 h-6" />,    color: '#34d399', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)', title: 'Data & Analytics AI',    desc: 'Transform raw business data into actionable intelligence using AI-driven analytics, forecasting, and automated reporting systems.', features: ['Predictive analytics','Automated dashboards','Anomaly detection'] },
  { icon: <Zap className="w-6 h-6" />,          color: '#fbbf24', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)', title: 'Process Optimization',   desc: 'We map, analyze, and re-engineer your business processes using AI to identify bottlenecks and eliminate operational waste.', features: ['Process mining & discovery','ROI measurement','Continuous improvement loops'] },
  { icon: <Shield className="w-6 h-6" />,       color: '#f472b6', bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.3)',title: 'AI Strategy & Consulting',desc: 'From roadmap to deployment — our experts guide your organization through every stage of the AI adoption journey.', features: ['AI readiness assessment','Tech stack selection','Team training & handover'] },
]

const STEPS = [
  { n: '01', title: 'Discovery & Audit',       desc: 'We deep-dive into your workflows, tools, and pain points to identify the highest-impact automation opportunities.' },
  { n: '02', title: 'Architecture & Design',   desc: 'Our team designs a tailored AI architecture — agents, pipelines, models — optimized for your specific business context.' },
  { n: '03', title: 'Build & Integrate',       desc: 'We build, test, and integrate the solution into your existing stack with zero disruption to ongoing operations.' },
  { n: '04', title: 'Launch & Scale',          desc: 'Go live with confidence. We monitor performance, iterate rapidly, and scale the system as your business grows.' },
]

const RESULTS = [
  { n: '100+', l: 'AI Workflows Deployed',     s: 'across industries',        c: '#22d3ee' },
  { n: '40%',  l: 'Average Cost Reduction',    s: 'in automated processes',   c: '#818cf8' },
  { n: '10×',  l: 'Faster Task Completion',    s: 'vs manual operations',     c: '#34d399' },
  { n: '24/7', l: 'Autonomous Operations',     s: 'zero downtime guaranteed', c: '#fbbf24' },
]

const TESTIMONIALS = [
  { quote: 'Cygnus automated our entire lead qualification pipeline. We went from 3 days to 20 minutes per lead. The ROI was visible in week one.', name: 'Sarah Chen',   role: 'COO, NexaScale',    stars: 5, color: '#22d3ee' },
  { quote: 'Their AI agent system replaced 6 hours of daily manual reporting. Our team now focuses on strategy instead of spreadsheets.',           name: 'Marcus Obi',   role: 'Head of Ops, Fintrek', stars: 5, color: '#818cf8' },
  { quote: 'Exceptional technical depth. They built us a custom LLM assistant that knows our product inside out. Customer satisfaction up 32%.',    name: 'Priya Sharma', role: 'CTO, Vaultly',        stars: 5, color: '#34d399' },
]

const BEBAS = '"Bebas Neue", Impact, sans-serif'
const INTER = 'Inter, system-ui, sans-serif'

const label = (color = '#22d3ee') => ({
  fontFamily: INTER, fontSize: '0.62rem',
  letterSpacing: '0.28em', textTransform: 'uppercase' as const, color,
})

/* ═══════════════════════════════════════════════════════
   REUSABLE BITS
═══════════════════════════════════════════════════════ */

function SectionTag({ text, color = '#22d3ee' }: { text: string; color?: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: `${color}18`, border: `1px solid ${color}35`, borderRadius: 999, marginBottom: 20 }}>
      <Sparkles style={{ width: 12, height: 12, color }} />
      <span style={label(color)}>{text}</span>
    </div>
  )
}

function Heading({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{ fontFamily: BEBAS, fontSize: 'clamp(2.6rem,5.5vw,5.5rem)', lineHeight: 0.88, letterSpacing: '0.025em', textTransform: 'uppercase', color: '#fff', margin: 0, ...style }}>
      {children}
    </h2>
  )
}

/* ═══════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════ */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm]         = useState({ name: '', email: '', company: '', message: '' })
  const [sent, setSent]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await supabase
        .from('leads')
        .insert([
          {
            name: form.name,
            email: form.email,
            company: form.company,
            message: form.message
          }
        ])
      if (err) throw err
      setSent(true)
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const wrap = { maxWidth: 1280, margin: '0 auto', padding: '0 64px' }

  return (
    <div style={{ color: '#fff', overflowX: 'hidden', fontFamily: INTER, position: 'relative' }}>

      {/* ════ FIXED VIDEO BACKGROUND — persists across entire page ════ */}
      <video autoPlay muted loop playsInline
        style={{ position:'fixed', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }}>
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4" type="video/mp4" />
      </video>
      {/* Fixed dark base overlay */}
      <div style={{ position:'fixed', inset:0, background:'rgba(3,4,10,0.72)', zIndex:1 }} />
      {/* Fixed animated cyan glow */}
      <div className="animate-glow-pulse" style={{ position:'fixed', inset:0, zIndex:2, pointerEvents:'none', background:'radial-gradient(ellipse 70% 55% at 55% 60%, rgba(6,182,212,0.13) 0%, rgba(99,102,241,0.07) 45%, transparent 70%)' }} />
      {/* Fixed animated grid */}
      <div style={{ position:'fixed', inset:0, zIndex:2, overflow:'hidden', pointerEvents:'none' }}>
        <div className="animate-grid-scroll" style={{ width:'100%', height:'200%', backgroundImage:'linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)', backgroundSize:'64px 64px' }} />
      </div>

      {/* ── AI Chat Widget ── */}
      <ChatWidget />

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section id="hero" style={{ position:'relative', minHeight:'100vh', zIndex:3 }}>

        {/* Navbar */}
        <nav style={{ position:'absolute', top:0, left:0, right:0, zIndex:40, display:'flex', justifyContent:'space-between', alignItems:'center' }} className="px-6 sm:px-10 lg:px-16 py-5 lg:py-7">
          <div style={{ lineHeight:1 }}>
            <div style={{ fontFamily:BEBAS, letterSpacing:'0.15em', fontSize:'1.9rem', color:'#fff', textTransform:'uppercase' }}>CYGNUS</div>
            <div style={{ fontFamily:INTER, letterSpacing:'0.42em', fontSize:'0.58rem', color:'#67e8f9', textTransform:'uppercase', marginTop:2 }}>AUTOMATION</div>
          </div>
          <ul className="hidden md:flex items-center gap-10" style={{ listStyle:'none', margin:0, padding:0 }}>
            {NAV_LINKS.map(l => (
              <li key={l}><a href={`#${l.toLowerCase().replace(/\s+/g,'-')}`}
                style={{ fontFamily:INTER, fontSize:'0.76rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.6)', textDecoration:'none', transition:'color .3s' }}
                className="hover:text-white transition-colors">{l}</a></li>
            ))}
          </ul>
          <a href="#contact" className="hidden md:flex items-center gap-2 transition-all duration-300 hover:bg-white/10"
            style={{ fontFamily:INTER, fontWeight:600, fontSize:'0.7rem', letterSpacing:'0.13em', textTransform:'uppercase', color:'#fff', textDecoration:'none', border:'1px solid rgba(255,255,255,0.2)', borderRadius:999, padding:'11px 22px' }}>
            BUILD WITH AI <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button onClick={() => setMenuOpen(true)} className="flex md:hidden flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-0" aria-label="Open menu">
            <span style={{ display:'block', width:24, height:2, background:'#fff', borderRadius:9 }} />
            <span style={{ display:'block', width:24, height:2, background:'#fff', borderRadius:9 }} />
            <span style={{ display:'block', width:16, height:2, background:'#fff', borderRadius:9 }} />
          </button>
        </nav>

        {/* Mobile menu */}
        <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(3,4,10,0.98)', backdropFilter:'blur(24px)', display:'flex', flexDirection:'column', opacity:menuOpen?1:0, visibility:menuOpen?'visible':'hidden', transition:'opacity .5s,visibility .5s' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'24px' }}>
            <div>
              <div style={{ fontFamily:BEBAS, letterSpacing:'0.15em', fontSize:'1.6rem', color:'#fff' }}>CYGNUS</div>
              <div style={{ fontFamily:INTER, letterSpacing:'0.4em', fontSize:'0.55rem', color:'#67e8f9', textTransform:'uppercase', marginTop:2 }}>AUTOMATION</div>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-white/60 hover:text-white bg-transparent border-0 cursor-pointer p-1"><X className="w-7 h-7" /></button>
          </div>
          <div style={{ height:1, background:'rgba(255,255,255,0.07)', margin:'0 24px' }} />
          <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 24px', gap:16 }}>
            {NAV_LINKS.map((l,i) => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,'-')}`} onClick={() => setMenuOpen(false)}
                style={{ fontFamily:BEBAS, fontSize:'clamp(2.5rem,8vw,4rem)', letterSpacing:'0.1em', textTransform:'uppercase', color:'#fff', textDecoration:'none', display:'block', opacity:menuOpen?1:0, transform:menuOpen?'translateY(0)':'translateY(20px)', transition:`opacity .4s ease ${i*80+80}ms,transform .4s ease ${i*80+80}ms` }}
                className="hover:text-cyan-300 transition-colors">{l}</a>
            ))}
          </div>
          <div style={{ padding:'0 24px 48px' }}>
            <a href="#contact" onClick={() => setMenuOpen(false)}
              style={{ display:'inline-flex', alignItems:'center', gap:8, fontFamily:INTER, fontWeight:600, fontSize:'0.75rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#fff', textDecoration:'none', border:'1px solid rgba(34,211,238,0.4)', borderRadius:999, padding:'14px 28px', opacity:menuOpen?1:0, transform:menuOpen?'translateY(0)':'translateY(20px)', transition:`opacity .4s ease ${NAV_LINKS.length*80+160}ms,transform .4s ease ${NAV_LINKS.length*80+160}ms` }}>
              BUILD WITH AI <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Hero content */}
        <div style={{ position:'relative', zIndex:10, minHeight:'100vh', display:'flex', alignItems:'center' }}>
          <div style={{ ...wrap, width:'100%', paddingTop:128, paddingBottom:80 }} className="px-6 sm:px-10 lg:px-16">
            <div style={{ maxWidth:780 }}>

              <div className="animate-fade-up" style={{ marginBottom:32 }}>
                <SectionTag text="NEXT GENERATION AI AUTOMATION" />
              </div>

              <h1 className="animate-fade-up delay-1" style={{ fontFamily:BEBAS, fontSize:'clamp(3.5rem,10vw,10rem)', lineHeight:0.85, letterSpacing:'0.02em', textTransform:'uppercase', color:'#fff', margin:0 }}>
                AUTOMATE.<br />
                <span style={{ backgroundImage:'linear-gradient(100deg,#fff 10%,#a5f3fc 45%,#22d3ee 75%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>INTELLIGENCE.</span><br />
                EVERYWHERE.
              </h1>

              <p className="animate-fade-up delay-2" style={{ fontFamily:INTER, fontSize:'clamp(0.9rem,1.6vw,1.05rem)', color:'rgba(255,255,255,0.6)', lineHeight:1.8, maxWidth:520, marginTop:32, marginBottom:0 }}>
                We engineer AI agents, automation pipelines, and intelligent workflows that let companies operate faster, leaner, and smarter than ever before.
              </p>

              <div className="animate-fade-up delay-3" style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:16, marginTop:40 }}>
                <a href="#contact" className="group flex items-center gap-2 transition-all duration-300 hover:shadow-2xl"
                  style={{ fontFamily:INTER, fontWeight:700, fontSize:'0.78rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#000', textDecoration:'none', background:'#fff', borderRadius:999, padding:'16px 32px', boxShadow:'0 0 40px rgba(255,255,255,0.2)' }}>
                  DEPLOY AI SYSTEMS <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a href="#how-it-works" className="flex items-center gap-2 hover:bg-white/10 transition-all duration-300"
                  style={{ fontFamily:INTER, fontWeight:500, fontSize:'0.78rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'#fff', textDecoration:'none', border:'1px solid rgba(255,255,255,0.18)', borderRadius:999, padding:'16px 32px' }}>
                  How It Works <ArrowDown className="w-3.5 h-3.5" />
                </a>
                <div className="hidden sm:flex items-center gap-3 ml-1">
                  <BrainCircuit className="w-5 h-5 flex-shrink-0" style={{ color:'#22d3ee' }} />
                  <div>
                    <p style={{ fontFamily:INTER, fontWeight:600, fontSize:'0.62rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#fff', margin:0 }}>Enterprise Grade</p>
                    <p style={{ fontFamily:INTER, fontSize:'0.58rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', margin:'3px 0 0' }}>AI Infrastructure</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="animate-fade-up delay-4" style={{ display:'flex', flexWrap:'wrap', gap:'24px 48px', marginTop:56, paddingTop:40, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
                {RESULTS.map(r => (
                  <div key={r.l}>
                    <div style={{ fontFamily:INTER, fontWeight:800, fontSize:'clamp(1.6rem,3.5vw,2.8rem)', color:r.c, lineHeight:1 }}>{r.n}</div>
                    <div style={{ fontFamily:INTER, fontSize:'0.58rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginTop:6 }}>{r.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating AI cards */}
          <div className="hidden lg:flex flex-col gap-4 absolute right-16" style={{ top:'50%', transform:'translateY(-50%)', width:260 }}>
            {[
              { icon:<Bot className="w-5 h-5" style={{color:'#67e8f9'}} />, ib:'rgba(6,182,212,0.15)', ib2:'rgba(6,182,212,0.35)', label:'Status', title:'AI Agent Active', badge:{c:'#34d399',t:'#34d399',l:'Running'}, anim:'animate-float' },
              { icon:<Cpu className="w-5 h-5" style={{color:'#93c5fd'}} />, ib:'rgba(99,102,241,0.15)', ib2:'rgba(99,102,241,0.35)', label:'Tasks', title:'12,450 Automated', progress:78, anim:'animate-float-delayed' },
              { icon:<Network className="w-5 h-5" style={{color:'#c4b5fd'}} />, ib:'rgba(139,92,246,0.15)', ib2:'rgba(139,92,246,0.35)', label:'Pipeline', title:'Neural Workflow Online', badge:{c:'#a78bfa',t:'#a78bfa',l:'Online'}, anim:'animate-float-slow' },
            ].map(card => (
              <div key={card.title} className={`glass-card ${card.anim}`} style={{ padding:20, display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ flexShrink:0, width:40, height:40, borderRadius:12, background:card.ib, border:`1px solid ${card.ib2}`, display:'flex', alignItems:'center', justifyContent:'center' }}>{card.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontFamily:INTER, fontSize:'0.56rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', margin:'0 0 4px' }}>{card.label}</p>
                  <p style={{ fontFamily:INTER, fontWeight:600, fontSize:'0.82rem', color:'#fff', margin:0, lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{card.title}</p>
                  {card.badge && <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:8 }}><span className="animate-dot-pulse" style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:card.badge.c, flexShrink:0 }} /><span style={{ fontFamily:INTER, fontSize:'0.68rem', color:card.badge.t }}>{card.badge.l}</span></div>}
                  {card.progress !== undefined && <div style={{ marginTop:8, height:4, background:'rgba(255,255,255,0.08)', borderRadius:9, overflow:'hidden', width:112 }}><div style={{ height:'100%', width:`${card.progress}%`, background:'linear-gradient(90deg,#6366f1,#22d3ee)', borderRadius:9 }} /></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SERVICES
      ════════════════════════════════════════════════════ */}
      <section id="services" style={{ padding:'128px 0', position:'relative', overflow:'hidden', zIndex:3, background:'transparent' }}>
        {/* Decorative orbs */}
        <div style={{ position:'absolute', top:-200, right:-200, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-200, left:-200, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(6,182,212,0.06) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ ...wrap, position:'relative' }} className="px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom:72, maxWidth:640 }}>
            <SectionTag text="WHAT WE BUILD" />
            <Heading>
              AI SOLUTIONS BUILT<br />
              <span style={{ backgroundImage:'linear-gradient(100deg,#818cf8,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>FOR SCALE</span>
            </Heading>
            <p style={{ fontFamily:INTER, fontSize:'0.95rem', color:'rgba(255,255,255,0.5)', lineHeight:1.8, margin:'20px 0 0' }}>
              Every engagement is custom-engineered for your industry, team size, and growth objectives. No off-the-shelf templates — just precise, powerful AI.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20 }}>
            {SERVICES.map(svc => (
              <div key={svc.title}
                className="group transition-all duration-500 hover:-translate-y-1"
                style={{ background:'rgba(255,255,255,0.025)', border:`1px solid rgba(255,255,255,0.07)`, borderRadius:24, padding:36, cursor:'default', position:'relative', overflow:'hidden' }}>
                {/* Hover glow top edge */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${svc.color}60,transparent)`, opacity:0, transition:'opacity .4s' }} className="group-hover:opacity-100" />
                <div style={{ width:52, height:52, borderRadius:16, background:svc.bg, border:`1px solid ${svc.border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24, color:svc.color }}>
                  {svc.icon}
                </div>
                <h3 style={{ fontFamily:INTER, fontWeight:700, fontSize:'1.05rem', color:'#fff', margin:'0 0 12px' }}>{svc.title}</h3>
                <p style={{ fontFamily:INTER, fontSize:'0.855rem', color:'rgba(255,255,255,0.48)', lineHeight:1.75, margin:'0 0 24px' }}>{svc.desc}</p>
                <ul style={{ listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:9 }}>
                  {svc.features.map(f => (
                    <li key={f} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ width:18, height:18, borderRadius:'50%', background:svc.bg, border:`1px solid ${svc.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Check style={{ width:10, height:10, color:svc.color }} />
                      </span>
                      <span style={{ fontFamily:INTER, fontSize:'0.8rem', color:'rgba(255,255,255,0.55)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding:'128px 0', position:'relative', overflow:'hidden', zIndex:3, background:'transparent' }}>
        {/* Center glow */}
        <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:1000, height:600, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(99,102,241,0.07) 0%,transparent 65%)', pointerEvents:'none' }} />

        <div style={{ ...wrap, position:'relative' }} className="px-6 sm:px-10 lg:px-16">
          <div style={{ textAlign:'center', marginBottom:80 }}>
            <SectionTag text="OUR PROCESS" color="#818cf8" />
            <Heading>
              FROM IDEA TO<br />
              <span style={{ backgroundImage:'linear-gradient(100deg,#a5b4fc,#818cf8,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>PRODUCTION IN WEEKS</span>
            </Heading>
            <p style={{ fontFamily:INTER, fontSize:'0.95rem', color:'rgba(255,255,255,0.48)', lineHeight:1.8, maxWidth:480, margin:'20px auto 0' }}>
              A proven four-phase framework that gets your AI systems deployed fast, without surprises.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
            {STEPS.map((step, i) => (
              <div key={step.n} style={{ position:'relative' }}>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block" style={{ position:'absolute', top:32, left:'58%', width:'42%', height:1, background:'linear-gradient(90deg,rgba(99,102,241,0.5),transparent)', zIndex:0 }} />
                )}
                <div style={{ background:'rgba(99,102,241,0.06)', border:'1px solid rgba(99,102,241,0.15)', borderRadius:24, padding:36, position:'relative', zIndex:1, height:'100%', boxSizing:'border-box' }}>
                  <div style={{ fontFamily:BEBAS, fontSize:'4rem', lineHeight:1, letterSpacing:'0.04em', marginBottom:16, backgroundImage:'linear-gradient(135deg,rgba(99,102,241,0.5),rgba(34,211,238,0.3))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{step.n}</div>
                  <h3 style={{ fontFamily:INTER, fontWeight:700, fontSize:'1rem', color:'#fff', margin:'0 0 12px' }}>{step.title}</h3>
                  <p style={{ fontFamily:INTER, fontSize:'0.86rem', color:'rgba(255,255,255,0.48)', lineHeight:1.75, margin:0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:'center', marginTop:64 }}>
            <a href="#contact" className="inline-flex items-center gap-2 hover:bg-indigo-500/10 transition-all duration-300"
              style={{ fontFamily:INTER, fontWeight:600, fontSize:'0.78rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#818cf8', textDecoration:'none', border:'1px solid rgba(99,102,241,0.4)', borderRadius:999, padding:'14px 28px' }}>
              Start Your Project <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          RESULTS
      ════════════════════════════════════════════════════ */}
      <section id="results" style={{ padding:'128px 0', position:'relative', overflow:'hidden', zIndex:3, background:'transparent' }}>
        <div style={{ position:'absolute', top:'50%', right:-300, transform:'translateY(-50%)', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle,rgba(34,211,238,0.06) 0%,transparent 65%)', pointerEvents:'none' }} />

        <div style={{ ...wrap, position:'relative' }} className="px-6 sm:px-10 lg:px-16">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }} className="block lg:grid">
            <div>
              <SectionTag text="PROVEN RESULTS" color="#34d399" />
              <Heading>
                REAL NUMBERS.<br />
                <span style={{ backgroundImage:'linear-gradient(100deg,#6ee7b7,#34d399)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>REAL IMPACT.</span>
              </Heading>
              <p style={{ fontFamily:INTER, fontSize:'0.95rem', color:'rgba(255,255,255,0.5)', lineHeight:1.8, margin:'20px 0 40px' }}>
                Our AI systems deliver measurable outcomes across every engagement. Here's what our clients experience on average within the first 90 days.
              </p>
              <a href="#contact" className="inline-flex items-center gap-2 group hover:bg-emerald-500/10 transition-all duration-300"
                style={{ fontFamily:INTER, fontWeight:700, fontSize:'0.78rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#34d399', textDecoration:'none', border:'1px solid rgba(52,211,153,0.35)', borderRadius:999, padding:'16px 32px' }}>
                GET YOUR RESULTS <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:40 }} className="mt-12 lg:mt-0">
              {RESULTS.map(r => (
                <div key={r.l}
                  style={{ background:'rgba(255,255,255,0.025)', border:`1px solid ${r.c}25`, borderRadius:22, padding:30, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 0% 0%,${r.c}0d 0%,transparent 60%)` }} />
                  <div style={{ fontFamily:INTER, fontWeight:900, fontSize:'clamp(2rem,4vw,3rem)', color:r.c, lineHeight:1, marginBottom:10, position:'relative' }}>{r.n}</div>
                  <div style={{ fontFamily:INTER, fontWeight:600, fontSize:'0.8rem', color:'#fff', marginBottom:4, position:'relative' }}>{r.l}</div>
                  <div style={{ fontFamily:INTER, fontSize:'0.67rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', position:'relative' }}>{r.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════ */}
      <section id="testimonials" style={{ padding:'128px 0', position:'relative', overflow:'hidden', zIndex:3, background:'transparent' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:900, height:500, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(244,114,182,0.04) 0%,transparent 65%)', pointerEvents:'none' }} />

        <div style={{ ...wrap, position:'relative' }} className="px-6 sm:px-10 lg:px-16">
          <div style={{ textAlign:'center', marginBottom:72 }}>
            <SectionTag text="CLIENT STORIES" color="#f472b6" />
            <Heading>
              WHAT OUR CLIENTS<br />
              <span style={{ backgroundImage:'linear-gradient(100deg,#fbcfe8,#f472b6,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>SAY ABOUT US</span>
            </Heading>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="group hover:-translate-y-1 transition-all duration-500"
                style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:24, padding:40, display:'flex', flexDirection:'column', gap:24, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${t.color}80,transparent)` }} />
                <div style={{ display:'flex', gap:3 }}>
                  {Array.from({length:t.stars}).map((_,i) => <Star key={i} className="w-3.5 h-3.5" style={{ color:'#fbbf24', fill:'#fbbf24' }} />)}
                </div>
                <p style={{ fontFamily:INTER, fontSize:'0.925rem', color:'rgba(255,255,255,0.7)', lineHeight:1.82, margin:0, flex:1 }}>"{t.quote}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:`${t.color}20`, border:`1px solid ${t.color}40`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:BEBAS, fontSize:'1.1rem', color:t.color }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontFamily:INTER, fontWeight:600, fontSize:'0.875rem', color:'#fff' }}>{t.name}</div>
                    <div style={{ fontFamily:INTER, fontSize:'0.72rem', color:t.color, marginTop:3 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CONTACT
      ════════════════════════════════════════════════════ */}
      <section id="contact" style={{ padding:'128px 0 100px', position:'relative', overflow:'hidden', zIndex:3, background:'transparent' }}>
        {/* Decorative orbs */}
        <div style={{ position:'absolute', bottom:-300, left:'30%', width:800, height:600, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(6,182,212,0.08) 0%,transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:-200, right:-200, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 65%)', pointerEvents:'none' }} />

        <div style={{ ...wrap, position:'relative' }} className="px-6 sm:px-10 lg:px-16">
          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:80 }}>
            <SectionTag text="GET IN TOUCH" />
            <Heading>
              READY TO BUILD<br />
              <span style={{ backgroundImage:'linear-gradient(100deg,#fff 10%,#a5f3fc 45%,#22d3ee 80%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>WITH AI?</span>
            </Heading>
            <p style={{ fontFamily:INTER, fontSize:'0.95rem', color:'rgba(255,255,255,0.5)', lineHeight:1.8, maxWidth:480, margin:'20px auto 0' }}>
              Tell us about your business and automation goals. Our team will get back to you within 24 hours with a tailored proposal.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.7fr', gap:48, alignItems:'start' }} className="block lg:grid">

            {/* Left */}
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              {/* Suggestion card */}
              <div style={{ background:'linear-gradient(135deg,rgba(6,182,212,0.1),rgba(99,102,241,0.07))', border:'1px solid rgba(6,182,212,0.2)', borderRadius:24, padding:30 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'rgba(34,211,238,0.15)', border:'1px solid rgba(34,211,238,0.25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#22d3ee' }}><MessageSquare className="w-4 h-4" /></div>
                  <span style={{ fontFamily:INTER, fontWeight:700, fontSize:'0.92rem', color:'#fff' }}>Not sure where to start?</span>
                </div>
                <p style={{ fontFamily:INTER, fontSize:'0.85rem', color:'rgba(255,255,255,0.55)', lineHeight:1.75, margin:'0 0 20px' }}>
                  Book a free 30-min strategy call. We'll map your top automation opportunities and show you exactly what's possible with AI.
                </p>
                <a href="mailto:kingaman242314@gmail.com"
                  className="inline-flex items-center gap-2 hover:bg-cyan-400/10 transition-all duration-300"
                  style={{ fontFamily:INTER, fontWeight:600, fontSize:'0.7rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'#22d3ee', textDecoration:'none', border:'1px solid rgba(34,211,238,0.3)', borderRadius:999, padding:'10px 20px' }}>
                  Book Free Call <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Contact info */}
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {[
                  { icon:<Mail className="w-4 h-4" />, c:'#22d3ee', l:'Email Us',  v:'kingaman242314@gmail.com' },
                  { icon:<Phone className="w-4 h-4" />, c:'#818cf8', l:'Call Us',   v:'+91 88068 68260' },
                  { icon:<MapPin className="w-4 h-4" />, c:'#34d399', l:'Location', v:'Remote-first · Global' },
                ].map(item => (
                  <div key={item.l} style={{ display:'flex', alignItems:'flex-start', gap:14, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'16px 20px' }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`${item.c}18`, border:`1px solid ${item.c}30`, display:'flex', alignItems:'center', justifyContent:'center', color:item.c, flexShrink:0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontFamily:INTER, fontSize:'0.62rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:4 }}>{item.l}</div>
                      <div style={{ fontFamily:INTER, fontWeight:500, fontSize:'0.875rem', color:'#fff' }}>{item.v}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Response badge */}
              <div style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(52,211,153,0.07)', border:'1px solid rgba(52,211,153,0.18)', borderRadius:14, padding:'14px 20px' }}>
                <span className="animate-dot-pulse" style={{ width:8, height:8, borderRadius:'50%', background:'#34d399', display:'inline-block', flexShrink:0 }} />
                <span style={{ fontFamily:INTER, fontSize:'0.8rem', color:'rgba(255,255,255,0.55)' }}>
                  Average response: <strong style={{ color:'#fff' }}>under 4 hours</strong>
                </span>
              </div>
            </div>

            {/* Right — form */}
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:28, padding:44, marginTop:40 }} className="mt-12 lg:mt-0">
              {sent ? (
                <div style={{ textAlign:'center', padding:'48px 0' }}>
                  <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(34,211,238,0.12)', border:'1px solid rgba(34,211,238,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', color:'#22d3ee' }}>
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 style={{ fontFamily:BEBAS, fontSize:'2.2rem', letterSpacing:'0.05em', color:'#fff', margin:'0 0 14px' }}>MESSAGE SENT!</h3>
                  <p style={{ fontFamily:INTER, fontSize:'0.9rem', color:'rgba(255,255,255,0.5)', lineHeight:1.75, margin:0 }}>
                    Thanks for reaching out. We'll be in touch within 24 hours with a tailored response.
                  </p>
                </div>
              ) : (
                <form id="contact-form" onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
                  <div>
                    <h3 style={{ fontFamily:BEBAS, fontSize:'2rem', letterSpacing:'0.06em', color:'#fff', margin:'0 0 6px' }}>SEND US A MESSAGE</h3>
                    <p style={{ fontFamily:INTER, fontSize:'0.82rem', color:'rgba(255,255,255,0.4)', margin:0, lineHeight:1.6 }}>We'll craft a custom AI strategy for your business.</p>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }} className="block sm:grid">
                    {[
                      { id:'contact-name',    label:'Full Name *',      type:'text',  required:true,  ph:'John Smith',          key:'name' },
                      { id:'contact-email',   label:'Email Address *',  type:'email', required:true,  ph:'john@company.com',    key:'email' },
                    ].map(f => (
                      <div key={f.id}>
                        <label style={{ fontFamily:INTER, fontSize:'0.66rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', display:'block', marginBottom:8 }}>{f.label}</label>
                        <input id={f.id} type={f.type} required={f.required} placeholder={f.ph} disabled={loading}
                          value={(form as any)[f.key]} onChange={e => setForm(s => ({ ...s, [f.key]: e.target.value }))}
                          style={{ width:'100%', background:loading ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:12, padding:'12px 16px', fontFamily:INTER, fontSize:'0.875rem', color:loading ? 'rgba(255,255,255,0.3)' : '#fff', outline:'none', boxSizing:'border-box', transition:'border-color .3s' }}
                          onFocus={e => e.target.style.borderColor='rgba(34,211,238,0.5)'}
                          onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.09)'}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label style={{ fontFamily:INTER, fontSize:'0.66rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', display:'block', marginBottom:8 }}>Company / Project</label>
                    <input id="contact-company" type="text" placeholder="Your company name" disabled={loading}
                      value={form.company} onChange={e => setForm(s => ({ ...s, company:e.target.value }))}
                      style={{ width:'100%', background:loading ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:12, padding:'12px 16px', fontFamily:INTER, fontSize:'0.875rem', color:loading ? 'rgba(255,255,255,0.3)' : '#fff', outline:'none', boxSizing:'border-box', transition:'border-color .3s' }}
                      onFocus={e => e.target.style.borderColor='rgba(34,211,238,0.5)'}
                      onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.09)'}
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily:INTER, fontSize:'0.66rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', display:'block', marginBottom:8 }}>Tell Us About Your Goals *</label>
                    <textarea id="contact-message" required rows={4} placeholder="What processes do you want to automate? What does success look like?" disabled={loading}
                      value={form.message} onChange={e => setForm(s => ({ ...s, message:e.target.value }))}
                      style={{ width:'100%', background:loading ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:12, padding:'12px 16px', fontFamily:INTER, fontSize:'0.875rem', color:loading ? 'rgba(255,255,255,0.3)' : '#fff', outline:'none', boxSizing:'border-box', resize:'vertical', transition:'border-color .3s' }}
                      onFocus={e => e.target.style.borderColor='rgba(34,211,238,0.5)'}
                      onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.09)'}
                    />
                  </div>

                  {error && (
                    <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, fontFamily: INTER, fontSize: '0.82rem', color: '#f87171', lineHeight: 1.5 }}>
                      ⚠️ {error}
                    </div>
                  )}

                  <button id="contact-submit" type="submit" disabled={loading}
                    className="group flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                    style={{ width:'100%', background:loading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#0891b2,#4f46e5)', borderRadius:14, padding:'17px 32px', fontFamily:INTER, fontWeight:700, fontSize:'0.8rem', letterSpacing:'0.14em', textTransform:'uppercase', color:loading ? 'rgba(255,255,255,0.3)' : '#fff', border:'none', cursor:loading ? 'not-allowed' : 'pointer', boxShadow:loading ? 'none' : '0 8px 40px rgba(6,182,212,0.3)' }}>
                    {loading ? 'SENDING...' : 'SEND MESSAGE'} <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <p style={{ fontFamily:INTER, fontSize:'0.7rem', color:'rgba(255,255,255,0.28)', textAlign:'center', margin:0 }}>
                    🔒 Your information is secure and never shared.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════ */}
      <footer style={{ padding:'48px 0 32px', position:'relative', zIndex:3, background:'transparent', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ ...wrap, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:24 }} className="px-6 sm:px-10 lg:px-16">
          <div>
            <div style={{ fontFamily:BEBAS, letterSpacing:'0.15em', fontSize:'1.5rem', color:'#fff', textTransform:'uppercase' }}>CYGNUS</div>
            <div style={{ fontFamily:INTER, letterSpacing:'0.4em', fontSize:'0.53rem', color:'#67e8f9', textTransform:'uppercase', marginTop:2 }}>AUTOMATION</div>
          </div>
          <p style={{ fontFamily:INTER, fontSize:'0.75rem', color:'rgba(255,255,255,0.28)', margin:0 }}>
            © {new Date().getFullYear()} Cygnus Automation. All rights reserved.
          </p>
          <div style={{ display:'flex', gap:24 }}>
            <a href="#contact" style={{ fontFamily:INTER, fontSize:'0.75rem', color:'rgba(255,255,255,0.38)', textDecoration:'none', transition:'color .3s' }} className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
