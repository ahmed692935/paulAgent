import type { RetellVoicesResponse } from "../interfaces/callForm";
import axiosInstance from "./axiosInterceptor";

const API_URL = import.meta.env.VITE_API_URL as string;

const jsonAuth = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  Accept: "application/json",
});

/** GET /retell/voices */
export const getAgentVoice = async (
  token: string
): Promise<RetellVoicesResponse> => {
  const response = await axiosInstance.get(`${API_URL}/retell/voices`, {
    headers: {
      ...jsonAuth(token),
    },
  });

  return response.data;
};

/** PUT /retell/agent/voice — sets the active Retell voice for the authenticated user */
export const setRetellAgentVoice = async (voice_id: string, token: string) => {
  const response = await axiosInstance.put(
    `${API_URL}/retell/agent/voice`,
    { voice_id },
    { headers: jsonAuth(token) }
  );
  return response.data;
};
