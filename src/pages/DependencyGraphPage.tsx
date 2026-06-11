import { useState, type CSSProperties } from 'react';
import {
  AlertTriangle,
  Crosshair,
  GitBranch,
  Map,
  Radar,
  ShieldCheck,
} from 'lucide-react';
import type { CourseIndex } from '../utils/courseIndex';
import { CriticalPathMap } from '../components/visuals/CriticalPathMap';
import { OfficialPrerequisiteGraph } from '../components/visuals/OfficialPrerequisiteGraph';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { VisualFallback } from '../components/common/VisualFallback';
import { officialPrerequisites } from '../data/officialPrerequisites';
import { dependencies } from '../data/dependencies';

type DependencyMode = 'official' | 'critical';

const modeCopy: Record<
  DependencyMode,
  {
    title: string;
    eyebrow: string;
    description: string;
    color: string;
    icon: typeof Map;
    legend: string[];
  }
> = {
  official: {
    title: 'โหมดอ่านเงื่อนไขทางการ',
    eyebrow: 'Readable prerequisite map',
    description:
      'เหมาะกับการเช็กก่อนลงทะเบียน อ่านจากวิชาพื้นฐานไปยังวิชาถัดไป และกดรายวิชาเพื่อเปิดรายละเอียดได้ทันที',
    color: 'var(--primary)',
    icon: Map,
    legend: ['วิชาพื้นฐาน', 'วิชาที่ต้องผ่านก่อน', 'วิชาถัดไปที่ปลดล็อก'],
  },
  critical: {
    title: 'โหมดเส้นทางเสี่ยง',
    eyebrow: 'Critical risk path',
    description:
      'รวมสายวิชาที่ถ้าสอบไม่ผ่านแล้วกระทบหลายเทอมต่อเนื่อง เหมาะกับการวางแผนกันพลาดตั้งแต่ต้นปี',
    color: 'var(--danger)',
    icon: Crosshair,
    legend: ['คอขวดหลัก', 'ผลกระทบต่อเนื่อง', 'คำเตือนจากรุ่นพี่'],
  },
};

export function DependencyGraphPage({ courseIndex }: { courseIndex: CourseIndex }) {
  const [activeMode, setActiveMode] = useState<DependencyMode>('official');

  const officialEdgesCount = (officialPrerequisites as any[]).filter((edge) => edge.from && edge.to).length;
  const criticalPathsCount =
    (dependencies as any).chains?.filter((chain: any) => chain.dangerLevel === 'critical').length || 0;
  const dangerousCourses = courseIndex.getCatalogCourses().filter((course) => course.dangerousToFail).length;
  const active = modeCopy[activeMode];
  const ActiveIcon = active.icon;

  return (
    <div className="page dependency-graph-page">
      <section className="dependency-console" aria-label="Prerequisite explorer overview">
        <div className="dependency-console__copy">
          <span className="technical-label">Prerequisite Explorer</span>
          <h1>วิชาตัวต่อที่อ่านแล้วตัดสินใจได้</h1>
          <p>
            เปลี่ยน prerequisite จากเส้นโยงรก ๆ ให้เป็นเครื่องมือวางแผน เริ่มจากโหมดอ่านง่าย แล้วค่อยเปิด graph
            explore เมื่ออยากสำรวจความเชื่อมโยงละเอียดขึ้น
          </p>

          <div className="dependency-stats" aria-label="สรุปข้อมูลวิชาตัวต่อ">
            <div>
              <strong>{officialEdgesCount}</strong>
              <span>คู่เงื่อนไขทางการ</span>
            </div>
            <div>
              <strong>{criticalPathsCount}</strong>
              <span>เส้นทางเสี่ยงสูง</span>
            </div>
            <div>
              <strong>{dangerousCourses}</strong>
              <span>วิชาที่ไม่ควรพลาด</span>
            </div>
          </div>
        </div>

        <aside className="dependency-inspector-preview" aria-label="ตัวอย่าง inspector">
          <div className="dependency-inspector-preview__header">
            <span>
              <Radar size={18} aria-hidden="true" />
              Impact Inspector
            </span>
            <strong>LIVE</strong>
          </div>
          <h2>ถ้าติดวิชานี้ กระทบอะไร?</h2>
          <p>ใช้หน้านี้ไล่ดูผลกระทบก่อนลงทะเบียนหรือก่อนตัดสินใจถอนรายวิชา</p>
          <div className="dependency-impact-list">
            <div>
              <ShieldCheck size={18} aria-hidden="true" />
              <span>อ่านเงื่อนไขทางการก่อน</span>
            </div>
            <div>
              <GitBranch size={18} aria-hidden="true" />
              <span>ดูวิชาที่ถูกล็อกต่อ</span>
            </div>
            <div>
              <AlertTriangle size={18} aria-hidden="true" />
              <span>เช็กเส้นทางที่กระทบแผนจบ</span>
            </div>
          </div>
          <div className="dependency-chain-preview" aria-hidden="true">
            <span>พื้นฐาน</span>
            <i />
            <span>ตัวต่อ</span>
            <i />
            <span>ปีสูง</span>
          </div>
        </aside>
      </section>

      <section
        className="dependency-mode-panel"
        style={{ '--mode-color': active.color } as CSSProperties}
        aria-label="โหมดสำรวจวิชาตัวต่อ"
      >
        <div className="dependency-mode-toolbar" role="tablist" aria-label="เลือกโหมดวิชาตัวต่อ">
          {(Object.keys(modeCopy) as DependencyMode[]).map((mode) => {
            const ModeIcon = modeCopy[mode].icon;
            const isActive = activeMode === mode;
            return (
              <button
                type="button"
                key={mode}
                role="tab"
                aria-selected={isActive}
                className={isActive ? 'is-active' : ''}
                onClick={() => setActiveMode(mode)}
              >
                <ModeIcon size={18} aria-hidden="true" />
                {mode === 'official' ? 'เงื่อนไขทางการ' : 'เส้นทางเสี่ยง'}
              </button>
            );
          })}
        </div>

        <div className="dependency-mode-copy">
          <div>
            <span>{active.eyebrow}</span>
            <h2>
              <ActiveIcon size={24} aria-hidden="true" />
              {active.title}
            </h2>
            <p>{active.description}</p>
          </div>
          <div className="dependency-mode-legend" aria-label="คำอธิบายสัญลักษณ์">
            {active.legend.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="dependency-graph-stage">
          {activeMode === 'official' ? (
            <ErrorBoundary name="Official Prerequisite Graph" fallback={<VisualFallback />}>
              <OfficialPrerequisiteGraph courseIndex={courseIndex} />
            </ErrorBoundary>
          ) : (
            <ErrorBoundary name="Critical Path Map" fallback={<VisualFallback />}>
              <CriticalPathMap courseIndex={courseIndex} />
            </ErrorBoundary>
          )}
        </div>
      </section>
    </div>
  );
}
