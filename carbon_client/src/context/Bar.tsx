import { createContext } from "react";
import { BarContextType } from "../types/BarContext.type";

export const BarContext = createContext<BarContextType>({
  showBar : (_note:string) => {}
});
