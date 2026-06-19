import { courseSchema } from './courseSchema';
import { studyYearSchema, curriculumNodeSchema } from './studyPlanSchema';
import { prerequisiteEdgeSchema } from './prerequisiteSchema';

export function validateStaticData(
  courses: any[],
  studyPlan: any[],
  curriculumStructure: any[],
  prerequisites: any[]
): string[] {
  const errors: string[] = [];

  // Validate Courses
  courses.forEach((course) => {
    const result = courseSchema.safeParse(course);
    if (!result.success) {
      errors.push(`[Course Schema Error] ${course.code || course.id}: ${JSON.stringify(result.error.format())}`);
    }

    // Custom logical validations
    if (course.sourceConfidence === 'verified-official' && (course.credits === 'TBD' || course.credits == null)) {
      errors.push(`[Data Warning] ${course.code}: Credits are TBD but source is verified-official.`);
    }
    
    // Warn if type is unknown but it's part of the default catalog (assuming code exists and isn't a placeholder)
    if (course.type === 'unknown' && course.code && !course.code.includes('xxx') && !course.isPlaceholder) {
      errors.push(`[Data Warning] ${course.code}: Course type is unknown.`);
    }
  });

  // Check for duplicate course codes
  const codes = courses.map(c => c.code).filter(Boolean);
  const uniqueCodes = new Set(codes);
  if (codes.length !== uniqueCodes.size) {
    const duplicates = codes.filter((item, index) => codes.indexOf(item) !== index);
    errors.push(`[Data Warning] Duplicate course codes found: ${Array.from(new Set(duplicates)).join(', ')}`);
  }

  // Validate Study Plan
  studyPlan.forEach((year) => {
    const result = studyYearSchema.safeParse(year);
    if (!result.success) {
      errors.push(`[Study Plan Schema Error] Year ${year.year}: ${JSON.stringify(result.error.format())}`);
    }
  });

  // Validate Curriculum Structure
  curriculumStructure.forEach((node) => {
    const result = curriculumNodeSchema.safeParse(node);
    if (!result.success) {
      errors.push(`[Curriculum Schema Error] Node ${node.title || node.name}: ${JSON.stringify(result.error.format())}`);
    }
  });

  // Validate Prerequisites
  const courseCodeSet = new Set(courses.map(c => c.code).filter(Boolean));
  prerequisites.forEach((edge) => {
    const result = prerequisiteEdgeSchema.safeParse(edge);
    if (!result.success) {
      errors.push(`[Prerequisite Schema Error] Edge ${edge.id}: ${JSON.stringify(result.error.format())}`);
    }

    // Check if source and target exist
    const fromCode = String(edge.from || edge.source);
    const toCode = String(edge.to || edge.target);
    
    if (fromCode && !courseCodeSet.has(fromCode)) {
      errors.push(`[Data Warning] Prerequisite edge ${edge.id}: Source course ${fromCode} not found in index.`);
    }
    if (toCode && !courseCodeSet.has(toCode)) {
      errors.push(`[Data Warning] Prerequisite edge ${edge.id}: Target course ${toCode} not found in index.`);
    }
  });

  return errors;
}
