import { useState, useEffect } from 'react';
import { Background, Controls, ReactFlow, type Edge, type Node, Handle, Position, MarkerType, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import { officialPrerequisites } from '../../data/officialPrerequisites';
import type { GraphEdge } from '../../types/visualMap';
import type { CourseIndex } from '../../utils/courseIndex';
import { edgeKey } from '../../utils/graphUtils';
import { useCourseModal } from '../common/CourseModalProvider';
import { ArrowDown, ArrowRight, Calculator, TerminalSquare, Cpu, Zap, Sparkles, GraduationCap, Grid, ToggleRight, ToggleLeft } from 'lucide-react';
import { CourseChip } from '../common/CourseChip';

const OfficialNode = ({ data }: any) => {
  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', border: '2px solid var(--primary)', borderRadius: '20px', padding: '16px', width: '220px', boxShadow: '0 8px 24px rgba(139, 92, 246, 0.15)', position: 'relative', transition: 'all 0.3s' }} className="hover-glow">
      <Handle type="target" position={Position.Left} style={{ background: 'var(--primary)', width: '10px', height: '10px' }} />
      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.05em', boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)' }}>
        OFFICIAL MKO.2
      </div>
      <div style={{ textAlign: 'center', whiteSpace: 'pre-wrap', fontSize: '0.95rem', color: 'var(--text)', fontWeight: 700, marginTop: '8px', lineHeight: '1.4' }}>
        {data.label}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: 'var(--primary)', width: '10px', height: '10px' }} />
    </div>
  );
};

const DangerOfficialNode = ({ data }: any) => {
  return (
    <div style={{ background: 'rgba(255, 241, 242, 0.95)', backdropFilter: 'blur(12px)', border: '2px solid #f43f5e', borderRadius: '20px', padding: '16px', width: '220px', boxShadow: '0 8px 24px rgba(244, 63, 94, 0.15)', position: 'relative', transition: 'all 0.3s' }} className="hover-glow-danger">
      <Handle type="target" position={Position.Left} style={{ background: '#f43f5e', width: '10px', height: '10px' }} />
      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#e11d48', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.05em', boxShadow: '0 2px 8px rgba(225, 29, 72, 0.4)' }}>
        CRITICAL MKO.2
      </div>
      <div style={{ textAlign: 'center', whiteSpace: 'pre-wrap', fontSize: '0.95rem', color: '#9f1239', fontWeight: 700, marginTop: '8px', lineHeight: '1.4' }}>
        {data.label}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#f43f5e', width: '10px', height: '10px' }} />
    </div>
  );
};

const nodeTypes = { official: OfficialNode, dangerOfficial: DangerOfficialNode };
type FamilyLane = 'All' | 'Math' | 'Programming' | 'Hardware' | 'Circuit' | 'Elective' | 'Year4';

const COURSE_FAMILY_MAP: Record<string, FamilyLane> = {
  "252182": "Math", "252183": "Math", "252284": "Math", "305361": "Math", "305233": "Math",
  "305121": "Programming", "305322": "Programming", "305323": "Programming", "305122": "Programming", "305372": "Programming", "305445": "Programming",
  "305241": "Hardware", "305341": "Hardware", "305342": "Hardware", "305358": "Hardware", "305359": "Hardware",
  "305142": "Circuit", "305245": "Circuit",
  "305221": "Elective", "305454": "Elective", "305335": "Elective", "305437": "Elective",
  "305491": "Year4", "305492": "Year4", "305493": "Year4", "305494": "Year4", "305495": "Year4", "305496": "Year4",
};

const NODE_POSITIONS: Record<string, { x: number, y: number }> = {
  "252182": { x: 0, y: 0 }, "252183": { x: 340, y: -60 }, "305233": { x: 340, y: 80 }, "252284": { x: 680, y: -60 }, "305361": { x: 1020, y: -60 },
  "305121": { x: 0, y: 280 }, "305322": { x: 340, y: 220 }, "305323": { x: 340, y: 340 }, "305122": { x: 0, y: 480 }, "305372": { x: 340, y: 480 }, "305445": { x: 340, y: 600 },
  "305241": { x: 0, y: 800 }, "305341": { x: 340, y: 800 }, "305342": { x: 680, y: 800 }, "305358": { x: 0, y: 920 }, "305359": { x: 340, y: 920 },
  "305142": { x: 0, y: 1100 }, "305245": { x: 340, y: 1100 },
  "305221": { x: 0, y: 1300 }, "305454": { x: 340, y: 1300 }, "305335": { x: 0, y: 1420 }, "305437": { x: 340, y: 1420 },
  "305491": { x: 0, y: 1600 }, "305492": { x: 340, y: 1600 }, "305493": { x: 0, y: 1720 }, "305494": { x: 340, y: 1720 }, "305495": { x: 0, y: 1840 }, "305496": { x: 340, y: 1840 },
};

