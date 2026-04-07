import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { TooltipProvider } from './components/Tooltip';
import { RigFilterProvider } from './store/rigFilterStore';
import './styles/app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <RigFilterProvider>
        <App />
      </RigFilterProvider>
    </TooltipProvider>
  </StrictMode>,
);
