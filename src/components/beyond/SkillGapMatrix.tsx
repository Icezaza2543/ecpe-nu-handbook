import { Check, CircleDot, Dot, Sparkles } from 'lucide-react';
import type { RealWorldSkill } from '../../data/toolsAndSources';

type MatrixRow = {
  area: string;
  matcher: string[];
  notes: [string, string, string];
};

const rows: MatrixRow[] = [
  {
    area: 'Software',
    matcher: ['Coding'],
    notes: ['อ่าน codebase / docs', 'ทำ mini app', 'มี repo ที่อธิบายได้'],
  },
  {
    area: 'Git / Collaboration',
    matcher: ['Git'],
    notes: ['รู้ branch / PR', 'ให้เพื่อน review', 'มี PR history จริง'],
  },
  {
    area: 'DevOps',
    matcher: ['DevOps'],
    notes: ['รู้จัก deploy flow', 'ลอง CI/CD', 'มี demo ที่ online'],
  },
  {
    area: 'Embedded',
    matcher: ['Embedded'],
    notes: ['รู้ tool วัดสัญญาณ', 'ต่อ MQTT / sensor', 'มี diagram + firmware'],
  },
  {
    area: 'Security',
    matcher: ['Security'],
    notes: ['รู้ risk พื้นฐาน', 'เช็ก dependency', 'อธิบาย threat ได้'],
  },
  {
    area: 'Communication',
    matcher: ['Soft Skills'],
    notes: ['เขียน docs ได้', 'present งาน', 'เล่าโปรเจกต์ให้ non-tech เข้าใจ'],
  },
  {
    area: 'Career',
    matcher: ['Career', 'Business'],
    notes: ['รู้ตลาดงาน', 'ลองสมัคร / networking', 'มี portfolio พร้อมเล่า'],
  },
];

type SkillGapMatrixProps = {
  skills: RealWorldSkill[];
};

export function SkillGapMatrix({ skills }: SkillGapMatrixProps) {
  return (
    <div className="skill-gap-matrix" role="table" aria-label="Skill Gap Matrix">
      <div className="skill-gap-matrix__legend" aria-hidden="true">
        <span>
          <Dot size={22} />
          รู้จัก
        </span>
        <span>
          <Check size={15} />
          ลองทำ
        </span>
        <span>
          <Sparkles size={15} />
          มีผลงาน
        </span>
      </div>
      <div className="skill-gap-matrix__head" role="row">
        <span role="columnheader">สายทักษะ</span>
        <span role="columnheader">รู้จัก</span>
        <span role="columnheader">ลอง</span>
        <span role="columnheader">ผลงาน</span>
      </div>
      {rows.map((row) => {
        const matchedSkills = skills.filter((skill) => row.matcher.includes(skill.category));
        return (
          <div className="skill-gap-matrix__row" role="row" key={row.area}>
            <div className="skill-gap-matrix__area" role="cell">
              <CircleDot size={18} aria-hidden="true" />
              <div>
                <strong>{row.area}</strong>
                <span>{matchedSkills.length || 1} เรื่องที่โยงกัน</span>
              </div>
            </div>
            {row.notes.map((note, index) => (
              <div className="skill-gap-matrix__cell" role="cell" key={note}>
                <span title={note} aria-label={note}>
                  {index === 0 ? <Dot size={24} aria-hidden="true" /> : null}
                  {index === 1 ? <Check size={15} aria-hidden="true" /> : null}
                  {index === 2 ? <Sparkles size={15} aria-hidden="true" /> : null}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
