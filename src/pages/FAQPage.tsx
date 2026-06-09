import { useMemo, useState } from 'react';
import { faqs } from '../data/faqs';
import type { CourseIndex } from '../utils/courseIndex';
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

export function FAQPage({ courseIndex }: { courseIndex: CourseIndex }) {
  const [query, setQuery] = useState('');
  const items = faqs as FAQItem[];
  const filtered = useMemo(() => items.filter((item) => includesNormalized(`${item.question} ${item.shortAnswer} ${item.category}`, query)), [items, query]);

  return (
    <div className="page" style={{ paddingBottom: '100px' }}>
      <SectionHeader 
        title="FAQ" 
        description="คำถามที่น้องปี 1 มักอยากรู้ พร้อม course chips ที่เกี่ยวข้อง" 
        bgImage="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80"
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
