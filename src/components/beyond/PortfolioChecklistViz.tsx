import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, Rocket } from 'lucide-react';

const checklist = [
  'GitHub มี repo จริง',
  'README อ่านรู้เรื่อง',
  'มี demo หรือ screenshot',
  'อธิบาย tech stack ได้',
  'มี project story',
  'มี LinkedIn / contact',
  'มีอย่างน้อย 1 project ที่ deploy ได้',
];

export function PortfolioChecklistViz() {
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({
    'GitHub มี repo จริง': true,
    'README อ่านรู้เรื่อง': true,
  });

  const completed = useMemo(() => checklist.filter((item) => checked[item]).length, [checked]);
  const progress = Math.round((completed / checklist.length) * 100);
  const visibleChecklist = expanded ? checklist : checklist.slice(0, 4);
  const hiddenCount = checklist.length - visibleChecklist.length;

  return (
    <div className="portfolio-checklist-viz">
      <div className="portfolio-checklist-viz__summary">
        <div>
          <Rocket size={24} aria-hidden="true" />
          <strong>Portfolio readiness</strong>
          <span>{completed}/{checklist.length} พร้อมเล่าให้คนอื่นฟัง</span>
        </div>
        <b>{progress}%</b>
      </div>
      <div className="portfolio-progress" aria-label={`Portfolio progress ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="portfolio-checklist-viz__items">
        {visibleChecklist.map((item) => {
          const isChecked = Boolean(checked[item]);
          return (
            <button
              type="button"
              key={item}
              className={isChecked ? 'is-checked' : ''}
              onClick={() => setChecked((current) => ({ ...current, [item]: !current[item] }))}
              aria-pressed={isChecked}
            >
              {isChecked ? <CheckCircle2 size={18} aria-hidden="true" /> : <Circle size={18} aria-hidden="true" />}
              <span>{item}</span>
            </button>
          );
        })}
      </div>
      <button type="button" className="portfolio-checklist-viz__expand" onClick={() => setExpanded((current) => !current)}>
        {expanded ? 'ย่อรายการ' : `ดูอีก ${hiddenCount} รายการ`}
      </button>
    </div>
  );
}
