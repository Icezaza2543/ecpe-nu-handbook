import { SlidersHorizontal } from 'lucide-react';
import { SearchBox } from '../common/SearchBox';

export type BeyondFilter =
  | 'All'
  | 'Tools'
  | 'Sources'
  | 'Skills'
  | 'Coding'
  | 'Git'
  | 'DevOps'
  | 'Cloud'
  | 'Embedded'
  | 'Security'
  | 'Soft Skills'
  | 'Career'
  | 'Business';

export type BeyondMobileSection = 'tools' | 'sources' | 'skills' | 'start';

const filterOptions: BeyondFilter[] = [
  'All',
  'Tools',
  'Sources',
  'Skills',
  'Coding',
  'Git',
  'DevOps',
  'Cloud',
  'Embedded',
  'Security',
  'Soft Skills',
  'Career',
  'Business',
];

const mobileSections: Array<{ id: BeyondMobileSection; label: string }> = [
  { id: 'tools', label: 'Tools' },
  { id: 'sources', label: 'Sources' },
  { id: 'skills', label: 'Skills' },
  { id: 'start', label: 'เริ่มต้น' },
];

type BeyondFiltersProps = {
  query: string;
  activeFilter: BeyondFilter;
  activeMobileSection: BeyondMobileSection;
  onQueryChange: (value: string) => void;
  onFilterChange: (filter: BeyondFilter) => void;
  onMobileSectionChange: (section: BeyondMobileSection) => void;
};

export function BeyondFilters({
  query,
  activeFilter,
  activeMobileSection,
  onQueryChange,
  onFilterChange,
  onMobileSectionChange,
}: BeyondFiltersProps) {
  return (
    <section className="beyond-filters" aria-label="ค้นหาและกรองรายการ">
      <SearchBox
        value={query}
        onChange={onQueryChange}
        placeholder="ค้นหาเช่น GitHub, Docker, Testing, Cloud, LinkedIn, System Design"
      />
      <div className="beyond-filter-row" aria-label="ตัวกรอง">
        <span className="beyond-filter-row__label">
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filter
        </span>
        {filterOptions.map((filter) => (
          <button
            type="button"
            key={filter}
            className={filter === activeFilter ? 'is-active' : ''}
            onClick={() => onFilterChange(filter)}
            aria-pressed={filter === activeFilter}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="beyond-mobile-tabs" aria-label="เลือกหมวดบนมือถือ">
        {mobileSections.map((section) => (
          <button
            type="button"
            key={section.id}
            className={section.id === activeMobileSection ? 'is-active' : ''}
            onClick={() => onMobileSectionChange(section.id)}
            aria-pressed={section.id === activeMobileSection}
          >
            {section.label}
          </button>
        ))}
      </div>
    </section>
  );
}
