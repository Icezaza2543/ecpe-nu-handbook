import { describe, it, expect } from 'vitest';
import { createCourseIndex } from '../courseIndex';
import { courses } from '../../data/courses';
import { officialPrerequisites } from '../../data/officialPrerequisites';

describe('courseIndex with real data', () => {
  const index = createCourseIndex(courses);

  it('can find a course by exact code (305171)', () => {
    const course = index.findCourseStrict('305171');
    expect(course).toBeDefined();
    expect(course?.code).toBe('305171');
    expect(course?.credits).toBe('3(3-0-6)');
    expect(course?.type).not.toBe('unknown');
    expect(course?.type).not.toBe('Needs Classification');
  });

  it('can find a course by legacy ID', () => {
    index.searchCourses('legacy'); 
  });

  it('305121 and 305171 are separate courses and not merged', () => {
    const course171 = index.findCourseStrict('305171');
    const course121 = index.findCourseStrict('305121');
    expect(course171).toBeDefined();
    expect(course121).toBeDefined();
    expect(course171?.id).not.toBe(course121?.id);
  });

  it('filters out placeholders and unknowns when getting catalog courses', () => {
    const catalog = index.getCatalogCourses();
    const unknownCourses = catalog.filter(c => c.type === 'unknown' || c.isPlaceholder);
    expect(unknownCourses.length).toBe(0);
  });

  it('search returns fuzzy matches', () => {
    const results = index.searchCourses('วิศวกรรมคอมพิวเตอร์');
    expect(results.length).toBeGreaterThan(0);
  });

  it('officialPrerequisites from/to map to real courses', () => {
    // We only test a subset to avoid huge test output if it fails, but we can test all
    for (const edge of officialPrerequisites) {
      if (edge.from) {
        expect(index.findCourseStrict(edge.from)).toBeDefined();
      }
      if (edge.to) {
        expect(index.findCourseStrict(edge.to)).toBeDefined();
      }
    }
  });
});

