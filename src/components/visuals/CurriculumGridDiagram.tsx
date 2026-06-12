import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { studyPlan } from '../../data/studyPlan';
import { officialPrerequisites } from '../../data/officialPrerequisites';
import type { CourseIndex } from '../../utils/courseIndex';
import { useCourseModal } from '../common/CourseModalProvider';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { StudyYear, StudyCourse } from '../../types/curriculum';

const CATEGORIES = {
  math: { label: 'Math / Science', color: '#be185d', bg: '#fdf2f8', border: '#fbcfe8' },
  prog: { label: 'Programming / Software', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  hard: { label: 'Hardware / Network', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  gened: { label: 'GenEd / Soft Skills', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  proj: { label: 'Project / Field / Elective', color: '#7e22ce', bg: '#faf5ff', border: '#e9d5ff' },
};

function getCourseCategory(code: string, titleTh: string): keyof typeof CATEGORIES {
  if (!code) return 'proj';
  const c = code.toLowerCase();
  
  if (c.startsWith('00') || titleTh.includes('ศึกษาทั่วไป') || titleTh.includes('กีฬา') || titleTh.includes('ทักษะเสริมการทำงาน')) return 'gened';
  if (c.includes('free') || c === 'xxxxxx' || titleTh.includes('เลือกเสรี')) return 'proj';
  if (c.startsWith('252') || c.startsWith('261') || ['305131','305132','305230','305231','305233'].includes(c)) return 'math';
  if (c.match(/^305[123]4/)) return 'hard';
  if (c.match(/^305[123][123]/) && !['305131','305132','305230','305231','305233'].includes(c)) return 'prog';
  if (titleTh.includes('โครงงาน') || titleTh.includes('วิจัย') || titleTh.includes('ประสบการณ์') || titleTh.includes('ปฏิบัติงาน') || titleTh.includes('การศึกษาเชิงบูรณาการ') || titleTh.includes('เลือกทางวิศวกรรม') || c.includes('xxx')) return 'proj';
  if (c.match(/^305[1234]9/)) return 'proj';
  if (c.match(/^305[123]0/)) return 'gened';

  return 'prog';
}

const COURSE_SHORT_NAMES: Record<string, string> = {
  "252182": "Calc 1",
  "252183": "Calc 2",
  "252284": "Calc 3",

  "261101": "Physics 1",
  "261102": "Physics 2",
  "261111": "Lab Phy 1",
  "261112": "Lab Phy 2",

  "305121": "Com Pro 1",
  "305122": "Com Pro 2",
  "305232": "Data Struct",
  "305131": "Discrete 1",
  "305132": "Discrete 2",

  "305141": "IoT Intro",
  "305142": "Circuit",
  "305241": "Digital Logic",
  "305245": "Electronics",
  "305242": "Network",
  "305343": "Com Arch",
  "305341": "Embed 1",
  "305342": "Embed 2",

  "305221": "AI",
  "305230": "Prob & Stat",
  "305231": "Applied Stat",
  "305233": "Numerical",
  "305311": "Database",
  "305323": "Software Eng",
  "305334": "OS",
  "305335": "Signal Proc",
  "305331": "Security",

  "305321": "Machine Learning",
  "305372": "Compiler",
  "305445": "Network Prog",

  "305491": "Project 1",
  "305492": "Project 2",
  "305493": "Practicum 1",
  "305494": "Practicum 2",
  "305495": "Research 1",
  "305496": "Research 2",

  "305191": "Field Exp 1",
  "305291": "Field Exp 2",
  "305292": "Field Exp 3",
  "305391": "Field Exp 4",
  "305392": "Field Exp 5",
  "305393": "Training",

  "300301": "Technopreneur",
  "300302": "Prof. English",

  "305101": "Soft Skill 1",
  "305102": "Soft Skill 2",
  "305201": "Soft Skill 3",
  "305202": "Soft Skill 4",
  "305301": "Soft Skill 5",
  
  "001281": "Sports"
};

function getCourseShortName(course: { code?: string, titleTh?: string }): string {
  if (course.code && COURSE_SHORT_NAMES[course.code]) {
    return COURSE_SHORT_NAMES[course.code];
  }
  if (!course.code || course.code.toLowerCase() === 'xxxxxx' || course.code.toLowerCase().includes('xxx')) {
    const t = course.titleTh || '';
    if (course.code?.toLowerCase() === '001xxx' || t.includes('ศึกษาทั่วไป')) {
      return (t && t !== 'หมวดวิชาศึกษาทั่วไป') ? t : 'GenEd';
    }
    if (t.includes('เลือกทางวิศวกรรม')) return 'Major Elective';
    if (t.includes('เลือกเสรี')) {
      return (t && t !== 'วิชาเลือกเสรี') ? t : 'Free Elective';
    }
    return 'Elective';
  }
  return course.titleTh || course.code || 'Unknown';
}

type RoadSide = 'top' | 'right' | 'bottom' | 'left';
type RouteMode = 'avoidCards' | 'straightVertical';
type MarkerSize = 'default' | 'small';

type EdgeRoad = {
  markerId: string;
  lane: number;
  color: string;
  fromSide?: RoadSide;
  toSide?: RoadSide;
  routeMode?: RouteMode;
  markerSize?: MarkerSize;
};

type Point = { x: number; y: number };
type RectBounds = { left: number; top: number; right: number; bottom: number };

const ROAD_ROUTER = {
  boundaryGap: 10,
  obstaclePadding: 3,
  cardGap: 6,
  anchorGap: 6,
  cornerRadius: 7,
} as const;

const EDGE_MARKERS = [
  { id: 'math', color: CATEGORIES.math.color },
  { id: 'prog', color: CATEGORIES.prog.color },
  { id: 'hard', color: CATEGORIES.hard.color },
  { id: 'proj', color: CATEGORIES.proj.color },
  { id: 'official', color: '#475569' },
];

// Edit these road settings when you want to hand-tune a prerequisite lane.
// lane moves the road farther away from cards; fromSide/toSide pin the exit and entry side.
const OFFICIAL_EDGE_ROADS: Record<string, EdgeRoad> = {
  '252182->252183': { markerId: 'math', lane: 8, color: CATEGORIES.math.color, fromSide: 'bottom', toSide: 'top', routeMode: 'straightVertical', markerSize: 'small' },
  '252183->252284': { markerId: 'math', lane: 16, color: CATEGORIES.math.color, fromSide: 'bottom', toSide: 'top', routeMode: 'straightVertical', markerSize: 'small' },
  '252182->305233': { markerId: 'math', lane: 8, color: CATEGORIES.math.color, fromSide: 'right', toSide: 'top', routeMode: 'straightVertical', markerSize: 'small' },
  '305121->305323': { markerId: 'prog', lane: 18, color: CATEGORIES.prog.color, fromSide: 'bottom', toSide: 'top', routeMode: 'straightVertical' },
  '305142->305245': { markerId: 'hard', lane: 18, color: CATEGORIES.hard.color, fromSide: 'bottom', toSide: 'top', routeMode: 'straightVertical' },
  '305241->305341': { markerId: 'hard', lane: 10, color: CATEGORIES.hard.color, fromSide: 'bottom', toSide: 'top', routeMode: 'straightVertical' },
  '305341->305342': { markerId: 'hard', lane: 10, color: CATEGORIES.hard.color, fromSide: 'bottom', toSide: 'top', routeMode: 'straightVertical', markerSize: 'small' },
  '305491->305492': { markerId: 'proj', lane: 14, color: CATEGORIES.proj.color, fromSide: 'bottom', toSide: 'top', routeMode: 'straightVertical', markerSize: 'small' },
  '305493->305494': { markerId: 'proj', lane: 8, color: CATEGORIES.proj.color, fromSide: 'bottom', toSide: 'top', routeMode: 'straightVertical', markerSize: 'small' },
  '305495->305496': { markerId: 'proj', lane: 16, color: CATEGORIES.proj.color, fromSide: 'bottom', toSide: 'top', routeMode: 'straightVertical', markerSize: 'small' },
};

function getOfficialEdgeRoad(fromCode: string, toCode: string, index: number): EdgeRoad {
  return OFFICIAL_EDGE_ROADS[`${fromCode}->${toCode}`] || {
    markerId: 'official',
    lane: 10 + (index % 4) * 6,
    color: '#475569',
  };
}

type LineCoords = {
  id: string;
  points: Point[];
  source: string;
  target: string;
  color: string;
  lane: number;
  markerId: string;
  markerSize: MarkerSize;
  routeMode: RouteMode;
};

function inflateRect(rect: RectBounds, padding: number): RectBounds {
  return {
    left: rect.left - padding,
    top: rect.top - padding,
    right: rect.right + padding,
    bottom: rect.bottom + padding,
  };
}

function getElementRect(element: HTMLElement, containerRect: DOMRect): RectBounds {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left - containerRect.left,
    top: rect.top - containerRect.top,
    right: rect.right - containerRect.left,
    bottom: rect.bottom - containerRect.top,
  };
}

function pointInRect(point: Point, rect: RectBounds): boolean {
  return point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom;
}

function segmentIntersectsRect(a: Point, b: Point, rect: RectBounds): boolean {
  const minX = Math.min(a.x, b.x);
  const maxX = Math.max(a.x, b.x);
  const minY = Math.min(a.y, b.y);
  const maxY = Math.max(a.y, b.y);

  if (Math.abs(a.y - b.y) < 0.1) {
    return a.y > rect.top && a.y < rect.bottom && maxX > rect.left && minX < rect.right;
  }

  if (Math.abs(a.x - b.x) < 0.1) {
    return a.x > rect.left && a.x < rect.right && maxY > rect.top && minY < rect.bottom;
  }

  return false;
}

function isPointClear(point: Point, obstacles: RectBounds[], width: number, height: number): boolean {
  if (
    point.x < ROAD_ROUTER.boundaryGap ||
    point.y < ROAD_ROUTER.boundaryGap ||
    point.x > width - ROAD_ROUTER.boundaryGap ||
    point.y > height - ROAD_ROUTER.boundaryGap
  ) {
    return false;
  }

  return !obstacles.some(rect => pointInRect(point, rect));
}

function isSegmentClear(a: Point, b: Point, obstacles: RectBounds[]): boolean {
  return !obstacles.some(rect => segmentIntersectsRect(a, b, rect));
}

function uniqueSorted(values: number[], min: number, max: number): number[] {
  const rounded = values
    .map(value => Math.round(value * 10) / 10)
    .filter(value => value >= min && value <= max);

  return Array.from(new Set(rounded)).sort((a, b) => a - b);
}

function snapPoint(point: Point): Point {
  return {
    x: Math.round(point.x * 10) / 10,
    y: Math.round(point.y * 10) / 10,
  };
}

function getAnchor(rect: RectBounds, side: RoadSide, road: EdgeRoad, extraGap = 0): Point {
  const centerX = (rect.left + rect.right) / 2;
  const centerY = (rect.top + rect.bottom) / 2;
  const gap = ROAD_ROUTER.anchorGap + Math.min(road.lane, 12) * 0.15 + extraGap;

  switch (side) {
    case 'top':
      return { x: centerX, y: rect.top - gap };
    case 'right':
      return { x: rect.right + gap, y: centerY };
    case 'bottom':
      return { x: centerX, y: rect.bottom + gap };
    case 'left':
      return { x: rect.left - gap, y: centerY };
  }
}

function getClearAnchor(
  rect: RectBounds,
  side: RoadSide,
  road: EdgeRoad,
  obstacles: RectBounds[],
  width: number,
  height: number
): Point {
  for (let extraGap = 0; extraGap <= 220; extraGap += 8) {
    const point = snapPoint(getAnchor(rect, side, road, extraGap));
    if (isPointClear(point, obstacles, width, height)) return point;
  }

  const centerX = (rect.left + rect.right) / 2;
  const centerY = (rect.top + rect.bottom) / 2;
  switch (side) {
    case 'top':
      return { x: snapPoint({ x: centerX, y: 0 }).x, y: ROAD_ROUTER.boundaryGap };
    case 'right':
      return { x: width - ROAD_ROUTER.boundaryGap, y: snapPoint({ x: 0, y: centerY }).y };
    case 'bottom':
      return { x: snapPoint({ x: centerX, y: 0 }).x, y: height - ROAD_ROUTER.boundaryGap };
    case 'left':
      return { x: ROAD_ROUTER.boundaryGap, y: snapPoint({ x: 0, y: centerY }).y };
  }
}

function getOrderedAnchors(
  rect: RectBounds,
  preferredSide: RoadSide | undefined,
  road: EdgeRoad,
  obstacles: RectBounds[],
  width: number,
  height: number
): Point[] {
  const sides: RoadSide[] = preferredSide
    ? [preferredSide, ...(['top', 'right', 'bottom', 'left'] as RoadSide[]).filter(side => side !== preferredSide)]
    : ['top', 'right', 'bottom', 'left'];

  return sides.map(side => getClearAnchor(rect, side, road, obstacles, width, height));
}

function simplifyRoadPoints(points: Point[]): Point[] {
  if (points.length <= 2) return points;

  const simplified: Point[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const prev = simplified[simplified.length - 1];
    const current = points[i];
    const next = points[i + 1];
    const sameX = Math.abs(prev.x - current.x) < 0.1 && Math.abs(current.x - next.x) < 0.1;
    const sameY = Math.abs(prev.y - current.y) < 0.1 && Math.abs(current.y - next.y) < 0.1;

    if (!sameX && !sameY) simplified.push(current);
  }
  simplified.push(points[points.length - 1]);

  return simplified;
}

function routeCost(points: Point[]): number {
  if (points.length < 2) return Number.POSITIVE_INFINITY;

  let distance = 0;
  let turns = 0;
  for (let i = 1; i < points.length; i++) {
    distance += Math.abs(points[i].x - points[i - 1].x) + Math.abs(points[i].y - points[i - 1].y);
    if (i > 1) {
      const prevHorizontal = Math.abs(points[i - 1].y - points[i - 2].y) < 0.1;
      const currentHorizontal = Math.abs(points[i].y - points[i - 1].y) < 0.1;
      if (prevHorizontal !== currentHorizontal) turns += 1;
    }
  }

  return distance + turns * 18;
}

function findRoadPath(
  start: Point,
  end: Point,
  obstacles: RectBounds[],
  width: number,
  height: number
): Point[] | null {
  const snappedStart = snapPoint(start);
  const snappedEnd = snapPoint(end);

  if (!isPointClear(snappedStart, obstacles, width, height) || !isPointClear(snappedEnd, obstacles, width, height)) {
    return null;
  }

  const xCoords = uniqueSorted([
    ROAD_ROUTER.boundaryGap,
    width - ROAD_ROUTER.boundaryGap,
    snappedStart.x,
    snappedEnd.x,
    ...obstacles.flatMap(rect => [rect.left - ROAD_ROUTER.cardGap, rect.right + ROAD_ROUTER.cardGap]),
  ], ROAD_ROUTER.boundaryGap, width - ROAD_ROUTER.boundaryGap);

  const yCoords = uniqueSorted([
    ROAD_ROUTER.boundaryGap,
    height - ROAD_ROUTER.boundaryGap,
    snappedStart.y,
    snappedEnd.y,
    ...obstacles.flatMap(rect => [rect.top - ROAD_ROUTER.cardGap, rect.bottom + ROAD_ROUTER.cardGap]),
  ], ROAD_ROUTER.boundaryGap, height - ROAD_ROUTER.boundaryGap);

  const keyFor = (point: Point) => `${point.x},${point.y}`;
  const pointFor = (key: string): Point => {
    const [x, y] = key.split(',').map(Number);
    return { x, y };
  };

  const open = new Set<string>([keyFor(snappedStart)]);
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[keyFor(snappedStart), 0]]);
  const fScore = new Map<string, number>([[keyFor(snappedStart), Math.abs(snappedStart.x - snappedEnd.x) + Math.abs(snappedStart.y - snappedEnd.y)]]);
  const endKey = keyFor(snappedEnd);
  const maxIterations = xCoords.length * yCoords.length;
  let iterations = 0;

  while (open.size > 0 && iterations < maxIterations) {
    iterations += 1;
    let currentKey = '';
    let bestScore = Number.POSITIVE_INFINITY;

    open.forEach(key => {
      const score = fScore.get(key) ?? Number.POSITIVE_INFINITY;
      if (score < bestScore) {
        bestScore = score;
        currentKey = key;
      }
    });

    if (currentKey === endKey) {
      const points: Point[] = [snappedEnd];
      let cursor = currentKey;
      while (cameFrom.has(cursor)) {
        cursor = cameFrom.get(cursor) as string;
        points.unshift(pointFor(cursor));
      }
      return simplifyRoadPoints(points);
    }

    open.delete(currentKey);
    const current = pointFor(currentKey);
    const xIndex = xCoords.indexOf(current.x);
    const yIndex = yCoords.indexOf(current.y);
    const neighbors = [
      xIndex > 0 ? { x: xCoords[xIndex - 1], y: current.y } : null,
      xIndex < xCoords.length - 1 ? { x: xCoords[xIndex + 1], y: current.y } : null,
      yIndex > 0 ? { x: current.x, y: yCoords[yIndex - 1] } : null,
      yIndex < yCoords.length - 1 ? { x: current.x, y: yCoords[yIndex + 1] } : null,
    ].filter((point): point is Point => !!point);

    neighbors.forEach(neighbor => {
      if (!isPointClear(neighbor, obstacles, width, height) || !isSegmentClear(current, neighbor, obstacles)) {
        return;
      }

      const neighborKey = keyFor(neighbor);
      const tentativeScore = (gScore.get(currentKey) ?? Number.POSITIVE_INFINITY)
        + Math.abs(current.x - neighbor.x)
        + Math.abs(current.y - neighbor.y);

      if (tentativeScore < (gScore.get(neighborKey) ?? Number.POSITIVE_INFINITY)) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeScore);
        fScore.set(
          neighborKey,
          tentativeScore + Math.abs(neighbor.x - snappedEnd.x) + Math.abs(neighbor.y - snappedEnd.y)
        );
        open.add(neighborKey);
      }
    });
  }

  return null;
}

