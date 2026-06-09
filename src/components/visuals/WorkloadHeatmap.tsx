import { studyPlan } from '../../data/studyPlan';
import type { StudyYear } from '../../types/curriculum';
import type { CourseIndex } from '../../utils/courseIndex';
import { SectionHeader } from '../common/SectionHeader';
import { AlertTriangle, BookOpen, GraduationCap } from 'lucide-react';

function formatSemesterTitle(title: string) {
  return title || 'ไม่ระบุเทอม';
}
function formatCredits(credits: number) {
  return `${credits} หน่วยกิต`;
}
function formatCourseCount(count: number) {
  return `${count} รายวิชา`;
}
function formatCriticalCount(count: number) {
  return count > 0 ? `${count} วิชาที่ควรระวัง` : 'ไม่มีวิชาควรระวัง';
}

function getWorkloadLevel(credits: number, criticalCount: number) {
  if (criticalCount >= 3 || credits > 20) {
    return { level: 'ควรระวัง', color: '#e11d48', bg: '#ffe4e6', barWidth: '95%' };
  } else if (credits >= 18 || criticalCount >= 2) {
    return { level: 'หนัก', color: '#ea580c', bg: '#ffedd5', barWidth: '75%' };
  } else if (credits >= 12) {
    return { level: 'ปานกลาง', color: '#4f46e5', bg: '#e0e7ff', barWidth: '50%' };
  } else {
    return { level: 'เบา', color: '#0d9488', bg: '#ccfbf1', barWidth: '25%' };
  }
}

function getSemesterNote(title: string) {
  if (title.includes('ปี 1 เทอม 1')) return 'ตั้งหลัก Calculus, Physics และ Programming ให้ทันตั้งแต่ต้น';
  if (title.includes('ปี 1 เทอม 2')) return 'วิชาเริ่มยากขึ้น โดยเฉพาะ Calculus 2 และวงจรไฟฟ้า';
  if (title.includes('ปี 2 เทอม 1')) return 'จุดตัดสายคอม Data Structures และ Digital Logic คือวิชาชี้ชะตา';
  if (title.includes('ปี 2 เทอม 2')) return 'เทอมที่หนักที่สุดของหลักสูตร! ระวัง AI และ Networks';
  if (title.includes('ปี 3 เทอม 1')) return 'เน้นปฏิบัติจริง Embedded Systems และ Database สำคัญมาก';
  if (title.includes('ปี 3 เทอม 2')) return 'เตรียมตัวเข้าสายงานจริง เน้นทำโปรเจกต์และ OS';
  if (title.includes('ปิดเทอมปี 3')) return 'ฝึกงานเก็บเกี่ยวประสบการณ์จริงในอุตสาหกรรม';
  if (title.includes('ปี 4 เทอม 1')) return 'ลุย Senior Project 1 และหาหัวข้อที่น่าสนใจ';
  if (title.includes('ปี 4 เทอม 2')) return 'ปิดจบ Senior Project 2 ให้สมบูรณ์ เตรียมตัวเรียนจบ';
  return '';
}

export function WorkloadHeatmap({ courseIndex }: { courseIndex: CourseIndex }) {
  const semesters = ((studyPlan as { years?: StudyYear[] }).years || []).flatMap((year) =>
    (year.semesters || year.terms || []).map((semester) => {
      const courses = semester.courses || [];
      
      let computedCredits = 0;
      let nonCreditCount = 0;
      let criticalCount = 0;
      
      courses.forEach(c => {
        const fullCourse = c.code ? courseIndex.findCourseByCode(c.code) : null;
        if (c.counted !== false) {
          // Parse string like "3(2-2-5)" to get 3
          const match = c.credits?.match(/^(\d+)/);
          if (match) computedCredits += parseInt(match[1]);
        } else {
          nonCreditCount++;
        }
        
        if (fullCourse?.dangerousToFail || fullCourse?.dangerLevel) {
          criticalCount++;
        }
      });
      
      const totalCredits = Number(semester.totalCredits) || computedCredits;
      
      return { 
        id: semester.id,
        title: semester.title || '', 
        totalCredits, 
        courseCount: courses.length, 
        criticalCount,
        note: getSemesterNote(semester.title || '')
      };
    }),
  );

  return (
    <section className="visual-card">
      <SectionHeader title="Workload Heatmap" description="จำลองภาระงานแต่ละเทอม เพื่อให้คุณวางแผนรับมือกับวิชาสุดโหดได้อย่างแม่นยำ" />
      
      <div className="heatmap-grid-new">
        {semesters.map((sem) => {
          if (sem.totalCredits === 0 && sem.courseCount === 0) return null;
          
          const { level, color, bg, barWidth } = getWorkloadLevel(sem.totalCredits, sem.criticalCount);
          
          return (
            <div key={sem.id || sem.title} style={{ 
              background: 'var(--surface)', border: `1px solid var(--border)`, 
              borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              {/* Heat progress bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'var(--bg)' }}>
                <div style={{ height: '100%', width: barWidth, background: color, borderRadius: '0 4px 4px 0', transition: 'width 0.5s ease-out' }}></div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', marginTop: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text)' }}>{formatSemesterTitle(sem.title)}</h3>
                <span style={{ 
                  background: bg, color: color, padding: '4px 12px', borderRadius: '999px', 
                  fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.02em',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  {sem.criticalCount >= 3 && <AlertTriangle size={14} />}
                  ระดับภาระ: {level}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                <div style={{ background: 'var(--bg)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={16} color="var(--primary)" />
                  {formatCredits(Number(sem.totalCredits))}
                </div>
                <div style={{ background: 'var(--bg)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={16} color="var(--violet)" />
                  {formatCourseCount(sem.courseCount)}
                </div>
              </div>
              
              <div style={{ 
                color: sem.criticalCount > 0 ? '#dc2626' : 'var(--text-muted)', 
                fontWeight: sem.criticalCount > 0 ? 600 : 500,
                fontSize: '0.9rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                {sem.criticalCount > 0 && <AlertTriangle size={16} />}
                {formatCriticalCount(sem.criticalCount)}
              </div>
              
              {sem.note && (
                <div style={{ background: 'var(--bg)', borderLeft: `3px solid ${color}`, padding: '12px', borderRadius: '0 8px 8px 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '4px' }}>Note:</strong>
                  {sem.note}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .heatmap-grid-new {
          display: grid;
          gap: 20px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .heatmap-grid-new {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .heatmap-grid-new {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
        }
      `}</style>
    </section>
  );
}
