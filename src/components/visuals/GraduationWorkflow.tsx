import { RotateCcw } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SectionHeader } from '../common/SectionHeader';

const checks = [
  'เรียนครบ 138 หน่วยกิต',
  'GenEd ครบตามหมวด',
  'วิชาเฉพาะครบ',
  'เลือกเสรีครบ 6 หน่วยกิต',
  'ผ่าน Field Experience 1-5',
  'ผ่าน Internship ≥ 270 ชั่วโมง',
  'ผ่าน Year 4 Track',
  'ตรวจข้อมูลกับมหาวิทยาลัย',
];

export function GraduationWorkflow() {
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>('cpe-v2-graduation-checklist', {});
  const complete = checks.filter((item) => checked[item]).length;

  const reset = () => {
    if (window.confirm('Reset graduation checklist?')) setChecked({});
  };

  return (
    <section className="visual-card">
      <SectionHeader title="Graduation Requirement Workflow" description="Checklist ส่วนตัว เก็บใน localStorage ของ V2" />
      <div className="progress-ring-container" aria-label={`progress ${complete}/${checks.length}`} style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 16px' }}>
        <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="65"
            cy="65"
            r="54"
            fill="transparent"
            stroke="#dbeafe"
            strokeWidth="12"
          />
          <circle
            cx="65"
            cy="65"
            r="54"
            fill="transparent"
            stroke="var(--primary)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 54}
            strokeDashoffset={(2 * Math.PI * 54) - ((complete / checks.length) * (2 * Math.PI * 54))}
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <strong style={{ fontSize: '1.4rem' }}>{complete}/{checks.length}</strong>
          <span style={{ fontSize: '0.85rem' }}>completed</span>
        </div>
      </div>
      <div className="checklist-grid">
        {checks.map((item) => (
          <label key={item} className="check-card">
            <input
              type="checkbox"
              checked={Boolean(checked[item])}
              onChange={(event) => setChecked({ ...checked, [item]: event.target.checked })}
            />
            {item}
          </label>
        ))}
      </div>
      <button className="secondary-button" type="button" onClick={reset}><RotateCcw size={16} /> Reset</button>
    </section>
  );
}
