import ReactDOM from 'react-dom/client'
import {App} from './App.tsx'
import './index.css'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers';


ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <LocalizationProvider dateAdapter={AdapterMoment}>
    <App />
  </LocalizationProvider>
  // </React.StrictMode>,
)
