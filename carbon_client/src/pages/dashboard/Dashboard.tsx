import { Header } from "../../components/header/Header";
import "./Dashboard.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "../home/Home";
import { Groups } from "../groups/Groups";
import { CalculatorStatic } from "../calculator_static/CalculatorStatic";
import { Reports } from "../reports/Reports";

export const Dashboard = () => {


  return (
    <>
      <div className="page_wrapper">
        <Header isLoggedIn />

        <Routes>
          <Route path="/calculator" element={<CalculatorStatic />} />
          <Route path="/home" element={<Home />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/reports" element={<Reports />} />
          {/* <Route path="/add-session" element={<Calculator  askToSave={true}/>} /> */}
        </Routes>

      </div>
    </>
  );
};
