import { describe, it, expect } from 'vitest';
import { courseSchema } from '../courseSchema';

describe('Data Validation', () => {
  it('validates a known course 305171 correctly', () => {
    const data = {
      id: 'c-305171',
      code: '305171',
      nameEn: 'Intro to CE Lab',
      credits: '1(0-3-2)',
      sourceConfidence: 'verified-official'
    };

    const result = courseSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.credits).toBe('1(0-3-2)');
    }
  });

  it('fails validation if required fields are missing/wrong type', () => {
    const data = {
      // Missing id
      code: '305171',
    };

    const result = courseSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
