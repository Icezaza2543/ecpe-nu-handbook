import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type NodeId = 'core' | 'math' | 'code' | 'hardware' | 'career' | 'gened' | 'projects' | 'electives' | 'internship';
type AnchorDir = 't' | 'b' | 'l' | 'r';
type AnchorType = 'top' | 'bottom' | 'left' | 'right' | 'right-top' | 'right-bottom' | 'left-top' | 'left-bottom';

interface AnchorPoint {
  x: number;
  y: number;
  dir: AnchorDir;
}

interface NodeLayout {
  id: NodeId;
  label: string;
  className: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PathConfig {
  id: string;
  source: NodeId;
  target: NodeId;
  startAnchor: AnchorType;
  endAnchor: AnchorType;
  color: string;
  glow: string;
}

interface ComputedPath extends PathConfig {
  d: string;
}

// 600x360 Internal Coordinate System
const MAP_W = 600;
const MAP_H = 360;

const NODES: NodeLayout[] = [
  { id: 'math', label: 'Math Chain', className: 'mission-node--math', x: 110, y: 60, w: 130, h: 44 },
  { id: 'gened', label: 'GenEd', className: 'mission-node--gened', x: 110, y: 180, w: 130, h: 44 },
  { id: 'hardware', label: 'Hardware', className: 'mission-node--hardware', x: 110, y: 300, w: 130, h: 44 },
  
  { id: 'electives', label: 'Electives', className: 'mission-node--electives', x: 300, y: 60, w: 130, h: 44 },
  { id: 'core', label: 'ECPE Core', className: 'mission-node--core', x: 300, y: 180, w: 160, h: 48 },
  { id: 'internship', label: 'Internship', className: 'mission-node--internship', x: 300, y: 300, w: 130, h: 44 },
  
  { id: 'code', label: 'Programming', className: 'mission-node--code', x: 490, y: 60, w: 140, h: 44 },
  { id: 'projects', label: 'Projects', className: 'mission-node--projects', x: 490, y: 180, w: 130, h: 44 },
  { id: 'career', label: 'Career Output', className: 'mission-node--career', x: 490, y: 300, w: 140, h: 44 },
];

const RAW_PATHS: PathConfig[] = [
  // Math & Hardware into GenEd
  { id: 'math-to-gened', source: 'math', target: 'gened', startAnchor: 'bottom', endAnchor: 'top', color: 'rgba(8, 145, 178, 0.4)', glow: 'rgba(8, 145, 178, 1)' },
  { id: 'hw-to-gened', source: 'hardware', target: 'gened', startAnchor: 'top', endAnchor: 'bottom', color: 'rgba(255, 158, 87, 0.4)', glow: 'rgba(255, 158, 87, 1)' },
  
  // GenEd to Electives and Core (Lane splitting)
  { id: 'gened-to-electives', source: 'gened', target: 'electives', startAnchor: 'right-top', endAnchor: 'left', color: 'rgba(168, 85, 247, 0.4)', glow: 'rgba(168, 85, 247, 1)' },
  { id: 'gened-to-core', source: 'gened', target: 'core', startAnchor: 'right-bottom', endAnchor: 'left', color: 'rgba(168, 85, 247, 0.4)', glow: 'rgba(168, 85, 247, 1)' },
  
  // Electives to Core
  { id: 'electives-to-core', source: 'electives', target: 'core', startAnchor: 'bottom', endAnchor: 'top', color: 'rgba(234, 179, 8, 0.4)', glow: 'rgba(234, 179, 8, 1)' },

  // Core radiating outwards
  { id: 'core-to-prog', source: 'core', target: 'code', startAnchor: 'right-top', endAnchor: 'left', color: 'rgba(37, 99, 235, 0.4)', glow: 'rgba(37, 99, 235, 1)' },
  { id: 'core-to-intern', source: 'core', target: 'internship', startAnchor: 'bottom', endAnchor: 'top', color: 'rgba(14, 165, 233, 0.4)', glow: 'rgba(14, 165, 233, 1)' },

  // Prog -> Projects -> Career/Internship
  { id: 'prog-to-projects', source: 'code', target: 'projects', startAnchor: 'bottom', endAnchor: 'top', color: 'rgba(37, 99, 235, 0.4)', glow: 'rgba(37, 99, 235, 1)' },
  { id: 'projects-to-internship', source: 'projects', target: 'internship', startAnchor: 'left', endAnchor: 'right', color: 'rgba(236, 72, 153, 0.4)', glow: 'rgba(236, 72, 153, 1)' },
  { id: 'projects-to-career', source: 'projects', target: 'career', startAnchor: 'bottom', endAnchor: 'top', color: 'rgba(236, 72, 153, 0.4)', glow: 'rgba(236, 72, 153, 1)' },
];

const LEARNING_TRACKS = [
  { id: 'track-math-core', paths: ['math-to-gened', 'gened-to-core'] },
  { id: 'track-hw-core', paths: ['hw-to-gened', 'gened-to-core'] },
  { id: 'track-electives-core', paths: ['gened-to-electives', 'electives-to-core'] },
  { id: 'track-core-career', paths: ['core-to-prog', 'prog-to-projects', 'projects-to-career'] },
  { id: 'track-core-intern', paths: ['core-to-intern', 'prog-to-projects', 'projects-to-internship'] }
];

function getAnchor(node: NodeLayout, type: AnchorType): AnchorPoint {
  const hw = node.w / 2;
  const hh = node.h / 2;
  const oy = hh * 0.4; // 40% offset for lanes
  
  switch(type) {
    case 'top': return { x: node.x, y: node.y - hh, dir: 't' };
    case 'bottom': return { x: node.x, y: node.y + hh, dir: 'b' };
    case 'left': return { x: node.x - hw, y: node.y, dir: 'l' };
    case 'right': return { x: node.x + hw, y: node.y, dir: 'r' };
    case 'right-top': return { x: node.x + hw, y: node.y - oy, dir: 'r' };
    case 'right-bottom': return { x: node.x + hw, y: node.y + oy, dir: 'r' };
    case 'left-top': return { x: node.x - hw, y: node.y - oy, dir: 'l' };
    case 'left-bottom': return { x: node.x - hw, y: node.y + oy, dir: 'l' };
    default: return { x: node.x, y: node.y, dir: 'r' };
  }
}

function routePath(start: AnchorPoint, end: AnchorPoint): string {
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  
  let strengthX = dx * 0.5;
  let strengthY = dy * 0.5;

  // Prevent overly tight or collapsed curves
  strengthX = Math.max(strengthX, 20);
  strengthY = Math.max(strengthY, 20);

  // Force minimum arc for loopbacks
  if ((start.dir === 'r' && end.x < start.x) || (start.dir === 'l' && end.x > start.x)) {
    strengthX = Math.max(strengthX, 40);
  }
  if ((start.dir === 'b' && end.y < start.y) || (start.dir === 't' && end.y > start.y)) {
    strengthY = Math.max(strengthY, 40);
  }

  const getCP = (pt: AnchorPoint) => {
    let cx = pt.x;
    let cy = pt.y;
    if (pt.dir === 'r') cx += strengthX;
    if (pt.dir === 'l') cx -= strengthX;
    if (pt.dir === 'b') cy += strengthY;
    if (pt.dir === 't') cy -= strengthY;
    return { x: cx, y: cy };
  }

  const cp1 = getCP(start);
  const cp2 = getCP(end);

  return `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
}

const PATHS: ComputedPath[] = RAW_PATHS.map(p => {
  const sourceNode = NODES.find(n => n.id === p.source)!;
  const targetNode = NODES.find(n => n.id === p.target)!;
  const startAnchor = getAnchor(sourceNode, p.startAnchor);
  const endAnchor = getAnchor(targetNode, p.endAnchor);
  return { ...p, d: routePath(startAnchor, endAnchor) };
});

export function AnimatedDependencyMap() {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredNode, setHoveredNode] = useState<NodeId | null>(null);
  const [activeTrackIdx, setActiveTrackIdx] = useState<number | null>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const idleInterval = setInterval(() => {
      if (isCardHovered || prefersReducedMotion) return;
      
      setActiveTrackIdx((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % LEARNING_TRACKS.length;
      });
      
      setTimeout(() => {
        setActiveTrackIdx(null);
      }, 2000); 
      
    }, 4000);

    return () => clearInterval(idleInterval);
  }, [isCardHovered, prefersReducedMotion]);

  const getConnectedNodes = (nodeId: NodeId): Set<NodeId> => {
    const connected = new Set<NodeId>([nodeId]);
    PATHS.forEach(p => {
      if (p.source === nodeId) connected.add(p.target);
      if (p.target === nodeId) connected.add(p.source);
    });
    return connected;
  };

  const connectedNodes = hoveredNode ? getConnectedNodes(hoveredNode) : new Set<NodeId>();
  
  const getActiveTrackPaths = (): string[] => {
    if (activeTrackIdx === null) return [];
    return LEARNING_TRACKS[activeTrackIdx].paths;
  };

  const activeTrackPaths = getActiveTrackPaths();
  const activeTrackNodes = new Set<NodeId>();
  if (activeTrackPaths.length > 0) {
    PATHS.forEach(p => {
      if (activeTrackPaths.includes(p.id)) {
        activeTrackNodes.add(p.source);
        activeTrackNodes.add(p.target);
      }
    });
  }

  const isNodeDimmed = (id: NodeId) => {
    if (!hoveredNode && activeTrackPaths.length === 0) return false;
    if (hoveredNode) return !connectedNodes.has(id);
    if (activeTrackPaths.length > 0) return !activeTrackNodes.has(id);
    return false;
  };

  const isNodeHighlighted = (id: NodeId) => {
    if (hoveredNode) return connectedNodes.has(id);
    if (activeTrackPaths.length > 0) return activeTrackNodes.has(id);
    return false;
  };

  const isPathDimmed = (p: ComputedPath) => {
    if (!hoveredNode && activeTrackPaths.length === 0) return false;
    if (hoveredNode) return p.source !== hoveredNode && p.target !== hoveredNode;
    if (activeTrackPaths.length > 0) return !activeTrackPaths.includes(p.id);
    return false;
  };

  const isPathHighlighted = (p: ComputedPath) => {
    if (hoveredNode) return p.source === hoveredNode || p.target === hoveredNode;
    if (activeTrackPaths.length > 0) return activeTrackPaths.includes(p.id);
    return false;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const nodeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  const pathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } }
  };

  return (
    <motion.div 
      className={`mission-graph ${isCardHovered ? 'is-hovered' : ''}`}
      aria-hidden="true"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => {
        setIsCardHovered(false);
        setHoveredNode(null);
      }}
      variants={prefersReducedMotion ? {} : containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="none" role="presentation" className="dependency-svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <filter id="glow-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="particle-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {PATHS.map(p => {
          const highlighted = isPathHighlighted(p);
          if (!highlighted) return null;
          return (
            <motion.path 
              key={`glow-${p.id}`}
              d={p.d} 
              stroke={p.glow} 
              strokeWidth="6" 
              fill="none" 
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-blur)"
              style={{ opacity: 0.3 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.4 }}
            />
          );
        })}

        {PATHS.map(p => {
          const highlighted = isPathHighlighted(p);
          const dimmed = isPathDimmed(p);
          
          return (
            <motion.path 
              key={`base-${p.id}`}
              id={`path-${p.id}`} 
              d={p.d} 
              stroke={highlighted ? p.glow : p.color} 
              strokeWidth={highlighted ? "3" : "2"} 
              fill="none" 
              className={`base-path ${dimmed ? 'is-dimmed' : ''} ${highlighted ? 'is-highlighted' : ''}`} 
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              variants={prefersReducedMotion ? {} : pathVariants}
              style={{
                opacity: dimmed ? 0.15 : 1,
                transition: 'opacity 0.4s ease, stroke-width 0.4s ease, stroke 0.4s ease'
              }}
            />
          );
        })}

        {mounted && !prefersReducedMotion && PATHS.map(p => {
          const highlighted = isPathHighlighted(p);
          const dimmed = isPathDimmed(p);
          if (dimmed) return null; 
          
          return (
            <g key={`particle-${p.id}`} filter="url(#particle-glow)">
              {/* White core packet */}
              <circle r={highlighted ? "4" : "2.5"} fill="#fff" />
              {/* Colored outer glow trail */}
              <circle r={highlighted ? "8" : "5"} fill={p.glow} opacity="0.8" />
              
              <animateMotion
                dur={highlighted ? "1.5s" : `${2 + Math.random() * 2}s`}
                repeatCount="indefinite"
                path={p.d}
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
                keyTimes="0;1"
              />
            </g>
          );
        })}
      </svg>

      {NODES.map(node => {
        const dimmed = isNodeDimmed(node.id);
        const highlighted = isNodeHighlighted(node.id);
        
        return (
          <motion.span 
            key={node.id}
            className={`mission-node ${node.className} ${dimmed ? 'is-dimmed' : ''} ${highlighted ? 'is-highlighted' : ''} ${hoveredNode === node.id ? 'is-selected' : ''}`}
            onMouseEnter={() => setHoveredNode(node.id)}
            variants={prefersReducedMotion ? {} : nodeVariants}
            style={{
              left: `${(node.x / MAP_W) * 100}%`,
              top: `${(node.y / MAP_H) * 100}%`,
              width: `${(node.w / MAP_W) * 100}%`,
              height: `${(node.h / MAP_H) * 100}%`,
            }}
          >
            {node.label}
          </motion.span>
        );
      })}
    </motion.div>
  );
}
