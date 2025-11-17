// import axios from "axios";
import type { CallFormInputs } from "../interfaces/callForm";
import axiosInstance from "./axiosInterceptor";
const API_URL = import.meta.env.VITE_API_URL as string;

export const initiateCall = async (data: CallFormInputs, token: string) => {
  const response = await axiosInstance.post(
    `${API_URL}/assistant-initiate-call`,
    data,
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

export const checkCallStatus = async (callId: string, token: string) => {
  const response = await axiosInstance.get(`${API_URL}/call-status/${callId}`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data;
};

// ✅ PUT /system-prompt API
export const updateSystemPrompt = async (
  promptData: { system_prompt: string },
  token: string
) => {
  const response = await axiosInstance.put(
    `${API_URL}/prompt-customization`,
    promptData,
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return response.data;
};

// ✅ GET /prompt_customization API
export const getSystemPrompt = async (token: string) => {
  const response = await axiosInstance.get(`${API_URL}/prompt-customization`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data;
};

// ✅ POST: Upload Excel File
export const uploadContactsFile = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    `${API_URL}/contacts/upload`,
    formData,
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    }
  );

  return response.data;
};

// GET contacts for CallForm autocomplete
export const getContacts = async (token: string) => {
  const response = await axiosInstance.get(`${API_URL}/contacts`, {
    headers: {
      "ngrok-skip-browser-warning": "true ",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  // response.contacts me array hai
  // sirf name & phone_number return karo
  return response.data.contacts.map((c: any) => ({
    firstName: c.name,
    phoneNumber: c.phone_number,
  }));
};
