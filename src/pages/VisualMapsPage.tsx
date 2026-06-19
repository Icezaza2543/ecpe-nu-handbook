import { useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Grid,
  Layers3,
  Map,
  Maximize2,
  Network,
  Route
} from 'lucide-react';
import { useCourseIndex } from '../hooks/useCourseIndex';
import { CriticalPathMap } from '../components/visuals/CriticalPathMap';
import { CurriculumFlowchart } from '../components/visuals/CurriculumFlowchart';
import { CurriculumGridDiagram } from '../components/visuals/CurriculumGridDiagram';
import { GenEdExplorer } from '../components/visuals/GenEdExplorer';
import { GraduationWorkflow } from '../components/visuals/GraduationWorkflow';
import { InteractiveCurriculumGraph } from '../components/visuals/interactive-graph/InteractiveCurriculumGraph';
import { WorkloadHeatmap } from '../components/visuals/WorkloadHeatmap';
import { Year4DecisionWorkflow } from '../components/visuals/Year4DecisionWorkflow';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { VisualFallback } from '../components/common/VisualFallback';
import { AnimatedVisualHero } from '../components/visuals/AnimatedVisualHero';

type VisualMapItem = {
  id: string;
  title: string;
  desc: string;
  icon: typeof Grid;
  color: string;
  bg: string;
  mode: string;
  signal: string;
  cta: string;
  preview: string[];
  questions: string[];
  component: ReactNode;
};

