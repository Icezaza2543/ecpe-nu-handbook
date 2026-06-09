import { useState } from 'react';
import { roadmaps } from '../data/roadmaps';
import type { RoadmapItem } from '../types/roadmap';
import type { CourseIndex } from '../utils/courseIndex';
import { CourseChip } from '../components/common/CourseChip';
import { SectionHeader } from '../components/common/SectionHeader';
import { MotionCard } from '../components/common/MotionCard';
import { CheckCircle2, AlertTriangle, Wrench, Terminal, Target, BookOpen, Compass, Check } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

function toCourseRef(item: NonNullable<RoadmapItem['recommendedCourses']>[number]): string {
  return typeof item === 'string' ? item : item.courseId || item.code || item.id || item.name || item.title || '';
}

function getRoleColor(id: string) {
  if (id.includes('software')) return '#3b82f6';
  if (id.includes('ai') || id.includes('data')) return '#8b5cf6';
  if (id.includes('embedded') || id.includes('iot')) return '#10b981';
  if (id.includes('network') || id.includes('cloud')) return '#06b6d4';
  if (id.includes('cyber')) return '#f59e0b';
  if (id.includes('robotic')) return '#ef4444';
  if (id.includes('graphic') || id.includes('game') || id.includes('vision')) return '#ec4899';
  if (id.includes('research')) return '#6366f1';
  if (id.includes('entrepreneur') || id.includes('management')) return '#eab308';
  return 'var(--primary)';
}

function getRoleTagline(id: string) {
  if (id.includes('software')) return 'สายสร้างระบบและแอปที่คนใช้จริง';
  if (id.includes('ai') || id.includes('data')) return 'สายเปลี่ยนข้อมูลให้กลายเป็นการตัดสินใจ';
  if (id.includes('embedded') || id.includes('iot')) return 'สายเชื่อมโลกซอฟต์แวร์กับฮาร์ดแวร์';
  if (id.includes('network') || id.includes('cloud')) return 'สายดูแลระบบให้เชื่อมต่อและ scale ได้';
  if (id.includes('cyber')) return 'สายป้องกันระบบด้วยจริยธรรม';
  if (id.includes('robotic')) return 'สายทำให้เครื่องจักรตัดสินใจได้';
  if (id.includes('graphic') || id.includes('game')) return 'สายภาพ เกม และการมองเห็นของคอมพิวเตอร์';
  if (id.includes('research')) return 'สายค้นคว้าและต่อยอดองค์ความรู้';
  if (id.includes('entrepreneur')) return 'สายเปลี่ยนเทคโนโลยีเป็นธุรกิจ';
  return 'สายแห่งอนาคต';
}

function getRoleKeywords(id: string) {
  if (id.includes('software')) return ['Web/App', 'Backend', 'System Design'];
  if (id.includes('ai') || id.includes('data')) return ['Machine Learning', 'Statistics', 'Data Pipeline'];
  if (id.includes('embedded') || id.includes('iot')) return ['Hardware', 'Sensors', 'Firmware'];
  if (id.includes('network') || id.includes('cloud')) return ['Infrastructure', 'Scaling', 'DevOps'];
  if (id.includes('cyber')) return ['Security', 'Ethical Hacking', 'Risk Management'];
  if (id.includes('robotic')) return ['Control', 'Automation', 'Sensors'];
  if (id.includes('graphic') || id.includes('game')) return ['Computer Vision', 'Rendering', 'Interactive'];
  if (id.includes('research')) return ['Paper', 'Algorithms', 'Innovation'];
  if (id.includes('entrepreneur')) return ['Business', 'Product', 'Agile'];
  return ['Tech', 'Coding', 'Logic'];
}

