import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { Course } from '../types/course';
import type { CourseIndex } from '../utils/courseIndex';

import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { SearchBox } from '../components/common/SearchBox';
import { SourceBadge } from '../components/common/SourceBadge';
import { useCourseModal } from '../components/common/CourseModalProvider';
import {
  AlertTriangle,
  BookOpen,
  Grid2X2,
  List,
  Network,
  PanelRightOpen,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';

type SortMode = 'code' | 'year' | 'name';
type ViewMode = 'grid' | 'list';

const typeLabels: Record<string, string> = {
  required: 'วิชาแกน',
  'general-education': 'ศึกษาทั่วไป',
  'major-elective': 'เลือกเฉพาะ',
  'free-elective': 'เลือกเสรี',
  'non-credit': 'ไม่นับหน่วยกิต',
};

function getTypeLabel(type?: string) {
  if (!type) return 'ไม่ระบุประเภท';
  return typeLabels[type] || type;
}

function getTypeStyle(course: Course): CSSProperties {
  const type = course.type || '';
  if (course.dangerousToFail) {
    return {
      '--course-accent': 'var(--danger)',
      '--course-bg': 'rgba(225, 29, 72, 0.065)',
      '--course-border': 'rgba(225, 29, 72, 0.28)',
    } as CSSProperties;
  }
  if (type === 'general-education') {
    return {
      '--course-accent': 'var(--violet)',
      '--course-bg': 'rgba(109, 40, 217, 0.055)',
      '--course-border': 'rgba(109, 40, 217, 0.22)',
    } as CSSProperties;
  }
  if (type === 'major-elective' || type === 'free-elective') {
    return {
      '--course-accent': 'var(--orange)',
      '--course-bg': 'rgba(255, 158, 87, 0.08)',
      '--course-border': 'rgba(255, 158, 87, 0.26)',
    } as CSSProperties;
  }
  return {
    '--course-accent': 'var(--cyan)',
    '--course-bg': 'rgba(8, 145, 178, 0.055)',
    '--course-border': 'rgba(8, 145, 178, 0.22)',
  } as CSSProperties;
}

function getCourseTitle(course: Course) {
  return course.nameTh || course.titleTh || course.title || course.nameEn || course.id;
}

export function CourseCatalogPage({ courseIndex }: { courseIndex: CourseIndex }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState<SortMode>('code');
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    typeof window !== 'undefined' && window.innerWidth > 768 ? 'list' : 'grid',
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query);
  const { openCourse } = useCourseModal();

  const filtered = useMemo(() => {
    let baseCourses = courseIndex.getCatalogCourses();

    if (debouncedQuery.trim()) {
      const searchResults = courseIndex.searchCourses(debouncedQuery);
      const matchedIds = new Set(searchResults.map((result) => result.course.id));
      baseCourses = baseCourses.filter((course) => matchedIds.has(course.id));
    }

    const result = baseCourses.filter((course) => {
      return type === 'all' || course.type === type;
    });

    return result.sort((a, b) => {
      if (sort === 'year') {
        return Number(a.year || 99) - Number(b.year || 99) || String(a.code || '').localeCompare(String(b.code || ''));
      }
      if (sort === 'name') {
        return String(a.nameTh || a.nameEn || '').localeCompare(String(b.nameTh || b.nameEn || ''), 'th');
      }
      return String(a.code || '').localeCompare(String(b.code || ''));
    });
  }, [courseIndex, debouncedQuery, sort, type]);

  useEffect(() => {
    if (!filtered.length) {
      if (selectedId) setSelectedId(null);
      return;
    }
    if (!selectedId || !filtered.some((course) => course.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const catalogCourses = useMemo(() => courseIndex.getCatalogCourses(), [courseIndex]);
  const selectedCourse = filtered.find((course) => course.id === selectedId) || filtered[0] || null;

  const stats = [
    { label: 'ทั้งหมด', value: catalogCourses.length, tone: 'primary' },
    { label: 'วิชาแกน', value: catalogCourses.filter((course) => course.type === 'required').length, tone: 'cyan' },
    {
      label: 'ศึกษาทั่วไป',
      value: catalogCourses.filter((course) => course.type === 'general-education').length,
      tone: 'violet',
    },
    {
      label: 'วิชาเลือก',
      value: catalogCourses.filter((course) => course.type === 'major-elective').length,
      tone: 'orange',
    },
    { label: 'ห้ามพลาด', value: catalogCourses.filter((course) => course.dangerousToFail).length, tone: 'danger' },
  ];

  const getCourseRefLabel = (ref: string) => {
    const found = courseIndex.findCourse(ref);
    return found ? `${found.code || ref} ${getCourseTitle(found)}` : ref;
  };

  return (
    <div className="page course-catalog-page">
      <section className="course-catalog-hero" aria-label="Course catalog overview">
        <div>
          <span className="technical-label">Course Explorer</span>
          <h1>รายวิชาทั้งหมด</h1>
          <p>
            ค้นหา กรอง และไล่ดูรายวิชาทั้งหมดในหลักสูตร วิศวกรรมคอมพิวเตอร์
          </p>
        </div>
        <aside className="course-hero-panel" aria-label="Catalog signal">
          <div>
            <BookOpen size={22} aria-hidden="true" />
            <span>Catalog Signal</span>
          </div>
          <strong>{filtered.length}</strong>
          <p>รายวิชาที่ตรงกับตัวกรองปัจจุบัน</p>
        </aside>
      </section>

      <section className="catalog-stats course-stats-strip" aria-label="สถิติรายวิชา">
        {stats.map((stat) => (
          <div key={stat.label} data-tone={stat.tone}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="catalog-toolbar course-filter-toolbar" aria-label="ตัวกรองรายวิชา">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="ค้นหารหัสวิชา ชื่อวิชา หมวด หรือ career path"
        />
        <select value={type} onChange={(event) => setType(event.target.value)} aria-label="filter type">
          <option value="all">ทุกประเภท</option>
          <option value="required">วิชาแกนบังคับ</option>
          <option value="general-education">หมวดศึกษาทั่วไป</option>
          <option value="major-elective">วิชาเลือกเฉพาะ</option>
          <option value="non-credit">ไม่นับหน่วยกิต</option>
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} aria-label="sort">
          <option value="code">เรียงตามรหัส</option>
          <option value="year">เรียงตามปี</option>
          <option value="name">เรียงตามชื่อ</option>
        </select>
        <div className="catalog-view-toggle" aria-label="เลือกมุมมอง">
          <button
            type="button"
            className={viewMode === 'list' ? 'is-active' : ''}
            onClick={() => setViewMode('list')}
            aria-label="มุมมอง list"
            title="List view"
          >
            <List size={18} aria-hidden="true" />
            List
          </button>
          <button
            type="button"
            className={viewMode === 'grid' ? 'is-active' : ''}
            onClick={() => setViewMode('grid')}
            aria-label="มุมมอง grid"
            title="Grid view"
          >
            <Grid2X2 size={18} aria-hidden="true" />
            Grid
          </button>
        </div>
      </section>

      <div className="course-explorer-layout">
        <section className="course-results-panel" aria-label="ผลลัพธ์รายวิชา">
          <div className="course-results-panel__header">
            <div>
              <SlidersHorizontal size={18} aria-hidden="true" />
              <span>{filtered.length} รายการ</span>
            </div>
            <small>กดรายวิชาเพื่ออัปเดต inspector</small>
          </div>

          {filtered.length === 0 ? <EmptyState title="ไม่พบรายวิชา" /> : null}

          <div className={viewMode === 'grid' ? 'course-card-grid course-card-grid--catalog' : 'course-data-list'}>
            {filtered.map((course: Course) => {
              const isSelected = selectedCourse?.id === course.id;
              const prereqCount = course.prerequisites?.length || course.officialPrerequisites?.length || 0;
              const unlockCount = course.prerequisiteOf?.length || course.officialPrerequisiteOf?.length || 0;

              if (viewMode === 'list') {
                return (
                  <button
                    type="button"
                    className={`course-row ${isSelected ? 'is-selected' : ''}`}
                    key={course.id}
                    onClick={() => setSelectedId(course.id)}
                    style={getTypeStyle(course)}
                  >
                    <span className="course-row__code">{course.code || 'TBD'}</span>
                    <span className="course-row__title">
                      <strong>{getCourseTitle(course)}</strong>
                      <small>{course.nameEn || getTypeLabel(course.type)}</small>
                    </span>
                    <span className="course-row__meta">
                      <span>{course.credits || 'TBD'} Cr.</span>
                      <span>{getTypeLabel(course.type)}</span>
                      {course.year ? <span>ปี {course.year}</span> : null}
                    </span>
                    <span className="course-row__signals">
                      {prereqCount ? (
                        <span>
                          <Network size={14} aria-hidden="true" />
                          ก่อนเรียน {prereqCount}
                        </span>
                      ) : null}
                      {unlockCount ? <span>ปลดล็อก {unlockCount}</span> : null}
                      {course.dangerousToFail ? (
                        <span className="is-danger">
                          <AlertTriangle size={14} aria-hidden="true" />
                          ห้ามพลาด
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  type="button"
                  className={`course-card catalog-course-card ${isSelected ? 'is-selected' : ''}`}
                  key={course.id}
                  onClick={() => setSelectedId(course.id)}
                  style={getTypeStyle(course)}
                >
                  <span className="course-code">{course.code || 'TBD'}</span>
                  <h3>{getCourseTitle(course)}</h3>
                  <p>{course.nameEn || course.description || getTypeLabel(course.type)}</p>
                  <div className="badge-row">
                    <Badge tone="soft">{course.credits || 'TBD'} Cr.</Badge>
                    {course.dangerousToFail ? <Badge tone="danger">ห้ามพลาด</Badge> : null}
                    <SourceBadge course={course} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="course-inspector" aria-label="Course inspector">
          {selectedCourse ? (
            <>
              <div className="course-inspector__header">
                <span>
                  <PanelRightOpen size={18} aria-hidden="true" />
                  Course Inspector
                </span>
                <strong>{selectedCourse.code || 'TBD'}</strong>
              </div>

              <div className="course-inspector__title">
                <h2>{getCourseTitle(selectedCourse)}</h2>
                <p>{selectedCourse.nameEn || selectedCourse.description || 'ไม่มีคำอธิบายภาษาอังกฤษในชุดข้อมูล'}</p>
              </div>

              <div className="course-inspector__badges">
                <Badge tone="soft">{selectedCourse.credits || 'TBD'} หน่วยกิต</Badge>
                <Badge>{getTypeLabel(selectedCourse.type)}</Badge>
                {selectedCourse.category ? <Badge tone="soft">{selectedCourse.category}</Badge> : null}
                <SourceBadge course={selectedCourse} />
              </div>

              {selectedCourse.dangerousToFail ? (
                <div className="course-inspector__risk">
                  <AlertTriangle size={18} aria-hidden="true" />
                  วิชานี้เป็นจุดเสี่ยงของแผนการเรียน ควรตรวจวิชาตัวต่อก่อนตัดสินใจถอนหรือลงช้า
                </div>
              ) : null}

              <div className="course-inspector__metrics">
                <div>
                  <strong>{selectedCourse.prerequisites?.length || selectedCourse.officialPrerequisites?.length || 0}</strong>
                  <span>ต้องผ่านก่อน</span>
                </div>
                <div>
                  <strong>{selectedCourse.prerequisiteOf?.length || selectedCourse.officialPrerequisiteOf?.length || 0}</strong>
                  <span>วิชาที่ปลดล็อก</span>
                </div>
                <div>
                  <strong>{selectedCourse.careerPaths?.length || 0}</strong>
                  <span>career path</span>
                </div>
              </div>

              <section>
                <h3>คำอธิบายย่อ</h3>
                <p>{selectedCourse.description || selectedCourse.whyItMatters || 'ยังไม่มีคำอธิบายเพิ่มเติม'}</p>
              </section>

              <section>
                <h3>วิชาที่เกี่ยวข้อง</h3>
                <div className="course-inspector__list">
                  <span>ต้องผ่านก่อน</span>
                  <p>
                    {(selectedCourse.prerequisites || selectedCourse.officialPrerequisites || [])
                      .map(getCourseRefLabel)
                      .join(' / ') || selectedCourse.officialPrerequisiteText || 'ไม่มี'}
                  </p>
                </div>
                <div className="course-inspector__list">
                  <span>เป็นตัวต่อให้</span>
                  <p>
                    {(selectedCourse.prerequisiteOf || selectedCourse.officialPrerequisiteOf || [])
                      .map(getCourseRefLabel)
                      .join(' / ') || 'ไม่มี'}
                  </p>
                </div>
              </section>

              {selectedCourse.careerPaths?.length ? (
                <section>
                  <h3>Career relevance</h3>
                  <div className="badge-row">
                    {selectedCourse.careerPaths.slice(0, 6).map((path) => (
                      <Badge key={path} tone="verified">
                        {path}
                      </Badge>
                    ))}
                  </div>
                </section>
              ) : null}

              <button type="button" className="primary-button course-inspector__action" onClick={() => openCourse(selectedCourse)}>
                เปิดรายละเอียดเต็ม
                <PanelRightOpen size={18} aria-hidden="true" />
              </button>
            </>
          ) : (
            <EmptyState title="ยังไม่ได้เลือกรายวิชา" />
          )}
        </aside>
      </div>
    </div>
  );
}
