import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ScrollToTop } from './components/common/ScrollToTop';
import { AppLayout } from './components/layout/AppLayout';
import { CourseModalProvider } from './components/common/CourseModalProvider';
import { resolveRoutePath } from './utils/routing';

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const VisualMapsPage = lazy(() => import('./pages/VisualMapsPage').then((module) => ({ default: module.VisualMapsPage })));
const CourseCatalogPage = lazy(() => import('./pages/CourseCatalogPage').then((module) => ({ default: module.CourseCatalogPage })));
const CareerRoadmapsPage = lazy(() => import('./pages/CareerRoadmapsPage').then((module) => ({ default: module.CareerRoadmapsPage })));
const UsefulLinksPage = lazy(() => import('./pages/UsefulLinksPage').then((module) => ({ default: module.UsefulLinksPage })));
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
  return (
    <CourseModalProvider>
      <Suspense fallback={<div className="route-loading">กำลังโหลดคู่มือ...</div>}>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/visual-maps" element={<VisualMapsPage />} />
            <Route path="/courses" element={<CourseCatalogPage />} />
            <Route path="/roadmaps" element={<CareerRoadmapsPage />} />
            <Route path="/dependency-graph" element={<DependencyGraphPage />} />
            <Route path="/useful-links" element={<UsefulLinksPage />} />
            <Route path="/survival-guide" element={<SurvivalGuidePage />} />
            <Route path="/tools-sources" element={<BeyondClassroomPage />} />
            <Route path="/beyond-classroom" element={<BeyondClassroomPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/senior-tips" element={<SeniorTipsPage />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="*" element={<RouteFallback />} />
          </Route>
        </Routes>
      </Suspense>
    </CourseModalProvider>
  );
}
