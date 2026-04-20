export interface CallContact {
  phone_number: string;
  first_name: string;
}

export interface CallGroup {
  context: string;
  system_prompt: string;
  contacts: CallContact[];
}

export interface CallFormInputs {
  caller_name: string;
  caller_email: string;
  caller_number: string;
  phone_numbers?: string[]; // Optional now, used for temporary state or legacy
  objective?: string;
  context?: string;         // Optional now
  system_prompt?: string;   // Optional now
  first_names?: string[];   // Optional now
  language: string;
  voice: string;
  groups: CallGroup[];      // New field
}

/** POST /assistant-bulk-call (Retell bulk call) */
export interface InitiateCallPayload {
  phone_numbers: string[];
  caller_name: string;
  caller_email: string;
  context: string;
  system_prompt: string;
  voice: string;
  language: string;
  first_names: (string | null)[];
  first_name?: string | null;
  email?: string | null;
  category?: string | null;
}

export interface TranscriptLine {
  role: string;
  text: string;
}

export interface TranscriptPayload {
  status?: string | null;
  transcript?: TranscriptLine[] | string;
}

// ==========================
// AddPrompt Interfaces
// ==========================
export interface Prompt {
  id: number;
  prompt_name: string;
  system_prompt: string;
}

export interface PromptFormValues {
  prompt_name: string;
  system_prompt: string;
}



// =========================
// Agent Voice Interfaces
// =========================

export interface AgentVoice {
  voice_id: string;
  voice_name: string;
}

/** Retell GET /retell/voices */
export interface RetellVoiceListItem {
  voice_id: string;
  voice_name: string;
  provider?: string;
  gender?: string;
  age?: string;
  accent?: string;
  language?: string | null;
  preview_audio_url?: string;
}

export interface RetellVoicesResponse {
  current_voice_id: string;
  voices: RetellVoiceListItem[];
}