export function VisualMapsPage() {
  const courseIndex = useCourseIndex();
  const [activeMap, setActiveMap] = useState<string | null>(null);
  const catalogCount = courseIndex.getCatalogCourses().length;

  const maps: VisualMapItem[] = [
    {
      id: 'grid',
      title: 'แผนการศึกษา 4 ปี',
      desc: 'ภาพรวมรายวิชาในแต่ละเทอม พร้อมเส้นวิชาตัวต่อที่สำคัญ',
      icon: Grid,
      color: 'var(--primary)',
      bg: 'rgba(37, 99, 235, 0.1)',
      mode: 'Plan View',
      signal: '8 เทอม',
      cta: 'เปิดแผน 4 ปี',
      preview: ['ปี 1', 'ปี 2', 'ปี 3', 'ปี 4'],
      questions: [],
      component: <CurriculumGridDiagram courseIndex={courseIndex} />,
    },
    {
      id: 'flowchart',
      title: 'Flowchart หมวดวิชา',
      desc: 'จัดรายวิชาเป็นสายความรู้ เพื่อเห็นว่าพื้นฐานแต่ละก้อนพาไปต่อด้านไหน',
      icon: Map,
      color: 'var(--cyan)',
      bg: 'rgba(8, 145, 178, 0.1)',
      mode: 'Cluster View',
      signal: 'หมวดวิชา',
      cta: 'ดูสายความรู้',
      preview: ['Math', 'Code', 'Hardware', 'Project'],
      questions: ['วิชานี้อยู่ในหมวดไหน?', 'ปี 3 มีเรียนอะไรบ้าง?'],
      component: <CurriculumFlowchart />,
    },
    {
      id: 'prereq',
      title: 'โครงข่ายวิชาตัวต่อ',
      desc: 'อ่านเงื่อนไขวิชาบังคับก่อนแบบซ้ายไปขวา แล้วสลับเป็น graph explore ได้',
      icon: Network,
      color: 'var(--violet)',
      bg: 'rgba(109, 40, 217, 0.1)',
      mode: 'Prerequisite Explorer',
      signal: 'วิชาตัวต่อ',
      cta: 'ตรวจวิชาตัวต่อ',
      preview: ['Calc', 'Prog', 'Logic', 'Project'],
      questions: ['ถ้าดรอปวิชานี้จะกระทบตัวไหน?', 'วิชาไหนที่มีตัวต่อเยอะสุด?'],
      component: <InteractiveCurriculumGraph />,
    },
    {
      id: 'critical',
      title: 'แผนที่เส้นทางเสี่ยง',
      desc: 'รวมสายวิชาที่ถ้าพลาดแล้วกระทบต่อเนื่อง เหมาะกับการเช็กก่อนลงทะเบียนทุกเทอม',
      icon: AlertTriangle,
      color: 'var(--danger)',
      bg: 'rgba(225, 29, 72, 0.1)',
      mode: 'Risk Map',
      signal: 'ห้ามพลาด',
      cta: 'ดูเส้นทางเสี่ยง',
      preview: ['เสี่ยงสูง', 'คอขวด', 'กระทบแผน', 'แก้ทาง'],
      questions: ['วิชาไหนคือคอขวด?', 'ถ้าตกวิชานี้จะจบ 4 ปีไหม?'],
      component: <CriticalPathMap courseIndex={courseIndex} />,
    },
    {
      id: 'year4',
      title: 'ตัวเลือกปี 4',
      desc: 'เทียบเส้นทางโปรเจกต์ สหกิจ และการเตรียมตัวก่อนออกไปเจองานจริง',
      icon: Route,
      color: 'var(--orange)',
      bg: 'rgba(255, 158, 87, 0.12)',
      mode: 'Decision Flow',
      signal: 'Project / Co-op',
      cta: 'เปิด workflow ปี 4',
      preview: ['เตรียมตัว', 'เลือกทาง', 'เอกสาร', 'จบงาน'],
      questions: ['ไปสหกิจต้องเตรียมตัวยังไง?', 'ทำโปรเจกต์มีกี่ขั้นตอน?'],
      component: <Year4DecisionWorkflow courseIndex={courseIndex} />,
    },
    {
      id: 'grad',
      title: 'เช็กลิสต์ก่อนจบ',
      desc: 'เช็กเงื่อนไขหลัก หน่วยกิต ขั้นตอน และรายการที่ไม่ควรปล่อยจนเทอมสุดท้าย',
      icon: GraduationCap,
      color: 'var(--success)',
      bg: 'rgba(5, 150, 105, 0.1)',
      mode: 'Graduation Gate',
      signal: 'ก่อนจบ',
      cta: 'ตรวจเงื่อนไข',
      preview: ['หน่วยกิต', 'สอบ', 'เอกสาร', 'อนุมัติ'],
      questions: ['ต้องมีหน่วยกิตเท่าไหร่ถึงจบ?', 'อย่าลืมสอบอะไรบ้าง?'],
      component: <GraduationWorkflow />,
    },
    {
      id: 'gened',
      title: 'สำรวจ GenEd',
      desc: 'ช่วยเลือกวิชาศึกษาทั่วไปให้เข้ากับเวลา ความสนใจ และเป้าหมายของแต่ละปี',
      icon: Maximize2,
      color: '#7c3aed',
      bg: 'rgba(124, 58, 237, 0.1)',
      mode: 'General Education',
      signal: 'GenEd',
      cta: 'สำรวจ GenEd',
      preview: ['ภาษา', 'สังคม', 'สุขภาพ', 'เลือกเสรี'],
      questions: ['ลง GenEd หมวดไหนดี?', 'วิชาไหนเหมาะกับเทอมงานหนัก?'],
      component: <GenEdExplorer courseIndex={courseIndex} />,
    },
    {
      id: 'workload',
      title: 'Heatmap ความหนัก',
      desc: 'ประเมินความแน่นของแต่ละเทอมจากจำนวนวิชา หน่วยกิต และชนิดของงานที่ต้องเจอ',
      icon: Activity,
      color: '#0f766e',
      bg: 'rgba(15, 118, 110, 0.1)',
      mode: 'Load Monitor',
      signal: 'Workload',
      cta: 'ดู workload',
      preview: ['เบา', 'กลาง', 'หนัก', 'เสี่ยงล้น'],
      questions: ['เทอมไหนงานหนักสุด?', 'ควรแบ่งเวลายังไง?'],
      component: <WorkloadHeatmap courseIndex={courseIndex} />,
    },
  ];

  if (activeMap) {
    const map = maps.find((item) => item.id === activeMap);
    if (!map) return null;
    const Icon = map.icon;

    return (
      <div
        className="page visual-map-detail"
        style={{ '--map-color': map.color, '--map-bg': map.bg } as CSSProperties}
      >
        <button type="button" className="map-back-button" onClick={() => setActiveMap(null)}>
          <ArrowLeft size={18} aria-hidden="true" />
          กลับไปหน้ารวมแผนภาพ
        </button>

        <section className="active-map-shell">
          <header className="active-map-header">
            <div className="active-map__icon">
              <Icon size={26} aria-hidden="true" />
            </div>
            <div>
              <span>{map.mode}</span>
              <h1>{map.title}</h1>
              <p>{map.desc}</p>
            </div>
            <div className="active-map__signal">
              <strong>{map.signal}</strong>
              <small>focus signal</small>
            </div>
          </header>

          {map.questions.length > 0 && (
            <div className="active-map-prompts" aria-label="คำถามที่แผนภาพนี้ช่วยตอบ">
              {map.questions.map((question) => (
                <span key={question}>{question}</span>
              ))}
            </div>
          )}

          <div className="active-map-canvas">
            <ErrorBoundary name={map.title} fallback={<VisualFallback />}>
              {map.component}
            </ErrorBoundary>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page visual-maps-page">
      <section className="visual-command" aria-label="Visual maps command center">
        <div className="visual-command__copy">
          <span className="technical-label">Visual Maps</span>
          <h1>แผนภาพหลักสูตร</h1>
          <p>
            สรุปรวมหลักสูตร 4 ปี พร้อมเงื่อนไขจบการศึกษาในชุดเดียว
          </p>
          <div className="visual-command__actions">
            <button type="button" className="primary-button" onClick={() => setActiveMap('grid')}>
              เริ่มจากแผน 4 ปี
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button type="button" className="secondary-button" onClick={() => setActiveMap('prereq')}>
              ตรวจวิชาตัวต่อ
            </button>
          </div>
        </div>

        <aside className="visual-command-canvas" aria-label="ตัวอย่างภาพรวมหลักสูตร">
          <AnimatedVisualHero />
        </aside>
      </section>

      <section className="visual-map-summary" aria-label="สรุปชุดแผนภาพ">
        <div>
          <strong>{maps.length}</strong>
          <span>โหมดแผนภาพ</span>
        </div>
        <div>
          <strong>{catalogCount}</strong>
          <span>รายวิชาใน catalog</span>
        </div>
        <div>
          <strong>4</strong>
          <span>ปีการศึกษา</span>
        </div>
        <div>
          <strong>1</strong>
          <span>เส้นทางก่อนจบ</span>
        </div>
      </section>

      <section className="map-gallery" aria-label="แกลเลอรีแผนภาพ">
        <div className="map-gallery-header">
          <div>
            <span className="technical-label">Map Gallery</span>
            <h2>เลือกแผนภาพตามโจทย์ที่อยากตอบ</h2>
          </div>
          <p>แต่ละการ์ดมี signal, preview และคำถามนำทาง เพื่อให้รู้ทันทีว่าควรเปิดเครื่องมือไหน</p>
        </div>

        <div className="map-gallery-grid">
          <AnimatePresence>
            {maps.map((map, index) => {
              const Icon = map.icon;
              return (
                <motion.button
                  type="button"
                  key={map.id}
                  className="map-showcase-card"
                  style={{ '--map-color': map.color, '--map-bg': map.bg } as CSSProperties}
                  onClick={() => setActiveMap(map.id)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="map-card__top">
                    <span className="map-card__icon">
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <span className="map-card__mode">{map.mode}</span>
                  </div>

                  <div className="map-card__body">
                    <h3>{map.title}</h3>
                    <p>{map.desc}</p>
                  </div>

                  <div className="map-card__preview" aria-hidden="true">
                    <div className="map-card__preview-line" />
                    {map.preview.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>

                  {map.questions.length > 0 && (
                    <div className="map-card__questions">
                      <strong>ช่วยตอบคำถาม</strong>
                      <ul>
                        {map.questions.map((question) => (
                          <li key={question}>{question}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="map-card__footer">
                    <span>
                      <Layers3 size={16} aria-hidden="true" />
                      {map.signal}
                    </span>
                    <strong>
                      {map.cta}
                      <ArrowRight size={17} aria-hidden="true" />
                    </strong>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