function GraphContent({ courseIndex, filter }: { courseIndex: CourseIndex, filter: FamilyLane }) {
  const { openCourse } = useCourseModal();
  const reactFlowInstance = useReactFlow();

  const sourceEdges = (officialPrerequisites as GraphEdge[]).filter((edge) => edge.from && edge.to);
  let ids = Array.from(new Set(sourceEdges.flatMap((edge) => [edge.from, edge.to]).filter(Boolean))) as string[];

  if (filter !== 'All') {
    ids = ids.filter(id => COURSE_FAMILY_MAP[id] === filter);
  }

  const nodes: Node[] = ids.map((id, index) => {
    const course = courseIndex.findCourse(id);
    const pos = NODE_POSITIONS[id] || { x: (index % 3) * 340, y: Math.floor(index / 3) * 150 + 2000 };
    return {
      id,
      type: course?.dangerousToFail ? 'dangerOfficial' : 'official',
      position: pos,
      data: { label: `${course?.code || id}\n${course?.nameTh || course?.nameEn || id}` },
    };
  });

  const edges: Edge[] = sourceEdges
    .filter(edge => ids.includes(String(edge.from)) && ids.includes(String(edge.to)))
    .map((edge) => ({
      id: edgeKey(edge),
      source: String(edge.from),
      target: String(edge.to),
      label: edge.sourcePage || 'Official',
      type: 'smoothstep',
      animated: false,
      markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15, color: '#7c3aed' },
      style: { stroke: '#7c3aed', strokeWidth: 2.5 },
      labelStyle: { fill: '#4c1d95', fontWeight: 700, fontSize: 11 },
      labelBgStyle: { fill: '#f3e8ff', fillOpacity: 0.9, stroke: '#e9d5ff', rx: 4 },
    }));

  useEffect(() => {
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.15, duration: 400 });
    }, 50);
  }, [filter, reactFlowInstance]);

  return (
    <ReactFlow 
      nodes={nodes} edges={edges} nodeTypes={nodeTypes} 
      fitView fitViewOptions={{ padding: 0.15 }} minZoom={0.2} maxZoom={1.5}
      nodesDraggable={false} nodesConnectable={false} elementsSelectable={true} panOnDrag={true}
      onNodeClick={(_, node) => openCourse(node.id)} proOptions={{ hideAttribution: true }}
    >
      <Controls showInteractive={false} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
      <Background color="var(--primary)" gap={24} size={1} style={{ opacity: 0.2 }} />
    </ReactFlow>
  );
}

