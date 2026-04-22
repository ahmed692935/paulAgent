import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiEye, FiTrash2, FiX } from "react-icons/fi";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createPrompt, getAllPrompt, updatePrompt, deletePrompt } from "../api/Call";
import type { Prompt, PromptFormValues } from "../interfaces/callForm";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Database, Cpu, Loader2, ChevronRight } from "lucide-react";

const AddPrompt = () => {
  const [prompts, setPromptList] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PromptFormValues>({
    defaultValues: {
      prompt_name: "",
      system_prompt: "",
    },
  });

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      const prompts = await getAllPrompt(token);
      setPromptList(prompts);
    } catch (error) {
      console.error("Failed to fetch prompts:", error);
      toast.error("Failed to load prompts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const onAdd: SubmitHandler<PromptFormValues> = async (data) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await createPrompt(data as any, token);
      const newPrompt = response?.prompt || response;
      setPromptList((prev) => [newPrompt, ...prev]);
      toast.success("Prompt integrated successfully.");
      setOpenModal(false);
      reset();
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error?.response?.data?.error || "Registration failed");
    } finally {
      setSaving(false);
    }
  };

  const handleView = (item: Prompt) => {
    setSelectedPrompt(item);
    setEditMode(false);
    setViewModal(true);
  };

  const onUpdate: SubmitHandler<PromptFormValues> = async (data) => {
    if (!selectedPrompt) return;
    try {
      setUpdateLoading(true);
      const token = localStorage.getItem("token") || "";
      const response = await updatePrompt(selectedPrompt.id, data, token);
      toast.success("Intelligence updated.");
      setPromptList((prev) =>
        prev.map((item) =>
          item.id === selectedPrompt.id
            ? { ...item, ...response.prompt }
            : item
        )
      );
      setEditMode(false);
      setViewModal(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Update cycle failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const deletePromptNow = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("token") || "";
      await deletePrompt(deleteId, token);
      setPromptList((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success("Data purged.");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Purge failed");
    } finally {
      setDeleteModal(false);
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="py-8 space-y-12 animate-fadeIn max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white p-10 rounded-[14px] border border-slate-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-brand-primary/20">
              <Brain size={12} />
              <span>Logic Architect</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
              Intelligence <span className="text-brand-primary">Architect</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-tight max-w-xl">
              Construct and optimize the core neural logic and response protocols for your AI agents.
            </p>
          </div>
          
          <button
            onClick={() => {
              reset();
              setOpenModal(true);
            }}
            className="group relative flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-[14px] transition-all hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/10 active:scale-95 overflow-hidden"
          >
            <FiPlus className="group-hover:rotate-90 transition-transform duration-300" size={18} />
            Initialize Instruction
            <div className="absolute inset-0 bg-linear-to-r from-brand-primary to-brand-secondary opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Main Repository Section */}
      <div className="bg-white rounded-[14px] border border-slate-300 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 tracking-[0.1em] uppercase flex items-center gap-3">
             <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
             Core Logic Repository
          </h2>
          <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-xs">
            {prompts.length} Stored Blocks
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Architecture Heading</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Operations Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={2} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-brand-primary" size={32} />
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Retrieving Protocols...</p>
                    </div>
                  </td>
                </tr>
              ) : prompts.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-24 text-center">
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[14px] p-10 max-w-md mx-auto">
                      <p className="text-slate-400 font-bold text-xs">Repository empty. No intelligence protocols synchronized.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                prompts.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-all">
                           <Database size={16} />
                         </div>
                         <p className="font-black text-slate-900 text-sm tracking-tight">{item.prompt_name}</p>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => handleView(item)} 
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:border-brand-primary hover:text-brand-primary transition-all shadow-xs"
                        >
                          <FiEye size={14} />
                          Analyze
                        </button>
                        <button 
                          onClick={() => {
                            setDeleteId(item.id);
                            setDeleteModal(true);
                          }} 
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-red-400 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all shadow-xs"
                        >
                          <FiTrash2 size={14} />
                          Purge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS Component */}
      <AnimatePresence>
        {/* ADD MODAL */}
        {openModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
              onClick={() => setOpenModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-2xl rounded-[14px] border border-slate-300 shadow-2xl p-12 overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16" />
              
              <button 
                onClick={() => setOpenModal(false)}
                className="absolute top-8 right-8 p-2.5 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-lg transition-all"
              >
                <FiX size={18} />
              </button>

              <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-brand-primary/20">
                  <Cpu size={12} />
                  <span>Initialization Phase</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter mt-4">New Intelligence Protocol</h2>
              </div>

              <form onSubmit={handleSubmit(onAdd)} className="space-y-8 relative z-10 text-left">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. Phase 01: Customer Onboarding"
                    {...register("prompt_name", { required: "Identity required" })}
                    className={`w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-[14px] text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-sm shadow-inner ${errors.prompt_name ? "border-red-500" : ""}`}
                  />
                  {errors.prompt_name && <p className="text-red-500 text-[10px] font-black uppercase ml-1 tracking-wider">{errors.prompt_name.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">System Logic Hierarchy</label>
                  <textarea
                    placeholder="Describe how the agent should interpret data and formulate responses..."
                    {...register("system_prompt", { required: "Logic required" })}
                    className={`w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-[14px] text-slate-900 h-48 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-sm resize-none shadow-inner custom-scrollbar ${errors.system_prompt ? "border-red-500" : ""}`}
                  />
                  {errors.system_prompt && <p className="text-red-500 text-[10px] font-black uppercase ml-1 tracking-wider">{errors.system_prompt.message}</p>}
                </div>

                <button className="w-full relative flex items-center justify-center gap-3 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-[14px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group">
                  {saving ? <Loader2 className="animate-spin" size={20} /> : (
                    <span className="flex items-center gap-3">
                      Sync Intelligence Protocols <ChevronRight size={16} />
                    </span>
                  )}
                  <div className="absolute inset-0 bg-linear-to-r from-brand-primary to-brand-secondary opacity-0 group-hover:opacity-10 transition-opacity rounded-[14px]" />
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* VIEW/EDIT MODAL */}
        {viewModal && selectedPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
              onClick={() => setViewModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-2xl rounded-[14px] border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left"
            >
              {/* Header */}
              <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-left">
                <div className="space-y-3 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                    {editMode ? "Optimization Phase" : "Neural Analysis"}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter text-left">
                    {editMode ? "Optimize Logic" : "Protocol Details"}
                  </h2>
                </div>
                <div className="flex gap-3">
                  {!editMode && (
                    <button
                      onClick={() => {
                        setEditMode(true);
                        reset({
                          prompt_name: selectedPrompt.prompt_name,
                          system_prompt: selectedPrompt.system_prompt,
                        });
                      }}
                      className="p-3 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-brand-primary hover:border-brand-primary transition-all shadow-xs"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => setViewModal(false)}
                    className="p-3 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-all shadow-xs"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-10 overflow-y-auto custom-scrollbar flex-1 bg-white text-left">
                {!editMode ? (
                  <div className="space-y-10 text-left">
                    <div className="space-y-3 text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Identifier</p>
                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-[14px] font-black text-lg text-slate-900 tracking-tight text-left">
                        {selectedPrompt.prompt_name}
                      </div>
                    </div>
                    <div className="space-y-3 text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Neural Sequence</p>
                      <div className="p-8 bg-slate-900 rounded-[14px] text-xs font-mono text-emerald-400 leading-relaxed shadow-inner border border-slate-800 whitespace-pre-wrap text-left">
                        {selectedPrompt.system_prompt}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onUpdate)} className="space-y-8 text-left">
                    <div className="space-y-3 text-left">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Identifier</label>
                      <input
                        type="text"
                        {...register("prompt_name", { required: "Title required" })}
                        className={`w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-[14px] text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-sm shadow-inner ${errors.prompt_name ? "border-red-500" : ""}`}
                      />
                    </div>

                    <div className="space-y-3 text-left">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Logic Optimization</label>
                      <textarea
                        {...register("system_prompt", { required: "Instruction required" })}
                        className={`w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-[14px] text-slate-900 h-64 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-sm shadow-inner resize-none custom-scrollbar ${errors.system_prompt ? "border-red-500" : ""}`}
                      />
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-[14px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                      {updateLoading ? <Loader2 className="animate-spin" size={20} /> : "Commit Optimized Protocol"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteId && deleteModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 text-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setDeleteModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-sm rounded-[14px] p-10 border border-slate-300 shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-red-100">
                <FiTrash2 size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">Purge Intelligence?</h2>
              <p className="text-slate-500 font-bold text-xs mb-10 leading-relaxed uppercase tracking-wide">This will permanently remove the logic sequence from all active deployment nodes.</p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={deletePromptNow}
                  className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-[14px] hover:bg-red-700 transition-all active:scale-[0.98] shadow-lg shadow-red-600/10"
                >
                  {deleteLoading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Purge Protocol"}
                </button>
                <button
                  onClick={() => setDeleteModal(false)}
                  className="w-full py-4 bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-[14px] hover:bg-slate-100 transition-all border border-slate-200"
                >
                  Abort Action
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddPrompt;
