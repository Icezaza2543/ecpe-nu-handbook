import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Compass,
  ExternalLink,
  Filter,
  GraduationCap,
  Layers3,
  ListChecks,
  Search,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';
import '../styles/beyond.css';
import { Badge } from '../components/common/Badge';
import { PortfolioChecklistViz } from '../components/beyond/PortfolioChecklistViz';
import { SkillGapMatrix } from '../components/beyond/SkillGapMatrix';
import {
  realWorldSkills,
  sources,
  tools,
  yearStarterGuide,
  type RealWorldSkill,
  type SourceItem,
  type ToolItem,
} from '../data/toolsAndSources';
import { getToolLogo } from '../data/toolLogos';

type SearchableKind = 'tool' | 'source' | 'skill';
type ExplorerTab = 'tools' | 'sources' | 'skills';
type FocusState =
  | { type: 'all' }
  | { type: 'category'; value: string }
  | { type: 'year'; value: string }
  | { type: 'goal'; value: 'project' | 'career' | 'track' };
type SearchableItem = ToolItem | SourceItem | RealWorldSkill;
type ItemRecord = {
  kind: SearchableKind;
  item: SearchableItem;
};
type DrawerState =
  | { mode: 'items'; title: string; description: string; records: ItemRecord[] }
  | { mode: 'item'; record: ItemRecord };

const tabLabels: Record<ExplorerTab, string> = {
  tools: 'Tools',
  sources: 'Sources',
  skills: 'Skills',
};

const kindLabels: Record<SearchableKind, string> = {
  tool: 'Tools',
  source: 'Sources',
  skill: 'Skills',
};

const toolTopPickIds = ['visual-studio-code', 'git', 'github', 'python', 'google-docs', 'markdown'];
const sourceTopPickIds = ['thai-mooc', 'freecodecamp', 'mdn-web-docs', 'youtube-education', 'github-profile', 'linkedin'];
const skillTopPickIds = ['real-world-coding', 'git-real-work', 'frameworks-project-stack', 'self-learning-career'];

const categoryFilters = ['Coding', 'Git', 'DevOps', 'Cloud', 'Embedded', 'Security', 'Soft Skills', 'Career', 'Business'];
const yearFilters = ['ปี 1', 'ปี 2', 'ปี 3', 'ปี 4'];

const filterAliases: Record<string, string[]> = {
  Coding: ['coding', 'code', 'programming', 'software', 'python', 'react', 'node', 'test', 'debug', 'framework'],
  Git: ['git', 'github', 'gitlab', 'pull request', 'merge request', 'code review'],
  DevOps: ['devops', 'docker', 'ci/cd', 'deploy', 'monitoring', 'logging', 'grafana', 'production'],
  Cloud: ['cloud', 'aws', 'azure', 'gcp', 'terraform', 'vercel', 'netlify'],
  Embedded: ['embedded', 'iot', 'esp32', 'arduino', 'mqtt', 'pcb', 'oscilloscope', 'logic analyzer'],
  Security: ['security', 'secure', 'vulnerability', 'authentication', 'authorization', 'privacy'],
  'Soft Skills': ['soft skills', 'communication', 'teamwork', 'present', 'docs', 'non-tech'],
  Career: ['career', 'portfolio', 'internship', 'job', 'resume', 'linkedin', 'interview', 'freelance'],
  Business: ['business', 'requirement', 'roi', 'cost', 'trade-off', 'prioritization'],
};

const goalAliases: Record<Extract<FocusState, { type: 'goal' }>['value'], string[]> = {
  project: ['project', 'coding', 'git', 'github', 'docker', 'postman', 'database', 'react', 'node', 'markdown', 'docs'],
  career: ['career', 'portfolio', 'internship', 'job', 'resume', 'linkedin', 'interview', 'freelance', 'github profile'],
  track: ['embedded', 'cloud', 'security', 'data', 'ai', 'business', 'devops', 'software', 'iot'],
};

function normalize(value: string) {
  return value.toLocaleLowerCase('th-TH');
}

function getTitle(record: ItemRecord) {
  return 'name' in record.item ? record.item.name : record.item.title;
}

function getDescription(record: ItemRecord) {
  return record.item.description;
}

function getCategory(record: ItemRecord) {
  return record.item.category;
}

function getRecommendedYear(record: ItemRecord) {
  return record.item.recommendedYear;
}

