import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  Compass,
  Cpu,
  GraduationCap,
  Map,
  Network,
  Route,
  Search,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { MotionCard } from '../components/common/MotionCard';
import { HomeInsightDataVizSection } from '../components/home/HomeInsightDataVizSection';
import { AnimatedDependencyMap } from '../components/home/AnimatedDependencyMap';
import { useCourseModal } from '../components/common/CourseModalProvider';
import type { CourseIndex } from '../utils/courseIndex';

const heroMetrics = [
  { value: '138', label: 'หน่วยกิตที่ต้องวางแผน' },
  { value: '17', label: 'วิชาบังคับก่อนที่กระทบแผน' },
  { value: '6', label: 'สายอาชีพให้ลองสำรวจ' },
  { value: '135', label: 'tools และ sources นอกห้องเรียน' },
];

const quickStart = [
  { step: '01', title: 'ดูภาพรวม 4 ปี', desc: 'เห็นภาพรวมว่าแต่ละเทอมต้องเรียนอะไรบ้าง', icon: Map, link: '/visual-maps', color: 'var(--primary)' },
  { step: '02', title: 'เช็กวิชาตัวต่อ', desc: 'วางแผนไม่ให้ติดแหงกกับวิชา prerequisite', icon: Network, link: '/dependency-graph', color: 'var(--cyan)' },
  { step: '03', title: 'เลือกสายที่อยากลอง', desc: 'ค้นหาแนวทางอาชีพที่ใช่จาก 6 สายหลัก', icon: Route, link: '/roadmaps', color: 'var(--success)' },
  { step: '04', title: 'ตรวจเงื่อนไขก่อนจบ', desc: 'เตรียมตัวให้พร้อมสำหรับการฝึกงานและโปรเจกต์', icon: GraduationCap, link: '/survival-guide', color: 'var(--orange)' },
];

function MissionGraphPanel() {
  return (
    <aside className="mission-panel" aria-label="Handbook preview">
      <div className="mission-panel__header">
        <div>
          <h2 className="mission-panel__title">Handbook Preview</h2>
          <p className="mission-panel__meta">course-map / prerequisite-risk / career-output</p>
        </div>
        <span className="mission-panel__status">READY</span>
      </div>

      <AnimatedDependencyMap />
    </aside>
  );
}

