import { useState, useRef, useEffect } from 'react'
import {
  X, Send, Bot, Sparkles, ChevronRight, RotateCcw,
} from 'lucide-react'

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */
interface Message {
  id: string
  role: 'user' | 'agent'
  text: string
  time: string
}

/* ═══════════════════════════════════════════════
   KNOWLEDGE BASE — smart keyword matching
═══════════════════════════════════════════════ */
const KB: { keys: string[]; reply: string; suggestions?: string[] }[] = [
  {
    keys: ['hello', 'hi', 'hey', 'start', 'help'],
    reply: "Hey! 👋 I'm **Cyg**, Cygnus Automation's AI assistant.\n\nI can help you understand our services, explain how AI automation works, or guide you toward the right solution for your business.\n\nWhat would you like to know?",
    suggestions: ['What services do you offer?', 'How does pricing work?', 'How quickly can you deploy?'],
  },
  {
    keys: ['service', 'offer', 'what do you do', 'build', 'provide', 'solution'],
    reply: "We offer **6 core AI services**:\n\n🤖 **AI Agent Development** — Autonomous agents that handle complex multi-step tasks\n\n⚡ **Workflow Automation** — Intelligent pipelines connecting your tools\n\n🧠 **LLM Integration** — GPT-4, Claude, Gemini in your products\n\n📊 **Data & Analytics AI** — Forecasting and automated reporting\n\n🔧 **Process Optimization** — Identify and eliminate operational waste\n\n🎯 **AI Strategy & Consulting** — Full roadmap to deployment\n\nWhich area interests you most?",
    suggestions: ['Tell me about AI Agents', 'LLM integration options', 'I need workflow automation'],
  },
  {
    keys: ['agent', 'autonomous', 'bot'],
    reply: "Our **AI Agents** are autonomous systems that:\n\n• Handle complex, multi-step business tasks end-to-end\n• Make contextual decisions without human input\n• Use tools like search, APIs, databases, and email\n• Remember context across conversations and tasks\n• Can be orchestrated in multi-agent pipelines\n\nCommon use cases include lead qualification, customer support, report generation, and data enrichment.\n\nWant to explore if an AI agent is right for your use case?",
    suggestions: ['What\'s the setup time?', 'Can agents integrate with my CRM?', 'Book a free call'],
  },
  {
    keys: ['workflow', 'automation', 'pipeline', 'automate', 'process'],
    reply: "**Workflow Automation** is where we connect your existing tools (Slack, HubSpot, Notion, Salesforce, etc.) into intelligent pipelines that run 24/7.\n\nExamples of what we automate:\n\n• Lead capture → qualification → CRM entry\n• Invoice processing → approval → payment\n• Support tickets → triage → response drafts\n• Content creation → review → publishing\n\nMost clients see **40%+ cost reduction** within 90 days.\n\nWhat process are you looking to automate?",
    suggestions: ['How long does setup take?', 'What tools do you integrate with?', 'Get a free audit'],
  },
  {
    keys: ['llm', 'gpt', 'claude', 'gemini', 'language model', 'chatgpt', 'openai'],
    reply: "We work with all major LLMs:\n\n• **OpenAI GPT-4o** — Best for reasoning and code\n• **Anthropic Claude 3.5** — Best for long documents\n• **Google Gemini** — Best for multimodal tasks\n• **Open-source models** (Llama, Mistral) — For private deployments\n\nWe typically build **RAG pipelines** (Retrieval-Augmented Generation) so the AI knows your specific business data — not just general knowledge.\n\nWould you like to know more about how RAG works?",
    suggestions: ['What is RAG?', 'Can I keep data private?', 'Which LLM is best for me?'],
  },
  {
    keys: ['rag', 'retrieval', 'vector', 'knowledge base', 'embeddings'],
    reply: "**RAG (Retrieval-Augmented Generation)** is how we make AI smart about *your* business:\n\n1. We index your documents, PDFs, emails, and databases\n2. User asks a question → system finds the relevant info\n3. LLM answers using YOUR data as context\n\nThe result: an AI that knows your products, policies, and history — not just general internet knowledge.\n\nThis is how we build internal knowledge assistants and customer-facing AI that gives accurate, company-specific answers.",
    suggestions: ['How secure is my data?', 'What file types are supported?', 'Start a project'],
  },
  {
    keys: ['price', 'cost', 'pricing', 'how much', 'fee', 'charge', 'budget', 'expensive'],
    reply: "Our pricing is **project-based** and depends on scope:\n\n💼 **Starter** — Simple automations, single workflow\nFrom ~$2,000 one-time\n\n⚡ **Professional** — Multi-workflow systems + AI agents\nFrom ~$8,000–$20,000\n\n🏢 **Enterprise** — Full AI transformation programs\nCustom pricing\n\nMost projects pay for themselves within 60–90 days through time/cost savings.\n\nWant a free estimate? Book a discovery call and we'll scope it out with no obligation.",
    suggestions: ['Book a free call', 'What\'s included?', 'Do you offer retainers?'],
  },
  {
    keys: ['time', 'how long', 'timeline', 'fast', 'quick', 'when', 'deploy', 'launch'],
    reply: "Our typical timelines:\n\n🚀 **Simple automation** — 1–2 weeks\n🤖 **AI agent deployment** — 3–4 weeks\n🧠 **Full LLM integration** — 4–8 weeks\n🏢 **Enterprise program** — 8–16 weeks\n\nWe move fast because we have battle-tested templates and frameworks built from 100+ past projects.\n\nAll projects include testing, documentation, and team training before handover.",
    suggestions: ['What\'s your process?', 'Do you offer support after launch?', 'Start now'],
  },
  {
    keys: ['process', 'how it works', 'steps', 'methodology', 'approach'],
    reply: "Our **4-phase process**:\n\n**01 Discovery & Audit** (Week 1)\nWe map your workflows and find the highest-ROI automation targets.\n\n**02 Architecture & Design** (Week 1–2)\nWe design the AI system tailored to your stack and context.\n\n**03 Build & Integrate** (Weeks 2–6)\nWe build, test, and integrate with zero disruption to your ops.\n\n**04 Launch & Scale** (Ongoing)\nWe go live, monitor performance, and iterate.\n\nYou have a dedicated point of contact throughout.",
    suggestions: ['What happens at discovery?', 'How do you handle integrations?', 'Book a call'],
  },
  {
    keys: ['integrate', 'integration', 'connect', 'crm', 'salesforce', 'hubspot', 'slack', 'notion', 'zapier', 'tool'],
    reply: "We integrate with **virtually any tool** your team uses:\n\n📊 **CRM** — Salesforce, HubSpot, Pipedrive\n💬 **Comms** — Slack, Teams, Gmail, Outlook\n📋 **PM Tools** — Notion, Asana, ClickUp, Linear\n🛒 **E-commerce** — Shopify, WooCommerce\n📈 **Analytics** — Google Analytics, Mixpanel\n🔧 **Custom APIs** — Any REST/GraphQL API\n\nNo native integration? We build custom connectors.",
    suggestions: ['Do you work with legacy systems?', 'What about data security?', 'Get started'],
  },
  {
    keys: ['security', 'secure', 'private', 'data', 'gdpr', 'compliance', 'safe'],
    reply: "Data security is a priority for us:\n\n🔒 **Data stays yours** — We never train models on your data without explicit consent\n\n🛡️ **On-premise options** — Deploy entirely within your infrastructure for sensitive data\n\n✅ **Compliance-friendly** — GDPR, SOC2, HIPAA-adjacent architectures available\n\n🔑 **Encrypted in transit + at rest** — Industry-standard encryption\n\n📋 **NDAs** — We sign NDAs before any project discovery call",
    suggestions: ['Can I use open-source models locally?', 'Do you sign NDAs?', 'Book a security briefing'],
  },
  {
    keys: ['result', 'roi', 'benefit', 'success', 'outcome', 'saving', 'impact'],
    reply: "Our clients typically see:\n\n📉 **40% cost reduction** on automated processes\n⚡ **10× faster** task completion vs manual\n⏱️ **Hours saved daily** per team member\n💰 **ROI in 60–90 days** on average\n\nReal example: One client automated their lead pipeline — 3 days → 20 minutes per lead. Fully autonomous.\n\nAnother replaced 6 hours of daily reporting with a single dashboard that updates automatically.\n\nWant a free ROI estimate for your use case?",
    suggestions: ['See case studies', 'Calculate my ROI', 'Book a call'],
  },
  {
    keys: ['contact', 'call', 'meeting', 'talk', 'speak', 'book', 'schedule', 'reach'],
    reply: "Ready to move forward? Here's how to connect:\n\n📧 **Email:** kingaman242314@gmail.com\n📞 **Phone:** +91 88068 68260\n📅 **Book a free 30-min strategy call** — we'll map your automation opportunities at no cost\n\nYou can also scroll down to the **Contact** section on this page and fill out the form — we respond within 4 hours.\n\nLooking forward to hearing about your project! 🚀",
    suggestions: ['Fill out the contact form', 'What to prepare for a call?', 'Is the call really free?'],
  },
  {
    keys: ['free', 'no cost', 'trial', 'demo'],
    reply: "Yes! We offer:\n\n✅ **Free 30-min strategy call** — No pitch, just value. We map your automation opportunities.\n\n✅ **Free ROI estimate** — We'll tell you exactly what you could save before any commitment\n\n✅ **Free AI readiness assessment** — Know where you stand in your AI journey\n\nNo obligation, no pressure. If we're not the right fit, we'll say so and point you in the right direction.",
    suggestions: ['Book a free call', 'What happens after the call?', 'I\'m ready to start'],
  },
]

