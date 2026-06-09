import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { curriculumStructure } from '../../data/curriculumStructure';
import type { CurriculumNode } from '../../types/curriculum';
import { SectionHeader } from '../common/SectionHeader';

function nodeTitle(node: CurriculumNode): string {
  return node.title || node.name || String(node.id || 'หมวดวิชา');
}

function getChildren(node: CurriculumNode): CurriculumNode[] {
  return node.subgroups || node.subcategories || node.children || [];
}

export function CurriculumFlowchart() {
  const structure = curriculumStructure as { totalCredits?: number; groups?: CurriculumNode[]; categories?: CurriculumNode[] };
  const groups = structure.groups || structure.categories || [];
  const [openGroups, setOpenGroups] = useState(() => new Set(groups.map((group) => nodeTitle(group))));

  const toggle = (id: string) => {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="visual-card">
      <SectionHeader
        title="Curriculum Structure Flowchart"
        description="ภาพรวม 138 หน่วยกิต แยกหมวดทางการจากหลักสูตร"
      />
      <div className="curriculum-root">
        <div className="flow-root">หลักสูตร {structure.totalCredits || 138} หน่วยกิต</div>
        <div className="flow-branches">
          {groups.map((group) => {
            const title = nodeTitle(group);
            const children = getChildren(group);
            const isOpen = openGroups.has(title);
            return (
              <article className="flow-node" key={title}>
                <button type="button" onClick={() => toggle(title)} aria-expanded={isOpen}>
                  <span>{title}</span>
                  <strong>{group.credits || '-'} หน่วยกิต</strong>
                  <ChevronDown size={16} />
                </button>
                {isOpen && children.length > 0 ? (
                  <div className="flow-children">
                    {children.map((child) => (
                      <div className="flow-child" key={nodeTitle(child)}>
                        <span>{nodeTitle(child)}</span>
                        <strong>{child.credits || '-'}</strong>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
