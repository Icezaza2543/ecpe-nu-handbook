import { survivalGuide } from '../data/survivalGuide';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CourseIndex } from '../utils/courseIndex';
import { CourseChip } from '../components/common/CourseChip';
import { SectionHeader } from '../components/common/SectionHeader';

interface SurvivalItem {
  id?: string;
  title?: string;
  phase?: string;
  theme?: string;
  month?: string;
  description?: string;
  mainGoal?: string;
  actions?: Array<string | { id?: string; text?: string }>;
  checklist?: string[];
  tips?: string[];
  coursesToWatch?: string[];
  redFlags?: string[];
  portfolioTasks?: string[];
  seniorTips?: string[];
  [key: string]: unknown;
}

function getItems(): SurvivalItem[] {
  if (Array.isArray(survivalGuide)) return survivalGuide as SurvivalItem[];
  const guide = survivalGuide as { periods?: SurvivalItem[]; items?: SurvivalItem[]; months?: SurvivalItem[]; timeline?: SurvivalItem[] };
  return guide.periods || guide.items || guide.months || guide.timeline || [];
}

function getActionText(item: string | { id?: string; text?: string }): string {
  return typeof item === 'string' ? item : item.text || item.id || '';
}

function getChecklist(item: SurvivalItem): string[] {
  return [
    ...(item.actions || []).map(getActionText),
    ...(item.checklist || []),
    ...(item.portfolioTasks || []),
  ].filter(Boolean);
}

export function SurvivalGuidePage({ courseIndex }: { courseIndex: CourseIndex }) {
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>('ecpe-v2-survival-checklist', {});
  const items = getItems();

  return (
    <div className="page" style={{ paddingBottom: '100px' }}>
      <SectionHeader 
        title="คัมภีร์เอาตัวรอด (Survival Guide)" 
        description="คู่มือเอาชีวิตรอดในแต่ละปีการศึกษา รวบรวมข้อมูลสำคัญที่ต้องรู้เพื่อไม่ให้พลาด"
        variant="hero"
        className="survival-hero"
      />
      <div className="survival-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', paddingLeft: '24px' }}>
        {/* Vertical line for timeline */}
        <div style={{ position: 'absolute', left: '46px', top: '24px', bottom: '24px', width: '2px', background: 'var(--border)', zIndex: 0 }}></div>
        
        {items.map((item, index) => (
          <article key={item.id || item.title || index} className="survival-card" style={{ position: 'relative', zIndex: 1, marginLeft: '48px', background: 'var(--surface)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <span className="timeline-index" style={{ position: 'absolute', left: '-66px', top: '24px', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '1.2rem', boxShadow: '0 0 0 8px var(--bg)' }}>{index + 1}</span>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.6rem', color: 'var(--text)' }}>{item.title || item.month || item.phase}</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '1.1rem', color: 'var(--text-muted)' }}>{item.description || item.mainGoal || item.theme}</p>
            {item.coursesToWatch?.length ? (
              <div className="chip-grid compact" style={{ marginBottom: '24px' }}>
                {item.coursesToWatch.map((ref) => (
                  <CourseChip key={ref} course={courseIndex.findCourse(ref)} courseRef={ref} />
                ))}
              </div>
            ) : null}
            <div className="checklist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {getChecklist(item).slice(0, 6).map((check) => (
                <label key={check} className="check-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: checked[check] ? 'rgba(78, 230, 178, 0.1)' : 'white', padding: '16px', borderRadius: '16px', border: checked[check] ? '1px solid var(--success)' : '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(checked[check])}
                    onChange={(event) => setChecked({ ...checked, [check]: event.target.checked })}
                    style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--success)', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: '0.95rem', color: checked[check] ? 'var(--text)' : 'var(--text-muted)', textDecoration: checked[check] ? 'line-through' : 'none' }}>{check}</span>
                </label>
              ))}
            </div>
            {item.redFlags?.length ? (
              <div style={{ background: 'rgba(255, 90, 121, 0.05)', border: '1px solid rgba(255, 90, 121, 0.2)', padding: '20px', borderRadius: '16px' }}>
                <strong style={{ color: 'var(--danger)', display: 'block', marginBottom: '8px' }}>⚠️ ข้อควรระวัง (Red Flags)</strong>
                <ul className="compact-list" style={{ margin: 0, paddingLeft: '20px', color: '#be123c' }}>{item.redFlags.slice(0, 3).map((flag) => <li key={flag} style={{ marginBottom: '4px' }}>{flag}</li>)}</ul>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
