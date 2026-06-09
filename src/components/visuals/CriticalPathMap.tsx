import { dependencies } from '../../data/dependencies';
import type { CourseIndex } from '../../utils/courseIndex';
import { CourseChip } from '../common/CourseChip';
import { AlertOctagon, AlertTriangle, ArrowRight } from 'lucide-react';

interface Chain {
  id: string;
  titleTh?: string;
  description?: string;
  seniorWarning?: string;
  dangerLevel?: string;
  nodes?: string[];
}

export function CriticalPathMap({ courseIndex }: { courseIndex: CourseIndex }) {
  const chains = ((dependencies as { chains?: Chain[] }).chains || []).filter((chain) =>
    ['critical', 'high'].includes(chain.dangerLevel || ''),
  );

  return (
    <section className="visual-card" style={{ padding: '32px' }}>
      <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', color: 'var(--danger)' }}>Critical Course Path Map</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem' }}>
        วิชาที่ยากไม่น่ากลัวเท่าวิชาที่มีตัวต่อ เส้นทางเหล่านี้ไม่ควรปล่อยให้หลุด เพราะมักกระทบหลายวิชาต่อเนื่อง ทำให้แผนการเรียนพัง
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {chains.map((chain) => {
          const isCritical = chain.dangerLevel === 'critical';
          const themeColor = isCritical ? '#ef4444' : '#f97316';
          const bgColor = isCritical ? '#fef2f2' : '#fff7ed';
          const borderColor = isCritical ? '#fca5a5' : '#fdba74';

          return (
            <article key={chain.id} style={{ background: bgColor, borderRadius: '24px', padding: '24px', border: `1px solid ${borderColor}`, position: 'relative', boxShadow: `0 8px 24px rgba(${isCritical ? '239, 68, 68' : '249, 115, 22'}, 0.08)`, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(${isCritical ? '239, 68, 68' : '249, 115, 22'}, 0.2)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(${isCritical ? '239, 68, 68' : '249, 115, 22'}, 0.08)`; }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: `radial-gradient(circle, ${themeColor}20 0%, transparent 70%)`, filter: 'blur(20px)', pointerEvents: 'none' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: themeColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isCritical ? <AlertOctagon size={24} /> : <AlertTriangle size={24} />}
                  {chain.titleTh || chain.id}
                </h3>
                <span style={{ background: themeColor, color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Danger: {isCritical ? 'สูงมาก' : 'สูง'}
                </span>
              </div>

              <div style={{ background: 'white', padding: '16px', borderRadius: '16px', border: `1px solid ${borderColor}`, marginBottom: '16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Path</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                  {(chain.nodes || []).map((node, index) => (
                    <div key={`${chain.id}-${node}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CourseChip course={courseIndex.findCourse(node)} courseRef={node} />
                      {index < (chain.nodes?.length || 0) - 1 && (
                        <ArrowRight size={16} color={themeColor} style={{ opacity: 0.6 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: themeColor, marginBottom: '4px' }}>ถ้าพลาด:</div>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.5 }}>
                    {chain.description}
                  </p>
                </div>
                {chain.seniorWarning && (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)', marginBottom: '4px' }}>ควรทำ:</div>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {chain.seniorWarning}
                    </p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
