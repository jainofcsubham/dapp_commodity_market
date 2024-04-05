
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import reactLogo from './assets/react.svg'
import "./App.css";
import { Landing } from "./pages/landing/Landing";
import { Login } from './pages/login/Login';
import { Register } from './pages/register/Register';
import "./App.css"
import { Calculator } from './pages/calculator/Calculator';
import { Dashboard } from './pages/dashboard/Dashboard';
import { CalculatePublic } from './pages/calculator_public/CalculatePublic';

export const App = () => {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/calculator" element={<CalculatePublic/>} />
          <Route path="/dashboard/*" element={<Dashboard/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgot-password" element={<Calculator/>} />
        </Routes>
      </Router>
    </>
  );
};
