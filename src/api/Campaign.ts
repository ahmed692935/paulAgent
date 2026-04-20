import axiosInstance from "./axiosInterceptor";
import type { 
  Campaign, 
  CampaignDetail, 
  CampaignRun, 
  CampaignStats, 
  UploadResponse 
} from "../interfaces/campaign";

const API_URL = import.meta.env.VITE_API_URL as string;

export const createCampaign = async (data: { name: string; description?: string }, token: string): Promise<Campaign> => {
  const response = await axiosInstance.post(`${API_URL}/campaigns`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.campaign;
};

export const listCampaigns = async (token: string, includeArchived: boolean = false): Promise<Campaign[]> => {
  const response = await axiosInstance.get(`${API_URL}/campaigns?include_archived=${includeArchived}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.campaigns;
};

export const getCampaignDetails = async (campaignId: number, token: string): Promise<CampaignDetail> => {
  const response = await axiosInstance.get(`${API_URL}/campaigns/${campaignId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // This returns {success, campaign, total_contacts}
};

export const uploadCampaignCsv = async (campaignId: number, file: File, token: string): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(`${API_URL}/campaigns/${campaignId}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data; // returns {success, uploaded_rows, linked_contacts, total_contacts}
};

export const runCampaign = async (campaignId: number, batchSize: number = 15, token: string): Promise<CampaignRun> => {
  const response = await axiosInstance.post(`${API_URL}/campaigns/${campaignId}/run?batch_size=${batchSize}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.run;
};

export const getRunStatus = async (runId: number, token: string): Promise<CampaignRun> => {
  const response = await axiosInstance.get(`${API_URL}/campaign-runs/${runId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.run;
};

export const getCampaignStats = async (campaignId: number, token: string): Promise<CampaignStats> => {
  const response = await axiosInstance.get(`${API_URL}/campaigns/${campaignId}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