function getTags(record: ItemRecord) {
  return 'bestFor' in record.item ? record.item.bestFor : record.item.topics;
}

function getRecordLogo(record: ItemRecord) {
  return record.kind === 'tool' && 'id' in record.item ? getToolLogo(record.item.id) : undefined;
}

function getSearchText(record: ItemRecord) {
  if ('bestFor' in record.item) {
    return [
      record.item.name,
      record.item.category,
      record.item.recommendedYear,
      record.item.description,
      ...record.item.bestFor,
      record.item.link || '',
    ].join(' ');
  }

  return [
    record.item.title,
    record.item.category,
    record.item.recommendedYear,
    record.item.description,
    ...record.item.topics,
    ...record.item.relatedTools,
    record.item.action,
  ].join(' ');
}

function getYearNumber(year: string) {
  const match = year.match(/[1-4]/);
  return match ? Number(match[0]) : 1;
}

function matchesYear(record: ItemRecord, year: string) {
  const selected = getYearNumber(year);
  const recommended = getYearNumber(getRecommendedYear(record));
  return recommended <= selected;
}

function matchesWords(record: ItemRecord, words: string[]) {
  const haystack = normalize(getSearchText(record));
  return words.map(normalize).some((word) => haystack.includes(word));
}

function matchesCategory(record: ItemRecord, category: string) {
  if (getCategory(record) === category) return true;
  return matchesWords(record, [category, ...(filterAliases[category] || [])]);
}

function matchesFocus(record: ItemRecord, focus: FocusState) {
  if (focus.type === 'all') return true;
  if (focus.type === 'year') return matchesYear(record, focus.value);
  if (focus.type === 'category') return matchesCategory(record, focus.value);
  return matchesWords(record, goalAliases[focus.value]);
}

function matchesSearch(record: ItemRecord, query: string) {
  const trimmed = normalize(query.trim());
  if (!trimmed) return true;
  return normalize(getSearchText(record)).includes(trimmed);
}