const DEFAULT_REPLY = {
  reply: "That's a great question! I want to make sure I give you the most accurate answer.\n\nFor anything specific to your business or use case, the best next step is a **free 30-min strategy call** with our team — we'll give you a tailored answer and roadmap.\n\nOr feel free to ask about our services, pricing, timeline, integrations, or process!",
  suggestions: ['What services do you offer?', 'How does pricing work?', 'Book a free call'],
}

function getReply(input: string): { reply: string; suggestions?: string[] } {
  const lower = input.toLowerCase()
  for (const entry of KB) {
    if (entry.keys.some(k => lower.includes(k))) {
      return { reply: entry.reply, suggestions: entry.suggestions }
    }
  }
  return DEFAULT_REPLY
}

function formatTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function uid() {
  return Math.random().toString(36).slice(2)
}

/* ═══════════════════════════════════════════════
   RENDER HELPER — bold markdown
═══════════════════════════════════════════════ */
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color: '#fff', fontWeight: 700 }}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  )
}

/* ═══════════════════════════════════════════════
   CHAT WIDGET COMPONENT
═══════════════════════════════════════════════ */
const BEBAS = '"Bebas Neue", Impact, sans-serif'
const INTER = 'Inter, system-ui, sans-serif'

const WELCOME: Message = {
  id: 'welcome',
  role: 'agent',
  text: "Hey! 👋 I'm **Cyg**, your AI guide at Cygnus Automation.\n\nAsk me anything about AI automation — services, pricing, timelines, or how we can help your business scale. I'm here to help!",
  time: formatTime(),
}

