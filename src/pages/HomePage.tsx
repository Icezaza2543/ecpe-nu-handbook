import { Link } from 'react-router-dom';
import { ArrowRight, Map, Route, Search, GraduationCap, ChevronRight, Network, Compass } from 'lucide-react';
import { MotionCard } from '../components/common/MotionCard';
import { useCourseModal } from '../components/common/CourseModalProvider';
import { useState, useEffect, lazy, Suspense } from 'react';
import type { CourseIndex } from '../utils/courseIndex';
import { motion, AnimatePresence } from 'framer-motion';




const HeroCurriculumOrbit3D = lazy(() => import('../components/home/HeroCurriculumOrbit3D'));
import { HeroConstellationFallback } from '../components/home/HeroConstellationFallback';
import { HomeInsightDataVizSection } from '../components/home/HomeInsightDataVizSection';


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
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth > 768);
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);
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
      <section style={{ 
        position: 'relative', 
        minHeight: isDesktop ? '720px' : 'auto', 
        display: 'flex', 
        flexDirection: isDesktop ? 'row' : 'column',
        alignItems: 'center', 
        marginBottom: '64px', 
        paddingTop: isDesktop ? 0 : '40px',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '10%', left: '30%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(79, 124, 255, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: '40%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(123, 97, 255, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(30px)', zIndex: 0 }}></div>

        {/* 3D Visual Layer - Placed as absolute background layer but visually overlapping */}
        <div style={{ 
          position: isDesktop ? 'absolute' : 'relative', 
          right: isDesktop ? '-5%' : '0', 
          top: isDesktop ? '50%' : 'auto', 
          transform: isDesktop ? 'translateY(-50%)' : 'none', 
          width: isDesktop ? '55vw' : '100%', 
          minWidth: '300px', 
          maxWidth: '800px', 
          height: isDesktop ? '600px' : '400px', 
          zIndex: 1, 
          pointerEvents: 'auto',
          marginTop: isDesktop ? 0 : '40px'
        }}>
          {isDesktop ? (
            <Suspense fallback={<HeroConstellationFallback />}>
              <HeroCurriculumOrbit3D />
            </Suspense>
          ) : (
            <HeroConstellationFallback />
          )}
        </div>

        {/* Text Layer - Front */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '580px', paddingRight: isDesktop ? '40px' : 0 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '20px', color: 'var(--text)', letterSpacing: '-0.03em' }}>
              <span className="text-gradient">ECPE NU</span><br/>
              Freshman<br/>Handbook
            </h1>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '20px', maxWidth: '480px' }}>
              คู่มือเอาตัวรอดวิศวกรรมคอมพิวเตอร์แบบ <span className="text-gradient-cyan" style={{fontWeight: 700}}>Interactive</span> 
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '520px' }}>
              นี่ไม่ใช่คู่มือวิชาการน่าเบื่อ! แต่เป็นแผนที่พาน้อง ๆ ตะลุย 4 ปีในมหาลัย ให้เห็นภาพรวมว่าต้องเจอวิชาอะไร วางแผนเทอมไหน และเลือกสายอาชีพที่ใช่
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px', alignItems: 'center' }}>
              <motion.div whileHover="hover" whileTap={{ scale: 0.95 }} style={{ display: 'inline-flex' }}>
                <Link to="/visual-maps" className="primary-button" style={{ textDecoration: 'none', fontSize: '1rem', fontWeight: 600, height: '48px', padding: '0 24px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 24px rgba(79, 124, 255, 0.3)', boxSizing: 'border-box' }}>
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)', transform: 'translateX(-100%)' }} variants={{ hover: { transform: 'translateX(100%)', transition: { duration: 0.8, ease: "easeInOut" as const } } }} />
                  สำรวจแผน 4 ปี 
                  <motion.div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} variants={{ hover: { x: 4 } }} transition={{ type: "spring", stiffness: 300 }}><ArrowRight size={18} /></motion.div>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.05)' }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-flex', borderRadius: '999px' }}>
                <Link to="/courses" className="secondary-button" style={{ textDecoration: 'none', fontSize: '1rem', fontWeight: 600, height: '48px', padding: '0 24px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxSizing: 'border-box' }}>
                  <Search size={18} /> หาวิชาเรียน
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.05)' }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-flex', borderRadius: '999px' }}>
                <Link to="/tools-sources" className="secondary-button" style={{ textDecoration: 'none', fontSize: '1rem', fontWeight: 600, height: '48px', padding: '0 24px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxSizing: 'border-box' }}>
                  <Compass size={18} /> ทักษะนอกห้องเรียน
                </Link>
              </motion.div>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>138</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>หน่วยกิตทั้งหมด</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>17</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>เส้นทางวิชาตัวต่อ</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>6</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>สายอาชีพหลัก</span>
              </div>
            </div>
          </motion.div>
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

      {/* 4 & 5. Data Visualization Cards (Combined Insights) */}
      <HomeInsightDataVizSection />

      {/* 6. Course Search Section */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <MotionCard style={{ padding: '64px 40px', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary), var(--violet))', color: 'white', border: 'none', boxShadow: '0 20px 40px rgba(123, 97, 255, 0.2)' }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 16px 0', color: 'white', fontWeight: 800 }}>ค้นหารายวิชา</h2>
          <p style={{ fontSize: '1.15rem', margin: '0 auto 40px auto', maxWidth: '600px', opacity: 0.9, lineHeight: 1.6 }}>
            พิมพ์รหัสวิชา หรือคีย์เวิร์ดที่สนใจ เช่น แคลคูลัส, Database, 305121
          </p>
          <form onSubmit={handleSearch} style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ position: 'relative', flexGrow: 1, minWidth: '300px' }}>
                <Search style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: isSearchFocused ? 'var(--primary)' : 'var(--text-muted)', zIndex: 1, transition: 'color 0.3s' }} size={24} />
                
                <AnimatePresence mode="wait">
                  {!searchQuery && !isSearchFocused && (
                    <motion.div 
                      key={placeholderIdx}
                      initial={{ opacity: 0, y: "calc(-50% + 5px)" }}
                      animate={{ opacity: 1, y: "-50%" }}
                      exit={{ opacity: 0, y: "calc(-50% - 5px)" }}
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
                  style={{ width: '100%', height: '64px', padding: '0 20px 0 60px', fontSize: '1.15rem', borderRadius: '999px', border: isSearchFocused ? '2px solid var(--primary)' : '2px solid transparent', outline: 'none', boxShadow: isSearchFocused ? '0 0 0 4px rgba(79, 124, 255, 0.2)' : '0 8px 30px rgba(0,0,0,0.15)', color: 'var(--text)', background: 'white', transition: 'all 0.3s', boxSizing: 'border-box' }} 
                />
              </div>
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }} whileTap={{ scale: 0.95 }} type="submit" style={{ height: '64px', padding: '0 40px', borderRadius: '999px', border: 'none', background: 'var(--text)', color: 'white', fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer', transition: 'box-shadow 0.3s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
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
