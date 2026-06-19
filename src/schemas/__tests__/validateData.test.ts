import { describe, it, expect } from 'vitest';
import { validateStaticData } from '../validateData';
import { courses } from '../../data/courses';
import { studyPlan } from '../../data/studyPlan';
import { curriculumStructure } from '../../data/curriculumStructure';
import { officialPrerequisites } from '../../data/officialPrerequisites';

describe('Static Data Validation', () => {
  it('should have no schema validation errors in static data', () => {
    // @ts-expect-error some dynamic typing in legacy fields
    const errors = validateStaticData(courses, studyPlan.years, curriculumStructure.categories || [], officialPrerequisites);
    
    if (errors.length > 0) {
      console.error('Validation Errors Found:');
      errors.forEach(e => console.error(e));
    }
    
    expect(errors.length).toBe(0);
  });
});
