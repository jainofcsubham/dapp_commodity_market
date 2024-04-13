import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import ErrorBoundary from './components/error_boundary/ErrorBoundary.tsx';
// import React from 'react';


ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ErrorBoundary>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <App />
    </LocalizationProvider>
  </ErrorBoundary>
  // </React.StrictMode>,
)
