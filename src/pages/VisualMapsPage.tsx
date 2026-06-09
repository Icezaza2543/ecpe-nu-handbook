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

export function VisualMapsPage({ courseIndex }: { courseIndex: CourseIndex }) {
  return (
    <div className="page visual-maps-page">
      <SectionHeader 
        title="แผนภาพรวมหลักสูตร" 
        description="ดูโครงสร้างหลักสูตร แผนการศึกษา และความเชื่อมโยงของรายวิชาในรูปแบบ Visual ที่เข้าใจง่าย" 
        bgImage="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80"
      />
      <ErrorBoundary name="Curriculum Grid Diagram" fallback={<VisualFallback />}>
        <CurriculumGridDiagram courseIndex={courseIndex} />
      </ErrorBoundary>
      <ErrorBoundary name="Curriculum Flowchart" fallback={<VisualFallback />}>
        <CurriculumFlowchart />
      </ErrorBoundary>
      <ErrorBoundary name="Official Prerequisite Graph" fallback={<VisualFallback />}>
        <OfficialPrerequisiteGraph courseIndex={courseIndex} />
      </ErrorBoundary>
      <ErrorBoundary name="Critical Path Map" fallback={<VisualFallback />}>
        <CriticalPathMap courseIndex={courseIndex} />
      </ErrorBoundary>
      <ErrorBoundary name="Year 4 Decision Workflow" fallback={<VisualFallback />}>
        <Year4DecisionWorkflow courseIndex={courseIndex} />
      </ErrorBoundary>
      <ErrorBoundary name="Graduation Workflow" fallback={<VisualFallback />}>
        <GraduationWorkflow />
      </ErrorBoundary>
      <ErrorBoundary name="GenEd Explorer" fallback={<VisualFallback />}>
        <GenEdExplorer courseIndex={courseIndex} />
      </ErrorBoundary>
      <ErrorBoundary name="Workload Heatmap" fallback={<VisualFallback />}>
        <WorkloadHeatmap courseIndex={courseIndex} />
      </ErrorBoundary>
    </div>
  );
}
