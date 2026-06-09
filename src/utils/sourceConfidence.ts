import type { Course } from '../types/course';

export function getSourceLabel(course: Course): string {
  if (course.sourceConfidence === 'verified-official') return 'Official MKO2';
  if (course.sourceConfidence === 'verified-description') return 'Verified Description';
  if (course.sourceConfidence === 'needs-verification' || course.needsVerification) {
    return 'Needs Verification';
  }
  if (course.sourceConfidence?.includes('gened')) return 'GenEd Source';
  return course.sourceConfidence || 'Source Unspecified';
}

export function getSourceTone(course: Course): 'official' | 'verified' | 'warning' | 'muted' {
  if (course.sourceConfidence === 'verified-official') return 'official';
  if (course.sourceConfidence === 'verified-description') return 'verified';
  if (course.sourceConfidence === 'needs-verification' || course.needsVerification) return 'warning';
  return 'muted';
}
