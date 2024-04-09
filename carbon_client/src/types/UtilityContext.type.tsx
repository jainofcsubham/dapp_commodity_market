import { ContractDetailsType } from "./ContractDetails.type";

type ConnectWalletType = () => Promise<ContractDetailsType>;

export interface UtilityContextType {
  connectWallet: ConnectWalletType;
  contractDetails : ContractDetailsType
}