function routeAroundCards(
  sourceRect: RectBounds,
  targetRect: RectBounds,
  obstacles: RectBounds[],
  road: EdgeRoad,
  width: number,
  height: number
): Point[] {
  const startAnchors = getOrderedAnchors(sourceRect, road.fromSide, road, obstacles, width, height);
  const endAnchors = getOrderedAnchors(targetRect, road.toSide, road, obstacles, width, height);
  let bestPath: Point[] | null = null;
  let bestCost = Number.POSITIVE_INFINITY;

  startAnchors.forEach((start, startIndex) => {
    endAnchors.forEach((end, endIndex) => {
      const path = findRoadPath(start, end, obstacles, width, height);
      if (!path) return;

      const cost = routeCost(path) + startIndex * 90 + endIndex * 90;
      if (cost < bestCost) {
        bestPath = path;
        bestCost = cost;
      }
    });
  });

  return bestPath || [startAnchors[0], endAnchors[0]];
}

function routeStraightVertical(sourceRect: RectBounds, targetRect: RectBounds, road: EdgeRoad): Point[] {
  const fromSide = road.fromSide || 'bottom';
  const toSide = road.toSide || 'top';
  const start = snapPoint(getAnchor(sourceRect, fromSide, road));
  const end = snapPoint(getAnchor(targetRect, toSide, road));

  if (Math.abs(start.x - end.x) < 1 || Math.abs(start.y - end.y) < 1) {
    return [start, end];
  }

  if (fromSide === 'left' || fromSide === 'right' || toSide === 'left' || toSide === 'right') {
    const useRightRoad = fromSide === 'right' || toSide === 'right';
    const roadX = useRightRoad
      ? Math.max(sourceRect.right, targetRect.right) + ROAD_ROUTER.anchorGap + (road.lane || 0)
      : Math.min(sourceRect.left, targetRect.left) - ROAD_ROUTER.anchorGap - (road.lane || 0);

    const isToVertical = toSide === 'top' || toSide === 'bottom';
    if (isToVertical) {
      const approachY = toSide === 'top'
        ? targetRect.top - ROAD_ROUTER.anchorGap - (road.lane || 0) - 16
        : targetRect.bottom + ROAD_ROUTER.anchorGap + (road.lane || 0) + 16;

      return simplifyRoadPoints([
        start,
        snapPoint({ x: roadX, y: start.y }),
        snapPoint({ x: roadX, y: approachY }),
        snapPoint({ x: end.x, y: approachY }),
        end,
      ]);
    }

    return simplifyRoadPoints([
      start,
      snapPoint({ x: roadX, y: start.y }),
      snapPoint({ x: roadX, y: end.y }),
      end,
    ]);
  }

  if (fromSide === 'bottom' && toSide === 'top') {
    const dropY = start.y + ROAD_ROUTER.anchorGap + (road.lane || 0);
    return simplifyRoadPoints([
      start,
      { x: start.x, y: dropY },
      { x: end.x, y: dropY },
      end,
    ]);
  }

  return simplifyRoadPoints([
    start,
    { x: start.x, y: end.y },
    end,
  ]);
}

