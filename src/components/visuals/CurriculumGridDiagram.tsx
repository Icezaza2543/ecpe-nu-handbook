import { useState, useEffect, useRef, useCallback } from 'react';
import { studyPlan } from '../../data/studyPlan';
import { officialPrerequisites } from '../../data/officialPrerequisites';
import type { CourseIndex } from '../../utils/courseIndex';
import { SectionHeader } from '../common/SectionHeader';
import { useCourseModal } from '../common/CourseModalProvider';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { StudyYear, StudyCourse } from '../../types/curriculum';

const CATEGORIES = {
  math: { label: 'Math / Science', color: '#be185d', bg: '#fdf2f8', border: '#fbcfe8' },
  prog: { label: 'Programming / Software', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  hard: { label: 'Hardware / Network', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  gened: { label: 'GenEd / Soft Skills', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  proj: { label: 'Project / Field / Elective', color: '#7e22ce', bg: '#faf5ff', border: '#e9d5ff' },
};

function getCourseCategory(code: string, titleTh: string): keyof typeof CATEGORIES {
  if (!code) return 'proj';
  const c = code.toLowerCase();
  
  if (c.startsWith('00') || titleTh.includes('ศึกษาทั่วไป') || titleTh.includes('กีฬา') || titleTh.includes('ทักษะเสริมการทำงาน')) return 'gened';
  if (c.includes('free') || c === 'xxxxxx' || titleTh.includes('เลือกเสรี')) return 'proj';
  if (c.startsWith('252') || c.startsWith('261') || ['305131','305132','305230','305231','305233'].includes(c)) return 'math';
  if (c.match(/^305[123]4/)) return 'hard';
  if (c.match(/^305[123][123]/) && !['305131','305132','305230','305231','305233'].includes(c)) return 'prog';
  if (titleTh.includes('โครงงาน') || titleTh.includes('วิจัย') || titleTh.includes('ประสบการณ์') || titleTh.includes('ปฏิบัติงาน') || titleTh.includes('การศึกษาเชิงบูรณาการ') || titleTh.includes('เลือกทางวิศวกรรม') || c.includes('xxx')) return 'proj';
  if (c.match(/^305[1234]9/)) return 'proj';
  if (c.match(/^305[123]0/)) return 'gened';

  return 'prog';
}

const COURSE_SHORT_NAMES: Record<string, string> = {
  "252182": "Calc 1",
  "252183": "Calc 2",
  "252284": "Calc 3",

  "261101": "Physics 1",
  "261102": "Physics 2",
  "261111": "Lab Phy 1",
  "261112": "Lab Phy 2",

  "305121": "Com Pro 1",
  "305122": "Com Pro 2",
  "305232": "Data Struct",
  "305131": "Discrete 1",
  "305132": "Discrete 2",

  "305141": "IoT Intro",
  "305142": "Circuit",
  "305241": "Digital Logic",
  "305245": "Electronics",
  "305242": "Network",
  "305343": "Com Arch",
  "305341": "Embed 1",
  "305342": "Embed 2",

  "305221": "AI",
  "305230": "Prob & Stat",
  "305231": "Applied Stat",
  "305233": "Numerical",
  "305311": "Database",
  "305323": "Software Eng",
  "305334": "OS",
  "305335": "Signal Proc",
  "305331": "Security",

  "305321": "Machine Learning",
  "305372": "Compiler",
  "305445": "Network Prog",

  "305491": "Project 1",
  "305492": "Project 2",
  "305493": "Practicum 1",
  "305494": "Practicum 2",
  "305495": "Research 1",
  "305496": "Research 2",

  "305191": "Field Exp 1",
  "305192": "Field Exp 2",
  "305291": "Field Exp 3",
  "305292": "Field Exp 4",
  "305391": "Field Exp 5",
  "305393": "Training",

  "300301": "Technopreneur",
  "300302": "Prof. English",

  "305101": "Soft Skill 1",
  "305102": "Soft Skill 2",
  "305201": "Soft Skill 3",
  "305202": "Soft Skill 4",
  "305301": "Soft Skill 5",
  
  "001281": "Sports"
};

function getCourseShortName(course: { code?: string, titleTh?: string }): string {
  if (course.code && COURSE_SHORT_NAMES[course.code]) {
    return COURSE_SHORT_NAMES[course.code];
  }
  if (!course.code || course.code === 'xxxxxx' || course.code.includes('xxx')) {
    const t = course.titleTh || '';
    if (course.code === '001xxx' || t.includes('ศึกษาทั่วไป')) return 'GenEd';
    if (t.includes('เลือกทางวิศวกรรม')) return 'Major Elective';
    if (t.includes('เลือกเสรี')) return 'Free Elective';
    return 'Elective';
  }
  return course.titleTh || course.code || 'Unknown';
}

// ---------------------------------------------------------
// KEY CHAINS DEFINITION (Manual Deterministic Lanes)
// ---------------------------------------------------------
type KeyChain = { id: string; offset: number; color: string; nodes: string[] };

const KEY_CHAINS: KeyChain[] = [
  { id: 'math', offset: 0, color: '#be185d', nodes: ['252182', '252183', '252284'] }, // Calc
  { id: 'physics', offset: -12, color: '#be185d', nodes: ['261101', '261102'] }, // Physics
  { id: 'prog', offset: 12, color: '#15803d', nodes: ['305121', '305122', '305232'] }, // Programming
  { id: 'logic', offset: 24, color: '#1d4ed8', nodes: ['305241', '305341', '305342'] }, // Embed
  { id: 'circuit', offset: 36, color: '#1d4ed8', nodes: ['305142', '305245'] }, // Electronics
  { id: 'proj1', offset: 0, color: '#7e22ce', nodes: ['305491', '305492'] },
  { id: 'proj2', offset: 10, color: '#7e22ce', nodes: ['305493', '305494'] },
  { id: 'proj3', offset: -10, color: '#7e22ce', nodes: ['305495', '305496'] },
];

type LineCoords = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  source: string;
  target: string;
  color: string;
  offset: number;
  isSameRow?: boolean;
};

export function CurriculumGridDiagram({ courseIndex }: { courseIndex: CourseIndex }) {
  const { openCourse } = useCourseModal();
  const [expandedSems, setExpandedSems] = useState<Record<string, boolean>>({});
  const [lines, setLines] = useState<LineCoords[]>([]);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [activeGroupCourses, setActiveGroupCourses] = useState<{ title: string, courses: StudyCourse[] } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const toggleSem = (semId: string) => {
    setExpandedSems(prev => ({ ...prev, [semId]: !prev[semId] }));
  };

  const semesters = ((studyPlan as { years?: StudyYear[] }).years || []).flatMap((year) =>
    (year.semesters || year.terms || []).map(sem => ({ ...sem, yearNumber: year.year }))
  );

  // Group Courses to maintain 2-line maximum
  const compactSemesterCourses = (courses: StudyCourse[]) => {
    if (courses.length <= 6) return courses as (StudyCourse & { groupedCourses?: StudyCourse[] })[];
    
    const keyCourses: (StudyCourse & { groupedCourses?: StudyCourse[] })[] = [];
    const genEdList: StudyCourse[] = [];
    const elecList: StudyCourse[] = [];
    const softList: StudyCourse[] = [];

    courses.forEach(c => {
      const short = getCourseShortName(c);
      if (short === 'GenEd') genEdList.push(c);
      else if (short.includes('Elective')) elecList.push(c);
      else if (short.includes('Soft Skill')) softList.push(c);
      else keyCourses.push(c);
    });

    if (genEdList.length > 0) keyCourses.push({ code: 'gened-group', titleTh: `ศึกษาทั่วไป x${genEdList.length}`, courseId: 'gened-group', groupedCourses: genEdList });
    if (elecList.length > 0) keyCourses.push({ code: 'elec-group', titleTh: `วิชาเลือก x${elecList.length}`, courseId: 'elec-group', groupedCourses: elecList });
    if (softList.length > 0) keyCourses.push({ code: 'soft-group', titleTh: `ทักษะเสริม x${softList.length}`, courseId: 'soft-group', groupedCourses: softList });

    return keyCourses;
  };

  // Extract edges from chains
  const calculateLines = useCallback(() => {
    if (!containerRef.current) return;
    
    const newLines: LineCoords[] = [];
    const containerRect = containerRef.current.getBoundingClientRect();
    
    KEY_CHAINS.forEach(chain => {
      for (let i = 0; i < chain.nodes.length - 1; i++) {
        const fromCode = chain.nodes[i];
        const toCode = chain.nodes[i+1];
        
        const sourceEl = document.getElementById(`cm-node-${fromCode}`);
        const targetEl = document.getElementById(`cm-node-${toCode}`);
        
        if (sourceEl && targetEl && sourceEl.offsetParent && targetEl.offsetParent) {
          const sRect = sourceEl.getBoundingClientRect();
          const tRect = targetEl.getBoundingClientRect();
          
          const sameSemester = Math.abs(sRect.top - tRect.top) < 40;
          let x1, y1, x2, y2, isSameRow;
          
          if (sameSemester) {
            x1 = (sRect.left + sRect.right) / 2 - containerRect.left;
            y1 = sRect.bottom - containerRect.top;
            x2 = (tRect.left + tRect.right) / 2 - containerRect.left;
            y2 = tRect.bottom - containerRect.top + 6;
            isSameRow = true;
          } else {
            x1 = (sRect.left + sRect.right) / 2 - containerRect.left;
            y1 = sRect.bottom - containerRect.top;
            x2 = (tRect.left + tRect.right) / 2 - containerRect.left;
            y2 = tRect.top - containerRect.top - 6;
            isSameRow = false;
          }
          
          newLines.push({
            id: `line-${fromCode}-${toCode}`,
            x1, y1, x2, y2,
            isSameRow,
            source: fromCode,
            target: toCode,
            color: chain.color,
            offset: chain.offset
          });
        }
      }
    });
    
    setLines(newLines);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(calculateLines, 150);
    window.addEventListener('resize', calculateLines);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', calculateLines);
    };
  }, [calculateLines]);

  const createPath = (line: LineCoords) => {
    const { x1, y1, x2, y2, isSameRow, offset } = line;
    
    if (isSameRow) {
      const gutterY = Math.max(y1, y2) + 12 + offset;
      const r = 6;
      const dir = x2 > x1 ? 1 : -1;
      
      if (Math.abs(x2 - x1) < 10) return `M ${x1} ${y1} L ${x2} ${y2}`;
      
      return `M ${x1} ${y1} 
              L ${x1} ${gutterY - r} 
              Q ${x1} ${gutterY} ${x1 + (r * dir)} ${gutterY} 
              L ${x2 - (r * dir)} ${gutterY} 
              Q ${x2} ${gutterY} ${x2} ${gutterY - r} 
              L ${x2} ${y2}`;
    } else {
      const dy = Math.abs(y2 - y1);
      const gutterY = y1 + Math.min(24, dy * 0.5) + offset;
      const r = 8;
      
      if (Math.abs(x2 - x1) < 10) {
        return `M ${x1} ${y1} L ${x2} ${y2}`;
      } else {
        const dir = x2 > x1 ? 1 : -1;
        return `M ${x1} ${y1} 
                L ${x1} ${gutterY - r} 
                Q ${x1} ${gutterY} ${x1 + (r * dir)} ${gutterY} 
                L ${x2 - (r * dir)} ${gutterY} 
                Q ${x2} ${gutterY} ${x2} ${gutterY + r} 
                L ${x2} ${y2}`;
      }
    }
  };

  // Sort: Key sources to the left
  const sortPosterCourses = (courses: StudyCourse[]) => {
    return [...courses].sort((a, b) => {
      const aCode = a.code || a.courseId || '';
      const bCode = b.code || b.courseId || '';
      
      const aIsKey = KEY_CHAINS.some(c => c.nodes.includes(aCode));
      const bIsKey = KEY_CHAINS.some(c => c.nodes.includes(bCode));
      
      if (aIsKey && !bIsKey) return -1;
      if (!aIsKey && bIsKey) return 1;
      return 0;
    });
  };

  return (
    <section className="visual-card">
      <SectionHeader title="แผนผังหลักสูตร 4 ปี" description="ภาพรวมรายวิชาในแต่ละเทอม พร้อมเส้นวิชาตัวต่อที่สำคัญ" />
      
      {/* Legend */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.75rem', marginBottom: '8px' }}>
          {Object.values(CATEGORIES).map(cat => (
            <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.bg, border: `1px solid ${cat.border}` }}></div>
            <span style={{ color: 'var(--text-muted)' }}>{cat.label}</span>
          </div>
        ))}
        </div>
      </div>

      {/* 1:1 POSTER WRAPPER */}
      <div className="curriculum-poster-wrapper" style={{ width: '100%', justifyContent: 'center' }}>
          <div 
            ref={containerRef} 
            className="curriculum-poster-map" 
            style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '1080px', 
              aspectRatio: '1 / 1', 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '24px',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden'
            }}
          >
            {/* SVG OVERLAY */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
              <defs>
                {KEY_CHAINS.map(c => (
                  <marker key={`arrow-${c.id}`} id={`arrow-${c.id}`} markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                    <polygon points="0 0, 7 2.5, 0 5" fill={c.color} />
                  </marker>
                ))}
                <marker id="arrow-active" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#f97316" />
                </marker>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f97316" floodOpacity="0.5"/>
                </filter>
              </defs>

              {lines.map(line => {
                const isActive = hoveredCourse === line.source || hoveredCourse === line.target;
                
                let strokeColor = line.color;
                let strokeWidth = 3.5;
                let opacity = 0.9;
                let markerId = `url(#arrow-${KEY_CHAINS.find(c => c.color === line.color)?.id})`;
                let zIndex = 5;
                let filter = 'none';
                
                if (isActive) {
                  strokeColor = '#f97316';
                  strokeWidth = 4.5;
                  opacity = 1;
                  markerId = 'url(#arrow-active)';
                  zIndex = 20;
                  filter = 'url(#glow)';
                } else if (hoveredCourse && !isActive) {
                  // Dim slightly if hovering over unrelated course, but DO NOT hide it completely
                  opacity = 0.55; 
                  zIndex = 0;
                }
                
                return (
                  <path
                    key={line.id}
                    d={createPath(line)}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    markerEnd={markerId}
                    filter={filter}
                    style={{ transition: 'all 0.2s', zIndex }}
                  />
                );
              })}
            </svg>

            {/* SEMESTER ROWS (Wrap layout, max 2 lines) */}
            {semesters.map((sem) => {
              const isSummer = (sem.semester === 'ฤดูร้อน') || (sem.title || '').includes('Summer') || (sem.title || '').includes('ฤดูร้อน');
              const coursesToRender = compactSemesterCourses(sem.courses || []);
              const sortedCourses = sortPosterCourses(coursesToRender);
              
              const isLongBar = isSummer && sortedCourses.length <= 2;

              return (
                <div 
                  key={sem.id} 
                  style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    alignItems: 'stretch', 
                    position: 'relative', 
                    zIndex: 1,
                    flexGrow: isSummer ? 0 : 1,
                    minHeight: isSummer ? '40px' : '52px'
                  }}
                >
                  {/* Semester Label */}
                  <div style={{ width: '70px', flexShrink: 0, textAlign: 'right', paddingTop: '4px' }}>
                    <h3 style={{ margin: '0 0 2px 0', fontSize: '0.8rem', color: 'var(--text)', fontWeight: 700 }}>{(sem.title || '').replace('เทอม ', 'T')}</h3>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{sem.totalCredits} CR</div>
                  </div>
                  
                  {/* Courses container (Flex Wrap) */}
                  <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '8px 12px', alignContent: 'flex-start' }}>
                    {isLongBar ? (
                      <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
                        {sortedCourses.map(c => {
                          const fullCourse = c.code && !c.code.includes('x') && !c.code.includes('group') ? courseIndex.findCourseByCode(c.code) : null;
                          const catKey = getCourseCategory(c.code || '', c.titleTh || '');
                          const cat = CATEGORIES[catKey];
                          const nodeId = c.code !== 'xxxxxx' && !c.code?.includes('xxx') ? c.code : c.courseId;
                          
                          return (
                            <div 
                              key={nodeId}
                              id={`cm-node-${nodeId}`}
                              onClick={() => fullCourse && openCourse(fullCourse.id)}
                              title={`${c.code} ${c.titleTh}`}
                              style={{
                                flex: 1,
                                height: '42px',
                                background: cat.bg, 
                                border: `1px solid ${cat.border}`, 
                                borderRadius: '6px', 
                                padding: '4px 12px',
                                cursor: fullCourse ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                zIndex: 10
                              }}
                            >
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: cat.color }}>{c.code !== 'xxxxxx' && !c.code?.includes('xxx') ? c.code : ''}</span>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{getCourseShortName(c)}</span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      sortedCourses.map(c => {
                        const isGroup = c.code?.includes('group');
                        const fullCourse = c.code && !c.code.includes('x') && !isGroup ? courseIndex.findCourseByCode(c.code) : null;
                        const catKey = getCourseCategory(c.code || '', c.titleTh || '');
                        const cat = CATEGORIES[catKey];
                        const nodeId = c.code !== 'xxxxxx' && !c.code?.includes('xxx') ? c.code : c.courseId;
                        
                        const isHovered = hoveredCourse === nodeId;
                        
                        return (
                          <div 
                            key={nodeId}
                            id={`cm-node-${nodeId}`}
                            onClick={() => {
                              if (isGroup) {
                                setActiveGroupCourses({ title: c.titleTh || 'Group', courses: (c as any).groupedCourses || [] });
                              } else if (fullCourse) {
                                openCourse(fullCourse.id);
                              }
                            }}
                            onMouseEnter={() => setHoveredCourse(nodeId || null)}
                            onMouseLeave={() => setHoveredCourse(null)}
                            title={`${c.code !== 'xxxxxx' && !c.code?.includes('xxx') ? c.code : ''} ${c.titleTh}`}
                            style={{
                              width: '96px', // Tiny nodes
                              height: '48px', // Compact height
                              background: cat.bg, 
                              border: `1px solid ${cat.border}`, 
                              borderRadius: '6px', 
                              padding: '4px 6px',
                              cursor: fullCourse ? 'pointer' : 'default', 
                              transition: 'all 0.2s',
                              boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.02)', 
                              position: 'relative',
                              transform: isHovered ? 'translateY(-2px)' : 'none',
                              zIndex: isHovered ? 20 : 10,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              textAlign: 'center'
                            }}
                          >

                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: cat.color, marginBottom: '2px', lineHeight: 1 }}>
                              {isGroup ? 'Group' : (c.code !== 'xxxxxx' && !c.code?.includes('xxx') ? c.code : '')}
                            </div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {isGroup ? c.titleTh : getCourseShortName(c)}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      {/* Mobile Accordion Layout */}
      <div className="curriculum-accordion-mobile" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
        <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
          💡 แนะนำให้เปิดดูบนจอใหญ่เพื่อดูแผนผังหลักสูตร
        </div>
        
        {semesters.map((sem) => {
          const isExpanded = !!expandedSems[sem.id || ''];
          const courses = sem.courses || [];

          return (
            <div key={sem.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
              <div 
                onClick={() => toggleSem(sem.id || '')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer', background: isExpanded ? 'var(--bg)' : 'transparent' }}
              >
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--text)' }}>{sem.title}</h3>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>{sem.totalCredits} หน่วยกิต</span>
                  </div>
                </div>
                <div>{isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</div>
              </div>

              {isExpanded && (
                <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {courses.map(c => {
                    const fullCourse = c.code && !c.code.includes('x') ? courseIndex.findCourseByCode(c.code) : null;
                    const catKey = getCourseCategory(c.code || '', c.titleTh || '');
                    const cat = CATEGORIES[catKey];
                    const nodeId = c.code !== 'xxxxxx' && !c.code?.includes('xxx') ? c.code : c.courseId;
                    
                    const preReqs = officialPrerequisites.filter(e => e.to === nodeId).map(e => e.from);
                    
                    return (
                      <div 
                        key={c.courseId || c.code} 
                        onClick={() => fullCourse && openCourse(fullCourse.id)}
                        style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: '12px', cursor: fullCourse ? 'pointer' : 'default' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: cat.color }}>{c.code !== 'xxxxxx' && !c.code?.includes('xxx') ? c.code : ''}</div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>{getCourseShortName(c)}</div>
                          </div>
                        </div>
                        {preReqs.length > 0 && (
                          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px dashed ${cat.border}`, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span style={{ fontWeight: 600 }}>ต้องผ่าน:</span> {preReqs.join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grouped Node Popover Modal */}
      {activeGroupCourses && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setActiveGroupCourses(null)}>
          <div style={{ background: 'var(--bg)', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{activeGroupCourses.title}</h3>
              <button onClick={() => setActiveGroupCourses(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeGroupCourses.courses.map(gc => {
                const fc = gc.code && !gc.code.includes('x') ? courseIndex.findCourseByCode(gc.code) : null;
                const cat = CATEGORIES[getCourseCategory(gc.code || '', gc.titleTh || '')];
                return (
                  <div 
                    key={gc.courseId || gc.code}
                    onClick={() => {
                      if (fc) {
                        openCourse(fc.id);
                        setActiveGroupCourses(null);
                      }
                    }}
                    style={{ padding: '12px', background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: '8px', cursor: fc ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '12px' }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: cat.color }}>{gc.code !== 'xxxxxx' && !gc.code?.includes('xxx') ? gc.code : ''}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{gc.titleTh || getCourseShortName(gc)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .curriculum-poster-wrapper { display: flex !important; }
          .curriculum-accordion-mobile { display: none !important; }
        }
        @media (max-width: 1023px) {
          .curriculum-poster-wrapper { display: none !important; }
          .curriculum-accordion-mobile { display: flex !important; }
        }
      `}</style>
    </section>
  );
}
