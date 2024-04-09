import { Header } from "../../components/header/Header";
import { CalculatorStatic } from "../calculator_static/CalculatorStatic";

export const CalculatePublic = () => {
  return (
    <>
      <div className="page_wrapper">
        <Header />
        <CalculatorStatic />
      </div>
    </>
  );
};
