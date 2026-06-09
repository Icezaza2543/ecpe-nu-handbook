import type { Course, CourseSearchResult } from '../types/course';
import { normalizeText, slugify } from './slug';
import Fuse from 'fuse.js';
import { officialPrerequisites } from '../data/officialPrerequisites';

export interface CourseIndex {
  courses: Course[];
  findCourse: (query: string) => Course | undefined;
  findCourseStrict: (codeOrId: string) => Course | undefined;
  findCourseById: (id: string) => Course | undefined;
  findCourseByCode: (code: string) => Course | undefined;
  findCourseByLegacyId: (legacyId: string) => Course | undefined;
  findCoursesByCodes: (codes: string[]) => Course[];
  findCoursesByCareerPath: (pathId: string) => Course[];
  findCoursesByType: (type: string) => Course[];
  findCoursesBySourceConfidence: (confidence: string) => Course[];
  searchCourses: (query: string, limit?: number) => CourseSearchResult[];
  getRelatedPrerequisites: (courseCode: string) => { prerequisiteFor: string[], prerequisites: string[] };
  getCoursesForSemester: (semesterId: string | number) => Course[];
  getCatalogCourses: (options?: { includeUnmapped?: boolean }) => Course[];
  keysForCourse: (course: Course) => string[];
}

function addKey(map: Map<string, Course>, key: unknown, course: Course): void {
  const raw = String(key ?? '').trim();
  if (!raw) return;
  map.set(raw, course);
  const normalized = normalizeText(raw);
  if (normalized) map.set(normalized, course);
}

export function createCourseIndex(courses: Course[]): CourseIndex {
  const byAny = new Map<string, Course>();
  const byId = new Map<string, Course>();
  const byCode = new Map<string, Course>();
  const byLegacy = new Map<string, Course>();

  const keysForCourse = (course: Course): string[] => {
    const keys = [
      course.id,
      course.code,
      course.slug,
      course.courseId,
      course.nameTh,
      course.nameEn,
      course.titleTh,
      course.title,
      course.code && course.nameEn ? `${course.code} ${course.nameEn}` : '',
      course.code && course.nameTh ? `${course.code} ${course.nameTh}` : '',
      course.nameEn ? slugify(course.nameEn) : '',
      ...(course.legacyIds || []),
    ];
    return keys.filter((key): key is string => Boolean(key));
  };

  for (const course of courses) {
    addKey(byId, course.id, course);
    addKey(byCode, course.code, course);
    for (const legacyId of course.legacyIds || []) addKey(byLegacy, legacyId, course);
    for (const key of keysForCourse(course)) addKey(byAny, key, course);
  }

  const findCourse = (query: string) => byAny.get(query) || byAny.get(normalizeText(query));
  const findCourseStrict = (codeOrId: string) => byCode.get(codeOrId) || byId.get(codeOrId);
  const findCourseByCode = (code: string) => byCode.get(code) || byCode.get(normalizeText(code));

  // Initialize Fuse instance
  const fuse = new Fuse(courses, {
    keys: ['code', 'nameTh', 'nameEn', 'legacyIds', 'tags'],
    threshold: 0.3,
    includeScore: true,
  });

  return {
    courses,
    findCourse,
    findCourseStrict,
    findCourseById: (id) => byId.get(id) || byId.get(normalizeText(id)),
    findCourseByCode,
    findCourseByLegacyId: (legacyId) => byLegacy.get(legacyId) || byLegacy.get(normalizeText(legacyId)),
    findCoursesByCodes: (codes) => codes.map(findCourseByCode).filter((c): c is Course => !!c),
    findCoursesByCareerPath: (pathId) => {
      const needle = normalizeText(pathId);
      return courses.filter((course) => (course.careerPaths || []).some((path) => normalizeText(path).includes(needle)));
    },
    findCoursesByType: (type) => courses.filter((course) => course.type === type),
    findCoursesBySourceConfidence: (confidence) =>
      courses.filter((course) => course.sourceConfidence === confidence),
    searchCourses: (query, limit = 12) => {
      if (!query.trim()) return [];
      const results = fuse.search(query);
      return results.slice(0, limit).map((res) => ({
        course: res.item,
        score: (1 - (res.score || 0)) * 100,
        reason: 'fuse',
      }));
    },
    getRelatedPrerequisites: (courseCode) => {
      const prerequisites = officialPrerequisites.filter(edge => edge.to === courseCode).map(e => String(e.from));
      const prerequisiteFor = officialPrerequisites.filter(edge => edge.from === courseCode).map(e => String(e.to));
      return { prerequisiteFor, prerequisites };
    },
    getCoursesForSemester: (semesterId) => {
      return courses.filter(c => String(c.semester) === String(semesterId));
    },
    getCatalogCourses: (options) => {
      return courses.filter(c => {
        if (c.isPlaceholder) return false;
        if (!options?.includeUnmapped && c.type === 'unknown') return false;
        return true;
      });
    },
    keysForCourse,
  };
}
