import { useState } from 'react';
import type { CourseIndex } from '../utils/courseIndex';
import { CriticalPathMap } from '../components/visuals/CriticalPathMap';
import { OfficialPrerequisiteGraph } from '../components/visuals/OfficialPrerequisiteGraph';

import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { VisualFallback } from '../components/common/VisualFallback';
import { SectionHeader } from '../components/common/SectionHeader';
import { Map, Crosshair } from 'lucide-react';
import { officialPrerequisites } from '../data/officialPrerequisites';
import { dependencies } from '../data/dependencies';

export function DependencyGraphPage({ courseIndex }: { courseIndex: CourseIndex }) {
  const [activeMode, setActiveMode] = useState<'official' | 'senior' | 'critical'>('official');

  // Mini stats calculation
  const officialEdgesCount = (officialPrerequisites as any[]).filter(e => e.from && e.to).length;
  const criticalPathsCount = (dependencies as any).chains?.filter((c: any) => c.dangerLevel === 'critical').length || 0;

  return (
    <div className="page" style={{ paddingBottom: '100px' }}>
      
      {/* 1. Section Header — same style as other pages */}
      <SectionHeader
        title="วิชาตัวต่อ"
        description={`แผนภาพแสดงเงื่อนไขวิชาบังคับก่อนตาม มคอ.2 และเส้นทางวิกฤตที่อาจทำให้แผนการเรียนรวนหากสอบไม่ผ่าน · ${officialEdgesCount} คู่วิชาบังคับก่อน · ${criticalPathsCount} เส้นทางวิกฤต`}
        variant="hero"
      />

      {/* 2. Mode Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', background: 'var(--surface)', padding: '8px', borderRadius: '999px', border: '1px solid var(--border)', gap: '8px', overflowX: 'auto', maxWidth: '100%' }}>
          <button
            onClick={() => setActiveMode('official')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '999px', border: 'none', background: activeMode === 'official' ? 'var(--primary)' : 'transparent', color: activeMode === 'official' ? 'white' : 'var(--text)', fontWeight: activeMode === 'official' ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          >
            <Map size={18} /> Official
          </button>
          <button
            onClick={() => setActiveMode('critical')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '999px', border: 'none', background: activeMode === 'critical' ? 'var(--danger)' : 'transparent', color: activeMode === 'critical' ? 'white' : 'var(--text)', fontWeight: activeMode === 'critical' ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          >
            <Crosshair size={18} /> เส้นทางวิกฤต
          </button>
        </div>
      </div>

      {/* Sections based on Mode */}
      {activeMode === 'official' && (
        <div>
          <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '16px', color: '#1e3a8a', marginBottom: '24px', border: '1px solid #bfdbfe' }}>
            <strong>Official Prerequisite:</strong> เส้นนี้คือเงื่อนไขทางการจากหลักสูตร ถ้าไม่ผ่านวิชาก่อนหน้า จะลงวิชาถัดไปไม่ได้เด็ดขาด
          </div>
          <ErrorBoundary name="Official Prerequisite Graph" fallback={<VisualFallback />}>
            <OfficialPrerequisiteGraph courseIndex={courseIndex} />
          </ErrorBoundary>
        </div>
      )}



      {activeMode === 'critical' && (
        <div>
          <div style={{ background: '#fff7ed', padding: '16px', borderRadius: '16px', color: '#9a3412', marginBottom: '24px', border: '1px solid #fed7aa' }}>
            <strong>Critical Path:</strong> เส้นทางนี้ไม่ควรปล่อยให้หลุด เพราะมักกระทบหลายวิชาต่อเนื่อง ทำให้แผนการเรียนพัง
          </div>
          <ErrorBoundary name="Critical Path Map" fallback={<VisualFallback />}>
            <CriticalPathMap courseIndex={courseIndex} />
          </ErrorBoundary>
        </div>
      )}

    </div>
  );
}
