import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BookOpen,
  Briefcase,
  Cloud,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  Terminal,
  Users,
  Wrench,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import type { SourceItem, ToolItem } from '../../data/toolsAndSources';

type ToolSourceCardProps = {
  item: ToolItem | SourceItem;
  kind: 'tool' | 'source';
};

const iconByCategory: Record<string, LucideIcon> = {
  Coding: Code2,
  Git: GitBranch,
  Terminal,
  DevOps: Wrench,
  Cloud,
  Embedded: Cpu,
  'API / Database': Database,
  'Documentation / Design': FileText,
  Learning: BookOpen,
  Documentation: FileText,
  'Coding Practice': Code2,
  Community: Users,
  Portfolio: Briefcase,
  Career: Briefcase,
  'Open Source': GitBranch,
};

export function ToolSourceCard({ item, kind }: ToolSourceCardProps) {
  const Icon = iconByCategory[item.category] || (kind === 'tool' ? Wrench : Activity);

  return (
    <article className={`tool-source-card tool-source-card--${kind}`}>
      <div className="tool-source-card__icon" aria-hidden="true">
        <Icon size={22} />
      </div>
      <div className="tool-source-card__body">
        <div className="tool-source-card__heading">
          <h3>{item.name}</h3>
          {item.link ? (
            <a
              className="tool-source-card__link"
              href={item.link}
              target="_blank"
              rel="noreferrer"
              aria-label={`เปิด ${item.name} ในแท็บใหม่`}
            >
              <ExternalLink size={16} />
            </a>
          ) : null}
        </div>
        <div className="tool-source-card__meta">
          <Badge tone={kind === 'tool' ? 'verified' : 'soft'}>{item.category}</Badge>
          <Badge tone="muted">{item.recommendedYear}</Badge>
        </div>
        <p>{item.description}</p>
        <div className="beyond-tag-row" aria-label={`เหมาะกับ ${item.name}`}>
          {item.bestFor.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
