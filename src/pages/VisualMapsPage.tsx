import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Maximize2, Map, Network, AlertTriangle, Route, GraduationCap, Grid, Activity } from 'lucide-react';
import type { CourseIndex } from '../utils/courseIndex';
import { CriticalPathMap } from '../components/visuals/CriticalPathMap';
import { CurriculumFlowchart } from '../components/visuals/CurriculumFlowchart';
import { CurriculumGridDiagram } from '../components/visuals/CurriculumGridDiagram';
import { GenEdExplorer } from '../components/visuals/GenEdExplorer';
import { GraduationWorkflow } from '../components/visuals/GraduationWorkflow';
import { OfficialPrerequisiteGraph } from '../components/visuals/OfficialPrerequisiteGraph';
import { WorkloadHeatmap } from '../components/visuals/WorkloadHeatmap';
import { Year4DecisionWorkflow } from '../components/visuals/Year4DecisionWorkflow';
import { SectionHeader } from '../components/common/SectionHeader';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { VisualFallback } from '../components/common/VisualFallback';
import { MotionCard } from '../components/common/MotionCard';

export function VisualMapsPage({ courseIndex }: { courseIndex: CourseIndex }) {
  const [activeMap, setActiveMap] = useState<string | null>(null);

  const maps = [
    {
      id: 'grid',
      title: 'แผนการศึกษา 4 ปี (Grid)',
      desc: 'ดูโครงสร้างหลักสูตรแบบตาราง ว่าเทอมไหนต้องเรียนอะไรบ้างตาม มคอ.2',
      icon: Grid,
      color: 'var(--primary)',
      bg: 'rgba(79, 124, 255, 0.1)',
      questions: ['ปี 1 ต้องลงเรียนอะไรบ้าง?', 'วิชาเลือกเสรีลงเทอมไหนดี?'],
      component: <CurriculumGridDiagram courseIndex={courseIndex} />
    },
    {
      id: 'flowchart',
      title: 'Curriculum Flowchart',
      desc: 'แผนภาพแสดงลำดับการเรียนวิชาต่างๆ ตามหมวดหมู่',
      icon: Map,
      color: 'var(--cyan)',
      bg: 'rgba(6, 182, 212, 0.1)',
      questions: ['วิชานี้อยู่ในหมวดไหน?', 'ปี 3 มีเรียนอะไรบ้าง?'],
      component: <CurriculumFlowchart />
    },
    {
      id: 'prereq',
      title: 'แผนภาพวิชาตัวต่อ (Official)',
      desc: 'ดูโครงข่ายวิชาตัวต่อแบบโยงเส้นทั้งหมด',
      icon: Network,
      color: 'var(--violet)',
      bg: 'rgba(123, 97, 255, 0.1)',
      questions: ['ถ้าดรอปวิชานี้จะกระทบตัวไหน?', 'วิชาไหนที่มีตัวต่อเยอะสุด?'],
      component: <OfficialPrerequisiteGraph courseIndex={courseIndex} />
    },
    {
      id: 'critical',
      title: 'Critical Path Map',
      desc: 'เส้นทางวิกฤตที่ห้ามตกเด็ดขาด ไม่เช่นนั้นอาจเรียนจบช้ากว่า 4 ปี',
      icon: AlertTriangle,
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.1)',
      questions: ['วิชาไหนคือคอขวด?', 'ถ้าตกวิชานี้จะจบ 4 ปีไหม?'],
      component: <CriticalPathMap courseIndex={courseIndex} />
    },
    {
      id: 'year4',
      title: 'Year 4 Decision Workflow',
      desc: 'แผนผังการตัดสินใจเลือกทำโปรเจกต์ หรือสหกิจศึกษาในปี 4',
      icon: Route,
      color: 'var(--orange)',
      bg: 'rgba(249, 115, 22, 0.1)',
      questions: ['ไปสหกิจต้องเตรียมตัวยังไง?', 'ทำโปรเจกต์มีกี่ขั้นตอน?'],
      component: <Year4DecisionWorkflow courseIndex={courseIndex} />
    },
    {
      id: 'grad',
      title: 'Graduation Workflow',
      desc: 'เงื่อนไขและขั้นตอนทั้งหมดที่ต้องผ่านก่อนจะขอจบการศึกษาได้',
      icon: GraduationCap,
      color: 'var(--success)',
      bg: 'rgba(16, 185, 129, 0.1)',
      questions: ['ต้องมีหน่วยกิตเท่าไหร่ถึงจบ?', 'อย่าลืมสอบอะไรบ้าง?'],
      component: <GraduationWorkflow />
    },
    {
      id: 'gened',
      title: 'GenEd Explorer',
      desc: 'สำรวจและค้นหาวิชาศึกษาทั่วไป (GenEd) ที่น่าสนใจ',
      icon: Maximize2,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.1)',
      questions: ['ลง GenEd หมวดไหนดี?', 'วิชาไหนได้เกรดง่าย? (รีวิว)'],
      component: <GenEdExplorer courseIndex={courseIndex} />
    },
    {
      id: 'workload',
      title: 'Workload Heatmap',
      desc: 'คาดการณ์ความหนักของการเรียนในแต่ละเทอม',
      icon: Activity,
      color: '#14b8a6',
      bg: 'rgba(20, 184, 166, 0.1)',
      questions: ['เทอมไหนงานหนักสุด?', 'ควรแบ่งเวลายังไง?'],
      component: <WorkloadHeatmap courseIndex={courseIndex} />
    }
  ];

  if (activeMap) {
    const map = maps.find(m => m.id === activeMap);
    if (!map) return null;

    return (
      <div className="page" style={{ padding: '0 24px 64px', maxWidth: '1440px', margin: '0 auto' }}>
        <button 
          onClick={() => setActiveMap(null)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '999px', cursor: 'pointer', fontWeight: 600, color: 'var(--text)', marginBottom: '32px', transition: 'all 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'var(--surface)'}
        >
          <ArrowLeft size={18} /> กลับไปหน้ารวมแผนภาพ
        </button>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 12px 0', color: map.color }}>{map.title}</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: 0 }}>{map.desc}</p>
        </div>
        <ErrorBoundary name={map.title} fallback={<VisualFallback />}>
          {map.component}
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="page visual-maps-page" style={{ padding: '0 24px 64px', maxWidth: '1200px', margin: '0 auto' }}>
      <SectionHeader 
        title="แผนภาพรวมหลักสูตร" 
        description="แกลเลอรีแผนภาพอินเทอร์แอคทีฟ ช่วยตอบทุกคำถามเกี่ยวกับการวางแผนการเรียน"
        variant="hero"
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px', marginTop: '32px' }}>
        <AnimatePresence>
          {maps.map((map, i) => (
            <motion.div
              key={map.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <MotionCard style={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: '0' }} onClick={() => setActiveMap(map.id)}>
                <div style={{ padding: '24px', flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: map.bg, color: map.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <map.icon size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{map.title}</h2>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>{map.desc}</p>
                  
                  <div style={{ background: 'var(--surface-muted)', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>ช่วยตอบคำถาม:</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {map.questions.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div style={{ padding: '16px 24px', background: map.bg, borderTop: `1px solid rgba(0,0,0,0.05)`, color: map.color, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  เปิดใช้งานแผนภาพ
                  <ArrowRight size={18} />
                </div>
              </MotionCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
