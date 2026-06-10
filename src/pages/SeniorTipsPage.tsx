import { useMemo, useState } from 'react';
import { seniorTips } from '../data/seniorTips';
import type { CourseIndex } from '../utils/courseIndex';
import { includesNormalized } from '../utils/search';
import { CourseChip } from '../components/common/CourseChip';
import { SearchBox } from '../components/common/SearchBox';
import { SectionHeader } from '../components/common/SectionHeader';

interface SeniorTip {
  id?: string;
  title?: string;
  topic?: string;
  description?: string;
  content?: string;
  tips?: Array<string | SeniorTip>;
  relatedCourses?: string[];
  priority?: string;
}

function getTips(): SeniorTip[] {
  if (Array.isArray(seniorTips)) return seniorTips as SeniorTip[];
  const data = seniorTips as { groups?: SeniorTip[]; tips?: SeniorTip[]; items?: SeniorTip[] };
  if (data.groups?.length) {
    return data.groups.map((group) => ({
      ...group,
      tips: group.tips || [],
      relatedCourses: Array.from(new Set((group.tips || []).flatMap((tip) => (typeof tip === 'string' ? [] : tip.relatedCourses || [])))),
    }));
  }
  return data.tips || data.items || [];
}

function tipText(item: string | SeniorTip): string {
  if (typeof item === 'string') return item;
  return [item.title, item.content || item.description].filter(Boolean).join(': ');
}

export function SeniorTipsPage({ courseIndex }: { courseIndex: CourseIndex }) {
  const [query, setQuery] = useState('');
  const tips = getTips();
  const filtered = useMemo(() => tips.filter((tip) => includesNormalized(`${tip.title} ${tip.topic} ${tip.description}`, query)), [query, tips]);

  return (
    <div className="page" style={{ paddingBottom: '100px' }}>
      <SectionHeader 
        title="คำแนะนำจากรุ่นพี่" 
        description="รวมทริคการเรียน การใช้ชีวิต และการเตรียมตัวทำงานจากรุ่นพี่ที่จบไปแล้ว"
        variant="hero"
      />
      <SearchBox value={query} onChange={setQuery} placeholder="ค้นหา tips เช่น portfolio, ฝึกงาน, โปรเจกต์..." />
      <div className="tips-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {filtered.map((tip, index) => (
          <article key={tip.id || tip.title || index} className="tip-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'linear-gradient(135deg, var(--surface), #fffbeb)', borderTop: '4px solid var(--warning)' }}>
            <span className="senior-badge" style={{ display: 'inline-flex', padding: '6px 12px', background: 'rgba(255, 158, 87, 0.15)', color: '#b45309', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, alignSelf: 'flex-start' }}>💡 Senior Advice {tip.priority ? `· ${tip.priority}` : ''}</span>
            <h2 style={{ fontSize: '1.4rem', margin: '0', color: 'var(--text)' }}>{tip.title || tip.topic}</h2>
            <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>{tip.description || tip.content}</p>
            <ul style={{ margin: '0', paddingLeft: '20px', color: 'var(--text)', fontSize: '0.95rem', lineHeight: '1.7' }}>{(tip.tips || []).slice(0, 5).map((item, itemIndex) => <li key={`${tipText(item)}-${itemIndex}`} style={{ marginBottom: '8px' }}>{tipText(item)}</li>)}</ul>
            <div className="chip-grid compact" style={{ marginTop: 'auto', paddingTop: '16px' }}>
              {(tip.relatedCourses || []).map((ref) => <CourseChip key={ref} course={courseIndex.findCourse(ref)} courseRef={ref} />)}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
