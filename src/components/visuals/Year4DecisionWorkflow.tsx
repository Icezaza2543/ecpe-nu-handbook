import { useMemo, useState } from 'react';
import { year4Tracks } from '../../data/year4Tracks';
import type { CourseIndex } from '../../utils/courseIndex';
import { CourseChip } from '../common/CourseChip';
import { SectionHeader } from '../common/SectionHeader';

interface CourseRefObject {
  id?: string;
  code?: string;
  courseId?: string;
  name?: string;
}

interface Track {
  id: string;
  title?: string;
  description?: string;
  courses?: Array<string | CourseRefObject>;
  bestFor?: string;
  condition?: string;
}

function toCourseRef(item: string | CourseRefObject): string {
  return typeof item === 'string' ? item : item.courseId || item.code || item.id || item.name || '';
}

const answers = [
  { id: 'engineering-project', label: 'อยากทำโปรเจกต์จบ + portfolio' },
  { id: 'industry-practicum', label: 'อยากทำงานในอุตสาหกรรมจริง' },
  { id: 'undergraduate-research', label: 'อยากทำวิจัย / เรียนต่อ' },
];

export function Year4DecisionWorkflow({ courseIndex }: { courseIndex: CourseIndex }) {
  const tracks = year4Tracks as unknown as Track[];
  const [selected, setSelected] = useState(answers[0].id);
  const recommended = useMemo(() => tracks.find((track) => track.id.includes(selected)) || tracks[0], [selected, tracks]);

  return (
    <section className="visual-card">
      <SectionHeader title="Year 4 Track Decision Workflow" description="เลือกแผนปี 4 จากเป้าหมายของตัวเอง" />
      <div className="decision-grid">
        {answers.map((answer) => (
          <button className={selected === answer.id ? 'decision-card is-selected' : 'decision-card'} key={answer.id} type="button" onClick={() => setSelected(answer.id)}>
            {answer.label}
          </button>
        ))}
      </div>
      {recommended ? (
        <article className="selected-track">
          <h3>{recommended.title}</h3>
          <p>{recommended.description || recommended.bestFor || recommended.condition}</p>
          <div className="chip-grid">
            {(recommended.courses || []).map((item, index) => {
              const ref = toCourseRef(item);
              return <CourseChip key={ref || index} course={courseIndex.findCourse(ref)} courseRef={ref} />;
            })}
          </div>
        </article>
      ) : null}
    </section>
  );
}
