import { FileText, Users, Globe } from 'lucide-react';
import type { SurvivalLink } from '../../types/survivalLinks';

interface SurvivalLinkCardProps {
  link: SurvivalLink;
  categoryId?: string;
}

export function SurvivalLinkCard({ link, categoryId }: SurvivalLinkCardProps) {
  const getIcon = () => {
    switch (link.platform) {
      case 'facebook':
      case 'post':
        return <Users size={18} className="survival-link-icon" />;
      case 'pdf':
        return <FileText size={18} className="survival-link-icon" />;
      case 'website':
      default:
        return <Globe size={18} className="survival-link-icon" />;
    }
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`survival-link-card theme-${categoryId || 'default'}`}
    >
      <div className="survival-link-header">
        <span className="survival-link-name">{link.name}</span>
        {getIcon()}
      </div>
      <p className="survival-link-desc">{link.description}</p>
    </a>
  );
}
