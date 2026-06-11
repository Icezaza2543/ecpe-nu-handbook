import { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { X, AlertCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { CourseNode } from './CourseNode';
import { studyPlan } from '../../../data/studyPlan';
import { officialPrerequisites } from '../../../data/officialPrerequisites';
import '../../../styles/interactive-graph.css';

const nodeTypes = {
  course: CourseNode,
};

// 1. Build Data Map
const codeToId: Record<string, string> = {};
const idToCourseMap: Record<string, any> = {};

const initialNodes: Node[] = [];
let col = 0;

studyPlan.years.forEach((year) => {
  year.semesters.forEach((sem) => {
    // Offset Y to center semesters with fewer courses
    const yOffset = (8 - sem.courses.length) * 55;

    sem.courses.forEach((course, index) => {
      // Map code to ID for exact matches
      if (!course.code.includes('x')) {
        codeToId[course.code] = course.courseId;
      }
      idToCourseMap[course.courseId] = { ...course, semesterTitle: sem.title };

      initialNodes.push({
        id: course.courseId,
        type: 'course',
        position: { x: col * 260, y: index * 120 + Math.max(0, yOffset) },
        data: {
          id: course.courseId,
          code: course.code,
          titleTh: course.titleTh,
          credits: course.credits,
          status: course.status,
          prerequisiteText: course.officialPrerequisiteText,
          semesterTitle: sem.title,
        },
      });
    });
    col++;
  });
});

const initialEdges: Edge[] = officialPrerequisites
  .map((prereq) => {
    const sourceId = codeToId[prereq.from];
    const targetId = codeToId[prereq.to];

    if (!sourceId || !targetId) return null;

    return {
      id: prereq.id,
      source: sourceId,
      target: targetId,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#cbd5e1',
      },
    };
  })
  .filter(Boolean) as Edge[];

export function InteractiveCurriculumGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeYearFilter, setActiveYearFilter] = useState<number | null>(null);

  // Computed state for active node details
  const activeCourse = selectedNodeId ? idToCourseMap[selectedNodeId] : null;

  // Graph Traversal Helpers
  const getUpstreamNodes = useCallback((nodeId: string, edgesList: Edge[]): Set<string> => {
    const upstream = new Set<string>();
    const stack = [nodeId];
    while (stack.length > 0) {
      const current = stack.pop()!;
      edgesList.forEach((e) => {
        if (e.target === current && !upstream.has(e.source)) {
          upstream.add(e.source);
          stack.push(e.source);
        }
      });
    }
    return upstream;
  }, []);

  const getDownstreamNodes = useCallback((nodeId: string, edgesList: Edge[]): Set<string> => {
    const downstream = new Set<string>();
    const stack = [nodeId];
    while (stack.length > 0) {
      const current = stack.pop()!;
      edgesList.forEach((e) => {
        if (e.source === current && !downstream.has(e.target)) {
          downstream.add(e.target);
          stack.push(e.target);
        }
      });
    }
    return downstream;
  }, []);

  // Update Node and Edge Styles based on Selection and Filters
  useMemo(() => {
    let upstream = new Set<string>();
    let downstream = new Set<string>();

    if (selectedNodeId) {
      upstream = getUpstreamNodes(selectedNodeId, initialEdges);
      downstream = getDownstreamNodes(selectedNodeId, initialEdges);
    }

    setNodes((nds) =>
      nds.map((n) => {
        const isSelected = n.id === selectedNodeId;
        const isUpstream = upstream.has(n.id);
        const isDownstream = downstream.has(n.id);
        
        let isDimmed = false;

        // Dim logic based on selection
        if (selectedNodeId && !isSelected && !isUpstream && !isDownstream) {
          isDimmed = true;
        }

        // Dim logic based on year filter
        if (activeYearFilter) {
          const semTitle = n.data.semesterTitle as string;
          if (!semTitle.includes(`ปี ${activeYearFilter}`)) {
            isDimmed = true;
          }
        }

        return {
          ...n,
          data: {
            ...n.data,
            isSelected,
            isUpstream,
            isDownstream,
            isDimmed,
          },
        };
      })
    );

    setEdges((eds) =>
      eds.map((e) => {
        const isUpstreamEdge = upstream.has(e.source) && (upstream.has(e.target) || e.target === selectedNodeId);
        const isDownstreamEdge = (downstream.has(e.source) || e.source === selectedNodeId) && downstream.has(e.target);

        let stroke = '#cbd5e1';
        let strokeWidth = 2;
        let opacity = 1;
        let animated = false;

        if (selectedNodeId) {
          opacity = 0.15; // Dim all edges initially
        }

        if (isUpstreamEdge) {
          stroke = '#f59e0b'; // Orange
          strokeWidth = 3;
          opacity = 1;
          animated = true;
        } else if (isDownstreamEdge) {
          stroke = '#10b981'; // Green
          strokeWidth = 3;
          opacity = 1;
          animated = true;
        }

        return {
          ...e,
          animated,
          style: { stroke, strokeWidth, opacity, transition: 'all 0.3s ease' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: stroke,
          },
        };
      })
    );
  }, [selectedNodeId, activeYearFilter, setNodes, setEdges, getUpstreamNodes, getDownstreamNodes]);

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
  };

  return (
    <div className="interactive-graph-container">
      {/* Filters & Legend */}
      <div className="graph-toolbar">
        <div className="graph-filters">
          <button className={`filter-btn ${activeYearFilter === null ? 'active' : ''}`} onClick={() => setActiveYearFilter(null)}>ทั้งหมด</button>
          <button className={`filter-btn ${activeYearFilter === 1 ? 'active' : ''}`} onClick={() => setActiveYearFilter(1)}>ปี 1</button>
          <button className={`filter-btn ${activeYearFilter === 2 ? 'active' : ''}`} onClick={() => setActiveYearFilter(2)}>ปี 2</button>
          <button className={`filter-btn ${activeYearFilter === 3 ? 'active' : ''}`} onClick={() => setActiveYearFilter(3)}>ปี 3</button>
          <button className={`filter-btn ${activeYearFilter === 4 ? 'active' : ''}`} onClick={() => setActiveYearFilter(4)}>ปี 4</button>
        </div>
        <div className="graph-legend">
          <div className="legend-item"><div className="legend-color color-selected"></div> วิชาที่เลือก</div>
          <div className="legend-item"><div className="legend-color color-prereq"></div> วิชาพื้นฐาน (ต้องผ่านก่อน)</div>
          <div className="legend-item"><div className="legend-color color-dependent"></div> วิชาต่อเนื่อง (ปลดล็อก)</div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1, minZoom: 0.5, maxZoom: 1 }}
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls showInteractive={false} />
        <MiniMap 
          nodeColor={(n) => {
            if (n.data.isSelected) return '#2563eb';
            if (n.data.isUpstream) return '#f59e0b';
            if (n.data.isDownstream) return '#10b981';
            return '#cbd5e1';
          }}
          maskColor="rgba(248, 250, 252, 0.7)"
          style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
      </ReactFlow>

      {/* Course Detail Panel */}
      <AnimatePresence>
        {activeCourse && (
          <motion.div
            className="course-detail-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="panel-header">
              <div>
                <div className="panel-code">{activeCourse.code}</div>
                <h3 className="panel-title">{activeCourse.titleTh}</h3>
              </div>
              <button className="panel-close" onClick={() => setSelectedNodeId(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="panel-meta">
              <span className="meta-badge badge-credits">{activeCourse.credits}</span>
              <span className="meta-badge">{activeCourse.semesterTitle}</span>
              <span className="meta-badge bg-slate-100">{activeCourse.status}</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

            <div className="panel-section">
              <h4>
                <AlertCircle size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                เงื่อนไขวิชา (Prerequisites)
              </h4>
              <p>{activeCourse.officialPrerequisiteText || 'ไม่มีเงื่อนไขรายวิชา'}</p>
            </div>
            
            <div className="panel-section">
              <h4>
                <BookOpen size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                คำแนะนำ
              </h4>
              <p className="text-sm text-slate-500">
                สามารถคลิกวิชาพื้นฐานหรือวิชาต่อเนื่องบนกราฟเพื่อดูรายละเอียดเพิ่มเติม
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
