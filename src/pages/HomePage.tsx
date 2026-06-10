import { Link } from 'react-router-dom';
import { ArrowRight, Map, Route, Search, GraduationCap, ChevronRight, Network, BookOpen, Activity, AlertTriangle, Briefcase, Compass } from 'lucide-react';
import { MotionCard } from '../components/common/MotionCard';
import { useCourseModal } from '../components/common/CourseModalProvider';
import { useState, useEffect } from 'react';
import type { CourseIndex } from '../utils/courseIndex';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';




// ─── Node definitions: cx/cy are SVG-space coords (viewBox 0 0 500 440) ───
const NODES = [
  { id: 'center', label: 'ECPE NU', cx: 250, cy: 220, isCenter: true, color: 'var(--primary)' },
  { id: 'prog',   label: 'Programming', cx: 390, cy: 100, color: 'var(--primary)' },
  { id: 'math',   label: 'Math',        cx: 100, cy: 110, color: 'var(--cyan)' },
  { id: 'hw',     label: 'Hardware',    cx:  90, cy: 320, color: 'var(--violet)' },
  { id: 'ai',     label: 'AI & Data',  cx: 390, cy: 340, color: '#f43f5e' },
  { id: 'net',    label: 'Network',     cx: 430, cy: 220, color: 'var(--orange)' },
  { id: 'career', label: 'Career',      cx: 250, cy:  55, color: 'var(--success)' },
];

const EDGES = [
  { from: 'center', to: 'prog',   color: 'var(--primary)' },
  { from: 'center', to: 'math',   color: 'var(--cyan)' },
  { from: 'center', to: 'hw',     color: 'var(--violet)' },
  { from: 'center', to: 'ai',     color: '#f43f5e' },
  { from: 'center', to: 'net',    color: 'var(--orange)' },
  { from: 'center', to: 'career', color: 'var(--success)' },
  { from: 'prog',   to: 'career', color: 'rgba(79,124,255,0.3)' },
  { from: 'math',   to: 'prog',   color: 'rgba(6,182,212,0.3)' },
];

