import { courseSchema } from './courseSchema';
import { studyYearSchema, curriculumNodeSchema } from './studyPlanSchema';
import { prerequisiteEdgeSchema } from './prerequisiteSchema';

export function validateStaticData(
  courses: any[],
  studyPlan: any[],
  curriculumStructure: any[],
  prerequisites: any[]
) {
  if (import.meta.env.PROD) return; // Only validate in dev mode

  console.groupCollapsed('🛠️ Data Validation Pass');

  let errorsCount = 0;

  // Validate Courses
  courses.forEach((course) => {
    const result = courseSchema.safeParse(course);
    if (!result.success) {
      console.warn(`[Course Schema Error] ${course.code || course.id}:`, result.error.format());
      errorsCount++;
    }

    // Custom logical validations
    if (course.sourceConfidence === 'verified-official' && (course.credits === 'TBD' || course.credits == null)) {
      console.warn(`[Data Warning] ${course.code}: Credits are TBD but source is verified-official.`);
      errorsCount++;
    }
    
    // Warn if type is unknown but it's part of the default catalog (assuming code exists and isn't a placeholder)
    if (course.type === 'unknown' && course.code && !course.code.includes('xxx') && !course.isPlaceholder) {
      console.warn(`[Data Warning] ${course.code}: Course type is unknown.`);
      errorsCount++;
    }
  });

  // Check for duplicate course codes
  const codes = courses.map(c => c.code).filter(Boolean);
  const uniqueCodes = new Set(codes);
  if (codes.length !== uniqueCodes.size) {
    const duplicates = codes.filter((item, index) => codes.indexOf(item) !== index);
    console.warn(`[Data Warning] Duplicate course codes found:`, Array.from(new Set(duplicates)));
    errorsCount++;
  }

  // Validate Study Plan
  studyPlan.forEach((year) => {
    const result = studyYearSchema.safeParse(year);
    if (!result.success) {
      console.warn(`[Study Plan Schema Error] Year ${year.year}:`, result.error.format());
      errorsCount++;
    }
  });

  // Validate Curriculum Structure
  curriculumStructure.forEach((node) => {
    const result = curriculumNodeSchema.safeParse(node);
    if (!result.success) {
      console.warn(`[Curriculum Schema Error] Node ${node.title || node.name}:`, result.error.format());
      errorsCount++;
    }
  });

  // Validate Prerequisites
  const courseCodeSet = new Set(courses.map(c => c.code).filter(Boolean));
  prerequisites.forEach((edge) => {
    const result = prerequisiteEdgeSchema.safeParse(edge);
    if (!result.success) {
      console.warn(`[Prerequisite Schema Error] Edge ${edge.id}:`, result.error.format());
      errorsCount++;
    }

    // Check if source and target exist
    const fromCode = String(edge.from || edge.source);
    const toCode = String(edge.to || edge.target);
    
    if (fromCode && !courseCodeSet.has(fromCode)) {
      console.warn(`[Data Warning] Prerequisite edge ${edge.id}: Source course ${fromCode} not found in index.`);
      errorsCount++;
    }
    if (toCode && !courseCodeSet.has(toCode)) {
      console.warn(`[Data Warning] Prerequisite edge ${edge.id}: Target course ${toCode} not found in index.`);
      errorsCount++;
    }
  });

  if (errorsCount > 0) {
    console.warn(`⚠️ Found ${errorsCount} validation issues in static data.`);
  }

  console.groupEnd();
}
