import { describe, expect, it } from 'vitest';
import { resolveRoutePath } from '../routing';

describe('resolveRoutePath', () => {
  it('keeps canonical routes intact', () => {
    expect(resolveRoutePath('/courses')).toBe('/courses');
    expect(resolveRoutePath('/dependency-graph')).toBe('/dependency-graph');
  });

  it('normalizes legacy base paths and known aliases', () => {
    expect(resolveRoutePath('/cpe-nu-handbook/courses')).toBe('/courses');
    expect(resolveRoutePath('/roadmap')).toBe('/roadmaps');
    expect(resolveRoutePath('/beyond-classroom')).toBe('/tools-sources');
  });

  it('recovers from small route typos', () => {
    expect(resolveRoutePath('/depndency-graph')).toBe('/dependency-graph');
    expect(resolveRoutePath('/senior-tps')).toBe('/senior-tips');
  });

  it('falls back to home for unknown paths and malformed encoding', () => {
    expect(resolveRoutePath('/not-a-real-section')).toBe('/');
    expect(resolveRoutePath('/%E0%A4%A')).toBe('/');
  });
});
