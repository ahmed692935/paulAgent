export interface Campaign {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface CampaignDetail {
  campaign: Campaign;
  total_contacts: number;
}

export interface CampaignRun {
  id: number;
  campaign_id: number;
  status: string;
  batch_size: number;
  total_contacts: number;
  processed_contacts: number;
  initiated_calls: number;
  failed_calls: number;
  created_at: string;
  started_at?: string;
  ended_at?: string;
}

export interface CampaignStats {
  success: boolean;
  campaign_id: number;
  total_contacts: number;
  call_stats: {
    total_calls: number;
    completed_calls: number;
    not_completed_calls: number;
  };
}

export interface UploadResponse {
  uploaded_rows: number;
  linked_contacts: number;
  total_contacts: number;
}