function JourneyStrip() {
  const years = [
    { year: 'YEAR 1', desc: 'ปูพื้นฐาน', icon: BookOpen },
    { year: 'YEAR 2', desc: 'วิชาหนักเริ่มมา', icon: Code2 },
    { year: 'YEAR 3', desc: 'เริ่มเลือกทาง', icon: Cpu },
    { year: 'YEAR 4', desc: 'โปรเจกต์ / ฝึกงาน', icon: BriefcaseBusiness },
  ];

  return (
    <section className="journey-strip" aria-label="Four-year learning journey">
      <div className="journey-rail">
        {years.map((item) => (
          <div className="journey-card" key={item.year}>
            <div className="journey-icon">
              <item.icon size={22} />
            </div>
            <div>
              <strong>{item.year}</strong>
              <span>{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomePage({ courseIndex }: { courseIndex: CourseIndex }) {
  const { openCourse } = useCourseModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const placeholders = ['305121', 'แคลคูลัส', 'Machine Learning', 'Digital Logic'];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const results = courseIndex.searchCourses(searchQuery, 1);
    if (results.length > 0) {
      openCourse(results[0].course);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  };

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <h1>
            ECPE NU
            <span className="text-gradient">Handbook</span>
          </h1>
          <p className="home-hero__subtitle">
            วางแผนการเรียนแบบเห็นภาพจริง เช็กวิชาเรียน พร้อมเลือกสายงานในอนาคต
          </p>

          <div className="hero-actions">
            <Link to="/visual-maps" className="primary-button">
              <Map size={18} />
              เปิดแผน 4 ปี
              <ArrowRight size={18} />
            </Link>
            <Link to="/dependency-graph" className="secondary-button">
              <Network size={18} />
              เช็กวิชาตัวต่อ
            </Link>
            <Link to="/tools-sources" className="secondary-button">
              <Compass size={18} />
              Tools นอกห้องเรียน
            </Link>
          </div>

          <div className="hero-metrics">
            {heroMetrics.map((metric) => (
              <div className="hero-metric" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <MissionGraphPanel />
      </section>

      <JourneyStrip />

      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="section-eyebrow">START PATH</span>
          <h2 style={{ fontSize: '34px', margin: '0 0 10px 0' }}>ควรเริ่มอ่านตรงไหน?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '17px', margin: 0 }}>4 ขั้นตอนทำความเข้าใจหลักสูตร ฉบับรวบรัด</p>
        </div>

        <div className="handbook-grid">
          {quickStart.map((item) => (
            <motion.div variants={itemVariants} key={item.step}>
              <Link to={item.link} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                <MotionCard style={{ height: '100%', display: 'grid', gap: '18px', borderTop: `3px solid ${item.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius)', background: 'var(--surface-muted)', display: 'grid', placeItems: 'center', color: item.color }}>
                      <item.icon size={23} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', color: item.color, fontWeight: 800 }}>{item.step}</span>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{item.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: item.color, fontWeight: 700, fontSize: '14px' }}>
                    สำรวจเลย <ArrowRight size={16} />
                  </div>
                </MotionCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <HomeInsightDataVizSection />

      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <MotionCard style={{ padding: '48px 32px', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary), #0f766e)', color: 'white', border: 'none', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontSize: '36px', margin: '0 0 14px 0', color: 'white', fontWeight: 800 }}>ค้นหารายวิชา</h2>
          <p style={{ fontSize: '17px', margin: '0 auto 32px auto', maxWidth: '620px', opacity: 0.92, lineHeight: 1.65 }}>
            พิมพ์รหัสวิชา หรือคีย์เวิร์ดที่สนใจ เช่น แคลคูลัส, Database, 305121
          </p>
          <form onSubmit={handleSearch} style={{ maxWidth: '760px', margin: '0 auto', display: 'grid', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ position: 'relative', flexGrow: 1, minWidth: '280px' }}>
                <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: isSearchFocused ? 'var(--primary)' : 'var(--text-muted)', zIndex: 1, transition: 'color 0.25s' }} size={22} />

                <AnimatePresence mode="wait">
                  {!searchQuery && !isSearchFocused && (
                    <motion.div
                      key={placeholderIdx}
                      initial={{ opacity: 0, y: 'calc(-50% + 5px)' }}
                      animate={{ opacity: 1, y: '-50%' }}
                      exit={{ opacity: 0, y: 'calc(-50% - 5px)' }}
                      transition={{ duration: 0.25 }}
                      style={{ position: 'absolute', left: '56px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '16px', pointerEvents: 'none' }}
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
                  style={{ width: '100%', height: '58px', padding: '0 20px 0 56px', fontSize: '16px', borderRadius: 'var(--radius)', border: isSearchFocused ? '2px solid var(--cyan)' : '2px solid transparent', outline: 'none', boxShadow: isSearchFocused ? '0 0 0 4px rgba(8, 145, 178, 0.2)' : '0 8px 24px rgba(0,0,0,0.12)', color: 'var(--text)', background: 'white', transition: 'all 0.25s', boxSizing: 'border-box' }}
                />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={{ height: '58px', padding: '0 28px', borderRadius: 'var(--radius)', border: 'none', background: 'var(--text)', color: 'white', fontSize: '16px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
                ค้นหาเลย
              </motion.button>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
              {['ปี 1', 'วิชาเลือก', 'AI', 'Network'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSearchQuery(chip)}
                  style={{ background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.28)', color: 'white', padding: '7px 13px', borderRadius: 'var(--radius)', fontSize: '13px', cursor: 'pointer' }}
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
