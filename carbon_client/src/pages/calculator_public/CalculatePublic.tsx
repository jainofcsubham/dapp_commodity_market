import { Header } from "../../components/header/Header";
import { Calculator } from "../calculator/Calculator";

export const CalculatePublic = () => {
  return (
    <>
      <div className="page_wrapper">
        <Header />
        <Calculator />
      </div>
    </>
  );
};
