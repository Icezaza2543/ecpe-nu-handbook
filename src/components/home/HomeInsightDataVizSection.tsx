import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { BookOpen, Activity, Briefcase, Calendar, Network, AlertTriangle, ChevronRight } from 'lucide-react';
import { MotionCard } from '../common/MotionCard';
import { Link } from 'react-router-dom';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export function HomeInsightDataVizSection() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section 
      variants={containerVariants} 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px" }} 
      style={{ marginBottom: '100px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '2.4rem', margin: '0 0 16px 0', fontWeight: 800 }}>
          ข้อมูลเชิงลึก <span className="text-gradient">หลักสูตร</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
          สรุปภาพรวมของหลักสูตรจากหลายมุม เพื่อช่วยให้น้องวางแผนการเรียนได้ง่ายขึ้น
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '24px',
        alignItems: 'stretch'
      }}>
        
        {/* Card 1: Credit Distribution (Donut Chart) */}
        <motion.div variants={itemVariants} style={{ display: 'flex' }}>
          <MotionCard style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(238, 242, 255, 0.8))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700 }}>
              <BookOpen size={20}/> สัดส่วนหน่วยกิต
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                <svg viewBox="0 0 36 36" width="100%" height="100%" style={{ transform: 'rotate(-90deg)' }}>
                  <circle stroke="rgba(0,0,0,0.05)" strokeWidth="4" fill="none" cx="18" cy="18" r="16" />
                  <motion.circle stroke="var(--cyan)" strokeWidth="4" fill="none" strokeDasharray="21.7 100" strokeDashoffset={0} cx="18" cy="18" r="16" initial={{ strokeDasharray: "0 100" }} whileInView={{ strokeDasharray: "21.7 100" }} transition={{ duration: 1 }} />
                  <motion.circle stroke="var(--primary)" strokeWidth="4" fill="none" strokeDasharray="73.9 100" strokeDashoffset="-21.7" cx="18" cy="18" r="16" initial={{ strokeDasharray: "0 100" }} whileInView={{ strokeDasharray: "73.9 100" }} transition={{ duration: 1, delay: 0.2 }} />
                  <motion.circle stroke="var(--warning)" strokeWidth="4" fill="none" strokeDasharray="4.3 100" strokeDashoffset="-95.6" cx="18" cy="18" r="16" initial={{ strokeDasharray: "0 100" }} whileInView={{ strokeDasharray: "4.3 100" }} transition={{ duration: 1, delay: 0.4 }} />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.8rem', color: 'var(--text)', lineHeight: 1 }}>138</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>หน่วยกิต</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 10, height: 10, borderRadius: '2px', background: 'var(--cyan)' }}></div> ศึกษาทั่วไป</span>
                <span>30</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 10, height: 10, borderRadius: '2px', background: 'var(--primary)' }}></div> วิชาเฉพาะ</span>
                <span>102</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 10, height: 10, borderRadius: '2px', background: 'var(--warning)' }}></div> เลือกเสรี</span>
                <span>6</span>
              </div>
            </div>
          </MotionCard>
        </motion.div>

        {/* Card 2: Workload Trend (Area Chart) */}
        <motion.div variants={itemVariants} style={{ display: 'flex' }}>
          <MotionCard style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(243, 232, 255, 0.8))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--violet)', fontWeight: 700 }}>
              <Activity size={20}/> ความเข้มข้นรายปี
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
              <svg viewBox="0 0 100 60" width="100%" height="120px" style={{ overflow: 'visible' }} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--violet)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--violet)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                {/* Data points roughly corresponding to typical CE workload: High in Year 2 and 3 */}
                <motion.path 
                  d="M0,55 L25,40 L50,15 L75,20 L100,45 L100,60 L0,60 Z" 
                  fill="url(#areaGradient)" 
                  initial={{ opacity: 0, y: 10 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.8 }} 
                />
                <motion.path 
                  d="M0,55 L25,40 L50,15 L75,20 L100,45" 
                  fill="none" 
                  stroke="var(--violet)" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  initial={{ pathLength: 0 }} 
                  whileInView={{ pathLength: 1 }} 
                  transition={{ duration: 1.2, ease: "easeInOut" }} 
                />
                <circle cx="25" cy="40" r="3" fill="var(--violet)" stroke="#fff" strokeWidth="1" />
                <circle cx="50" cy="15" r="4" fill="#fff" stroke="var(--violet)" strokeWidth="2" style={{ boxShadow: '0 0 10px rgba(123,97,255,0.5)' }} />
                <circle cx="75" cy="20" r="3" fill="var(--violet)" stroke="#fff" strokeWidth="1" />
                <circle cx="100" cy="45" r="3" fill="var(--violet)" stroke="#fff" strokeWidth="1" />
                
                {/* Max label */}
                <motion.text x="50" y="8" fontSize="6" fill="var(--violet)" fontWeight="bold" textAnchor="middle" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1 }}>Peak</motion.text>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <span style={{ width: '25px', textAlign: 'left' }}>ปี 1</span>
              <span style={{ width: '25px', textAlign: 'center' }}>ปี 2</span>
              <span style={{ width: '25px', textAlign: 'center' }}>ปี 3</span>
              <span style={{ width: '25px', textAlign: 'right' }}>ปี 4</span>
            </div>
          </MotionCard>
        </motion.div>

        {/* Card 3: Career Skill Mix (Horizontal Bars) */}
        <motion.div variants={itemVariants} style={{ display: 'flex' }}>
          <MotionCard style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(220, 252, 231, 0.6))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 700 }}>
              <Briefcase size={20}/> ทักษะจาก 6 สายอาชีพ
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              ความต้องการทักษะภาพรวมจากโครงสร้าง Roadmap หลักสูตร
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'center' }}>
              {[
                { label: 'Software Eng.', val: '90%', color: 'var(--primary)' },
                { label: 'AI & Data', val: '75%', color: 'var(--cyan)' },
                { label: 'Network', val: '65%', color: 'var(--violet)' },
                { label: 'Hardware', val: '60%', color: 'var(--orange)' },
              ].map((skill, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '85px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{skill.label}</span>
                  <div style={{ flex: 1, background: 'rgba(0,0,0,0.05)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={reducedMotion ? { width: skill.val } : { width: 0 }} 
                      whileInView={reducedMotion ? {} : { width: skill.val }} 
                      transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }} 
                      style={{ height: '100%', background: skill.color, borderRadius: '5px' }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </MotionCard>
        </motion.div>

        {/* Card 4: Semester Load Heatmap */}
        <motion.div variants={itemVariants} style={{ display: 'flex' }}>
          <MotionCard style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(254, 243, 199, 0.6))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--orange)', fontWeight: 700 }}>
              <Calendar size={20}/> ความหนาแน่นแต่ละเทอม
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right', paddingRight: '8px' }}>T1</div>
                <div style={{ height: '32px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.4)' }} title="ปี 1 เทอม 1: กลาง"></div>
                <div style={{ height: '32px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.8)' }} title="ปี 2 เทอม 1: หนัก"></div>
                <div style={{ height: '32px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.9)' }} title="ปี 3 เทอม 1: หนักมาก"></div>
                
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right', paddingRight: '8px' }}>T2</div>
                <div style={{ height: '32px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.5)' }} title="ปี 1 เทอม 2: กลาง"></div>
                <div style={{ height: '32px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.85)' }} title="ปี 2 เทอม 2: หนัก"></div>
                <div style={{ height: '32px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.6)' }} title="ปี 3 เทอม 2: กลาง"></div>
                
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right', paddingRight: '8px' }}>S/Pr</div>
                <div style={{ height: '16px', borderRadius: '4px', background: 'rgba(0,0,0,0.03)' }} ></div>
                <div style={{ height: '16px', borderRadius: '4px', background: 'rgba(0,0,0,0.03)' }} ></div>
                <div style={{ height: '16px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.7)' }} title="ปี 3 ฤดูร้อน: ฝึกงาน"></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: '8px' }}>
                <div></div>
                <div style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>ปี 1</div>
                <div style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>ปี 2</div>
                <div style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>ปี 3</div>
              </div>

            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              เบา <div style={{ width: '60px', height: '8px', background: 'linear-gradient(to right, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.9))', borderRadius: '4px' }}></div> หนัก
            </div>
          </MotionCard>
        </motion.div>

        {/* Card 5: Prerequisite Chain Preview (Mini Network) */}
        <motion.div variants={itemVariants} style={{ display: 'flex' }}>
          <MotionCard style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)', fontWeight: 700 }}>
              <Network size={20}/> เส้นทางวิชาตัวต่อ
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              ตัวอย่างสายวิชาต่อเนื่องที่ห้ามตก เพราะจะเรียนตัวถัดไปไม่ได้
            </p>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <div style={{ padding: '6px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, zIndex: 1 }}>Calc 1</div>
                <div style={{ flex: 1, height: '2px', background: 'var(--border)', margin: '0 8px', position: 'relative' }}>
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--cyan)', transformOrigin: 'left' }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.5 }} />
                </div>
                <div style={{ padding: '6px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, zIndex: 1 }}>Calc 2</div>
                <div style={{ flex: 1, height: '2px', background: 'var(--border)', margin: '0 8px', position: 'relative' }}>
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--cyan)', transformOrigin: 'left' }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
                </div>
                <div style={{ padding: '6px 12px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, zIndex: 1 }}>Calc 3</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <div style={{ padding: '6px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, zIndex: 1 }}>Prog 1</div>
                <div style={{ flex: 1, height: '2px', background: 'var(--border)', margin: '0 8px', position: 'relative' }}>
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--primary)', transformOrigin: 'left' }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.5 }} />
                </div>
                <div style={{ padding: '6px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, zIndex: 1 }}>Prog 2</div>
                <div style={{ flex: 1, height: '2px', background: 'var(--border)', margin: '0 8px', position: 'relative' }}>
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--primary)', transformOrigin: 'left' }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
                </div>
                <div style={{ padding: '6px 12px', background: 'rgba(79, 124, 255, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, zIndex: 1 }}>Data Struct</div>
              </div>

            </div>
            <div style={{ textAlign: 'right' }}>
              <Link to="/dependency-graph" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cyan)', textDecoration: 'none' }}>
                ดูเส้นทางทั้งหมด <ChevronRight size={14} />
              </Link>
            </div>
          </MotionCard>
        </motion.div>

        {/* Card 6: Attention/Risk Courses (Ranked Lollipop) */}
        <motion.div variants={itemVariants} style={{ display: 'flex' }}>
          <MotionCard style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255, 228, 230, 0.6))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e11d48', fontWeight: 700 }}>
              <AlertTriangle size={20}/> วิชาที่ควรวางแผนก่อน
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              สถิติความท้าทายสูง ควรให้เวลาทบทวนมากเป็นพิเศษ
            </p>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
              {[
                { label: 'Calculus Series', level: 90, color: '#e11d48' },
                { label: 'Data Struct & Algo', level: 85, color: 'var(--violet)' },
                { label: 'Physics Series', level: 75, color: 'var(--orange)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '110px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>{item.label}</span>
                  <div style={{ flex: 1, position: 'relative', height: '14px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '2px', background: 'rgba(0,0,0,0.05)', borderRadius: '1px' }}></div>
                    <motion.div 
                      initial={reducedMotion ? { width: `${item.level}%` } : { width: 0 }}
                      whileInView={reducedMotion ? {} : { width: `${item.level}%` }}
                      transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                      style={{ position: 'absolute', height: '2px', background: item.color, borderRadius: '1px' }}
                    >
                      <div style={{ position: 'absolute', right: '-6px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', borderRadius: '50%', background: item.color, boxShadow: `0 0 8px ${item.color}80` }}></div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ระดับความท้าทาย
            </div>
          </MotionCard>
        </motion.div>

      </div>
    </motion.section>
  );
}
