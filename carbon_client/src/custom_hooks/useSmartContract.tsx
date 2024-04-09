import { BaseContractMethod } from "ethers";
import { useContext } from "react";
import { ErrorBarContext } from "../context/ErrorBar.context";

export const useSmartContract = () => {

    const {showError} = useContext(ErrorBarContext)

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
        showError(extractedSentence);
        return { status: "ERROR", error: extractedSentence };
      } else {
        showError(error.message);
        return { status: "ERROR", error: error.message };
      }
    }
  };
  return { callSmartContractMethod };
};
