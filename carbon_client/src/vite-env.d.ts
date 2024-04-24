/// <reference types="vite/client" />
import { Eip1193Provider } from "ethers";

declare global {
  interface Window {
    ethereum: Eip1193Provider & {
      on : (event: string, callback: (...params: any) => void) => void;
    };
  }
}