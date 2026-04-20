import type {
  RetellFlowEditorState,
  RetellFlowPromptAndIntroPayload,
} from "../interfaces/retellFlow";
import axiosInstance from "./axiosInterceptor";

const API_URL = import.meta.env.VITE_API_URL as string;

const jsonAuth = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
  "Content-Type": "application/json",
});

export const getRetellFlowEditor = async (
  token: string
): Promise<RetellFlowEditorState> => {
  const res = await axiosInstance.get(`${API_URL}/retell/flow/editor`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data;
};

export const updateRetellFlowPromptAndIntro = async (
  data: RetellFlowPromptAndIntroPayload,
  token: string
) => {
  const res = await axiosInstance.put(
    `${API_URL}/retell/flow/prompt-and-intro`,
    data,
    { headers: jsonAuth(token) }
  );
  return res.data;
};
