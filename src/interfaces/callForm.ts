export interface CallFormInputs {
  caller_name: string;
  caller_email: string;
  caller_number: string;
  phone_numbers: string[];
  objective: string;
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