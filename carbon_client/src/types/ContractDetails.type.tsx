import { ethers } from "ethers";

export interface ContractDetailsType {
  contract: ethers.Contract | null;
  address: string;
  balance: bigint;
}
