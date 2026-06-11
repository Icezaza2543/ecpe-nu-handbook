const canonicalRoutes = [
  '/',
  '/visual-maps',
  '/courses',
  '/dependency-graph',
  '/roadmaps',
  '/survival-guide',
  '/tools-sources',
  '/faq',
  '/senior-tips',
  '/credits',
] as const;

const routeAliases: Record<string, (typeof canonicalRoutes)[number]> = {
  '/visual-map': '/visual-maps',
  '/visuals': '/visual-maps',
  '/maps': '/visual-maps',
  '/map': '/visual-maps',
  '/course': '/courses',
  '/catalog': '/courses',
  '/course-catalog': '/courses',
  '/รายวิชา': '/courses',
  '/dependency': '/dependency-graph',
  '/dependencies': '/dependency-graph',
  '/dependencygraph': '/dependency-graph',
  '/dependency-graphs': '/dependency-graph',
  '/prerequisite': '/dependency-graph',
  '/prerequisites': '/dependency-graph',
  '/prereq': '/dependency-graph',
  '/roadmap': '/roadmaps',
  '/career': '/roadmaps',
  '/careers': '/roadmaps',
  '/career-roadmap': '/roadmaps',
  '/career-roadmaps': '/roadmaps',
  '/survival': '/survival-guide',
  '/guide': '/survival-guide',
  '/survivalguide': '/survival-guide',
  '/tools': '/tools-sources',
  '/source': '/tools-sources',
  '/sources': '/tools-sources',
  '/tools-source': '/tools-sources',
  '/tools-and-sources': '/tools-sources',
  '/beyond': '/tools-sources',
  '/beyond-classroom': '/tools-sources',
  '/senior': '/senior-tips',
  '/tips': '/senior-tips',
  '/senior-tip': '/senior-tips',
  '/credit': '/credits',
  '/about': '/credits',
  '/credits-about': '/credits',
};

const legacyBaseSegments = new Set(['ecpe-nu-handbook']);
const normalizedRouteLookup = new Map<string, (typeof canonicalRoutes)[number]>();

for (const route of canonicalRoutes) {
  normalizedRouteLookup.set(toRouteKey(route), route);
}

for (const [alias, route] of Object.entries(routeAliases)) {
  normalizedRouteLookup.set(toRouteKey(alias), route);
}

export function getRouterBasename() {
  const basePath = normalizeBasePath(import.meta.env.BASE_URL || '/');
  return basePath === '/' || basePath === './' ? undefined : basePath.replace(/\/$/, '');
}

export function resolveRoutePath(pathname: string) {
  const normalizedPath = normalizePathname(pathname);

  if (isCanonicalRoute(normalizedPath)) {
    return normalizedPath;
  }

  if (routeAliases[normalizedPath]) {
    return routeAliases[normalizedPath];
  }

  const routeKey = toRouteKey(normalizedPath);
  const exactMatch = normalizedRouteLookup.get(routeKey);
  if (exactMatch) {
    return exactMatch;
  }

  const fuzzyMatch = findNearestRoute(routeKey);
  return fuzzyMatch || '/';
}

function normalizeBasePath(value: string) {
  if (!value || value === '/') return '/';
  if (value === './') return './';
  return `/${value.replace(/^\/+|\/+$/g, '')}/`;
}

function normalizePathname(pathname: string) {
  const [pathOnly] = pathname.split(/[?#]/);
  const decodedPath = safeDecodePath(pathOnly || '/');
  const segments = decodedPath
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments[0] && legacyBaseSegments.has(segments[0].toLowerCase())) {
    segments.shift();
  }

  return segments.length ? `/${segments.join('/')}` : '/';
}

function safeDecodePath(pathname: string) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

function isCanonicalRoute(pathname: string): pathname is (typeof canonicalRoutes)[number] {
  return canonicalRoutes.includes(pathname as (typeof canonicalRoutes)[number]);
}

function toRouteKey(pathname: string) {
  return pathname.toLowerCase().replace(/[^a-z0-9ก-๙]/g, '');
}

function findNearestRoute(routeKey: string) {
  if (!routeKey || routeKey.length < 4) return null;

  let bestMatch: (typeof canonicalRoutes)[number] | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const [candidateKey, route] of normalizedRouteLookup) {
    const distance = levenshteinDistance(routeKey, candidateKey);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = route;
    }
  }

  return bestDistance <= 2 ? bestMatch : null;
}

function levenshteinDistance(a: string, b: string) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost,
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}
