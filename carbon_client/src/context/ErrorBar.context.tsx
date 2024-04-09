import { createContext } from "react";
import { ErrorBarContextType } from "../types/ErrorBarContext.type";

export const ErrorBarContext = createContext<ErrorBarContextType>({
  showError : (_note:string) => {}
});
