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
  language: "english" | "spanish";
  voice: string;
  groups: CallGroup[];      // New field
}

export interface InitiateCallPayload {
  caller_name: string;
  caller_email: string;
  caller_number: string;
  phone_numbers: string[];
  objective?: string;
  context: string;
  system_prompt: string;
  first_names: string[];
  language: "english" | "spanish";
  voice: string;
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
  voice_name: string
}