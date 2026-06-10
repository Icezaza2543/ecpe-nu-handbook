import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, QuadraticBezierLine, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

// --- DATA ---
const nodesData = [
  { id: 'prog', label: 'Programming', color: '#4f7cff', pos: [-3, 2, -1] },
  { id: 'math', label: 'Math', color: '#35c9ff', pos: [3.5, 1.5, -2] },
  { id: 'hard', label: 'Hardware', color: '#ff6fd8', pos: [1, -3.5, 1.5] },
  { id: 'net', label: 'Network', color: '#4ee6b2', pos: [-2.5, -2, -2] },
  { id: 'ai', label: 'AI & Data', color: '#7b61ff', pos: [3, -1.5, 1] },
  { id: 'career', label: 'Career', color: '#ff9e57', pos: [-1.5, 3, 2] },
];

const centerPos = new THREE.Vector3(0, 0, 0);

// --- COMPONENTS ---

function CenterNode() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={centerPos}>
        <icosahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          emissive="#4f7cff"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1}
          transmission={0.5}
          thickness={0.5}
          wireframe={true}
        />
        <Html center position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            padding: '10px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(79, 124, 255, 0.3)',
            color: 'var(--primary-strong)',
            fontWeight: 800,
            fontSize: '1.2rem',
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 32px rgba(79, 124, 255, 0.2)'
          }}>
            ECPE NU
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

function OrbitNode({ data }: { data: typeof nodesData[0] }) {
  const [hovered, setHovered] = useState(false);
  const targetPos = useMemo(() => new THREE.Vector3(...data.pos as [number, number, number]), [data.pos]);
  
  return (
    <Float speed={hovered ? 0.5 : 3} rotationIntensity={0.5} floatIntensity={1}>
      <mesh 
        position={targetPos}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={data.color} 
          emissive={data.color}
          emissiveIntensity={hovered ? 0.8 : 0.2}
          roughness={0.2}
          metalness={0.5}
        />
        <Html center position={[0, -0.6, 0]} style={{ pointerEvents: 'none', transition: 'all 0.3s ease', opacity: hovered ? 1 : 0.8, transform: hovered ? 'scale(1.1)' : 'scale(1)' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '4px 12px',
            borderRadius: '999px',
            border: `1px solid ${data.color}`,
            color: 'var(--text)',
            fontWeight: 700,
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
            boxShadow: hovered ? `0 4px 16px ${data.color}40` : 'none'
          }}>
            {data.label}
          </div>
        </Html>
      </mesh>
      
      {/* Connection Line */}
      <QuadraticBezierLine 
        start={centerPos} 
        end={targetPos}
        mid={new THREE.Vector3(targetPos.x * 0.5, targetPos.y * 0.5 + 1, targetPos.z * 0.5)}
        color={data.color} 
        lineWidth={hovered ? 2 : 1}
        transparent
        opacity={hovered ? 0.6 : 0.2}
      />
    </Float>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const shouldReduceMotion = useReducedMotion();

  useFrame((state) => {
    if (groupRef.current && !shouldReduceMotion) {
      // Very subtle continuous rotation
      groupRef.current.rotation.y += 0.001;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      
      // Mouse parallax
      const targetX = (state.pointer.x * 0.1);
      const targetY = (state.pointer.y * 0.1);
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <CenterNode />
      {nodesData.map((node) => (
        <OrbitNode key={node.id} data={node} />
      ))}
    </group>
  );
}

export default function HeroCurriculumOrbit3D() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f7cff" />
        <Scene />
      </Canvas>
    </div>
  );
}
