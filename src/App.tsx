import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ScrollToTop } from './components/common/ScrollToTop';
import { AppLayout } from './components/layout/AppLayout';
import { CourseModalProvider } from './components/common/CourseModalProvider';
import { useCourseIndex } from './hooks/useCourseIndex';
import { resolveRoutePath } from './utils/routing';

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const VisualMapsPage = lazy(() => import('./pages/VisualMapsPage').then((module) => ({ default: module.VisualMapsPage })));
const CourseCatalogPage = lazy(() => import('./pages/CourseCatalogPage').then((module) => ({ default: module.CourseCatalogPage })));
const CareerRoadmapsPage = lazy(() => import('./pages/CareerRoadmapsPage').then((module) => ({ default: module.CareerRoadmapsPage })));
const DependencyGraphPage = lazy(() => import('./pages/DependencyGraphPage').then((module) => ({ default: module.DependencyGraphPage })));
const SurvivalGuidePage = lazy(() => import('./pages/SurvivalGuidePage').then((module) => ({ default: module.SurvivalGuidePage })));
const BeyondClassroomPage = lazy(() => import('./pages/BeyondClassroomPage').then((module) => ({ default: module.BeyondClassroomPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then((module) => ({ default: module.FAQPage })));
const SeniorTipsPage = lazy(() => import('./pages/SeniorTipsPage').then((module) => ({ default: module.SeniorTipsPage })));
const CreditsPage = lazy(() => import('./pages/CreditsPage').then((module) => ({ default: module.CreditsPage })));

function RouteFallback() {
  const location = useLocation();
  const pathname = resolveRoutePath(location.pathname);

  return (
    <Navigate
      to={{ pathname, search: location.search, hash: location.hash }}
      replace
    />
  );
}

export default function App() {
  const courseIndex = useCourseIndex();

  return (
    <CourseModalProvider courseIndex={courseIndex}>
      <Suspense fallback={<div className="route-loading">Loading ECPE Handbook...</div>}>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout courseIndex={courseIndex} />}>
            <Route index element={<HomePage courseIndex={courseIndex} />} />
            <Route path="/visual-maps" element={<VisualMapsPage courseIndex={courseIndex} />} />
            <Route path="/courses" element={<CourseCatalogPage courseIndex={courseIndex} />} />
            <Route path="/roadmaps" element={<CareerRoadmapsPage courseIndex={courseIndex} />} />
            <Route path="/dependency-graph" element={<DependencyGraphPage courseIndex={courseIndex} />} />
            <Route path="/survival-guide" element={<SurvivalGuidePage courseIndex={courseIndex} />} />
            <Route path="/tools-sources" element={<BeyondClassroomPage />} />
            <Route path="/beyond-classroom" element={<BeyondClassroomPage />} />
            <Route path="/faq" element={<FAQPage courseIndex={courseIndex} />} />
            <Route path="/senior-tips" element={<SeniorTipsPage courseIndex={courseIndex} />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="*" element={<RouteFallback />} />
          </Route>
        </Routes>
      </Suspense>
    </CourseModalProvider>
  );
}