// ─── Constellation Hero ───
function Constellation() {
  const reducedMotion = useReducedMotion();
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

  const lineVariants = {
    hidden:  { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1, opacity: 0.6,
      transition: { duration: 1.2, delay: i * 0.15, ease: 'easeInOut' as const }
    }),
  };

  const nodeVariants = {
    hidden:  { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1, opacity: 1,
      transition: { type: 'spring' as const, stiffness: 260, damping: 18, delay: i * 0.12 }
    }),
  };

  const floatY = (delay: number) =>
    reducedMotion ? {} : {
      y: [0, -10, 0],
      transition: { duration: 3.5 + delay * 0.5, repeat: Infinity, ease: 'easeInOut' as const, delay }
    };

  const pulseScale = (delay: number) =>
    reducedMotion ? {} : {
      scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6],
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const, delay }
    };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '440px', margin: '0 auto' }}>
      {/* SVG layer — lines & animated dots */}
      <svg
        viewBox="0 0 500 440"
        width="100%" height="100%"
        style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'visible' }}
      >
        <defs>
          {NODES.map(n => (
            <radialGradient key={n.id + '-glow'} id={`glow-${n.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={n.color} stopOpacity="0.5" />
              <stop offset="100%" stopColor={n.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Glow halos behind center node */}
        <motion.ellipse
          cx={250} cy={220} rx={60} ry={60}
          fill="url(#glow-center)"
          animate={reducedMotion ? {} : { rx: [55, 75, 55], ry: [55, 75, 55], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Edges */}
        {EDGES.map((e, i) => {
          const a = nodeMap[e.from];
          const b = nodeMap[e.to];
          return (
            <motion.line
              key={e.from + '-' + e.to}
              x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
              stroke={e.color} strokeWidth={e.from === 'center' ? 2 : 1.5}
              strokeLinecap="round"
              custom={i}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
            />
          );
        })}

        {/* Animated travelling dots along each center-edge */}
        {EDGES.filter(e => e.from === 'center').map((e, i) => {
          const b = nodeMap[e.to];
          return (
            <motion.circle
              key={'dot-' + e.to}
              r={3} fill={e.color}
              animate={reducedMotion ? {} : {
                cx: [250, b.cx, 250],
                cy: [220, b.cy, 220],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            />
          );
        })}
      </svg>

      {/* HTML node labels — positioned to match SVG coords via percentage */}
      {NODES.map((n, i) => {
        const xPct = (n.cx / 500) * 100;
        const yPct = (n.cy / 440) * 100;
        return (
          <motion.div
            key={n.id}
            custom={i}
            variants={nodeVariants}
            initial="hidden"
            animate="visible"
            style={{
              position: 'absolute',
              left: `${xPct}%`,
              top:  `${yPct}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: n.isCenter ? 3 : 2,
            }}
          >
            <motion.div
              whileHover={n.isCenter ? { scale: 1.05 } : { scale: 1.1, y: -4 }}
              animate={floatY(i * 0.4)}
              style={{
                background: n.isCenter
                  ? 'white'
                  : 'rgba(255,255,255,0.92)',
                padding: n.isCenter ? '14px 26px' : '6px 14px',
                borderRadius: n.isCenter ? '18px' : '999px',
                border: `2px solid ${n.color}`,
                boxShadow: n.isCenter
                  ? `0 8px 32px rgba(79,124,255,0.25), 0 0 0 4px rgba(79,124,255,0.08)`
                  : `0 4px 14px rgba(0,0,0,0.08)`,
                backdropFilter: 'blur(8px)',
                fontWeight: n.isCenter ? 900 : 600,
                fontSize: n.isCenter ? '1.3rem' : '0.82rem',
                color: n.color,
                letterSpacing: n.isCenter ? '-0.02em' : '0.01em',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {n.label}
              {/* Pulse dot for peripheral nodes */}
              {!n.isCenter && (
                <motion.span
                  animate={pulseScale(i * 0.3)}
                  style={{
                    display: 'inline-block', width: 6, height: 6,
                    borderRadius: '50%', background: n.color,
                    marginLeft: 6, verticalAlign: 'middle',
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

// --- Floating Chips --- (positioned relative to the hero section, not the whole page)
function FloatingChips() {
  const reducedMotion = useReducedMotion();
  const chips = [
    { text: 'อย่าปล่อย Calc นะ 🥲', top: '-2%',  left: '40%',  delay: 0.5, floatDur: 3.2 },
    { text: 'เขียนโค้ดทุกสัปดาห์ 💻', top: '85%', left: '10%',  delay: 0.9, floatDur: 3.8 },
    { text: 'เก็บ Portfolio ปี 1 ✨',  top: '12%', right: '2%', delay: 1.2, floatDur: 2.9 },
    { text: 'ระวัง Drop ✂️',            top: '70%', right: '8%', delay: 0.7, floatDur: 4.1 },
  ];
  return (
    <>
      {chips.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: c.delay, duration: 0.5 }}
          style={{
            position: 'absolute',
            top: c.top, left: (c as any).left, right: (c as any).right,
            zIndex: 0, pointerEvents: 'none',
          }}
        >
          <motion.div
            animate={reducedMotion ? {} : { y: [0, -7, 0] }}
            transition={{ duration: c.floatDur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
              border: '1px solid rgba(0,0,0,0.06)',
              whiteSpace: 'nowrap',
            }}
          >
            {c.text}
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}


// --- Journey Strip ---
function JourneyStrip() {
  const years = [
    { year: 'Year 1', desc: 'ปูพื้นฐาน',         icon: '🧱', color: 'var(--cyan)'    },
    { year: 'Year 2', desc: 'วิชาหนักเริ่มมา',    icon: '⚡', color: 'var(--primary)' },
    { year: 'Year 3', desc: 'เริ่มเลือกทาง',      icon: '🔀', color: 'var(--violet)'  },
    { year: 'Year 4', desc: 'โปรเจกต์/ฝึกงาน',   icon: '🚀', color: 'var(--success)' },
  ];
  return (
    <section style={{ marginBottom: '100px' }}>
      <div style={{ position: 'relative', maxWidth: '860px', margin: '0 auto', padding: '40px 0' }}>
        {/* Animated progress line — purely HTML, no SVG % issue */}
        <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '3px', background: 'var(--border)', borderRadius: '2px', transform: 'translateY(-50%)', zIndex: 0 }}>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, var(--cyan), var(--primary), var(--violet), var(--success))',
              transformOrigin: 'left center',
              borderRadius: '2px',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1, padding: '0 10%' }}>
          {years.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ delay: i * 0.25, duration: 0.5 }}
              whileHover={{ y: -4 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
            >
              <div style={{ fontSize: '1.6rem', lineHeight: 1 }}>{item.icon}</div>
              <div style={{
                background: 'white', padding: '12px 20px', borderRadius: '16px',
                border: `2px solid ${item.color}`,
                boxShadow: `0 6px 20px rgba(0,0,0,0.07)`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              }}>
                <div style={{ fontWeight: 800, color: item.color, fontSize: '1.1rem' }}>{item.year}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


export function HomePage({ courseIndex }: { courseIndex: CourseIndex }) {
  const { openCourse } = useCourseModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Search Placeholders
  const placeholders = ["305121", "แคลคูลัส", "Machine Learning", "Digital Logic"];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const results = courseIndex.searchCourses(searchQuery, 1);
    if (results.length > 0) {
      openCourse(results[0].course);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <div className="page" style={{ padding: '0 24px 64px', maxWidth: '1200px', margin: '0 auto', overflowX: 'hidden' }}>
      
      {/* 1. Hero Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '48px', alignItems: 'center', minHeight: '70vh', marginBottom: '64px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '10%', left: '30%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(79, 124, 255, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: -1 }}></div>
        <div style={{ position: 'absolute', top: '40%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(123, 97, 255, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(30px)', zIndex: -1 }}></div>

        <FloatingChips />

        <div style={{ paddingRight: '24px', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '20px', color: 'var(--text)', letterSpacing: '-0.03em' }}>
              <span className="text-gradient">ECPE NU</span><br/>
              Freshman<br/>Handbook
            </h1>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '28px', maxWidth: '480px' }}>
              คู่มือเอาตัวรอดวิศวกรรมคอมพิวเตอร์แบบ <span className="text-gradient-cyan" style={{fontWeight: 700}}>Interactive</span> 
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '40px', maxWidth: '520px' }}>
              นี่ไม่ใช่คู่มือวิชาการน่าเบื่อ! แต่เป็นแผนที่พาน้องๆ ตะลุย 4 ปีในมหาลัย ให้เห็นภาพรวมว่าต้องเจอวิชาอะไร วางแผนเทอมไหน และเลือกสายอาชีพที่ใช่
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <motion.div whileHover="hover" whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                <Link to="/visual-maps" className="primary-button" style={{ textDecoration: 'none', fontSize: '1rem', padding: '12px 24px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 24px rgba(79, 124, 255, 0.3)' }}>
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)', transform: 'translateX(-100%)' }} variants={{ hover: { transform: 'translateX(100%)', transition: { duration: 0.8, ease: "easeInOut" as const } } }} />
                  สำรวจแผน 4 ปี 
                  <motion.div variants={{ hover: { x: 4 } }} transition={{ type: "spring", stiffness: 300 }}><ArrowRight size={18} /></motion.div>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.05)' }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block', borderRadius: '999px' }}>
                <Link to="/courses" className="secondary-button" style={{ textDecoration: 'none', fontSize: '1rem', padding: '12px 24px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Search size={18} /> หาวิชาเรียน
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.05)' }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block', borderRadius: '999px' }}>
                <Link to="/tools-sources" className="secondary-button" style={{ textDecoration: 'none', fontSize: '1rem', padding: '12px 24px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass size={18} /> ทักษะนอกห้องเรียน
                </Link>
              </motion.div>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>138</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>หน่วยกิตทั้งหมด</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>17</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>เส้นทางวิชาตัวต่อ</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>6</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>สายอาชีพหลัก</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <Constellation />
        </div>
      </section>

      {/* 2. Journey Strip */}
      <JourneyStrip />

      {/* 3. Onboarding Flow */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} style={{ marginBottom: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(123, 97, 255, 0.1)', color: 'var(--violet)', borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '16px' }}>เริ่มต้นจากไหนดี</div>
          <h2 style={{ fontSize: '2.4rem', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>ควรเริ่มอ่านตรงไหน?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem' }}>4 ขั้นตอนทำความเข้าใจหลักสูตร ฉบับรวบรัด</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {[
            { step: 1, title: 'ดูภาพรวม 4 ปี', desc: 'เห็นภาพรวมว่าแต่ละเทอมต้องเรียนอะไรบ้าง', icon: Map, link: '/visual-maps', color: 'var(--primary)', bg: 'rgba(79, 124, 255, 0.1)' },
            { step: 2, title: 'เช็กวิชาตัวต่อ', desc: 'วางแผนไม่ให้ติดแหงกกับวิชา prerequisite', icon: Network, link: '/dependency-graph', color: 'var(--violet)', bg: 'rgba(123, 97, 255, 0.1)' },
            { step: 3, title: 'เลือกสายที่อยากลอง', desc: 'ค้นหาแนวทางอาชีพที่ใช่จาก 6 สายหลัก', icon: Route, link: '/roadmaps', color: 'var(--success)', bg: 'rgba(78, 230, 178, 0.15)' },
            { step: 4, title: 'ตรวจเงื่อนไขก่อนจบ', desc: 'เตรียมตัวให้พร้อมสำหรับการฝึกงานและโปรเจกต์', icon: GraduationCap, link: '/survival-guide', color: 'var(--orange)', bg: 'rgba(255, 158, 87, 0.15)' },
          ].map((item, i) => (
            <motion.div variants={itemVariants} key={i} whileHover={{ y: -5, boxShadow: `0 12px 24px ${item.bg}` }}>
              <Link to={item.link} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                <MotionCard style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', borderTop: `4px solid ${item.color}` }}>
                  <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '4rem', fontWeight: 900, color: item.bg, lineHeight: 1, zIndex: 0 }}>0{item.step}</div>
                  <div style={{ position: 'relative', zIndex: 1, flexGrow: 1, paddingTop: '16px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: item.bg, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px', color: item.color }}>
                      <item.icon size={28} />
                    </div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '1.3rem', fontWeight: 700 }}>{item.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                  <div style={{ position: 'relative', zIndex: 1, marginTop: '32px', display: 'flex', alignItems: 'center', gap: '6px', color: item.color, fontWeight: 700, fontSize: '0.95rem' }}>
                    สำรวจเลย <ChevronRight size={18} />
                  </div>
                </MotionCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 4. Data Visualization Cards */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} style={{ marginBottom: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.4rem', margin: '0 0 16px 0' }}>ข้อมูลเชิงลึก <span className="text-gradient">หลักสูตร</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem' }}>สถิติและข้อมูลที่ช่วยให้คุณวางแผนการเรียนได้ดีขึ้น</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          {/* A. Credit Breakdown */}
          <motion.div variants={itemVariants}>
            <MotionCard style={{ height: '100%', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(238, 242, 255, 0.8))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700 }}><BookOpen size={20}/> สัดส่วนหน่วยกิต</div>
              <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                <svg viewBox="0 0 36 36" width="100%" height="100%" style={{ transform: 'rotate(-90deg)' }}>
                  <motion.circle stroke="var(--cyan)" strokeWidth="4" fill="none" strokeDasharray="21.7 100" cx="18" cy="18" r="16" initial={{ strokeDasharray: "0 100" }} whileInView={{ strokeDasharray: "21.7 100" }} transition={{ duration: 1 }} />
                  <motion.circle stroke="var(--primary)" strokeWidth="4" fill="none" strokeDasharray="73.9 100" strokeDashoffset="-21.7" cx="18" cy="18" r="16" initial={{ strokeDasharray: "0 100" }} whileInView={{ strokeDasharray: "73.9 100" }} transition={{ duration: 1, delay: 0.5 }} />
                  <motion.circle stroke="var(--warning)" strokeWidth="4" fill="none" strokeDasharray="4.3 100" strokeDashoffset="-95.6" cx="18" cy="18" r="16" initial={{ strokeDasharray: "0 100" }} whileInView={{ strokeDasharray: "4.3 100" }} transition={{ duration: 1, delay: 1 }} />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 800, fontSize: '1.4rem' }}>138</div>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)' }}></div> ศึกษาทั่วไป (30)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }}></div> วิชาเฉพาะ (102)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }}></div> เลือกเสรี (6)</span>
              </div>
            </MotionCard>
          </motion.div>

          {/* B. Study Load Trend */}
          <motion.div variants={itemVariants}>
            <MotionCard style={{ height: '100%', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(243, 232, 255, 0.8))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--violet)', fontWeight: 700 }}><Activity size={20}/> ความเข้มข้นของเนื้อหา</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <svg viewBox="0 0 100 50" width="100%" height="80px" style={{ overflow: 'visible' }}>
                  <motion.path d="M0,45 L25,35 L50,15 L75,10 L100,25 L100,50 L0,50 Z" fill="rgba(123, 97, 255, 0.15)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} />
                  <motion.path d="M0,45 L25,35 L50,15 L75,10 L100,25" fill="none" stroke="var(--violet)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" as const }} />
                  <circle cx="25" cy="35" r="3" fill="var(--violet)" />
                  <circle cx="50" cy="15" r="3" fill="var(--violet)" />
                  <circle cx="75" cy="10" r="3" fill="var(--violet)" />
                  <circle cx="100" cy="25" r="3" fill="var(--violet)" />
                </svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                <span>ปี 1</span><span>ปี 2</span><span>ปี 3</span><span>ปี 4</span>
              </div>
            </MotionCard>
          </motion.div>

          {/* C. Career Radar / Bars */}
          <motion.div variants={itemVariants}>
            <MotionCard style={{ height: '100%', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 700 }}><Briefcase size={20}/> ทักษะที่ใช้บ่อยในสายงาน</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
                {[
                  { label: 'Software Eng.', val: '90%', color: 'var(--primary)' },
                  { label: 'AI/Data', val: '80%', color: 'var(--cyan)' },
                  { label: 'Hardware', val: '75%', color: 'var(--violet)' },
                  { label: 'Network', val: '65%', color: 'var(--orange)' },
                ].map((skill, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '80px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{skill.label}</span>
                    <div style={{ flex: 1, background: 'var(--surface-muted)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: skill.val }} transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" as const }} style={{ height: '100%', background: skill.color, borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </MotionCard>
          </motion.div>

          {/* D. Risk Courses */}
          <motion.div variants={itemVariants}>
            <MotionCard style={{ height: '100%', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #f43f5e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: 700 }}><AlertTriangle size={20}/> วิชาปราบเซียน (ต้องระวัง)</div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>วิชาที่สถิติการดรอป/F สูง ควรให้เวลาอ่านหนังสือมากเป็นพิเศษ</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#f43f5e' }}>
                  <span>Calculus 1-3</span>
                  <span style={{ display: 'flex', gap: '2px' }}>•••</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#ea580c' }}>
                  <span>Physics 1-2</span>
                  <span style={{ display: 'flex', gap: '2px' }}>••</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(123, 97, 255, 0.1)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--violet)' }}>
                  <span>Data Struct & Algo</span>
                  <span style={{ display: 'flex', gap: '2px' }}>•••</span>
                </div>
              </div>
            </MotionCard>
          </motion.div>

        </div>
      </motion.section>

      {/* 5. Mini Prerequisite Preview */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} style={{ marginBottom: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.4rem', margin: '0 0 16px 0' }}>วิชาตัวต่อ <span className="text-gradient-violet">ที่ควรรู้</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem' }}>ตัวอย่างสายวิชาต่อเนื่องที่ต้องวางแผนให้ดี เพราะถ้าตก 1 ตัว จะเรียนตัวถัดไปไม่ได้</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <motion.div variants={itemVariants} whileHover="hover" initial="initial">
            <MotionCard style={{ padding: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ marginBottom: '24px', fontWeight: 700, color: 'var(--text-muted)' }}>สายคณิตศาสตร์</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ padding: '8px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}>Calc 1</div>
                <div style={{ flex: 1, height: '2px', background: 'var(--border)', margin: '0 8px', position: 'relative' }}>
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--cyan)', transformOrigin: 'left' }} variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.4 }} />
                </div>
                <div style={{ padding: '8px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}>Calc 2</div>
                <div style={{ flex: 1, height: '2px', background: 'var(--border)', margin: '0 8px', position: 'relative' }}>
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--cyan)', transformOrigin: 'left' }} variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.4, delay: 0.2 }} />
                </div>
                <div style={{ padding: '8px 16px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}>Calc 3</div>
              </div>
            </MotionCard>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover" initial="initial">
            <MotionCard style={{ padding: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ marginBottom: '24px', fontWeight: 700, color: 'var(--text-muted)' }}>สายโปรแกรมมิ่ง</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ padding: '8px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}>Prog 1</div>
                <div style={{ flex: 1, height: '2px', background: 'var(--border)', margin: '0 8px', position: 'relative' }}>
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--primary)', transformOrigin: 'left' }} variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.4 }} />
                </div>
                <div style={{ padding: '8px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}>Prog 2</div>
                <div style={{ flex: 1, height: '2px', background: 'var(--border)', margin: '0 8px', position: 'relative' }}>
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--primary)', transformOrigin: 'left' }} variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.4, delay: 0.2 }} />
                </div>
                <div style={{ padding: '8px 16px', background: 'rgba(79, 124, 255, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}>Data Struct</div>
              </div>
            </MotionCard>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover" initial="initial">
            <MotionCard style={{ padding: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ marginBottom: '24px', fontWeight: 700, color: 'var(--text-muted)' }}>สายฮาร์ดแวร์</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ padding: '8px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}>Logic</div>
                <div style={{ flex: 1, height: '2px', background: 'var(--border)', margin: '0 8px', position: 'relative' }}>
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--violet)', transformOrigin: 'left' }} variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.4 }} />
                </div>
                <div style={{ padding: '8px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}>Embed 1</div>
                <div style={{ flex: 1, height: '2px', background: 'var(--border)', margin: '0 8px', position: 'relative' }}>
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--violet)', transformOrigin: 'left' }} variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.4, delay: 0.2 }} />
                </div>
                <div style={{ padding: '8px 16px', background: 'rgba(123, 97, 255, 0.1)', border: '1px solid var(--violet)', color: 'var(--violet)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}>Embed 2</div>
              </div>
            </MotionCard>
          </motion.div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
           <Link to="/dependency-graph" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--violet)', fontWeight: 700, textDecoration: 'none' }}>ดูแผนภาพวิชาตัวต่อทั้งหมด <ArrowRight size={16} /></Link>
        </div>
      </motion.section>

      {/* 6. Course Search Section */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <MotionCard style={{ padding: '64px 40px', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary), var(--violet))', color: 'white', border: 'none', boxShadow: '0 20px 40px rgba(123, 97, 255, 0.2)' }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 16px 0', color: 'white', fontWeight: 800 }}>ค้นหารายวิชา</h2>
          <p style={{ fontSize: '1.15rem', margin: '0 auto 40px auto', maxWidth: '600px', opacity: 0.9, lineHeight: 1.6 }}>
            พิมพ์รหัสวิชา หรือคีย์เวิร์ดที่สนใจ เช่น แคลคูลัส, Database, 305121
          </p>
          <form onSubmit={handleSearch} style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flexGrow: 1, minWidth: '300px' }}>
                <Search style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: isSearchFocused ? 'var(--primary)' : 'var(--text-muted)', zIndex: 1, transition: 'color 0.3s' }} size={24} />
                
                <AnimatePresence mode="wait">
                  {!searchQuery && !isSearchFocused && (
                    <motion.div 
                      key={placeholderIdx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      style={{ position: 'absolute', left: '60px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.15rem', pointerEvents: 'none' }}
                    >
                      ค้นหา "{placeholders[placeholderIdx]}"...
                    </motion.div>
                  )}
                </AnimatePresence>

                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  style={{ width: '100%', padding: '20px 20px 20px 60px', fontSize: '1.15rem', borderRadius: '999px', border: isSearchFocused ? '2px solid var(--primary)' : '2px solid transparent', outline: 'none', boxShadow: isSearchFocused ? '0 0 0 4px rgba(79, 124, 255, 0.2)' : '0 8px 30px rgba(0,0,0,0.15)', color: 'var(--text)', background: 'white', transition: 'all 0.3s' }} 
                />
              </div>
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }} whileTap={{ scale: 0.95 }} type="submit" style={{ padding: '16px 40px', borderRadius: '999px', border: 'none', background: 'var(--text)', color: 'white', fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer', transition: 'box-shadow 0.3s' }}>
                ค้นหาเลย
              </motion.button>
            </div>
            
            {/* Suggestion Chips */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
              {['ปี 1', 'วิชาเลือก', 'AI', 'Network'].map((chip) => (
                <button 
                  key={chip} 
                  type="button"
                  onClick={() => setSearchQuery(chip)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '6px 16px', borderRadius: '999px', fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                >
                  {chip}
                </button>
              ))}
            </div>
          </form>
        </MotionCard>
      </motion.section>

    </div>
  );
}
