import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export type CourseNodeData = {
  id: string;
  code: string;
  titleTh: string;
  credits: string;
  status: string;
  isSelected?: boolean;
  isUpstream?: boolean; // Highlighted as prerequisite (orange)
  isDownstream?: boolean; // Highlighted as dependent (green)
  isDimmed?: boolean; // Dimmed because it's not related to the selection
};

export const CourseNode = memo(({ data }: { data: CourseNodeData }) => {
  // Determine card classes based on state
  const stateClass = data.isSelected
    ? 'node-selected'
    : data.isUpstream
      ? 'node-upstream'
      : data.isDownstream
        ? 'node-downstream'
        : data.isDimmed
          ? 'node-dimmed'
          : 'node-default';

  // Category indicator color (GenEd, Core, Elective)
  const isGenEd = data.code.startsWith('001') || data.titleTh.includes('ศึกษาทั่วไป') || data.titleTh.includes('ภาษาอังกฤษ');
  const isElective = data.code.includes('xxx') || data.status.includes('เลือก');
  const isMathPhysics = data.code.startsWith('252') || data.code.startsWith('261');
  const isHardware = data.code === '305241' || data.code === '305341' || data.titleTh.includes('วงจร') || data.titleTh.includes('อิเล็ก');
  
  let typeIndicator = 'bg-core';
  if (isGenEd) typeIndicator = 'bg-gened';
  else if (isElective) typeIndicator = 'bg-elective';
  else if (isMathPhysics) typeIndicator = 'bg-math';
  else if (isHardware) typeIndicator = 'bg-hardware';

  return (
    <div className={`course-node-wrapper ${stateClass}`}>
      <Handle type="target" position={Position.Top} className="handle handle-top" />
      <Handle type="source" position={Position.Bottom} className="handle handle-bottom" />
      
      {/* Some nodes need side connections for horizontal flows */}
      <Handle type="target" position={Position.Left} id="left" className="handle handle-side" />
      <Handle type="source" position={Position.Right} id="right" className="handle handle-side" />

      <div className="course-node-card">
        <div className={`course-node-indicator ${typeIndicator}`} />
        <div className="course-node-header">
          <span className="course-node-code">{data.code}</span>
          <span className="course-node-credits">{data.credits.split('(')[0]} CR</span>
        </div>
        <div className="course-node-title" title={data.titleTh}>
          {data.titleTh}
        </div>
      </div>
    </div>
  );
});

CourseNode.displayName = 'CourseNode';
