// import axios from "axios";
import axiosInstance from "./axiosInterceptor";

const API_URL = import.meta.env.VITE_API_URL as string;

export const fetchCallHistory = async (
  token: string,
  page = 1,
  pageSize = 10
) => {
  const response = await axiosInstance.get(
    `${API_URL}/call-history?page=${page}&page_size=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return response.data;
};

// export const fetchRecordingStream = async (callId: string, token: string) => {
//   const response = await axiosInstance.get(
//     `${API_URL}/calls/${callId}/recording/stream`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "ngrok-skip-browser-warning": "true",
//         Accept: "audio/mpeg", // or "application/octet-stream" depending on backend
//       },
//       responseType: "blob", // so it treats it as binary audio data
//     }
//   );

//   // Convert to a playable blob URL
//   const audioUrl = URL.createObjectURL(response.data);
//   return audioUrl;
// };

export const fetchRecordingStream = async (call_Id: string, token: string) => {
  const response = await axiosInstance.get(
    `${API_URL}/calls/${call_Id}/recording`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        Accept: "audio/mpeg", // or "application/octet-stream" depending on backend
      },
      // responseType: "blob", // so it treats it as binary audio data
    }
  );

  // Convert to a playable blob URL
  // const audioUrl = URL.createObjectURL(response.data);
  // return audioUrl;
  return response.data
};

export const fetchCallTranscript = async (callId: string, token: string) => {
  const response = await axiosInstance.get(
    `${API_URL}/calls/${callId}/transcript`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  return response.data;
};