function createRoundedRoadPath(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const current = points[i];
    const next = points[i + 1];
    const incoming = Math.abs(prev.x - current.x) + Math.abs(prev.y - current.y);
    const outgoing = Math.abs(next.x - current.x) + Math.abs(next.y - current.y);
    const radius = Math.min(ROAD_ROUTER.cornerRadius, incoming / 2, outgoing / 2);
    const before: Point = {
      x: current.x + (prev.x === current.x ? 0 : prev.x < current.x ? -radius : radius),
      y: current.y + (prev.y === current.y ? 0 : prev.y < current.y ? -radius : radius),
    };
    const after: Point = {
      x: current.x + (next.x === current.x ? 0 : next.x < current.x ? -radius : radius),
      y: current.y + (next.y === current.y ? 0 : next.y < current.y ? -radius : radius),
    };

    path += ` L ${before.x} ${before.y} Q ${current.x} ${current.y} ${after.x} ${after.y}`;
  }

  const last = points[points.length - 1];
  return `${path} L ${last.x} ${last.y}`;
}

export function CurriculumGridDiagram({ courseIndex }: { courseIndex: CourseIndex }) {
  const { openCourse } = useCourseModal();
  const [expandedSems, setExpandedSems] = useState<Record<string, boolean>>({});
  const [lines, setLines] = useState<LineCoords[]>([]);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [activeGroupCourses, setActiveGroupCourses] = useState<{ title: string, courses: StudyCourse[] } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const toggleSem = (semId: string) => {
    setExpandedSems(prev => ({ ...prev, [semId]: !prev[semId] }));
  };

  const semesters = useMemo(() => ((studyPlan as { years?: StudyYear[] }).years || []).flatMap((year) =>
    (year.semesters || year.terms || []).map(sem => ({ ...sem, yearNumber: year.year }))
  ), []);

  const officialPlanEdges = useMemo(() => {
    const visibleCourseCodes = new Set(
      semesters
        .flatMap(sem => sem.courses || [])
        .map(course => course.code)
        .filter((code): code is string => !!code && !code.includes('x') && !code.includes('group'))
    );

    return officialPrerequisites.filter(edge =>
      visibleCourseCodes.has(edge.from) && visibleCourseCodes.has(edge.to)
    );
  }, [semesters]);

  const keyCourseCodes = useMemo(() => new Set(
    officialPlanEdges.flatMap(edge => [edge.from, edge.to])
  ), [officialPlanEdges]);

  // Group Courses to maintain 2-line maximum (disabled to match exactly one line per requirement)
  const compactSemesterCourses = (courses: StudyCourse[]) => {
    return courses as (StudyCourse & { groupedCourses?: StudyCourse[] })[];
  };

  const calculateLines = useCallback(() => {
    if (!containerRef.current) return;
    
    const newLines: LineCoords[] = [];
    const containerRect = containerRef.current.getBoundingClientRect();
    const posterWidth = containerRef.current.clientWidth;
    const posterHeight = containerRef.current.clientHeight;
    const obstacles = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>('[id^="cm-node-"]')
    )
      .filter(element => element.dataset.roadObstacle !== 'false')
      .map(element => inflateRect(
        getElementRect(element, containerRect),
        ROAD_ROUTER.obstaclePadding
      ));
    
    officialPlanEdges.forEach((edge, index) => {
      const fromCode = edge.from;
      const toCode = edge.to;
      const edgeRoad = getOfficialEdgeRoad(fromCode, toCode, index);
        
      const sourceEl = document.getElementById(`cm-node-${fromCode}`);
      const targetEl = document.getElementById(`cm-node-${toCode}`);
        
      if (sourceEl && targetEl && sourceEl.offsetParent && targetEl.offsetParent) {
        const sourceRect = getElementRect(sourceEl, containerRect);
        const targetRect = getElementRect(targetEl, containerRect);
        const points = edgeRoad.routeMode === 'straightVertical'
          ? routeStraightVertical(sourceRect, targetRect, edgeRoad)
          : routeAroundCards(
            sourceRect,
            targetRect,
            obstacles,
            edgeRoad,
            posterWidth,
            posterHeight
          );
          
        newLines.push({
          id: `line-${fromCode}-${toCode}`,
          points,
          source: fromCode,
          target: toCode,
          color: edgeRoad.color,
          lane: edgeRoad.lane,
          markerId: edgeRoad.markerId,
          markerSize: edgeRoad.markerSize || 'default',
          routeMode: edgeRoad.routeMode || 'avoidCards'
        });
      }
    });
    
    setLines(newLines);
  }, [officialPlanEdges]);

  useEffect(() => {
    const timeout = setTimeout(calculateLines, 150);
    window.addEventListener('resize', calculateLines);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', calculateLines);
    };
  }, [calculateLines]);

  const createPath = (line: LineCoords) => createRoundedRoadPath(line.points);

  const EXACT_ORDER: Record<string, string[]> = {
    'year1-sem1': ['252182', '261101', '261111', '001281', '305121', '305131', '305141', '305101', 'year1-sem1-gened-slot-1', 'year1-sem1-gened-slot-2'],
    'year1-sem2': ['252183', '261102', '261112', '305142', '305122', '305132', '305191', '305102', 'year1-sem2-gened-slot-1', 'year1-sem2-gened-slot-2'],
    'year1-summer': ['305193'],
    'year2-sem1': ['252284', '305241', 'gap-y2s1-1', 'gap-y2s1-2', '305232', '305230', '305291', '305201', 'year2-sem1-gened-slot-1', 'year2-sem1-gened-slot-2'],
    'year2-sem2': ['305233', 'gap-y2s2-1', '305245', '305231', '305242', '305221', '305292', '305202', 'year2-sem2-gened-slot-1', 'year2-sem2-gened-slot-2'],
    'year2-summer': ['305293'],
    'year3-sem1': ['gap-y3s1-1', '305341', '300302', '305311', '305331', '305343', '305391', '305301', 'year3-sem1-gened-slot-1', 'year3-sem1-free-elective-slot-1'],
    'year3-sem2': ['gap-y3s2-1', '305342', '300301', '305334', '305335', '305323', '305392', 'year3-sem2-gened-slot-1', 'year3-sem2-free-elective-slot-1'],
    'year3-summer': ['305393'],
    'year4-sem1': ['305491', '305493', '305495', 'year4-sem1-major-elective-slot-1'],
    'year4-sem2': ['305492', '305494', '305496', 'year4-sem2-major-elective-slot-1']
  };

  // Sort: Exact match based on the provided poster layout
  const sortPosterCourses = (semId: string, courses: StudyCourse[]) => {
    const order = EXACT_ORDER[semId] || [];
    const sorted = [...courses].sort((a, b) => {
      const aId = (a.code === '001XXX' || a.code === 'XXXXXX') ? a.courseId : a.code;
      const bId = (b.code === '001XXX' || b.code === 'XXXXXX') ? b.courseId : b.code;
      const indexA = order.indexOf(aId || '');
      const indexB = order.indexOf(bId || '');
      const posA = indexA === -1 ? 999 : indexA;
      const posB = indexB === -1 ? 999 : indexB;
      return posA - posB;
    });

    const finalCourses: any[] = [];
    order.forEach(id => {
      if (id.startsWith('gap')) {
        finalCourses.push({ code: id, titleTh: '', courseId: id });
      } else {
        const found = sorted.find(c => {
          const cId = (c.code === '001XXX' || c.code === 'XXXXXX') ? c.courseId : c.code;
          return cId === id;
        });
        if (found) finalCourses.push(found);
      }
    });

    sorted.forEach(c => {
      const cId = (c.code === '001XXX' || c.code === 'XXXXXX') ? c.courseId : c.code;
      if (!order.includes(cId || '')) {
        finalCourses.push(c);
      }
    });

    return finalCourses as StudyCourse[];
  };

  return (
    <section className="visual-card">
      
      {/* Legend */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.75rem', marginBottom: '8px' }}>
          {Object.values(CATEGORIES).map(cat => (
            <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.bg, border: `1px solid ${cat.border}` }}></div>
            <span style={{ color: 'var(--text-muted)' }}>{cat.label}</span>
          </div>
        ))}
        </div>
      </div>

      {/* 1:1 POSTER WRAPPER */}
      <div className="curriculum-poster-wrapper" style={{ width: '100%', justifyContent: 'center' }}>
          <div 
            ref={containerRef} 
            className="curriculum-poster-map" 
            style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '1080px', 
              aspectRatio: '1 / 1.16', 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '24px',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px',
              overflow: 'hidden'
            }}
          >
            {/* SVG OVERLAY */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 30 }}>
              <defs>
                {EDGE_MARKERS.map(c => (
                  <marker key={`arrow-${c.id}`} id={`arrow-${c.id}`} markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                    <polygon points="0 0, 7 2.5, 0 5" fill={c.color} />
                  </marker>
                ))}
                {EDGE_MARKERS.map(c => (
                  <marker key={`arrow-${c.id}-small`} id={`arrow-${c.id}-small`} markerWidth="5" markerHeight="4" refX="4.5" refY="2" orient="auto">
                    <polygon points="0 0, 5 2, 0 4" fill={c.color} />
                  </marker>
                ))}
                <marker id="arrow-active" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#f97316" />
                </marker>
                <marker id="arrow-active-small" markerWidth="6" markerHeight="4" refX="5.2" refY="2" orient="auto">
                  <polygon points="0 0, 6 2, 0 4" fill="#f97316" />
                </marker>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f97316" floodOpacity="0.5"/>
                </filter>
              </defs>

              {lines.map(line => {
                const isActive = hoveredCourse === line.source || hoveredCourse === line.target;
                const markerSuffix = line.markerSize === 'small' ? '-small' : '';
                
                let strokeColor = line.color;
                let strokeWidth = line.markerSize === 'small' ? 2.7 : 3.5;
                let opacity = 0.9;
                let markerId = `url(#arrow-${line.markerId}${markerSuffix})`;
                let filter = 'none';
                
                if (isActive) {
                  strokeColor = '#f97316';
                  strokeWidth = line.markerSize === 'small' ? 3.4 : 4.5;
                  opacity = 1;
                  markerId = `url(#arrow-active${markerSuffix})`;
                  filter = 'url(#glow)';
                } else if (hoveredCourse && !isActive) {
                  // Dim slightly if hovering over unrelated course, but DO NOT hide it completely
                  opacity = 0.55; 
                }
                
                return (
                  <path
                    key={line.id}
                    data-edge={line.id}
                    data-source={line.source}
                    data-target={line.target}
                    data-lane={line.lane}
                    data-marker-size={line.markerSize}
                    data-route-mode={line.routeMode}
                    d={createPath(line)}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={opacity}
                    markerEnd={markerId}
                    filter={filter}
                    style={{ transition: 'all 0.2s' }}
                  />
                );
              })}
            </svg>

            {/* SEMESTER ROWS (Wrap layout, max 2 lines) */}
            {semesters.map((sem) => {
              const isSummer = (sem.semester === 'ฤดูร้อน') || (sem.title || '').includes('Summer') || (sem.title || '').includes('ฤดูร้อน');
              const coursesToRender = compactSemesterCourses(sem.courses || []);
              const sortedCourses = sortPosterCourses(sem.id, coursesToRender);
              
              const isLongBar = isSummer && sortedCourses.length <= 2;

              return (
                <div 
                  key={sem.id} 
                  style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    alignItems: 'stretch', 
                    position: 'relative', 
                    zIndex: 1,
                    minHeight: isSummer ? '46px' : '64px'
                  }}
                >
                  {/* Semester Label */}
                  <div style={{ width: '70px', flexShrink: 0, textAlign: 'right', paddingTop: '4px' }}>
                    <h3 style={{ margin: '0 0 2px 0', fontSize: '0.8rem', color: 'var(--text)', fontWeight: 700 }}>
                      {isSummer ? (sem.yearNumber === 3 ? 'ฝึกงาน' : 'Summer') : (sem.title || '')}
                    </h3>
                    {!(isSummer && sem.yearNumber === 3) && (
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{sem.totalCredits} หน่วยกิต</div>
                    )}
                  </div>
                  
                  {/* Courses container (Flex Wrap) */}
                  <div style={{ flex: 1, display: 'flex', flexWrap: 'nowrap', gap: '12px 16px', overflowX: 'auto', paddingBottom: '4px', alignContent: 'flex-start' }}>
                    {isLongBar ? (
                      <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
                        {sortedCourses.map(c => {
                          let fullCourse = null;
              if (c.code === '001XXX' || c.code === 'XXXXXX') {
                fullCourse = {
                  id: c.courseId || c.code,
                  code: c.code,
                  titleTh: c.titleTh,
                  nameTh: c.titleTh,
                  nameEn: c.code === '001XXX' ? 'General Education' : 'Free Elective',
                  credits: c.credits,
                  type: c.code === '001XXX' ? 'general-education' : 'free-elective',
                  description: `หมวดหมู่นี้ให้นิสิตเลือกเรียนวิชาใดก็ได้ที่อยู่ในหมวด ${c.titleTh}`,
                  isSlot: true,
                } as any;
              } else if (c.code && !c.code.includes('x') && !c.code.includes('group')) {
                fullCourse = courseIndex.findCourseByCode(c.code);
              }
                          const catKey = getCourseCategory(c.code || '', c.titleTh || '');
                          const cat = CATEGORIES[catKey];
                          const rawNodeId = c.code?.toLowerCase() !== 'xxxxxx' && !c.code?.toLowerCase().includes('xxx') ? c.code : c.courseId;
                          const nodeId = c.code?.includes('group') ? `${sem.id}-${rawNodeId}` : rawNodeId;
                          
                          if (c.code?.startsWith('gap')) {
                            return (
                              <div
                                key={nodeId}
                                id={`cm-node-${nodeId}`}
                                data-road-obstacle="false"
                                style={{
                                  flex: 1,
                                  height: '42px',
                                  background: 'transparent',
                                  border: 'none',
                                  pointerEvents: 'none'
                                }}
                              />
                            );
                          }
                          
                          return (
                            <div 
                              key={nodeId}
                              id={`cm-node-${nodeId}`}
                              data-road-obstacle={isSummer ? 'false' : 'true'}
                              onClick={() => fullCourse && openCourse(fullCourse as any)}
                              title={`${c.code} ${c.titleTh}`}
                              style={{
                                flex: 1,
                                height: '42px',
                                background: cat.bg, 
                                border: `1px solid ${cat.border}`, 
                                borderRadius: '6px', 
                                padding: '4px 12px',
                                cursor: fullCourse ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                zIndex: 10
                              }}
                            >
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: cat.color }}>{c.code?.includes('group') ? '' : c.code}</span>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{getCourseShortName(c)}</span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      sortedCourses.map(c => {
                        const isGroup = c.code?.includes('group');
                        let fullCourse = null;
                        if (c.code === '001XXX' || c.code === 'XXXXXX') {
                          fullCourse = {
                            id: c.courseId || c.code,
                            code: c.code,
                            titleTh: c.titleTh,
                            nameTh: c.titleTh,
                            nameEn: c.code === '001XXX' ? 'General Education' : 'Free Elective',
                            credits: c.credits,
                            type: c.code === '001XXX' ? 'general-education' : 'free-elective',
                            description: `หมวดหมู่นี้ให้นิสิตเลือกเรียนวิชาใดก็ได้ที่อยู่ในหมวด ${c.titleTh}`,
                            isSlot: true,
                          } as any;
                        } else if (c.code && !c.code.includes('x') && !isGroup) {
                          fullCourse = courseIndex.findCourseByCode(c.code);
                        }
                        const catKey = getCourseCategory(c.code || '', c.titleTh || '');
                        const cat = CATEGORIES[catKey];
                        const rawNodeId = c.code?.toLowerCase() !== 'xxxxxx' && !c.code?.toLowerCase().includes('xxx') ? c.code : c.courseId;
                        const nodeId = isGroup ? `${sem.id}-${rawNodeId}` : rawNodeId;
                        
                        if (c.code?.startsWith('gap')) {
                          return (
                            <div
                              key={nodeId}
                              id={`cm-node-${nodeId}`}
                              data-road-obstacle="false"
                              style={{
                                width: '100px',
                                height: '56px',
                                flexShrink: 0,
                                background: 'transparent',
                                border: 'none',
                                pointerEvents: 'none'
                              }}
                            />
                          );
                        }

                        const isHovered = hoveredCourse === nodeId;
                        
                        return (
                          <div 
                            key={nodeId}
                            id={`cm-node-${nodeId}`}
                            data-road-obstacle={isSummer ? 'false' : 'true'}
                            onClick={() => {
                              if (isGroup) {
                                setActiveGroupCourses({ title: c.titleTh || 'Group', courses: (c as any).groupedCourses || [] });
                              } else if (fullCourse) {
                                openCourse(fullCourse as any);
                              }
                            }}
                            onMouseEnter={() => setHoveredCourse(nodeId || null)}
                            onMouseLeave={() => setHoveredCourse(null)}
                            title={`${c.code?.includes('group') ? '' : c.code} ${c.titleTh}`}
                            style={{
                              width: '88px',
                              height: '48px', // Compact height
                              background: cat.bg, 
                              border: `1px solid ${cat.border}`, 
                              borderRadius: '6px', 
                              padding: '4px 6px',
                              cursor: fullCourse ? 'pointer' : 'default', 
                              transition: 'all 0.2s',
                              boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.02)', 
                              position: 'relative',
                              transform: isHovered ? 'translateY(-2px)' : 'none',
                              zIndex: isHovered ? 20 : 10,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              textAlign: 'center'
                            }}
                          >

                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: cat.color, marginBottom: '2px', lineHeight: 1 }}>
                              {isGroup ? 'Group' : c.code}
                            </div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {isGroup ? c.titleTh : getCourseShortName(c)}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      {/* Mobile Accordion Layout */}
      <div className="curriculum-accordion-mobile" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
        <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
          💡 แนะนำให้เปิดดูบนจอใหญ่เพื่อดูแผนผังหลักสูตร
        </div>
        
        {semesters.map((sem) => {
          const isExpanded = !!expandedSems[sem.id || ''];
          const courses = sem.courses || [];

          return (
            <div key={sem.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
              <div 
                onClick={() => toggleSem(sem.id || '')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer', background: isExpanded ? 'var(--bg)' : 'transparent' }}
              >
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--text)' }}>{sem.title}</h3>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>{sem.totalCredits} หน่วยกิต</span>
                  </div>
                </div>
                <div>{isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</div>
              </div>

              {isExpanded && (
                <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {courses.map(c => {
                    const fullCourse = c.code && !c.code.includes('x') ? courseIndex.findCourseByCode(c.code) : null;
                    const catKey = getCourseCategory(c.code || '', c.titleTh || '');
                    const cat = CATEGORIES[catKey];
                    const nodeId = c.code !== 'xxxxxx' && !c.code?.includes('xxx') ? c.code : c.courseId;
                    
                    const preReqs = officialPrerequisites.filter(e => e.to === nodeId).map(e => e.from);
                    
                    return (
                      <div 
                        key={c.courseId || c.code} 
                        onClick={() => fullCourse && openCourse(fullCourse.id)}
                        style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: '12px', cursor: fullCourse ? 'pointer' : 'default' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: cat.color }}>{c.code !== 'xxxxxx' && !c.code?.includes('xxx') ? c.code : ''}</div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>{getCourseShortName(c)}</div>
                          </div>
                        </div>
                        {preReqs.length > 0 && (
                          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px dashed ${cat.border}`, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span style={{ fontWeight: 600 }}>ต้องผ่าน:</span> {preReqs.join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grouped Node Popover Modal */}
      {activeGroupCourses && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setActiveGroupCourses(null)}>
          <div style={{ background: 'var(--bg)', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{activeGroupCourses.title}</h3>
              <button onClick={() => setActiveGroupCourses(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeGroupCourses.courses.map(gc => {
                const fc = gc.code && !gc.code.includes('x') ? courseIndex.findCourseByCode(gc.code) : null;
                const cat = CATEGORIES[getCourseCategory(gc.code || '', gc.titleTh || '')];
                return (
                  <div 
                    key={gc.courseId || gc.code}
                    onClick={() => {
                      if (fc) {
                        openCourse(fc.id);
                        setActiveGroupCourses(null);
                      }
                    }}
                    style={{ padding: '12px', background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: '8px', cursor: fc ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '12px' }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: cat.color }}>{gc.code !== 'xxxxxx' && !gc.code?.includes('xxx') ? gc.code : ''}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{gc.titleTh || getCourseShortName(gc)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .curriculum-poster-wrapper { display: flex !important; }
          .curriculum-accordion-mobile { display: none !important; }
        }
        @media (max-width: 1023px) {
          .curriculum-poster-wrapper { display: none !important; }
          .curriculum-accordion-mobile { display: flex !important; }
        }
      `}</style>
    </section>
  );
}
