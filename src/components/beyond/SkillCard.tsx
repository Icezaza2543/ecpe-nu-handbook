import { ArrowRight, Lightbulb } from 'lucide-react';
import { Badge } from '../common/Badge';
import type { RealWorldSkill } from '../../data/toolsAndSources';

type SkillCardProps = {
  skill: RealWorldSkill;
};

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <article className="skill-card">
      <div className="skill-card__topline">
        <Badge tone="warning">{skill.category}</Badge>
        <Badge tone="muted">{skill.recommendedYear}</Badge>
      </div>
      <h3>{skill.title}</h3>
      <p>{skill.description}</p>
      <div className="skill-card__topics" aria-label={`หัวข้อของ ${skill.title}`}>
        {skill.topics.map((topic) => (
          <span key={topic}>{topic}</span>
        ))}
      </div>
      <div className="skill-card__tools">
        <strong>เครื่องมือที่โยงกัน</strong>
        <div className="beyond-tag-row">
          {skill.relatedTools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      </div>
      <div className="skill-card__action">
        <Lightbulb size={18} aria-hidden="true" />
        <span>{skill.action}</span>
        <ArrowRight size={17} aria-hidden="true" />
      </div>
    </article>
  );
}
