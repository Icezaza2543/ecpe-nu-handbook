import { useState, type CSSProperties } from 'react';
import { roadmaps } from '../data/roadmaps';
import type { RoadmapItem } from '../types/roadmap';
import type { CourseIndex } from '../utils/courseIndex';
import { CourseChip } from '../components/common/CourseChip';
import {
  AlertTriangle,
  BookOpen,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Cloud,
  Code2,
  Compass,
  Cpu,
  Gamepad2,
  Layers3,
  Microscope,
  Route,
  ShieldCheck,
  Target,
  Terminal,
  Wrench,
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

function toCourseRef(item: NonNullable<RoadmapItem['recommendedCourses']>[number]): string {
  return typeof item === 'string' ? item : item.courseId || item.code || item.id || item.name || item.title || '';
}

function getRoleColor(id: string) {
  if (id.includes('software')) return '#2563eb';
  if (id.includes('ai') || id.includes('data')) return '#6d28d9';
  if (id.includes('embedded') || id.includes('iot')) return '#059669';
  if (id.includes('network') || id.includes('cloud')) return '#0891b2';
  if (id.includes('cyber')) return '#d97706';
  if (id.includes('robotic')) return '#dc2626';
  if (id.includes('graphic') || id.includes('game') || id.includes('vision')) return '#db2777';
  if (id.includes('research')) return '#4f46e5';
  if (id.includes('entrepreneur') || id.includes('management')) return '#ca8a04';
  return '#2563eb';
}

function getRoleIcon(id: string) {
  if (id.includes('software')) return Code2;
  if (id.includes('ai') || id.includes('data')) return BrainCircuit;
  if (id.includes('embedded') || id.includes('iot')) return Cpu;
  if (id.includes('network') || id.includes('cloud')) return Cloud;
  if (id.includes('cyber')) return ShieldCheck;
  if (id.includes('robotic')) return Bot;
  if (id.includes('graphic') || id.includes('game') || id.includes('vision')) return Gamepad2;
  if (id.includes('research')) return Microscope;
  if (id.includes('entrepreneur') || id.includes('management')) return BriefcaseBusiness;
  return Compass;
}

function getRoleTagline(id: string) {
  if (id.includes('software')) return 'สร้างระบบและแอปที่คนใช้จริง';
  if (id.includes('ai') || id.includes('data')) return 'เปลี่ยนข้อมูลให้กลายเป็นการตัดสินใจ';
  if (id.includes('embedded') || id.includes('iot')) return 'เชื่อมซอฟต์แวร์กับฮาร์ดแวร์';
  if (id.includes('network') || id.includes('cloud')) return 'ดูแลระบบให้เชื่อมต่อและ scale ได้';
  if (id.includes('cyber')) return 'ป้องกันระบบด้วยจริยธรรม';
  if (id.includes('robotic')) return 'ทำให้เครื่องจักรตัดสินใจได้';
  if (id.includes('graphic') || id.includes('game')) return 'ภาพ เกม และการมองเห็นของคอมพิวเตอร์';
  if (id.includes('research')) return 'ค้นคว้าและต่อยอดองค์ความรู้';
  if (id.includes('entrepreneur')) return 'เปลี่ยนเทคโนโลยีเป็นธุรกิจ';
  return 'สำรวจสายงานที่ต่อยอดจากหลักสูตร';
}

function getRoleKeywords(id: string) {
  if (id.includes('software')) return ['Web/App', 'Backend', 'System Design'];
  if (id.includes('ai') || id.includes('data')) return ['Machine Learning', 'Statistics', 'Data Pipeline'];
  if (id.includes('embedded') || id.includes('iot')) return ['Hardware', 'Sensors', 'Firmware'];
  if (id.includes('network') || id.includes('cloud')) return ['Infrastructure', 'Scaling', 'DevOps'];
  if (id.includes('cyber')) return ['Security', 'Ethical Hacking', 'Risk Management'];
  if (id.includes('robotic')) return ['Control', 'Automation', 'Sensors'];
  if (id.includes('graphic') || id.includes('game')) return ['Computer Vision', 'Rendering', 'Interactive'];
  if (id.includes('research')) return ['Paper', 'Algorithms', 'Innovation'];
  if (id.includes('entrepreneur')) return ['Business', 'Product', 'Agile'];
  return ['Tech', 'Coding', 'Logic'];
}

function difficultyLabel(value?: string) {
  if (value === 'beginner') return 'เริ่มต้น';
  if (value === 'intermediate') return 'กลาง';
  if (value === 'advanced') return 'สูง';
  return value || 'ไม่ระบุ';
}

export function CareerRoadmapsPage({ courseIndex }: { courseIndex: CourseIndex }) {
  const items = roadmaps as unknown as RoadmapItem[];
  const [activeId, setActiveId] = useState(items[0]?.id || '');
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>('ecpe-v2-career-roadmap-checklist', {});
  const active = items.find((item) => item.id === activeId) || items[0];
  const accentColor = getRoleColor(String(active?.id || ''));

  if (!active) return null;

  const activeRoleId = String(active.id || '');
  const ActiveIcon = getRoleIcon(activeRoleId);
  const checkedCount = (active.portfolioChecklist || []).filter((_, index) => checked[`${active.id}-port-${index}`]).length;

  return (
    <div className="page career-roadmaps-page" style={{ '--career-color': accentColor } as CSSProperties}>
      <section className="career-command" aria-label="Career roadmap overview">
        <div className="career-command__copy">
          <span className="technical-label">Career Roadmaps</span>
          <h1>สายอาชีพไหนที่อยากทำ?</h1>
          <p>
            ทักษะ เครื่องมือ และ checklist เพื่อให้น้องเห็นว่าแต่ละสายควรเริ่มจากอะไร
          </p>
        </div>
        <aside className="career-command__panel">
          <div>
            <Route size={20} aria-hidden="true" />
            <span>Active Track</span>
          </div>
          <strong>{String(active.titleTh || active.title || '')}</strong>
          <p>{getRoleTagline(activeRoleId)}</p>
        </aside>
      </section>

      <div className="career-layout">
        <aside className="career-selector" aria-label="เลือกสายอาชีพ">
          <div className="career-selector__head">
            <span>เลือกสายที่สนใจ</span>
            <strong>{items.length} tracks</strong>
          </div>
          <div className="career-selector__grid">
            {items.map((item) => {
              const id = String(item.id || '');
              const isSelected = active?.id === item.id;
              const color = getRoleColor(id);
              const Icon = getRoleIcon(id);
              return (
                <button
                  type="button"
                  key={item.id}
                  className={isSelected ? 'career-selector-card is-active' : 'career-selector-card'}
                  onClick={() => setActiveId(item.id || '')}
                  style={{ '--career-color': color } as CSSProperties}
                >
                  <span className="career-selector-card__icon">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{String(item.titleTh || item.title || item.id || '')}</strong>
                    <small>{getRoleTagline(id)}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="career-workspace">
          <section className="career-focus-panel">
            <div className="career-focus-panel__title">
              <span className="career-focus-panel__icon">
                <ActiveIcon size={32} aria-hidden="true" />
              </span>
              <div>
                <span>Track workspace</span>
                <h2>{String(active.titleTh || active.title || '')}</h2>
              </div>
            </div>
            <p>{String(active.overview || active.description || '')}</p>
            <div className="career-keyword-row">
              {getRoleKeywords(activeRoleId).map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
            <div className="career-signal-grid">
              <div>
                <strong>{active.recommendedCourses?.length || 0}</strong>
                <span>วิชาเกี่ยวข้อง</span>
              </div>
              <div>
                <strong>{active.yearPlan?.length || 0}</strong>
                <span>ชั้นปีในแผน</span>
              </div>
              <div>
                <strong>{active.projectIdeas?.length || 0}</strong>
                <span>project brief</span>
              </div>
              <div>
                <strong>{checkedCount}/{active.portfolioChecklist?.length || 0}</strong>
                <span>portfolio checklist</span>
              </div>
            </div>
          </section>

          {activeRoleId.includes('cyber') ? (
            <section className="career-warning">
              <AlertTriangle size={22} aria-hidden="true" />
              <div>
                <strong>ความรับผิดชอบของสาย Cybersecurity</strong>
                <p>
                  การทดลองหรือเจาะระบบต้องทำใน lab หรือสภาพแวดล้อมที่ได้รับอนุญาตเท่านั้น
                  ห้ามนำทักษะไปโจมตีระบบของผู้อื่นโดยไม่ได้รับอนุญาต
                </p>
              </div>
            </section>
          ) : null}

          {active.whoIsThisFor?.length ? (
            <section className="career-section">
              <div className="career-section__heading">
                <Target size={22} aria-hidden="true" />
                <h3>เหมาะกับคนที่...</h3>
              </div>
              <div className="career-check-list">
                {active.whoIsThisFor.map((item: string) => (
                  <span key={item}>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {active.recommendedCourses?.length ? (
            <section className="career-section">
              <div className="career-section__heading">
                <BookOpen size={22} aria-hidden="true" />
                <h3>วิชาที่ควรโฟกัส</h3>
              </div>
              <div className="chip-grid career-course-grid">
                {active.recommendedCourses.map((item, index) => {
                  const ref = toCourseRef(item);
                  return <CourseChip key={ref || index} course={courseIndex.findCourse(ref)} courseRef={ref} />;
                })}
              </div>
            </section>
          ) : null}

          {active.yearPlan?.length ? (
            <section className="career-section">
              <div className="career-section__heading">
                <Compass size={22} aria-hidden="true" />
                <h3>Skill Tree ตามชั้นปี</h3>
              </div>
              <div className="career-skill-tree">
                {active.yearPlan.map((yearPlan: any, index: number) => (
                  <article key={`${yearPlan.year}-${yearPlan.title}`} className="career-skill-node">
                    <div className="career-skill-node__head">
                      <span>Tier {index + 1}</span>
                      <h4>
                        ปี {yearPlan.year}: {yearPlan.title}
                      </h4>
                    </div>
                    <div className="career-skill-node__grid">
                      <div>
                        <strong>Focus</strong>
                        <ul>
                          {yearPlan.focus.map((focus: string) => (
                            <li key={focus}>{focus}</li>
                          ))}
                        </ul>
                      </div>
                      {yearPlan.courses?.length ? (
                        <div>
                          <strong>วิชาที่เกี่ยวข้อง</strong>
                          <div className="chip-grid compact">
                            {yearPlan.courses.map((courseRef: string) => (
                              <CourseChip
                                key={courseRef}
                                course={courseIndex.findCourse(courseRef)}
                                courseRef={courseRef}
                              />
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {active.tools?.length ? (
            <section className="career-section">
              <div className="career-section__heading">
                <Wrench size={22} aria-hidden="true" />
                <h3>Tool stack ที่ควรรู้จัก</h3>
              </div>
              <div className="career-tool-list">
                {active.tools.map((tool: any) => (
                  <span key={`${tool.name}-${tool.level}`}>
                    <strong>{tool.name}</strong>
                    <small>{String(tool.level || 'learn')}</small>
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {active.projectIdeas?.length ? (
            <section className="career-section">
              <div className="career-section__heading">
                <Terminal size={22} aria-hidden="true" />
                <h3>Project briefs สำหรับ portfolio</h3>
              </div>
              <div className="career-project-grid">
                {active.projectIdeas.map((project: any) => (
                  <article key={`${project.title}-${project.difficulty}`} className="career-project-card">
                    <div>
                      <h4>{project.title}</h4>
                      <span className={`difficulty-badge difficulty-badge--${project.difficulty || 'unknown'}`}>
                        {difficultyLabel(project.difficulty)}
                      </span>
                    </div>
                    <p>{project.description}</p>
                    {project.skills?.length ? (
                      <div className="career-project-card__skills">
                        {project.skills.map((skill: string) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {active.portfolioChecklist?.length ? (
            <section className="career-section">
              <div className="career-section__heading">
                <Check size={22} aria-hidden="true" />
                <h3>Portfolio checklist</h3>
              </div>
              <div className="career-portfolio-grid">
                {active.portfolioChecklist.map((item: string, index: number) => {
                  const checkKey = `${active.id}-port-${index}`;
                  const isChecked = checked[checkKey];
                  return (
                    <label key={item} className={isChecked ? 'is-checked' : ''}>
                      <input
                        type="checkbox"
                        checked={Boolean(isChecked)}
                        onChange={(event) => setChecked({ ...checked, [checkKey]: event.target.checked })}
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          ) : null}

          <footer className="career-footer-note">
            <Layers3 size={18} aria-hidden="true" />
            <span>ใช้ roadmap เป็นแผนทดลอง ไม่ใช่กรอบบังคับ เลือก track ที่อยากลอง แล้วสะสมผลงานทีละชิ้น</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
