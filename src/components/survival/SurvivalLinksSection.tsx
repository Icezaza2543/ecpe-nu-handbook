import { survivalLinksBundle, getSurvivalLink } from '../../data/survivalLinks';
import { SurvivalLinkCard } from './SurvivalLinkCard';
import { 
  CheckCircle2, 
  Settings, 
  GraduationCap, 
  Wifi, 
  Languages, 
  HeartHandshake, 
  BookOpen 
} from 'lucide-react';
import '../../styles/survival.css';

export function SurvivalLinksSection() {
  const bundle = survivalLinksBundle;

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'cpe-faculty': return <Settings size={20} className="survival-link-icon" style={{ opacity: 1, color: 'var(--accent-color)' }} />;
      case 'university-systems': return <GraduationCap size={20} className="survival-link-icon" style={{ opacity: 1, color: 'var(--accent-color)' }} />;
      case 'it-services': return <Wifi size={20} className="survival-link-icon" style={{ opacity: 1, color: 'var(--accent-color)' }} />;
      case 'english-cept': return <Languages size={20} className="survival-link-icon" style={{ opacity: 1, color: 'var(--accent-color)' }} />;
      case 'student-affairs': return <HeartHandshake size={20} className="survival-link-icon" style={{ opacity: 1, color: 'var(--accent-color)' }} />;
      case 'library': return <BookOpen size={20} className="survival-link-icon" style={{ opacity: 1, color: 'var(--accent-color)' }} />;
      default: return null;
    }
  };

  return (
    <div className="survival-links-container" id="survival-links">

      {bundle.categories.map(category => {
        const catLinks = category.linkIds
          .map(getSurvivalLink)
          .filter((link): link is NonNullable<typeof link> => link !== undefined);

        if (catLinks.length === 0) return null;

        return (
          <section key={category.id} className="survival-category">
            <h3 className="survival-category-title">
              {getCategoryIcon(category.id)}
              {category.title}
            </h3>
            <div className="survival-bento-grid">
              {catLinks.map(link => (
                <SurvivalLinkCard key={link.id} link={link} categoryId={category.id} />
              ))}
            </div>
          </section>
        );
      })}

      <div className="survival-checklist-callout">
        <h3>
          <CheckCircle2 size={20} />
          ลิงก์ที่ควรมีไว้ แต่ยังต้องเช็กกับรุ่น/พี่รหัส
        </h3>
        <ul className="survival-checklist-list">
          {bundle.askSeniorsChecklist.map((item, idx) => (
            <li key={idx}>
              <CheckCircle2 size={16} className="survival-checklist-icon" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {bundle.notes.length > 0 && (
        <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <strong>หมายเหตุ:</strong>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            {bundle.notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
