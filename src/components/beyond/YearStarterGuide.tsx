import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { YearStarterItem } from '../../data/toolsAndSources';

type YearStarterGuideProps = {
  items: YearStarterItem[];
};

export function YearStarterGuide({ items }: YearStarterGuideProps) {
  return (
    <div className="year-starter-guide">
      <div className="year-readiness-path" aria-label="Year-by-Year Readiness Path">
        <div className="year-readiness-path__line" aria-hidden="true" />
        {items.map((item, index) => (
          <div className="year-readiness-path__step" key={item.year}>
            <span>{item.year}</span>
            <strong>{item.highlight}</strong>
            {index < items.length - 1 ? <ArrowRight size={18} aria-hidden="true" /> : null}
          </div>
        ))}
      </div>

      <div className="year-guide-grid">
        {items.map((item) => (
          <article className="year-guide-card" key={item.year}>
            <div>
              <span className="year-guide-card__year">{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.highlight}</p>
            </div>
            <ul>
              {item.items.map((entry) => (
                <li key={entry}>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
