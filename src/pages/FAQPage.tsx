import { useMemo, useState } from 'react';
import { faqs } from '../data/faqs';
import { useCourseIndex } from '../hooks/useCourseIndex';
import { includesNormalized } from '../utils/search';
import { CourseChip } from '../components/common/CourseChip';
import { SearchBox } from '../components/common/SearchBox';
import { SectionHeader } from '../components/common/SectionHeader';

interface FAQItem {
  id: string;
  category?: string;
  question?: string;
  shortAnswer?: string;
  answer?: string[];
  relatedCourses?: string[];
}

export function FAQPage() {
  const courseIndex = useCourseIndex();
  const [query, setQuery] = useState('');
  const items = faqs as FAQItem[];
  const filtered = useMemo(() => items.filter((item) => includesNormalized(`${item.question} ${item.shortAnswer} ${item.category}`, query)), [items, query]);

  return (
    <div className="page" style={{ paddingBottom: '100px' }}>
      <SectionHeader 
        title="คำถามที่พบบ่อย (FAQ)" 
        description="รวบรวมคำถามที่น้องๆ ปี 1 มักจะสงสัย พร้อมคำตอบฉบับย่อยง่าย"
        variant="hero"
        className="faq-hero"
      />
      <SearchBox value={query} onChange={setQuery} placeholder="ค้นหา FAQ..." />
      <div className="accordion-list">
        {filtered.map((item) => (
          <details key={item.id} className="faq-item">
            <summary>{item.question}</summary>
            <p>{item.shortAnswer}</p>
            <ul>{(item.answer || []).map((line) => <li key={line}>{line}</li>)}</ul>
            <div className="chip-grid compact">
              {(item.relatedCourses || []).map((ref) => <CourseChip key={ref} course={courseIndex.findCourse(ref)} courseRef={ref} />)}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
