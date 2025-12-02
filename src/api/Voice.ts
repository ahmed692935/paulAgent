import type { AgentVoice } from "../interfaces/callForm";
import axiosInstance from "./axiosInterceptor";

const API_URL = import.meta.env.VITE_API_URL as string;

export const addAgentVoice = async (data: AgentVoice, token: string) => {
  const response = await axiosInstance.post(
    `${API_URL}/voices`,
    {
      voice_id: data.voice_id,
      voice_name: data.voice_name,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  return response.data;
};



export const getAgentVoice = async (token: string) => {
  const response = await axiosInstance.get(`${API_URL}/voices`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return response.data;
};

// Delete Voice Agent
export const deleteVoice = async (voice_id: string, token: string) => {
  const response = await axiosInstance.delete(
    `${API_URL}/voices/${voice_id}`,
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return response.data;
};

