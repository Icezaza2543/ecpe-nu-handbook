import '@xyflow/react/dist/style.css';
import './styles/tokens.css';
import './styles/globals.css';
import './styles/layout.css';
import './styles/visuals.css';
import './styles/home.css';
import './styles/roadmaps.css';
import './styles/patterns.css';


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { getRouterBasename } from './utils/routing';

import { CourseIndexProvider } from './contexts/CourseIndexContext';

const routerBasename = getRouterBasename();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename}>
      <CourseIndexProvider>
        <App />
      </CourseIndexProvider>
    </BrowserRouter>
  </StrictMode>,
);
