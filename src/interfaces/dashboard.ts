// export interface RowData {
//   id: number;
//   name: string;
//   agent: string;
//   date: string;
//   transcription: string;
//   summary: string;
//   col1: string;
//   col2: string;
//   col3: string;
//   col4: string;
//   col5: string;
//   col6: string;
//   col7: string;
// }

// export interface Call {
//   id: number;
//   call_id: string;
//   status: string | null;
//   duration: number | null;
//   transcript: string | null;
//   summary: string | null;
//   recording_url: string | null;
//   created_at: string;
//   started_at: string | null;
//   ended_at: string | null;
//   voice_id: string;
//   voice_name: string;
//   from_number: string | null;
//   to_number: string | null;
//   user_id: number;
//   username: string;
//   email: string;
// }

// export interface CallHistoryResponse {
//   user_id: number;
//   calls: Call[];
// }

// export interface CallHistoryState {
//   loading: boolean;
//   error: string | null;
//   calls: Call[];
// }

// One transcript line in the call
// export interface TranscriptLine {
//   role: string;
//   text: string;
// }

// // Single Call record
// export interface Call {
//   id: number;
//   call_id: string;
//   status:
//     | "completed"
//     | "no-answer"
//     | "queued"
//     | "busy"
//     | "not_attended"
//     | "connected"
//     | null;
//   duration: number | null;
//   // transcript: TranscriptLine[] | null;
//   transcript: TranscriptLine[] | null;
//   summary: string | null;
//   recording_url: string | null;
//   created_at: string;
//   started_at: string | null;
//   ended_at: string | null;
//   voice_id: string;
//   voice_name: string;
//   from_number: string | null;
//   to_number: string | null;
//   user_id: number;
//   username: string;
//   email: string;
// }

// // Pagination info
// export interface Pagination {
//   page: number;
//   perPage: number;
//   total: number;
//   completed_calls: number;
//   not_completed_calls: number;
// }

// // API response for call history
// export interface CallHistoryResponse {
//   user_id: number;
//   calls: Call[];
//   pagination: Pagination;
// }

// // Local state shape (Redux / React state)
// export interface CallHistoryState {
//   loading: boolean;
//   error: string | null;
//   calls: Call[];
//   pagination: Pagination | null;
// }

// // ✅ Type for table rows (you can use Call directly too)
// export type RowData = Call;

export interface TranscriptItem {
  role: string;
  content: string[] | string;
}

export interface Transcript {
  items: TranscriptItem[];
  note: string;
}

// Single Call record
export interface Call {
  id: number;
  call_id: string;
  status:
    | "completed"
    | "unanswered"
    | "no-answer"
    | "queued"
    | "busy"
    | "not_attended"
    | "connected"
    | null;
  duration: number | null;
  transcript: Transcript | null; // ✅ Changed here
  summary: string | null;
  recording_url: string | null;
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
  voice_id: string;
  voice_name: string;
  from_number: string | null;
  to_number: string | null;
  user_id: number;
  username: string;
  email: string;
  call_outcome_status: string | null;
}

// Pagination info
export interface Pagination {
  page: number;
  perPage: number;
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

export type RowData = Call;
