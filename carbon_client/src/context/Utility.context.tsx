import { createContext } from "react";
import { UtilityContextType } from "../types/UtilityContext.type";
const defaultContractDetails = {
  contract: null,
  address: "",
  balance: BigInt(0),
};

export const UtilityContext = createContext<UtilityContextType>({
  connectWallet: async () => defaultContractDetails,
  contractDetails: defaultContractDetails,
});