const FAMILY_META: Record<FamilyLane, { label: string, icon: any, color: string, bg: string, border: string }> = {
  All: { label: 'All', icon: Grid, color: 'var(--text)', bg: 'var(--surface)', border: 'var(--border)' },
  Math: { label: 'Math', icon: Calculator, color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe' },
  Programming: { label: 'Programming', icon: TerminalSquare, color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd' },
  Hardware: { label: 'Hardware', icon: Cpu, color: '#4338ca', bg: '#eef2ff', border: '#c7d2fe' },
  Circuit: { label: 'Circuit', icon: Zap, color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
  Elective: { label: 'Elective', icon: Sparkles, color: '#be185d', bg: '#fdf2f8', border: '#fbcfe8' },
  Year4: { label: 'Year 4 Tracks', icon: GraduationCap, color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
};

function PrerequisiteChainCards({ courseIndex, filter }: { courseIndex: CourseIndex, filter: FamilyLane }) {
  const sourceEdges = (officialPrerequisites as GraphEdge[]).filter((edge) => edge.from && edge.to);
  
  const groupedEdges: Record<string, GraphEdge[]> = { Math: [], Programming: [], Hardware: [], Circuit: [], Elective: [], Year4: [] };
  sourceEdges.forEach(edge => {
    const family = COURSE_FAMILY_MAP[String(edge.from)] || 'Other';
    if (groupedEdges[family]) groupedEdges[family].push(edge);
  });

  const familiesToShow = filter === 'All' ? Object.keys(groupedEdges) as FamilyLane[] : [filter];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '8px 0' }}>
      {familiesToShow.map((family) => {
        const edges = groupedEdges[family];
        if (edges.length === 0) return null;
        
        const meta = FAMILY_META[family];
        const Icon = meta.icon;

        // Group into continuous chains for horizontal display
        const chains: GraphEdge[][] = [];
        const unassigned = [...edges];

        while (unassigned.length > 0) {
          const current = unassigned.shift()!;
          const chain = [current];
          
          let tailTo = current.to;
          let added = true;
          while (added) {
            added = false;
            const nextIdx = unassigned.findIndex(e => e.from === tailTo);
            if (nextIdx !== -1) {
              chain.push(unassigned[nextIdx]);
              tailTo = unassigned[nextIdx].to;
              unassigned.splice(nextIdx, 1);
              added = true;
            }
          }
          chains.push(chain);
        }

        return (
          <div key={family} style={{ background: 'var(--surface)', borderRadius: '24px', padding: '24px', border: `1px solid ${meta.border}`, position: 'relative', overflow: 'hidden', boxShadow: `0 8px 32px ${meta.color}15` }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100px', height: '100px', background: `radial-gradient(circle, ${meta.color}20 0%, transparent 70%)`, filter: 'blur(20px)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', position: 'relative' }}>
              <div style={{ background: meta.bg, padding: '8px', borderRadius: '12px', color: meta.color, border: `1px solid ${meta.border}` }}>
                <Icon size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: meta.color }}>{meta.label}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Official Requirements: {edges.length} edges</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
              {chains.map((chain, chainIdx) => (
                <div key={chainIdx} className="chain-container" style={{ background: 'var(--bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  
                  {/* First node in chain */}
                  <div className="chain-item"><CourseChip course={courseIndex.findCourse(String(chain[0].from))} /></div>
                  
                  {/* Rest of the chain */}
                  {chain.map((edge) => (
                    <div key={edge.id} style={{ display: 'contents' }}>
                      <div className="chain-arrow" style={{ color: meta.color, opacity: 0.7 }}>
                        <ArrowRight size={20} className="desktop-arrow" />
                        <ArrowDown size={20} className="mobile-arrow" />
                      </div>
                      <div className="chain-item">
                        <CourseChip course={courseIndex.findCourse(String(edge.to))} />
                      </div>
                    </div>
                  ))}

                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function OfficialPrerequisiteGraph({ courseIndex }: { courseIndex: CourseIndex }) {
  const [filter, setFilter] = useState<FamilyLane>('All');
  const [isGraphMode, setIsGraphMode] = useState<boolean>(false);

  return (
    <>
      <style>{`
        .chain-container { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .chain-item { display: flex; }
        .desktop-arrow { display: block; }
        .mobile-arrow { display: none; }
        
        @media (max-width: 768px) {
          .chain-container { flex-direction: column; align-items: stretch; gap: 8px; }
          .chain-item { display: flex; justify-content: center; }
          .chain-arrow { justify-content: center; padding: 4px 0; gap: 8px; display: flex; align-items: center; }
          .desktop-arrow { display: none; }
          .mobile-arrow { display: block; }
        }

        .hover-glow:hover { border-color: var(--violet) !important; box-shadow: 0 12px 32px rgba(139, 92, 246, 0.3) !important; transform: translateY(-2px); }
        .hover-glow-danger:hover { border-color: #e11d48 !important; box-shadow: 0 12px 32px rgba(225, 29, 72, 0.3) !important; transform: translateY(-2px); }
      `}</style>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
        {Object.values(FAMILY_META).map(meta => {
          const f = meta.label === 'All' ? 'All' : Object.keys(FAMILY_META).find(k => FAMILY_META[k as FamilyLane].label === meta.label) as FamilyLane;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px', borderRadius: '999px', border: '1px solid',
                borderColor: filter === f ? 'var(--primary)' : 'var(--border)',
                background: filter === f ? 'var(--primary)' : 'var(--surface)',
                color: filter === f ? 'white' : 'var(--text)',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: filter === f ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <meta.icon size={16} />
              {f === 'All' ? 'All' : f}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', padding: '12px 20px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <strong>อ่านจากซ้ายไปขวา:</strong> วิชาทางซ้ายคือพื้นฐานของวิชาทางขวา (Official MKO.2)
        </div>
        <button 
          onClick={() => setIsGraphMode(!isGraphMode)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: isGraphMode ? 'var(--primary)' : 'var(--surface)', color: isGraphMode ? 'white' : 'var(--primary)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: isGraphMode ? '0 4px 12px rgba(139, 92, 246, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          {isGraphMode ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
          {isGraphMode ? 'โหมดแผนภาพรวม (Explore Mode)' : 'โหมดแผนผัง (Readable Mode)'}
        </button>
      </div>

      {!isGraphMode ? (
        <PrerequisiteChainCards courseIndex={courseIndex} filter={filter} />
      ) : (
        <section className="visual-card graph-card" style={{ height: filter === 'All' ? '70vh' : '480px', minHeight: '400px', width: '100%', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <ReactFlowProvider>
            <GraphContent courseIndex={courseIndex} filter={filter} />
          </ReactFlowProvider>
          
          <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '8px 24px', borderRadius: '999px', fontSize: '0.85rem', pointerEvents: 'none', display: 'flex', gap: '8px', alignItems: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontWeight: 600 }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></span>
            ลากเพื่อสำรวจแผนภาพ / Scroll เพื่อซูม
          </div>
        </section>
      )}
    </>
  );
}
