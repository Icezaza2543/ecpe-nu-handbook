import { useMemo, useState } from 'react';
import type { Course } from '../types/course';
import type { CourseIndex } from '../utils/courseIndex';

import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { SearchBox } from '../components/common/SearchBox';
import { SectionHeader } from '../components/common/SectionHeader';
import { SourceBadge } from '../components/common/SourceBadge';
import { useCourseModal } from '../components/common/CourseModalProvider';

type SortMode = 'code' | 'year' | 'name';

export function CourseCatalogPage({ courseIndex }: { courseIndex: CourseIndex }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [source, setSource] = useState('all');
  const [category, setCategory] = useState('all');
  const [career, setCareer] = useState('all');
  const [dangerOnly, setDangerOnly] = useState(false);
  const [sort, setSort] = useState<SortMode>('code');
  const debouncedQuery = useDebouncedValue(query);
  const { openCourse } = useCourseModal();
  const careerOptions = Array.from(new Set(courseIndex.courses.flatMap((course) => course.careerPaths || []))).sort();
  const categoryOptions = Array.from(new Set(courseIndex.courses.map((course) => course.category).filter((item): item is string => Boolean(item)))).sort();

  const filtered = useMemo(() => {
    // 1. Get base catalog courses (excluding placeholders & unknowns)
    let baseCourses = courseIndex.getCatalogCourses();
    
    // 2. Filter by search query using fuse.js from courseIndex
    if (debouncedQuery.trim()) {
      const searchResults = courseIndex.searchCourses(debouncedQuery);
      const matchedIds = new Set(searchResults.map(res => res.course.id));
      baseCourses = baseCourses.filter(c => matchedIds.has(c.id));
    }

    // 3. Apply other filters
    const result = baseCourses.filter((course) => {
      const matchType = type === 'all' || course.type === type;
      const matchSource = source === 'all' || course.sourceConfidence === source || (source === 'needs' && (course.needsVerification || course.sourceConfidence === 'needs-verification'));
      const matchCategory = category === 'all' || course.category === category;
      const matchCareer = career === 'all' || course.careerPaths?.includes(career);
      const matchDanger = !dangerOnly || course.dangerousToFail;
      return matchType && matchSource && matchCategory && matchCareer && matchDanger;
    });

    // 4. Sort
    return result.sort((a, b) => {
      if (sort === 'year') return Number(a.year || 99) - Number(b.year || 99) || String(a.code || '').localeCompare(String(b.code || ''));
      if (sort === 'name') return String(a.nameTh || a.nameEn || '').localeCompare(String(b.nameTh || b.nameEn || ''), 'th');
      return String(a.code || '').localeCompare(String(b.code || ''));
    });
  }, [career, category, courseIndex, dangerOnly, debouncedQuery, sort, source, type]);

  const catalogCourses = useMemo(() => courseIndex.getCatalogCourses(), [courseIndex]);

  const stats = {
    all: catalogCourses.length,
    gened: catalogCourses.filter((course) => course.type === 'general-education').length,
    required: catalogCourses.filter((course) => course.type === 'required').length,
    elective: catalogCourses.filter((course) => course.type === 'major-elective').length,
    needs: catalogCourses.filter((course) => course.needsVerification || course.sourceConfidence === 'needs-verification').length,
  };

  return (
    <div className="page">
      <SectionHeader 
        title="Course Catalog" 
        description="รายวิชาทั้งหมด ค้นหา กรอง และดูข้อมูลเชิงลึกได้ทันที" 
        bgImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
      />
      <div className="catalog-stats" style={{ gap: '12px' }}>
        {Object.entries(stats).map(([label, value]) => {
          const thaiLabels: Record<string, string> = {
            all: 'ทั้งหมด',
            gened: 'ศึกษาทั่วไป',
            required: 'วิชาบังคับ',
            elective: 'วิชาเลือก',
            needs: 'รอตรวจสอบ'
          };
          return (
          <div key={label} style={{ background: 'var(--surface)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
            <strong style={{ fontSize: '2rem', color: label === 'gened' ? 'var(--violet)' : label === 'elective' ? 'var(--warning)' : label === 'required' ? 'var(--cyan)' : 'var(--primary)' }}>{value}</strong>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{thaiLabels[label] || label}</span>
          </div>
        )})}
      </div>
      <div className="catalog-toolbar">
        <SearchBox value={query} onChange={setQuery} />
        <select value={type} onChange={(event) => setType(event.target.value)} aria-label="filter type">
          <option value="all">ทุกประเภท</option>
          <option value="required">วิชาแกนบังคับ</option>
          <option value="general-education">หมวดศึกษาทั่วไป</option>
          <option value="major-elective">วิชาเลือกเฉพาะ</option>
          <option value="non-credit">ไม่นับหน่วยกิต</option>
        </select>
        <select value={source} onChange={(event) => setSource(event.target.value)} aria-label="filter source">
          <option value="all">ทุก source</option>
          <option value="verified-official">ข้อมูลทางการ (มคอ.2)</option>
          <option value="verified-description">คำอธิบายรายวิชา (ตรวจสอบแล้ว)</option>
          <option value="needs">รอการตรวจสอบ</option>
        </select>
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="filter category">
          <option value="all">ทุกหมวด</option>
          {categoryOptions.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={career} onChange={(event) => setCareer(event.target.value)} aria-label="filter career">
          <option value="all">ทุก career path</option>
          {careerOptions.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} aria-label="sort">
          <option value="code">เรียงตาม code</option>
          <option value="year">เรียงตามปี</option>
          <option value="name">เรียงตามชื่อ</option>
        </select>
        <label className="inline-check"><input type="checkbox" checked={dangerOnly} onChange={(event) => setDangerOnly(event.target.checked)} /> ห้ามติด F</label>
      </div>
      {filtered.length === 0 ? <EmptyState title="ไม่พบรายวิชา" /> : null}
    <div className="course-card-grid">
        {filtered.map((course: Course) => {
          let bg = 'var(--surface)';
          let border = 'var(--border)';
          if (course.type === 'general-education') { bg = 'rgba(139, 92, 246, 0.12)'; border = 'rgba(139, 92, 246, 0.3)'; }
          else if (course.type === 'required') { bg = 'rgba(6, 182, 212, 0.12)'; border = 'rgba(6, 182, 212, 0.3)'; }
          else if (course.type === 'major-elective') { bg = 'rgba(245, 158, 11, 0.12)'; border = 'rgba(245, 158, 11, 0.3)'; }
          else if (course.type === 'free-elective') { bg = 'rgba(236, 72, 153, 0.12)'; border = 'rgba(236, 72, 153, 0.3)'; }

          return (
            <button type="button" className="course-card" key={course.id} onClick={() => openCourse(course)} style={{ display: 'flex', flexDirection: 'column', height: '100%', background: bg, backdropFilter: 'blur(12px)', border: `1px solid ${border}`, borderRadius: '20px', padding: '20px' }}>
              <span className="course-code" style={{ padding: '4px 10px', background: 'rgba(79, 124, 255, 0.1)', color: 'var(--primary-strong)', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '12px', alignSelf: 'flex-start' }}>{course.code || 'TBD'}</span>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: 'var(--text)', textAlign: 'left' }}>{course.nameTh}</h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'left', flexGrow: 1 }}>{course.nameEn}</p>
              <div className="badge-row" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${border}`, width: '100%' }}>
                <Badge tone="soft">{course.credits || 'TBD'}</Badge>
                {course.dangerousToFail ? <Badge tone="danger">ห้ามพลาด</Badge> : null}
                <SourceBadge course={course} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
