import { Header } from "../../components/header/Header";
import "./Dashboard.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "../home/Home";
import { Calculator } from "../calculator/Calculator";
import { CalculationSession } from "../calculation_session/CalculationSession";
import { Groups } from "../groups/Groups";

export const Dashboard = () => {


  return (
    <>
      <div className="page_wrapper">
        <Header isLoggedIn />

        <Routes>
          <Route path="/calculator" element={<CalculationSession />} />
          <Route path="/home" element={<Home />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/add-session" element={<Calculator  askToSave={true}/>} />
        </Routes>

      </div>
    </>
  );
};
