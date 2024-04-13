import { BaseContractMethod } from "ethers";
import { useContext } from "react";
import { BarContext } from "../context/Bar";

export const useSmartContract = () => {

    const {showBar} = useContext(BarContext)

  const callSmartContractMethod: (
    method: BaseContractMethod<any[], any, any>,
    hasArg ?: boolean,
    args ?: any,
  ) => Promise<{
    status: "SUCCESS" | "ERROR";
    error?: any;
    data?: any;
  }> = async (method,hasArg = false,args) => {
    try {
      const data = hasArg ?  await method(args) : await method();
      return { status: "SUCCESS", data };
    } catch (error: any) {
      if (error.message.includes("reverted")) {
        const errorMessage = error.message.substring(
          error.message.lastIndexOf("reverted") + 9
        );
        const startIndex = errorMessage.indexOf('"');
        const endIndex = errorMessage.indexOf('"', startIndex + 1);
        const extractedSentence = errorMessage.substring(
          startIndex + 1,
          endIndex
        );
        showBar(extractedSentence,"error");
        return { status: "ERROR", error: extractedSentence };
      } else {
        showBar(error.message,"error");
        return { status: "ERROR", error: error.message };
      }
    }
  };
  return { callSmartContractMethod };
};
