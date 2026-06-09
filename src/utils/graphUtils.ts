import type { Course } from '../types/course';
import type { GraphEdge } from '../types/visualMap';

export function getCourseLabel(course?: Course, fallback = 'ยังไม่มีข้อมูลรายวิชา'): string {
  if (!course) return fallback;
  return course.nameTh || course.nameEn || course.titleTh || course.title || course.code || course.id;
}

export function edgeKey(edge: GraphEdge): string {
  return edge.id || `${edge.from || 'unknown'}-${edge.to || 'unknown'}`;
}

export function asArray<T>(value: T[] | Record<string, T[]> | undefined, keys: string[] = []): T[] {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return [];
  for (const key of keys) {
    const candidate = value[key];
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}