export function CareerRoadmapsPage({ courseIndex }: { courseIndex: CourseIndex }) {
  const items = roadmaps as unknown as RoadmapItem[];
  const [activeId, setActiveId] = useState(items[0]?.id || '');
  const active = items.find((item) => item.id === activeId) || items[0];
  const accentColor = getRoleColor(String(active.id));
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>('ecpe-v2-career-roadmap-checklist', {});

  const renderDifficultyBadge = (diff: string) => {
    const colors: Record<string, string> = {
      'beginner': 'var(--success)',
      'intermediate': 'var(--warning)',
      'advanced': 'var(--danger)'
    };
    return <span style={{ backgroundColor: colors[diff] || 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{diff}</span>
  }

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16),
          g = parseInt(hex.slice(3, 5), 16),
          b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="page" style={{ paddingBottom: '100px' }}>
      <style>{`
        .career-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          margin-top: 24px;
        }
        @media (min-width: 1024px) {
          .career-layout {
            grid-template-columns: 320px 1fr;
          }
        }
        .class-card {
          padding: 16px;
          border-radius: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }
        .class-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .class-card.active {
          transform: scale(1.02);
          border-color: transparent;
        }
        .class-card-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .class-card-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .skill-tree-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: relative;
          padding-left: 20px;
        }
        .skill-tree-container::before {
          content: '';
          position: absolute;
          top: 10px;
          bottom: 10px;
          left: 4px;
          width: 2px;
          background: linear-gradient(to bottom, var(--primary) 0%, transparent 100%);
          opacity: 0.2;
        }
        .skill-tree-node {
          position: relative;
          padding-left: 24px;
        }
        .skill-tree-node::before {
          content: '';
          position: absolute;
          left: -20px;
          top: 8px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--surface);
          border: 2px solid;
          z-index: 2;
        }
      `}</style>

      <SectionHeader 
        title="คลาสอาชีพ" 
        description="เลือกสายที่ชอบ วางแผน skill tree ให้พร้อมลุยตลาดงานจริง" 
        bgImage="https://images.unsplash.com/photo-1507238691740-14c015b63cf5?auto=format&fit=crop&w=1200&q=80"
      />

      <div className="career-layout">
        
        {/* 1. Class Selection Area */}
        <aside>
          <div style={{ position: 'sticky', top: '24px' }}>
            <div style={{ marginBottom: '16px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SELECT YOUR CLASS</div>
            <div className="class-card-grid">
              {items.map((item) => {
                const isSelected = active?.id === item.id;
                const color = getRoleColor(String(item.id));
                return (
                  <button 
                    type="button" 
                    key={item.id} 
                    className={`class-card ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveId(item.id || '')}
                    style={{ 
                      boxShadow: isSelected ? `0 8px 24px ${hexToRgba(color, 0.25)}` : 'none',
                      background: isSelected ? `linear-gradient(135deg, var(--surface), ${hexToRgba(color, 0.05)})` : 'var(--surface)',
                      border: isSelected ? `1px solid ${hexToRgba(color, 0.5)}` : '1px solid var(--border)'
                    }}
                  >
                    {isSelected && (
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: color }}></div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '2rem', filter: isSelected ? `drop-shadow(0 0 8px ${hexToRgba(color, 0.6)})` : 'none', transition: 'filter 0.3s' }}>{item.emoji}</div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isSelected ? color : 'var(--text)' }}>{String(item.titleTh || item.title || item.id || '')}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{getRoleTagline(String(item.id))}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* 2. Detail Panel */}
        {active ? (
          <main style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
            {/* Hero Panel */}
            <div style={{ position: 'relative', background: 'var(--surface)', borderRadius: '32px', padding: '48px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: `0 20px 40px ${hexToRgba(accentColor, 0.08)}` }}>
              <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: `radial-gradient(circle, ${hexToRgba(accentColor, 0.2)} 0%, transparent 70%)`, filter: 'blur(30px)' }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: hexToRgba(accentColor, 0.1), color: accentColor, borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '24px' }}>
                  CLASS PREVIEW
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '16px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  <span style={{ fontSize: '4rem', filter: `drop-shadow(0 8px 16px ${hexToRgba(accentColor, 0.4)})` }}>{active.emoji}</span> 
                  {String(active.titleTh || active.title || '')}
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.7', margin: '0 0 24px 0', maxWidth: '800px' }}>
                  {String(active.overview || active.description || '')}
                </p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {getRoleKeywords(String(active.id)).map(kw => (
                    <span key={kw} style={{ background: 'var(--bg)', border: `1px solid ${hexToRgba(accentColor, 0.3)}`, color: accentColor, padding: '4px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Safety Warning for Cyber */}
            {String(active.id).includes('cyber') ? (
              <div style={{ background: '#fff1f2', border: '1px solid #fda4af', padding: '24px', borderRadius: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <AlertTriangle size={28} color="#e11d48" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#be123c', fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>ETHICAL HACKING & SAFETY WARNING</strong>
                  <p style={{ margin: 0, color: '#9f1239', fontSize: '1rem', lineHeight: '1.6' }}>
                    การเรียนสาย Cybersecurity ต้องใช้ความรับผิดชอบสูง ห้ามนำทักษะไปโจมตีระบบของผู้อื่นโดยไม่ได้รับอนุญาตเด็ดขาด การทดลองหรือเจาะระบบต้องทำใน Lab หรือสภาพแวดล้อมที่จำลองขึ้นเพื่อการศึกษาเท่านั้น 
                  </p>
                </div>
              </div>
            ) : null}

            {/* Who is this for */}
            {active.whoIsThisFor && active.whoIsThisFor.length > 0 ? (
              <section>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={24} color={accentColor} /> เหมาะกับคนที่...
                </h3>
                <div style={{ background: 'var(--surface)', padding: '24px 32px', borderRadius: '24px', border: '1px solid var(--border)' }}>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {active.whoIsThisFor.map((w: string, i: number) => (
                      <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '1.05rem', color: 'var(--text)' }}>
                        <CheckCircle2 size={20} color={accentColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}

            {/* Core Courses */}
            {active.recommendedCourses && active.recommendedCourses.length > 0 ? (
              <section>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={24} color={accentColor} /> วิชาที่ต้องอัปสกิล (Core Courses)
                </h3>
                <div className="chip-grid" style={{ gap: '12px' }}>
                  {active.recommendedCourses.map((item, index) => {
                    const ref = toCourseRef(item);
                    return <CourseChip key={ref || index} course={courseIndex.findCourse(ref)} courseRef={ref} />;
                  })}
                </div>
              </section>
            ) : null}

            {/* Skill Tree / Path */}
            {active.yearPlan && active.yearPlan.length > 0 ? (
              <section>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass size={24} color={accentColor} /> Skill Tree & Path
                </h3>
                <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '24px', border: '1px solid var(--border)' }}>
                  <div className="skill-tree-container" style={{ '--primary': accentColor } as React.CSSProperties}>
                    {active.yearPlan.map((yp: any, i: number) => (
                      <div key={i} className="skill-tree-node" style={{ borderColor: accentColor }}>
                        <div style={{ background: hexToRgba(accentColor, 0.05), padding: '20px', borderRadius: '16px', border: `1px solid ${hexToRgba(accentColor, 0.2)}` }}>
                          <h4 style={{ margin: '0 0 12px 0', color: accentColor, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: accentColor, color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>Tier {i+1}</span>
                            {yp.title} (ปี {yp.year})
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            <div>
                               <strong style={{ color: 'var(--text)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Focus</strong>
                               <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                                 {yp.focus.map((f: string, j: number) => <li key={j} style={{ marginBottom: '4px' }}>{f}</li>)}
                               </ul>
                            </div>
                            {yp.courses && yp.courses.length > 0 ? (
                              <div>
                                 <strong style={{ color: 'var(--text)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nodes (Courses)</strong>
                                 <div className="chip-grid compact" style={{ marginTop: '8px' }}>
                                   {yp.courses.map((c: string, j: number) => <CourseChip key={j} course={courseIndex.findCourse(c)} courseRef={c} />)}
                                 </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {/* Tools */}
            {active.tools && active.tools.length > 0 ? (
              <section>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={24} color={accentColor} /> อุปกรณ์ประจำอาชีพ (Tools)
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {active.tools.map((t: any, i: number) => (
                    <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <strong style={{ color: 'var(--text)', fontSize: '0.95rem' }}>{t.name}</strong>
                      <span style={{ fontSize: '0.8rem', background: 'var(--bg)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>{t.level.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Project Ideas */}
            {active.projectIdeas?.length ? (
              <section>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={24} color={accentColor} /> Project ที่แนะนำ (Quests)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {active.projectIdeas.map((p: any, i: number) => (
                    <MotionCard key={i} style={{ padding: '24px', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <strong style={{ fontSize: '1.15rem', color: 'var(--text)' }}>{p.title}</strong>
                        {renderDifficultyBadge(p.difficulty)}
                      </div>
                      <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, flexGrow: 1 }}>{p.description}</p>
                      {p.skills && p.skills.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
                           {p.skills.map((s: string, idx: number) => <span key={idx} style={{ background: 'var(--bg)', fontSize: '0.8rem', padding: '4px 8px', borderRadius: '6px', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{s}</span>)}
                        </div>
                      ) : null}
                    </MotionCard>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Preparation Checklists */}
            {active.portfolioChecklist && active.portfolioChecklist.length > 0 ? (
              <section>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={24} color={accentColor} /> Portfolio Checklist
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {active.portfolioChecklist.map((c: string, i: number) => {
                    const checkKey = `${active.id}-port-${i}`;
                    const isChecked = checked[checkKey];
                    return (
                      <label key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: isChecked ? hexToRgba(accentColor, 0.05) : 'var(--surface)', padding: '16px', borderRadius: '16px', border: isChecked ? `1px solid ${hexToRgba(accentColor, 0.3)}` : '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(isChecked)}
                          onChange={(e) => setChecked({ ...checked, [checkKey]: e.target.checked })}
                          style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: accentColor, flexShrink: 0 }}
                        />
                        <span style={{ fontSize: '0.95rem', color: isChecked ? 'var(--text)' : 'var(--text-muted)', textDecoration: isChecked ? 'line-through' : 'none' }}>{c}</span>
                      </label>
                    );
                  })}
                </div>
              </section>
            ) : null}

          </main>
        ) : null}
      </div>
    </div>
  );
}
