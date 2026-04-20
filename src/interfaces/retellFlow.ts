export interface RetellFlowEditorState {
  conversation_flow_id: string;
  version: number;
  global_prompt: string;
  intro_node_id: string;
  intro_text: string;
}

export type RetellFlowPromptAndIntroPayload = Pick<
  RetellFlowEditorState,
  "conversation_flow_id" | "global_prompt" | "intro_node_id" | "intro_text"
>;
