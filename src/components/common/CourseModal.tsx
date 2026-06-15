import { useEffect } from 'react';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';
import type { Course } from '../../types/course';
import type { CourseIndex } from '../../utils/courseIndex';
import { getCourseLabel } from '../../utils/graphUtils';
import { Badge } from './Badge';
import { SourceBadge } from './SourceBadge';
import { useCourseModal } from './CourseModalProvider';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  courseIndex: CourseIndex;
}

export function CourseModal({ course, onClose, courseIndex }: CourseModalProps) {
  const { openCourse } = useCourseModal();
  useEffect(() => {
    if (!course) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('is-modal-open');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('is-modal-open');
    };
  }, [course, onClose]);

  if (!course) return null;

  const prerequisiteText = (course.prerequisites || [])
    .map((ref) => {
      const found = courseIndex.findCourse(ref);
      return found ? `${found.code} ${getCourseLabel(found)}` : ref;
    })
    .join(', ');

  const nextText = (course.prerequisiteOf || [])
    .map((ref) => {
      const found = courseIndex.findCourse(ref);
      return found ? `${found.code} ${getCourseLabel(found)}` : ref;
    })
    .join(', ');
  const recommendedText = course.recommendedYear || course.recommendedSemester
    ? `ปี ${course.recommendedYear || '-'}${course.recommendedSemester ? ` เทอม ${course.recommendedSemester}` : ''}`
    : course.recommendedYearSemester;

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="presentation">
      <section
        className="course-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="ปิดรายละเอียดรายวิชา">
          <X size={20} />
        </button>
        <div className="course-modal__header">
          <p className="course-modal__code">{course.code || 'TBD'}</p>
          <h2 id="course-modal-title">{course.nameTh || course.titleTh || course.title || course.id}</h2>
          <p>{course.nameEn}</p>
          <div className="badge-row">
            <Badge tone="soft">{course.credits || 'TBD'} หน่วยกิต</Badge>
            {course.year ? <Badge tone="soft">ปี {course.year}{course.semester ? ` เทอม ${course.semester}` : ''}</Badge> : null}
            {recommendedText ? <Badge tone="soft">แนะนำ {recommendedText}</Badge> : null}
            {course.category ? <Badge>{course.category}</Badge> : null}
            {course.type ? <Badge tone="soft">{course.type}</Badge> : null}
            {course.subcategory ? <Badge tone="soft">{course.subcategory}</Badge> : null}
            <SourceBadge course={course} />
            {course.seniorTips?.length ? <Badge tone="warning">Senior Advice</Badge> : null}
            {course.tags?.slice(0, 5).map((tag) => (
              <Badge key={tag} tone="soft">#{tag}</Badge>
            ))}
          </div>
        </div>

        {(course.sourceNote || course.sourcePage || course.sourceRef || course.officialCategory) && (
          <div className="source-panel">
            {course.officialCategory ? <p><strong>หมวดวิชาทางการ:</strong> {course.officialCategory}</p> : null}
            {course.sourceNote ? (
              <p>
                <strong>อ้างอิง:</strong>{' '}
                {course.sourceNote === 'อัปเดตจากไฟล์รายวิชาใหม่ที่ผู้ใช้รวบรวม' ? (
                  <a 
                    href="http://www.cpe.nu.ac.th/web/download/course/2565/%E0%B8%A1%E0%B8%84%E0%B8%AD.2%20%E0%B8%9B.%E0%B8%95%E0%B8%A3%E0%B8%B5%20%E0%B8%A7%E0%B8%B4%E0%B8%A8%E0%B8%A7%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%9E%E0%B8%B4%E0%B8%A7%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C%20%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B8%E0%B8%87%202565.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                  >
                    มคอ.2 ป.ตรี วิศวกรรมคอมพิวเตอร์ ปรับปรุง 2565
                  </a>
                ) : (
                  course.sourceNote
                )}
              </p>
            ) : null}
            {course.sourcePage || course.sourceRef ? (
              <p><ExternalLink size={14} /> {course.sourcePage || `ref ${course.sourceRef}`}</p>
            ) : null}
            {course.needsVerification ? <p><strong>Status:</strong> needs-verification</p> : null}
          </div>
        )}

        {course.dangerousToFail ? (
          <div className="danger-panel">
            <AlertTriangle size={18} />
            วิชานี้เป็นวิชาที่ต้องระวัง เพราะอาจเป็นตัวต่อหรือกระทบแผนการเรียน
          </div>
        ) : null}

        <div className="modal-grid">
          {course.isSlot && (course.code === '001XXX' || course.code === 'XXXXXX') ? (
            <section className="course-slot-suggestions">
              <h3>รายวิชาแนะนำในหมวดนี้</h3>
              <div className="badge-row" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {courseIndex.getCatalogCourses().filter(c => {
                  if (course.code === 'XXXXXX') return c.type === 'free-elective' || c.type === 'major-elective';
                  if (course.code === '001XXX') {
                    if (c.type !== 'general-education') return false;
                    const groupTitle = course.titleTh || '';
                    if (groupTitle.toUpperCase() === 'ENG' || groupTitle.toUpperCase() === 'ENGLISH') {
                      return ['001211', '001212', '001213'].includes(c.code || '');
                    }
                    if (groupTitle.toUpperCase() === 'THAI') {
                      return (c.titleTh || '').includes('ภาษาไทย') || (c.nameTh || '').includes('ภาษาไทย');
                    }
                    if (groupTitle.includes('ภาษา') && !groupTitle.includes('วิทยา')) {
                      return (c.category || '').includes('ภาษา') || (c.subcategory || '').includes('ภาษา') || (c.titleTh || '').includes('ภาษา') || (c.titleTh || '').includes('การสื่อสาร') || (c.nameTh || '').includes('ภาษา');
                    }
                    if (groupTitle.includes('มนุษยศาสตร์')) {
                      return (c.category || '').includes('มนุษย์') || (c.subcategory || '').includes('มนุษย์') || (c.titleTh || '').includes('มนุษย์') || (c.titleTh || '').includes('สุนทรียะ');
                    }
                    if (groupTitle.includes('สังคมศาสตร์')) {
                      return (c.category || '').includes('สังคม') || (c.subcategory || '').includes('สังคม') || (c.titleTh || '').includes('สังคม') || (c.titleTh || '').includes('ธุรกิจ') || (c.titleTh || '').includes('ประกอบการ') || (c.nameTh || '').includes('สังคม') || (c.nameTh || '').includes('ธุรกิจ');
                    }
                    if (groupTitle.includes('วิทยาศาสตร์')) {
                      return (c.category || '').includes('วิทย์') || (c.subcategory || '').includes('วิทย์') || (c.titleTh || '').includes('วิทย์') || (c.titleTh || '').includes('สุขภาพ') || (c.titleTh || '').includes('คณิต') || (c.titleTh || '').includes('ข้อมูล') || (c.nameTh || '').includes('วิทย์') || (c.nameTh || '').includes('คณิต') || (c.nameTh || '').includes('สุขภาพ') || (c.nameTh || '').includes('ข้อมูล');
                    }
                    return true;
                  }
                  return false;
                }).map(c => (
                  <Badge key={c.id} tone="soft">
                    <span onClick={() => openCourse(c.id)} style={{ cursor: 'pointer', display: 'block', padding: '2px 4px' }}>
                      {c.code} {c.titleTh || c.nameTh}
                    </span>
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}
          <section>
            <h3>คำอธิบายรายวิชา</h3>
            <p>{course.description || '-'}</p>
          </section>
          <section>
            <h3>วิชาที่เกี่ยวข้อง</h3>
            <p><strong>ต้องผ่านวิชา:</strong> {prerequisiteText || course.officialPrerequisiteText || 'ไม่มี'}</p>
            {course.prerequisite ? <p><strong>Prerequisite text:</strong> {course.prerequisite}</p> : null}
            <p><strong>เป็นตัวต่อให้วิชา:</strong> {nextText || 'ไม่มี'}</p>
          </section>
          {course.whyItMatters ? (
            <section>
              <h3>ทำไมวิชานี้ถึงสำคัญ</h3>
              <p>{course.whyItMatters}</p>
            </section>
          ) : null}
          {course.careerPaths?.length ? (
            <section>
              <h3>Career Paths</h3>
              <div className="badge-row">{course.careerPaths.map((path) => <Badge key={path} tone="verified">{path}</Badge>)}</div>
            </section>
          ) : null}
          {course.seniorTips?.length ? (
            <section>
              <h3>Senior Tips</h3>
              <ul>{course.seniorTips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
            </section>
          ) : null}
          <section>
            <h3>Related Visual Maps</h3>
            <div className="badge-row">
              {(course.prerequisites?.length || course.prerequisiteOf?.length) ? <Badge tone="official">Prerequisite Graph</Badge> : null}
              {course.dangerousToFail ? <Badge tone="danger">Critical Path Map</Badge> : null}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
