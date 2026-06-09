import { useMemo, useState } from 'react';
import type { CourseIndex } from '../../utils/courseIndex';
import { CourseChip } from '../common/CourseChip';
import { SectionHeader } from '../common/SectionHeader';
import { Languages, Users, FlaskConical, Activity, BookOpen, Layers } from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'ทั้งหมด', icon: Layers, color: 'var(--text)', bg: 'var(--surface)', border: 'var(--border)' },
  { id: 'Language', label: 'กลุ่มวิชาภาษา', icon: Languages, color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  { id: 'Humanities', label: 'กลุ่มวิชามนุษยศาสตร์', icon: BookOpen, color: '#be185d', bg: '#fdf2f8', border: '#fbcfe8' },
  { id: 'Social', label: 'กลุ่มวิชาสังคมศาสตร์', icon: Users, color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  { id: 'Science', label: 'กลุ่มวิชาวิทยาศาสตร์ฯ', icon: FlaskConical, color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe' },
  { id: 'Sports', label: 'กลุ่มวิชาพลานามัย', icon: Activity, color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' }
];

export function GenEdExplorer({ courseIndex }: { courseIndex: CourseIndex }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const genEdCourses = useMemo(
    () => courseIndex.courses.filter((course) => course.type === 'general-education' || course.code?.startsWith('001')),
    [courseIndex.courses],
  );

  const filteredCourses = useMemo(() => {
    if (activeCategory === 'All') return genEdCourses;
    return genEdCourses.filter((course) => {
      const matchString = [course.subcategory, course.requirementGroup, course.tags?.join(' ')].join(' ').toLowerCase();
      if (activeCategory === 'Language' && (matchString.includes('language') || matchString.includes('ภาษา'))) return true;
      if (activeCategory === 'Humanities' && (matchString.includes('humanities') || matchString.includes('มนุษย'))) return true;
      if (activeCategory === 'Social' && (matchString.includes('social') || matchString.includes('สังคม'))) return true;
      if (activeCategory === 'Science' && (matchString.includes('science') || matchString.includes('math') || matchString.includes('วิทย์') || matchString.includes('คณิต'))) return true;
      if (activeCategory === 'Sports' && (matchString.includes('sports') || matchString.includes('พลานามัย') || matchString.includes('activity'))) return true;
      return false;
    });
  }, [activeCategory, genEdCourses]);

  const activeMeta = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <section className="visual-card" style={{ padding: '32px' }}>
      <SectionHeader title="GenEd Explorer" description="เลือกดูรายวิชาศึกษาทั่วไป (หมวด GE) แยกตามกลุ่มวิชา พร้อมเปิดอ่านข้อมูลรายละเอียดได้ทันที" />
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '999px',
                border: `1px solid ${isActive ? cat.border : 'var(--border)'}`,
                background: isActive ? cat.bg : 'var(--surface)',
                color: isActive ? cat.color : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: isActive ? `0 4px 12px ${cat.color}20` : 'none'
              }}
            >
              <Icon size={18} />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div style={{ background: activeCategory === 'All' ? 'var(--bg)' : activeMeta.bg, border: `1px solid ${activeCategory === 'All' ? 'var(--border)' : activeMeta.border}`, borderRadius: '24px', padding: '32px', minHeight: '300px', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: activeMeta.color }}>
          <activeMeta.icon size={28} />
          <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{activeMeta.label}</h3>
          <span style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 600, marginLeft: 'auto', background: activeMeta.border, padding: '4px 12px', borderRadius: '999px' }}>
            พบ {filteredCourses.length} วิชา
          </span>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="chip-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {filteredCourses.map((course) => (
              <div key={course.id} style={{ display: 'flex' }}>
                <CourseChip course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', opacity: 0.5 }}>
            <activeMeta.icon size={48} style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>ไม่พบรายวิชาในกลุ่มนี้</p>
          </div>
        )}
      </div>
    </section>
  );
}
