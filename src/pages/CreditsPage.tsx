import { Mail, BookOpen, AlertTriangle, ExternalLink, Code } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';

export function CreditsPage() {
  return (
    <div className="page" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      <SectionHeader 
        title="Credits & About" 
        description="ข้อมูลเกี่ยวกับผู้จัดทำ และที่มาของ CPE NU Freshman Handbook"
        variant="hero"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Section 1: About */}
        <section style={{ background: 'var(--surface)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '16px', color: 'var(--primary)' }}>
              <BookOpen size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text)' }}>เกี่ยวกับคู่มือนี้</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem', margin: '0 0 16px 0' }}>
            เว็บนี้จัดทำขึ้นเพื่อช่วยให้นิสิตใหม่สาขาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยนเรศวร เห็นภาพรวมของหลักสูตร 4 ปี เข้าใจรายวิชา วิชาตัวต่อ Roadmap อาชีพ และเงื่อนไขก่อนจบได้ง่ายขึ้น
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>
            คู่มือนี้ไม่ใช่ประกาศทางการของมหาวิทยาลัย แต่เป็นการรวบรวม เรียบเรียง และออกแบบประสบการณ์การอ่านจากมุมมองรุ่นพี่ เพื่อให้น้องใช้เป็นจุดเริ่มต้นในการวางแผน
          </p>
        </section>

        {/* Section 2: Author */}
        <section style={{ background: 'var(--surface)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '16px', color: 'var(--violet)' }}>
              <Code size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text)' }}>ผู้จัดทำ</h2>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', color: 'var(--text)' }}>Terasit Juntarasombut</h3>
            <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '16px' }}>@Icezaza2543</div>
            
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem', margin: '0 0 24px 0', maxWidth: '600px' }}>
              Computer Engineering alumnus from Naresuan University. Interested in embedded systems, IoT, software development, hardware, and 3D printing technology. Always learning. Always building.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <a href="https://github.com/Icezaza2543/" target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)', textDecoration: 'none',
                padding: '12px 24px', borderRadius: '16px', background: 'var(--bg)', border: '1px solid var(--border)',
                fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s'
              }}>
                <Code size={20} /> GitHub
              </a>
              <a href="mailto:icezaza.jar@gmail.com" target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)', textDecoration: 'none',
                padding: '12px 24px', borderRadius: '16px', background: 'var(--bg)', border: '1px solid var(--border)',
                fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s'
              }}>
                <Mail size={20} /> icezaza.jar@gmail.com
              </a>
            </div>
          </div>
        </section>

        {/* Section 3: Sources */}
        <section style={{ background: 'var(--surface)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '16px', color: 'var(--accent)' }}>
              <ExternalLink size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text)' }}>แหล่งข้อมูล</h2>
          </div>
          
          <ul style={{ margin: 0, paddingLeft: '24px', color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>มคอ.2 หลักสูตรวิศวกรรมคอมพิวเตอร์ ปรับปรุง พ.ศ. 2565</li>
            <li>ข้อมูลหมวดวิชาศึกษาทั่วไป</li>
            <li>ข้อมูลรายวิชาและคำอธิบายรายวิชาที่รวบรวมเพื่อใช้ใน handbook</li>
            <li>คำแนะนำรุ่นพี่และการตีความเพื่อช่วยวางแผนการเรียน</li>
          </ul>
        </section>

        {/* Section 4: Disclaimer */}
        <section style={{ background: '#fff1f2', borderRadius: '24px', padding: '32px', border: '1px solid #fda4af' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'white', padding: '12px', borderRadius: '16px', color: '#e11d48' }}>
              <AlertTriangle size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#be123c' }}>Disclaimer</h2>
          </div>
          <p style={{ color: '#9f1239', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>
            ข้อมูลในเว็บนี้จัดทำเพื่อการวางแผนเบื้องต้นเท่านั้น รายวิชา แผนการเรียน เงื่อนไขการลงทะเบียน และข้อกำหนดต่าง ๆ อาจมีการเปลี่ยนแปลงได้ ควรตรวจสอบกับคณะ มหาวิทยาลัย อาจารย์ที่ปรึกษา และระบบลงทะเบียนล่าสุดเสมอ
          </p>
        </section>

      </div>
    </div>
  );
}
