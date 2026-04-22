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
import { Save, Loader2, Info, Sliders, MessageSquare, Terminal } from "lucide-react";
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
    <div className="py-8 space-y-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="bg-white p-10 rounded-[14px] border border-slate-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-brand-primary/20">
              <Sliders size={12} />
              <span>Prompt Configuration</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
              Prompt <span className="text-brand-primary">Settings</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-tight max-w-xl">
              Manage conversation flow architecture, global intelligence prompts, and interaction benchmarks.
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || saving || !flow.conversation_flow_id}
            className="group relative flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-[14px] transition-all hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/10 active:scale-95 disabled:opacity-50 overflow-hidden"
          >
             {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
             Commit Changes
            <div className="absolute inset-0 bg-linear-to-r from-brand-primary to-brand-secondary opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[14px] border border-slate-300 p-32 shadow-sm flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-brand-primary" size={48} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synchronizing Parameters...</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[14px] border border-slate-300 p-10 md:p-14 shadow-sm space-y-12 text-left"
        >
          {/* Core Identifiers */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Info className="text-brand-primary" size={14} />
              Prompt Identifiers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Conversation Flow ID
                </label>
                <div className="relative group">
                  <input
                    readOnly
                    value={flow.conversation_flow_id}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[14px] text-slate-400 text-sm font-bold shadow-inner outline-none transition-all group-hover:border-slate-300"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-400 transition-colors">ReadOnly</div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Revision Version
                </label>
                <div className="relative group">
                  <input
                    readOnly
                    value={flow.version}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[14px] text-slate-400 text-sm font-bold shadow-inner outline-none transition-all group-hover:border-slate-300"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-400 transition-colors">Stable</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 text-left">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                Assignment
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" title="System Critical" />
              </label>
              <div className="relative group text-left">
                <input
                  readOnly
                  value={flow.intro_node_id}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[14px] text-slate-400 text-sm font-bold shadow-inner outline-none cursor-not-allowed group-hover:border-slate-300"
                />
                <Terminal className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-slate-400" size={16} />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100" />

          {/* Logic Configuration */}
          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="text-brand-primary" size={14} />
                Prompt Protocol
              </h3>
              <p className="text-[11px] font-medium text-slate-500 max-w-2xl">
                The global prompt defines the foundational constraints and behavioral patterns of the AI agent across all nodes.
              </p>
            </div>
            
            <div className="space-y-3 text-left">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Global Prompt
              </label>
              <textarea
                value={flow.global_prompt}
                onChange={(e) =>
                  setFlow((f) => ({ ...f, global_prompt: e.target.value }))
                }
                rows={12}
                className="w-full px-8 py-6 bg-slate-100 border border-slate-300 rounded-[14px] text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-sm shadow-inner resize-y custom-scrollbar min-h-[300px]"
                placeholder="Initialize global architecture instructions..."
              />
            </div>
          </div>

          {/* Interaction Configuration */}
          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Terminal className="text-brand-primary" size={14} />
                Primary Response Benchmark
              </h3>
              <p className="text-[11px] font-medium text-slate-500 max-w-2xl">
                Define the initial output text when the agent establishes connection with the target endpoint.
              </p>
            </div>
            
            <div className="space-y-3 text-left">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Initial Voice Signal
              </label>
              <textarea
                value={flow.intro_text}
                onChange={(e) =>
                  setFlow((f) => ({ ...f, intro_text: e.target.value }))
                }
                rows={8}
                className="w-full px-8 py-6 bg-slate-100 border border-slate-300 rounded-[14px] text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-sm shadow-inner resize-y custom-scrollbar min-h-[200px]"
                placeholder="Initialize session entry copy..."
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default RetellFlowEditor;
