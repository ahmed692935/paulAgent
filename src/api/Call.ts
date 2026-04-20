// import axios from "axios";
import type { CallFormInputs, InitiateCallPayload } from "../interfaces/callForm";
import axiosInstance from "./axiosInterceptor";
const API_URL = import.meta.env.VITE_API_URL as string;

// export const initiateCall = async (data: CallFormInputs, token: string) => {
//   const response = await axiosInstance.post(
//     `${API_URL}/assistant-initiate-call`,
//     data,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//     }
//   );
//   return response.data;
// };

export const initiateCall = async (data: InitiateCallPayload, token: string) => {
  const response = await axiosInstance.post(
    `${API_URL}/assistant-bulk-call`,
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

// GET contacts for CallForm autocomplete (optional — many deployments omit this route)
export const getContacts = async (
  token: string
): Promise<{ firstName: string; phoneNumber: string }[]> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/contacts`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const raw = response.data?.contacts;
    if (!Array.isArray(raw)) return [];
    return raw.map((c: Record<string, unknown>) => ({
      firstName: String(c.name ?? c.first_name ?? ""),
      phoneNumber: String(c.phone_number ?? c.phone ?? ""),
    }));
  } catch (e: unknown) {
    const status = (e as { response?: { status?: number } })?.response?.status;
    if (status === 404) return [];
    throw e;
  }
};


// Post create prompt
export const createPrompt = async (data: CallFormInputs, token: string) => {
  const response = await axiosInstance.post(
    `${API_URL}/prompts`,
    data,
    {
      headers: {
        "ngrok-skip-browser-warning": "true ",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return response.data;
};

// get all prompts (optional — 404 yields empty list for Retell-only backends)
export const getAllPrompt = async (token: string) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/prompts`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const list = response.data?.prompts;
    return Array.isArray(list) ? list : [];
  } catch (e: unknown) {
    const status = (e as { response?: { status?: number } })?.response?.status;
    if (status === 404) return [];
    throw e;
  }
};


// Post Update prompt
export const updatePrompt = async (prompt_id: number, data: any, token: string) => {
  const response = await axiosInstance.put(
    `${API_URL}/prompts/${prompt_id}`,
    data,
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

// Delete Prompt
export const deletePrompt = async (prompt_id: number, token: string) => {
  const response = await axiosInstance.delete(
    `${API_URL}/prompts/${prompt_id}`,
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


// Call Outcomes 
export const callOutcomes = async (token: string) => {
  const response = await axiosInstance.get(
    `${API_URL}/analytics/call-outcome`,
    {
      headers: {
        "ngrok-skip-browser-warning": "true ",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return response.data.prompts; 
};