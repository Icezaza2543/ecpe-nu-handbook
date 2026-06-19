import { SurvivalLinksSection } from '../components/survival/SurvivalLinksSection';
import { SectionHeader } from '../components/common/SectionHeader';

export function UsefulLinksPage() {
  return (
    <div className="page-container" style={{ padding: '0 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <SectionHeader
        title="รวมลิงก์ที่มีประโยชน์"
        description="รวบรวมลิงก์ช่องทางการติดต่อ ข่าวสาร และระบบมหาวิทยาลัยที่จำเป็นสำหรับการเรียนในสาขาวิศวกรรมคอมพิวเตอร์ ม.นเรศวร"
        variant="hero"
      />
      <div style={{ marginTop: '-1rem' }}>
        <SurvivalLinksSection />
      </div>
    </div>
  );
}
