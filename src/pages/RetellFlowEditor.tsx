import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  getRetellFlowEditor,
  updateRetellFlowPromptAndIntro,
} from "../api/retell";
import type { RetellFlowEditorState } from "../interfaces/retellFlow";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Save, Settings } from "lucide-react";
import type { AxiosError } from "axios";

const emptyState: RetellFlowEditorState = {
  conversation_flow_id: "",
  version: 0,
  global_prompt: "",
  intro_node_id: "",
  intro_text: "",
};

function RetellFlowEditor() {
  const token = useSelector(
    (s: RootState) => s.auth.token ?? s.auth.user?.access_token ?? null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flow, setFlow] = useState<RetellFlowEditorState>(emptyState);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getRetellFlowEditor(token);
        setFlow(data);
      } catch (err) {
        const ax = err as AxiosError<{ detail?: string; error?: string }>;
        toast.error(
          ax.response?.data?.detail ||
            ax.response?.data?.error ||
            "Could not load Retell flow editor."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleSave = async () => {
    if (!token) {
      toast.error("Not signed in.");
      return;
    }
    if (!flow.conversation_flow_id) {
      toast.error("Missing conversation flow id — reload and try again.");
      return;
    }
    setSaving(true);
    try {
      await updateRetellFlowPromptAndIntro(
        {
          conversation_flow_id: flow.conversation_flow_id,
          global_prompt: flow.global_prompt,
          intro_node_id: flow.intro_node_id,
          intro_text: flow.intro_text,
        },
        token
      );
      toast.success("Flow prompt and intro saved.");
      const fresh = await getRetellFlowEditor(token);
      setFlow(fresh);
    } catch (err) {
      const ax = err as AxiosError<{ detail?: string; error?: string }>;
      toast.error(
        ax.response?.data?.detail ||
          ax.response?.data?.error ||
          "Save failed."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-8 space-y-10 animate-fadeIn max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 flex items-center gap-3">
            <Settings className="text-brand-primary" size={36} />
            Settings
          </h1>
          <p className="text-gray-400 font-medium tracking-tight">
            Conversation flow, global prompt, and intro copy for your agent.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || saving || !flow.conversation_flow_id}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-primary/90 transition-all shadow-[0_20px_40px_rgba(14,165,233,0.2)] disabled:opacity-50"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Save settings
        </button>
      </div>

      {loading ? (
        <div className="glass rounded-[3rem] border border-white/5 p-24 flex justify-center">
          <div className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[3rem] border border-white/5 p-10 md:p-14 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">
                Conversation flow ID
              </label>
              <input
                readOnly
                value={flow.conversation_flow_id}
                className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-gray-400 text-sm outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">
                Version
              </label>
              <input
                readOnly
                value={flow.version}
                className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-gray-400 text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">
              Intro node ID
            </label>
            <input
              readOnly
              value={flow.intro_node_id}
              title="Must match a node in your Retell flow graph"
              className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-gray-400 text-sm outline-none cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">
              Global prompt
            </label>
            <textarea
              value={flow.global_prompt}
              onChange={(e) =>
                setFlow((f) => ({ ...f, global_prompt: e.target.value }))
              }
              rows={14}
              className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-[2rem] text-white focus:border-brand-primary/30 outline-none transition-all font-medium text-sm resize-y custom-scrollbar min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">
              Intro text
            </label>
            <textarea
              value={flow.intro_text}
              onChange={(e) =>
                setFlow((f) => ({ ...f, intro_text: e.target.value }))
              }
              rows={10}
              className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-[2rem] text-white focus:border-brand-primary/30 outline-none transition-all font-medium text-sm resize-y custom-scrollbar min-h-[160px]"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default RetellFlowEditor;