function groupByCategory(records: ItemRecord[]) {
  return records.reduce<Record<string, ItemRecord[]>>((groups, record) => {
    const category = getCategory(record);
    groups[category] = [...(groups[category] || []), record];
    return groups;
  }, {});
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function focusLabel(focus: FocusState) {
  if (focus.type === 'all') return 'ภาพรวมทั้งหมด';
  if (focus.type === 'year') return `${focus.value} ควรเริ่มจาก 5 อย่างนี้ก่อน`;
  if (focus.type === 'category') return `${focus.value} มีอะไรควรรู้บ้าง`;
  if (focus.value === 'project') return 'เตรียมทำโปรเจกต์ มีอะไรควรรู้บ้าง';
  if (focus.value === 'career') return 'เตรียมฝึกงาน / หางาน มีอะไรควรรู้บ้าง';
  return 'เลือกตามสายที่สนใจ';
}

function compactDescription(text: string) {
  return text.length > 118 ? `${text.slice(0, 115)}...` : text;
}

function Highlight({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;

  const index = normalize(text).indexOf(normalize(trimmed));
  if (index < 0) return <>{text}</>;

  const before = text.slice(0, index);
  const match = text.slice(index, index + trimmed.length);
  const after = text.slice(index + trimmed.length);
  return (
    <>
      {before}
      <mark>{match}</mark>
      {after}
    </>
  );
}

function CompactItemCard({
  record,
  query = '',
  onOpen,
}: {
  record: ItemRecord;
  query?: string;
  onOpen: (record: ItemRecord) => void;
}) {
  const tags = getTags(record).slice(0, 3);
  const logo = getRecordLogo(record);
  const title = getTitle(record);

  return (
    <article className={`compact-item-card compact-item-card--${record.kind}`}>
      <div className="compact-item-card__head">
        {logo ? (
          <span className="tool-logo" title={`${title} logo จาก Devicon`}>
            <img src={logo.src} alt="" loading="lazy" />
          </span>
        ) : null}
        <div className="compact-item-card__meta">
          <Badge tone={record.kind === 'skill' ? 'warning' : record.kind === 'tool' ? 'verified' : 'soft'}>
            {getCategory(record)}
          </Badge>
          <Badge tone="muted">{getRecommendedYear(record)}</Badge>
        </div>
      </div>
      <h3>
        <Highlight text={title} query={query} />
      </h3>
      <p>{compactDescription(getDescription(record))}</p>
      <div className="compact-item-card__footer">
        <div className="compact-tags">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <button type="button" onClick={() => onOpen(record)}>
          ดูรายละเอียด
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function Drawer({
  drawer,
  query,
  onClose,
  onOpenItem,
}: {
  drawer: DrawerState | null;
  query: string;
  onClose: () => void;
  onOpenItem: (record: ItemRecord) => void;
}) {
  useEffect(() => {
    if (!drawer) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawer, onClose]);

  if (!drawer) return null;

  const isItem = drawer.mode === 'item';
  const record = isItem ? drawer.record : null;
  const drawerLabel = drawer.mode === 'item' ? kindLabels[drawer.record.kind] : 'รายการทั้งหมด';
  const drawerTitle = drawer.mode === 'item' ? getTitle(drawer.record) : drawer.title;
  const link = record && 'link' in record.item ? record.item.link : undefined;
  const drawerLogo = record ? getRecordLogo(record) : undefined;

  return (
    <div className="beyond-drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="beyond-drawer" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <div className="beyond-drawer__header">
          <div className="beyond-drawer__title">
            {drawerLogo ? (
              <span className="tool-logo tool-logo--drawer" title={`${drawerTitle} logo จาก Devicon`}>
                <img src={drawerLogo.src} alt="" />
              </span>
            ) : null}
            <div>
              <span>{drawerLabel}</span>
              <h2>{drawerTitle}</h2>
            </div>
          </div>
          <button type="button" className="beyond-icon-button" onClick={onClose} aria-label="ปิด">
            <X size={20} />
          </button>
        </div>

        {isItem && record ? (
          <div className="beyond-drawer__content">
            <div className="drawer-badge-row">
              <Badge tone={record.kind === 'skill' ? 'warning' : record.kind === 'tool' ? 'verified' : 'soft'}>
                {getCategory(record)}
              </Badge>
              <Badge tone="muted">{getRecommendedYear(record)}</Badge>
            </div>
            <p className="drawer-description">{getDescription(record)}</p>

            {'bestFor' in record.item ? (
              <section>
                <h3>เหมาะกับ</h3>
                <div className="drawer-tag-grid">
                  {record.item.bestFor.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </section>
            ) : (
              <>
                <section>
                  <h3>Topics</h3>
                  <div className="drawer-tag-grid">
                    {record.item.topics.map((topic) => (
                      <span key={topic}>{topic}</span>
                    ))}
                  </div>
                </section>
                <section>
                  <h3>Related tools</h3>
                  <div className="drawer-tag-grid">
                    {record.item.relatedTools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                </section>
                <section className="drawer-action-note">
                  <h3>ลองทำต่อ</h3>
                  <p>{record.item.action}</p>
                </section>
              </>
            )}

            {link ? (
              <a className="drawer-external-link" href={link} target="_blank" rel="noreferrer">
                เปิดแหล่งข้อมูล
                <ExternalLink size={17} aria-hidden="true" />
              </a>
            ) : null}
          </div>
        ) : null}

        {!isItem ? (
          <div className="beyond-drawer__content">
            <p className="drawer-description">{drawer.description}</p>
            <div className="drawer-list">
              {drawer.records.map((recordItem) => (
                <CompactItemCard key={`${recordItem.kind}-${'id' in recordItem.item ? recordItem.item.id : getTitle(recordItem)}`} record={recordItem} query={query} onOpen={onOpenItem} />
              ))}
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

export function BeyondClassroomPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ExplorerTab>('tools');
  const [focus, setFocus] = useState<FocusState>({ type: 'all' });
  const [activeYear, setActiveYear] = useState(yearStarterGuide[0]?.year || 'ปี 1');
  const [drawer, setDrawer] = useState<DrawerState | null>(null);

  useEffect(() => {
    const title = 'สิ่งที่มหาลัยไม่ได้สอน | ECPE NU Freshman Handbook';
    const description = 'เครื่องมือ แหล่งเรียนรู้ และทักษะโลกงานจริงที่นิสิต Computer Engineering ควรรู้จักตั้งแต่ปีแรก';
    document.title = title;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, []);

  const records = useMemo<ItemRecord[]>(
    () => [
      ...tools.map((item) => ({ kind: 'tool' as const, item })),
      ...sources.map((item) => ({ kind: 'source' as const, item })),
      ...realWorldSkills.map((item) => ({ kind: 'skill' as const, item })),
    ],
    [],
  );

  const focusedRecords = useMemo(() => records.filter((record) => matchesFocus(record, focus)), [focus, records]);
  const searchedRecords = useMemo(
    () => focusedRecords.filter((record) => matchesSearch(record, query)),
    [focusedRecords, query],
  );
  const isSearchMode = query.trim().length > 0;

  const tabRecords = useMemo(() => {
    const kind: SearchableKind = activeTab === 'tools' ? 'tool' : activeTab === 'sources' ? 'source' : 'skill';
    return focusedRecords.filter((record) => record.kind === kind);
  }, [activeTab, focusedRecords]);

  const tabGroups = useMemo(() => groupByCategory(tabRecords), [tabRecords]);
  const activeYearItem = yearStarterGuide.find((item) => item.year === activeYear) || yearStarterGuide[0];

  const topPicks = useMemo(() => {
    const ids = activeTab === 'tools' ? toolTopPickIds : activeTab === 'sources' ? sourceTopPickIds : skillTopPickIds;
    const kind: SearchableKind = activeTab === 'tools' ? 'tool' : activeTab === 'sources' ? 'source' : 'skill';
    const preferred = ids
      .map((id) => records.find((record) => record.kind === kind && 'id' in record.item && record.item.id === id))
      .filter((record): record is ItemRecord => Boolean(record))
      .filter((record) => matchesFocus(record, focus));

    return preferred.length ? preferred : tabRecords.slice(0, 6);
  }, [activeTab, focus, records, tabRecords]);

  const searchGroups = useMemo(
    () => ({
      tools: searchedRecords.filter((record) => record.kind === 'tool'),
      sources: searchedRecords.filter((record) => record.kind === 'source'),
      skills: searchedRecords.filter((record) => record.kind === 'skill'),
    }),
    [searchedRecords],
  );

  const quickStarts = useMemo(
    () => [
      {
        title: 'ปี 1 ควรรู้จักก่อน',
        description: 'เริ่มจาก editor, Git, docs และพื้นฐาน debug ให้ไม่งงตอนทำงานกลุ่ม',
        count: records.filter((record) => matchesYear(record, 'ปี 1')).length,
        cta: 'เปิดลิสต์ปี 1',
        icon: GraduationCap,
        action: () => {
          setQuery('');
          setActiveYear('ปี 1');
          setFocus({ type: 'year', value: 'ปี 1' });
          setActiveTab('tools');
          scrollToSection('year-path');
        },
      },
      {
        title: 'เตรียมทำโปรเจกต์',
        description: 'รวมเครื่องมือที่ช่วยต่อจากโจทย์ในห้องไปเป็นระบบที่ demo ได้จริง',
        count: records.filter((record) => matchesFocus(record, { type: 'goal', value: 'project' })).length,
        cta: 'ดูสายโปรเจกต์',
        icon: Wrench,
        action: () => {
          setQuery('');
          setFocus({ type: 'goal', value: 'project' });
          setActiveTab('tools');
          scrollToSection('explorer');
        },
      },
      {
        title: 'เตรียมฝึกงาน / หางาน',
        description: 'เน้น portfolio, LinkedIn, job platform และทักษะเล่าโปรเจกต์ให้เป็น',
        count: records.filter((record) => matchesFocus(record, { type: 'goal', value: 'career' })).length,
        cta: 'เปิดชุดสมัครงาน',
        icon: Briefcase,
        action: () => {
          setQuery('');
          setFocus({ type: 'goal', value: 'career' });
          setActiveTab('sources');
          scrollToSection('explorer');
        },
      },
      {
        title: 'เลือกตามสายที่สนใจ',
        description: 'ยังไม่ต้องเลือกถาวร แค่ลองไล่ดูสาย Cloud, Embedded, Security, Data หรือ Business',
        count: records.filter((record) => matchesFocus(record, { type: 'goal', value: 'track' })).length,
        cta: 'สำรวจตามสาย',
        icon: Compass,
        action: () => {
          setQuery('');
          setFocus({ type: 'goal', value: 'track' });
          setActiveTab('skills');
          scrollToSection('explorer');
        },
      },
    ],
    [records],
  );

  const setCategoryFocus = (category: string) => {
    setQuery('');
    setFocus({ type: 'category', value: category });
    scrollToSection('explorer');
  };

  const setYearFocus = (year: string) => {
    setQuery('');
    setActiveYear(year);
    setFocus({ type: 'year', value: year });
  };

  const openCategoryDrawer = (category: string, categoryRecords: ItemRecord[]) => {
    setDrawer({
      mode: 'items',
      title: `${category} ทั้งหมด`,
      description: `รายการในหมวดนี้ถูกเก็บไว้ใน drawer เพื่อไม่ให้หน้าหลักกลายเป็นลิสต์ยาว`,
      records: categoryRecords,
    });
  };

  return (
    <div className="page beyond-page">
      <section className="beyond-hero" id="start">
        <div className="beyond-hero__copy">
          <h1>สิ่งที่มหาลัยไม่ได้สอน</h1>
          <p>
            เครื่องมือ แหล่งเรียนรู้ และทักษะโลกงานจริงที่น้องควรรู้จักไว้ตั้งแต่ปี 1 เพราะหลายอย่างไม่ได้อยู่ในสไลด์เรียน
            แต่จะเจอแน่นอนตอนทำโปรเจกต์ ฝึกงาน และหางาน
          </p>
          <small>หน้านี้เป็นคำแนะนำจากมุมรุ่นพี่ ไม่ใช่ข้อกำหนดทางการของหลักสูตร</small>
        </div>

        <aside className="beyond-quote-card" aria-label="คำแนะนำจากรุ่นพี่">
          <Sparkles size={24} aria-hidden="true" />
          <blockquote>“ไม่ต้องใช้เป็นทุกอย่างตั้งแต่ปี 1 แต่ควรรู้ว่ามันมีไว้ทำอะไร”</blockquote>
          <p>มหาลัยให้พื้นฐานคิดเป็น ส่วนหน้านี้ช่วยเติมของที่ต้องใช้จริง</p>
        </aside>
      </section>

      <section className="beyond-command-center" aria-label="ค้นหาและทางลัด">
        <label className="beyond-search">
          <Search size={22} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาเช่น GitHub, Docker, Testing, Cloud, LinkedIn, System Design"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} aria-label="ล้างคำค้น">
              <X size={18} />
            </button>
          ) : null}
        </label>

        <div className="beyond-summary-stats" aria-label="สรุปจำนวนข้อมูล">
          <span><strong>{tools.length}</strong> Tools</span>
          <span><strong>{sources.length}</strong> Sources</span>
          <span><strong>{realWorldSkills.length}</strong> Skills</span>
          <span><strong>4</strong> Year Path</span>
        </div>

        <div className="beyond-filter-row" aria-label="ตัวกรองหลัก">
          <span className="beyond-filter-row__label">
            <Filter size={16} aria-hidden="true" />
            Filter
          </span>
          <button type="button" className={focus.type === 'all' ? 'is-active' : ''} onClick={() => setFocus({ type: 'all' })}>
            All
          </button>
          {yearFilters.map((year) => (
            <button
              type="button"
              key={year}
              className={focus.type === 'year' && focus.value === year ? 'is-active' : ''}
              onClick={() => setYearFocus(year)}
            >
              {year}
            </button>
          ))}
          {categoryFilters.map((category) => (
            <button
              type="button"
              key={category}
              className={focus.type === 'category' && focus.value === category ? 'is-active' : ''}
              onClick={() => setCategoryFocus(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <nav className="beyond-mini-nav" aria-label="ทางลัดในหน้านี้">
        {[
          ['start-here', 'เริ่มต้น', 'Start'],
          ['year-path', 'ตามชั้นปี', 'Year'],
          ['explorer', 'Tools', 'Tools'],
          ['explorer', 'Sources', 'Sources'],
          ['explorer', 'Skills', 'Skills'],
          ['portfolio', 'Portfolio', 'Portfolio'],
        ].map(([id, label, mobileLabel]) => (
          <button
            type="button"
            key={`${id}-${label}`}
            onClick={() => {
              if (label === 'Tools') setActiveTab('tools');
              if (label === 'Sources') setActiveTab('sources');
              if (label === 'Skills') setActiveTab('skills');
              scrollToSection(id);
            }}
          >
            <span>{label}</span>
            <small>{mobileLabel}</small>
          </button>
        ))}
      </nav>

      {isSearchMode ? (
        <section className="search-results-mode" aria-live="polite">
          <div className="beyond-section-heading">
            <div>
              <h2>พบผลลัพธ์ {searchedRecords.length} รายการ</h2>
              <p>จัดกลุ่มให้เลย จะได้ไม่ต้องไถหาเองในลิสต์ยาว ๆ</p>
            </div>
            <button type="button" className="text-link-button" onClick={() => setQuery('')}>
              Clear search
            </button>
          </div>
          <div className="search-results-grid">
            {([
              ['tools', 'Tools', searchGroups.tools],
              ['sources', 'Sources', searchGroups.sources],
              ['skills', 'Skills', searchGroups.skills],
            ] as const).map(([key, label, group]) => (
              <article className="search-result-group" key={key}>
                <div className="search-result-group__header">
                  <h3>{label}</h3>
                  <span>{group.length}</span>
                </div>
                <div className="search-result-group__list">
                  {group.slice(0, 6).map((record) => (
                    <CompactItemCard key={`${record.kind}-${'id' in record.item ? record.item.id : getTitle(record)}`} record={record} query={query} onOpen={(nextRecord) => setDrawer({ mode: 'item', record: nextRecord })} />
                  ))}
                </div>
                {group.length > 6 ? (
                  <button
                    type="button"
                    className="secondary-button compact-secondary"
                    onClick={() =>
                      setDrawer({
                        mode: 'items',
                        title: `${label} ที่ตรงกับ “${query}”`,
                        description: 'ผลลัพธ์ทั้งหมดถูกเปิดใน drawer เพื่อให้หน้าหลักยังสั้นและอ่านง่าย',
                        records: group,
                      })
                    }
                  >
                    ดูทั้งหมด {group.length} รายการ
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="quick-start-section" id="start-here">
            <div className="beyond-section-heading">
              <div>
                <h2>เริ่มจากตรงไหนดี?</h2>
                <p>เลือกเป้าหมายก่อน แล้วหน้า Explorer จะกรองของที่ควรรู้ให้ทันที</p>
              </div>
            </div>
            <div className="quick-start-grid">
              {quickStarts.map((card) => {
                const Icon = card.icon;
                return (
                  <button type="button" className="quick-start-card" key={card.title} onClick={card.action}>
                    <Icon size={24} aria-hidden="true" />
                    <span>{card.count} รายการที่เกี่ยวข้อง</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <strong>
                      {card.cta}
                      <ArrowRight size={16} aria-hidden="true" />
                    </strong>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="year-path-section" id="year-path">
            <div className="beyond-section-heading">
              <div>
                <h2>เริ่มรู้จักอะไรก่อนดี?</h2>
                <p>ใช้เส้นทางนี้เป็น navigation ได้เลย คลิกปีที่ต้องการเพื่อดูรายละเอียดและกรอง Explorer</p>
              </div>
            </div>
            <div className="year-path-compact" aria-label="Year-by-Year Readiness Path">
              <div className="year-path-compact__line" aria-hidden="true" />
              {yearStarterGuide.map((item) => (
                <button
                  type="button"
                  key={item.year}
                  className={activeYear === item.year ? 'is-active' : ''}
                  onClick={() => setYearFocus(item.year)}
                >
                  <span>{item.year}</span>
                  <strong>{item.highlight}</strong>
                </button>
              ))}
            </div>
            {activeYearItem ? (
              <article className="year-detail-panel">
                <div>
                  <Badge tone="verified">{activeYearItem.year}</Badge>
                  <h3>{activeYearItem.title}</h3>
                  <p>{activeYearItem.highlight}</p>
                </div>
                <div className="year-detail-panel__items">
                  {activeYearItem.items.slice(0, 5).map((item) => (
                    <span key={item}>
                      <CheckCircle2 size={16} aria-hidden="true" />
                      {item}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className="secondary-button compact-secondary"
                  onClick={() =>
                    setDrawer({
                      mode: 'items',
                      title: `${activeYearItem.year}: ${activeYearItem.title}`,
                      description: 'รายการแนะนำของปีนี้แบบเต็มจาก Year Starter Guide',
                      records: records.filter((record) => matchesYear(record, activeYearItem.year)).slice(0, 30),
                    })
                  }
                >
                  เปิดรายการที่เกี่ยวข้อง
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </article>
            ) : null}
          </section>

          <section className="explorer-section" id="explorer">
            <div className="beyond-section-heading">
              <div>
                <h2>เครื่องมือและแหล่งเรียนรู้แบบเลือกดู</h2>
                <p>{focusLabel(focus)} หน้าแรกโชว์ overview และ Top Picks ก่อน รายการเต็มอยู่ใน drawer</p>
              </div>
              <Badge tone="muted">{focusedRecords.length}/{records.length} รายการใน scope นี้</Badge>
            </div>

            <div className="explorer-tabs" role="tablist" aria-label="Explorer tabs">
              {(['tools', 'sources', 'skills'] as ExplorerTab[]).map((tab) => (
                <button
                  type="button"
                  role="tab"
                  key={tab}
                  className={activeTab === tab ? 'is-active' : ''}
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </div>

            <div className="top-picks-panel">
              <div className="top-picks-panel__header">
                <div>
                  <h3>Top Picks</h3>
                  <p>ชุดเริ่มต้นก่อนเข้า All Items</p>
                </div>
                <span>{topPicks.length} รายการ</span>
              </div>
              <div className="top-picks-grid">
                {topPicks.slice(0, 6).map((record) => (
                  <CompactItemCard key={`${record.kind}-${'id' in record.item ? record.item.id : getTitle(record)}`} record={record} onOpen={(nextRecord) => setDrawer({ mode: 'item', record: nextRecord })} />
                ))}
              </div>
            </div>

            <div className="category-overview-grid">
              {Object.entries(tabGroups).map(([category, categoryRecords]) => (
                <article className="category-overview-card" key={category}>
                  <div className="category-overview-card__top">
                    {activeTab === 'tools' ? (
                      <div className="category-logo-stack" aria-hidden="true">
                        {categoryRecords
                          .map(getRecordLogo)
                          .filter((logo): logo is NonNullable<ReturnType<typeof getRecordLogo>> => Boolean(logo))
                          .slice(0, 3)
                          .map((logo, index) => (
                            <span className="tool-logo tool-logo--stacked" key={`${logo.slug}-${index}`}>
                              <img src={logo.src} alt="" loading="lazy" />
                            </span>
                          ))}
                      </div>
                    ) : (
                      <Layers3 size={22} aria-hidden="true" />
                    )}
                    <span>{categoryRecords.length} รายการ</span>
                  </div>
                  <h3>{category}</h3>
                  <p>{categoryRecords.slice(0, 3).map(getTitle).join(' / ')}</p>
                  <div className="category-overview-card__actions">
                    <button type="button" onClick={() => openCategoryDrawer(category, categoryRecords)}>
                      ดูทั้งหมด
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => setCategoryFocus(category)}>
                      กรองหมวดนี้
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {activeTab === 'skills' ? (
              <div className="compact-skill-strip" aria-label="Real-world skills compact list">
                {tabRecords.map((record) => (
                  <button type="button" key={getTitle(record)} onClick={() => setDrawer({ mode: 'item', record })}>
                    <CircleDot size={17} aria-hidden="true" />
                    <span>{getTitle(record)}</span>
                    <small>{getRecommendedYear(record)}</small>
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        </>
      )}

      <section className="readiness-section" id="skills">
        <div className="beyond-section-heading">
          <div>
            <h2>Skill Gap Matrix</h2>
            <p>สั้น ๆ พอให้เห็นว่าควรรู้จัก ลองทำ และมีผลงานตรงไหน</p>
          </div>
        </div>
        <SkillGapMatrix skills={realWorldSkills} />
      </section>

      <section className="portfolio-section" id="portfolio">
        <div className="beyond-section-heading">
          <div>
            <h2>Portfolio readiness</h2>
            <p>เช็กแค่ของสำคัญก่อน ที่เหลือค่อยขยายดูเมื่อพร้อมเก็บงานจริง</p>
          </div>
        </div>
        <PortfolioChecklistViz />
      </section>

      <footer className="beyond-footer-note">
        <ListChecks size={18} aria-hidden="true" />
        <span>ไม่ต้องใช้เป็นทุกอย่างตั้งแต่ปี 1 แต่ควรรู้ว่ามันมีไว้ทำอะไร และเลือกฝึกตามเป้าหมายของตัวเอง</span>
      </footer>

      <Drawer
        drawer={drawer}
        query={query}
        onClose={() => setDrawer(null)}
        onOpenItem={(record) => setDrawer({ mode: 'item', record })}
      />
    </div>
  );
}
