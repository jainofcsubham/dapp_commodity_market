import axios, { AxiosRequestConfig } from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL : "https://2bikh722cf.execute-api.ap-south-1.amazonaws.com/dev";

export const useAxios = () => {
  const doCall = async (
    config: AxiosRequestConfig
  ): Promise<{
    status: "success" | "error";
    errorDetails?: any;
    res?: Record<string, any>;
  }> => {
    const token = localStorage.getItem("idToken");

    try {
      const data: Record<string, any> = await axios({
        baseURL: baseUrl,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        ...config,
      });
      return {
        status: "success",
        res: data.data,
      };
    } catch (e) {
      return {
        status: "error",
        errorDetails: e,
      };
    }
  };

  return { doCall };
};
