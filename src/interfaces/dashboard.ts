

export interface TranscriptItem {
  role: string;
  content: string[] | string;
}

export interface Transcript {
  transcript_with_tool_calls: TranscriptItem[];
}

// Single Call record
export interface Call {
  id: number;
  call_id: string;
  status: string | null;
  duration: number | null;
  transcript: Transcript | null;
  summary: string | null;
  recording_url: string | null;
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
  voice_id: string | null;
  voice_name: string | null;
  from_number: string | null;
  to_number: string | null;
  user_id: number;
  username: string;
  email: string;
  phone_number?: string | null;
  caller_number?: string | null;
  call_outcome_status: string | null;
  has_recording?: boolean;
}

// Pagination info
export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  completed_calls: number;
  not_completed_calls: number;
}

// API response for call history
export interface CallHistoryResponse {
  user_id: number;
  calls: Call[];
  pagination: Pagination;
}

// Local state shape
export interface CallHistoryState {
  loading: boolean;
  error: string | null;
  calls: Call[];
  pagination: Pagination | null;
}

export interface Summary {
  total_calls: number;
  avg_call_duration_seconds: number;
  avg_call_duration_minutes: number;
  total_talk_time_seconds: number;
  total_talk_time_minutes: number;
}

export interface DailyData {
  date: string;
  day: string;
  calls: number;
}

export interface Trends {
  daily_data: DailyData[];
  peak_day: string;
  daily_average: number;
  total_calls: number;
  total_days_with_calls: number;
}

export interface Comparison {
  this_week_calls: number;
  last_week_calls: number;
  vs_last_week_percent: number;
}

export interface AnalyticsSummary {
  summary: Summary;
  trends: Trends;
  comparison: Comparison;
}

export interface AnalyticsSummaryResponse {
  success: boolean;
  data: AnalyticsSummary;
}

export type RowData = Call;
