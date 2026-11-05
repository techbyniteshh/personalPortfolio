import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary name="ApplicationRoot">
      <App />
    </ErrorBoundary>
  );
} else {
  console.error('Fatal: #root element not found in DOM.');
}