const QUICK_QUESTIONS = [
  'What services do you offer?',
  'How does pricing work?',
  'How quickly can you deploy?',
  'Is my data secure?',
]

export default function ChatWidget() {
  const [open, setOpen]           = useState(false)
  const [messages, setMessages]   = useState<Message[]>([WELCOME])
  const [input, setInput]         = useState('')
  const [typing, setTyping]       = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>(QUICK_QUESTIONS)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg: Message = { id: uid(), role: 'user', text: trimmed, time: formatTime() }
    setMessages(m => [...m, userMsg])
    setInput('')
    setSuggestions([])
    setTyping(true)

    const delay = 900 + Math.random() * 800
    setTimeout(() => {
      const { reply, suggestions: s } = getReply(trimmed)
      const agentMsg: Message = { id: uid(), role: 'agent', text: reply, time: formatTime() }
      setMessages(m => [...m, agentMsg])
      setSuggestions(s || [])
      setTyping(false)
    }, delay)
  }

  const reset = () => {
    setMessages([WELCOME])
    setSuggestions(QUICK_QUESTIONS)
    setTyping(false)
    setInput('')
  }

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        id="chat-widget-btn"
        onClick={() => setOpen(true)}
        className="transition-all duration-300 hover:scale-110"
        aria-label="Open AI assistant"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 100,
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg,#0891b2,#4f46e5)',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(6,182,212,0.5), 0 0 0 0 rgba(6,182,212,0.4)',
          animation: 'chat-pulse 3s ease-in-out infinite',
          opacity: open ? 0 : 1, pointerEvents: open ? 'none' : 'auto',
          transition: 'opacity .3s, transform .3s',
        }}
      >
        <Bot style={{ width: 26, height: 26, color: '#fff' }} />
        {/* Unread dot */}
        <span style={{ position: 'absolute', top: 3, right: 3, width: 10, height: 10, borderRadius: '50%', background: '#22d3ee', border: '2px solid #03040a' }} />
      </button>

      {/* ── Chat panel ── */}
      <div
        id="chat-panel"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 100,
          width: 'min(420px, calc(100vw - 32px))',
          height: 'min(620px, calc(100vh - 56px))',
          borderRadius: 24,
          background: 'rgba(6,7,20,0.97)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(34,211,238,0.08)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .35s cubic-bezier(.4,0,.2,1), transform .35s cubic-bezier(.4,0,.2,1)',
          transformOrigin: 'bottom right',
        }}
      >
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(135deg,rgba(8,145,178,0.15),rgba(79,70,229,0.1))', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {/* Avatar */}
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#0891b2,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 16px rgba(6,182,212,0.4)' }}>
            <Bot style={{ width: 20, height: 20, color: '#fff' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: BEBAS, fontSize: '1.05rem', letterSpacing: '0.1em', color: '#fff' }}>CYG — AI ASSISTANT</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'dot-pulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: INTER, fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>Online · Powered by Cygnus AI</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={reset} title="Reset chat" style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', transition: 'all .2s' }}
              className="hover:bg-white/15 hover:text-white transition-all">
              <RotateCcw style={{ width: 14, height: 14 }} />
            </button>
            <button onClick={() => setOpen(false)} aria-label="Close chat" style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', transition: 'all .2s' }}
              className="hover:bg-white/15 hover:text-white transition-all">
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 10 }}>
              {/* Avatar */}
              {msg.role === 'agent' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#0891b2,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot style={{ width: 14, height: 14, color: '#fff' }} />
                </div>
              )}
              {/* Bubble */}
              <div style={{ maxWidth: '80%' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.role === 'agent' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                  background: msg.role === 'agent'
                    ? 'rgba(255,255,255,0.05)'
                    : 'linear-gradient(135deg,#0891b2,#4f46e5)',
                  border: msg.role === 'agent' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  fontFamily: INTER, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.7, whiteSpace: 'pre-wrap',
                }}>
                  {renderText(msg.text)}
                </div>
                <div style={{ fontFamily: INTER, fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left', paddingLeft: msg.role === 'agent' ? 4 : 0, paddingRight: msg.role === 'user' ? 4 : 0 }}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#0891b2,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot style={{ width: 14, height: 14, color: '#fff' }} />
              </div>
              <div style={{ padding: '14px 18px', borderRadius: '4px 18px 18px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', display: 'inline-block', animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {!typing && suggestions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <span style={{ fontFamily: INTER, fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', paddingLeft: 38 }}>Quick questions</span>
              <div style={{ paddingLeft: 38, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {suggestions.map(s => (
                  <button key={s} onClick={() => sendMessage(s)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 10, padding: '8px 14px', fontFamily: INTER, fontSize: '0.78rem', color: '#22d3ee', cursor: 'pointer', textAlign: 'left', transition: 'all .2s' }}
                    className="hover:bg-cyan-400/15 transition-all">
                    <ChevronRight style={{ width: 12, height: 12, flexShrink: 0 }} />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <form onSubmit={e => { e.preventDefault(); sendMessage(input) }}
            style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '8px 8px 8px 16px' }}>
            <input
              ref={inputRef}
              id="chat-input"
              type="text"
              placeholder="Ask about AI automation..."
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: INTER, fontSize: '0.875rem', color: '#fff' }}
            />
            <button id="chat-send" type="submit" disabled={!input.trim() || typing}
              style={{ width: 36, height: 36, borderRadius: 10, background: input.trim() && !typing ? 'linear-gradient(135deg,#0891b2,#4f46e5)' : 'rgba(255,255,255,0.08)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !typing ? 'pointer' : 'not-allowed', transition: 'all .2s', flexShrink: 0 }}>
              <Send style={{ width: 15, height: 15, color: input.trim() && !typing ? '#fff' : 'rgba(255,255,255,0.3)' }} />
            </button>
          </form>
          <p style={{ fontFamily: INTER, fontSize: '0.6rem', color: 'rgba(255,255,255,0.22)', textAlign: 'center', margin: '8px 0 0' }}>
            Powered by <Sparkles style={{ display: 'inline', width: 9, height: 9, verticalAlign: 'middle' }} /> Cygnus AI Engine
          </p>
        </div>
      </div>

      {/* Inline keyframes for the chat widget */}
      <style>{`
        @keyframes chat-pulse {
          0%, 100% { box-shadow: 0 8px 32px rgba(6,182,212,0.5), 0 0 0 0 rgba(6,182,212,0.4); }
          50%       { box-shadow: 0 8px 32px rgba(6,182,212,0.5), 0 0 0 12px rgba(6,182,212,0); }
        }
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-6px); opacity: 1; }
        }
        #chat-panel ::-webkit-scrollbar { width: 4px; }
        #chat-panel ::-webkit-scrollbar-track { background: transparent; }
        #chat-panel ::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.2); border-radius: 2px; }
        #chat-input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </>
  )
}
