import '@xyflow/react/dist/style.css';
import './styles/tokens.css';
import './styles/globals.css';
import './styles/layout.css';
import './styles/visuals.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import { validateStaticData } from './schemas/validateData';
import { courses } from './data/courses';
import { studyPlan } from './data/studyPlan';
import { curriculumStructure } from './data/curriculumStructure';
import { officialPrerequisites } from './data/officialPrerequisites';

if (import.meta.env.DEV) {
  validateStaticData(courses, studyPlan.years as any[], (curriculumStructure as any).categories || [], officialPrerequisites);
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/ecpe-nu-handbook">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
