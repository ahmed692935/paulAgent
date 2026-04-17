import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiEye, FiTrash2, FiX } from "react-icons/fi";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createPrompt, getAllPrompt, updatePrompt, deletePrompt } from "../api/Call";
import type { Prompt, PromptFormValues } from "../interfaces/callForm";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="py-8 space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            Intelligence <span className="text-brand-primary">Architect</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-tight">Configure the neural logic for your AI agents.</p>
        </div>
        <button
          onClick={() => {
            reset();
            setOpenModal(true);
          }}
          className="group flex items-center gap-2 px-8 py-4 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary/90 transition-all shadow-[0_20px_40px_rgba(14,165,233,0.2)] active:scale-95"
        >
          <FiPlus className="group-hover:rotate-90 transition-transform duration-300" />
          Initialize New Prompt
        </button>
      </div>

      {/* Table Section */}
      <div className="glass rounded-[3rem] border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.01]">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-primary" />
            Active Repository
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.02]">
              <tr>
                <th className="px-10 py-6 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Logic Heading</th>
                <th className="px-10 py-6 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">Control Center</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} className="py-24">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : prompts.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-24 text-center">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest opacity-50 italic">No intelligence schemas found.</p>
                  </td>
                </tr>
              ) : (
                prompts.map((item) => (
                  <tr key={item.id} className="group border-t border-white/5 hover:bg-white/[0.02] transition-colors duration-300">
                    <td className="px-10 py-6 text-sm font-bold text-white tracking-tight">{item.prompt_name}</td>
                    <td className="px-10 py-6">
                      <div className="flex items-center justify-center gap-4">
                        <button 
                          onClick={() => handleView(item)} 
                          className="p-3 glass rounded-xl text-brand-primary hover:bg-brand-primary/20 hover:text-white transition-all border border-white/5"
                          title="View Intelligence"
                        >
                          <FiEye size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setDeleteId(item.id);
                            setDeleteModal(true);
                          }} 
                          className="p-3 glass rounded-xl text-brand-accent hover:bg-brand-accent/20 hover:text-white transition-all border border-white/5"
                          title="Purge Schema"
                        >
                          <FiTrash2 size={18} />
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark-bg/80 backdrop-blur-xl" 
              onClick={() => setOpenModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative glass w-full max-w-2xl rounded-[3.5rem] border border-white/10 shadow-2xl p-10 md:p-14"
            >
              <button 
                onClick={() => setOpenModal(false)}
                className="absolute top-8 right-8 p-3 glass rounded-2xl text-white/50 hover:text-white transition-all"
              >
                <FiX size={20} />
              </button>

              <div className="mb-10">
                <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">New Logic</span>
                <h2 className="text-3xl font-black text-white tracking-tighter mt-4">Initialize Intelligence</h2>
              </div>

              <form onSubmit={handleSubmit(onAdd)} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Schema Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Sales Assistant v2"
                    {...register("prompt_name", { required: "Identity required" })}
                    className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-white focus:border-brand-primary/30 outline-none transition-all font-medium text-sm"
                  />
                  {errors.prompt_name && <p className="text-brand-accent text-[10px] font-bold uppercase ml-4 mt-1 tracking-wider">{errors.prompt_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">System Instruction</label>
                  <textarea
                    placeholder="Describe how the agent should think and react..."
                    {...register("system_prompt", { required: "Logic required" })}
                    className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-[2rem] text-white h-48 focus:border-brand-primary/30 outline-none transition-all font-medium text-sm resize-none custom-scrollbar"
                  />
                  {errors.system_prompt && <p className="text-brand-accent text-[10px] font-bold uppercase ml-4 mt-1 tracking-wider">{errors.system_prompt.message}</p>}
                </div>

                <button className="w-full flex items-center justify-center gap-3 py-4 bg-brand-primary text-white font-black uppercase tracking-widest text-xs rounded-[1.5rem] hover:bg-brand-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(14,165,233,0.2)] disabled:opacity-50">
                  {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Deploy Intelligence"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* VIEW/EDIT MODAL */}
        {viewModal && selectedPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark-bg/80 backdrop-blur-xl" 
              onClick={() => setViewModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative glass w-full max-w-2xl rounded-[3.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-10 md:p-14 border-b border-white/5 bg-gradient-to-br from-brand-primary/10 via-transparent to-transparent flex justify-between items-start">
                <div className="space-y-4">
                  <span className="px-3 py-1 bg-brand-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    {editMode ? "Optimization" : "Neural Analysis"}
                  </span>
                  <h2 className="text-3xl font-black text-white tracking-tighter">
                    {editMode ? "Optimize Schema" : "Schema Details"}
                  </h2>
                </div>
                <div className="flex gap-2">
                  {!editMode && (
                    <button
                      onClick={() => {
                        setEditMode(true);
                        reset({
                          prompt_name: selectedPrompt.prompt_name,
                          system_prompt: selectedPrompt.system_prompt,
                        });
                      }}
                      className="p-3 glass rounded-2xl text-brand-primary hover:bg-brand-primary/10 transition-all active:scale-90"
                    >
                      <FiEdit2 size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => setViewModal(false)}
                    className="p-3 glass rounded-2xl text-white/50 hover:text-white transition-all active:scale-90"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar flex-1">
                {!editMode ? (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Logic Title</p>
                      <p className="text-xl font-bold text-white tracking-tight">{selectedPrompt.prompt_name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Neural Protocol</p>
                      <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] text-sm text-gray-300 leading-relaxed font-medium">
                        {selectedPrompt.system_prompt}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onUpdate)} className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Schema Heading</label>
                      <input
                        type="text"
                        {...register("prompt_name", { required: "Title required" })}
                        className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-white focus:border-brand-primary/30 outline-none transition-all font-medium text-sm"
                      />
                      {errors.prompt_name && <p className="text-brand-accent text-[10px] font-bold uppercase ml-4 mt-1 tracking-wider">{errors.prompt_name.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">System Protocol</label>
                      <textarea
                        {...register("system_prompt", { required: "Instruction required" })}
                        className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-[2rem] text-white h-64 focus:border-brand-primary/30 outline-none transition-all font-medium text-sm resize-none custom-scrollbar"
                      />
                      {errors.system_prompt && <p className="text-brand-accent text-[10px] font-bold uppercase ml-4 mt-1 tracking-wider">{errors.system_prompt.message}</p>}
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 py-4 bg-brand-primary text-white font-black uppercase tracking-widest text-xs rounded-[1.5rem] hover:bg-brand-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(14,165,233,0.2)]">
                      {updateLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Commit Changes"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteId && deleteModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark-bg/90 backdrop-blur-2xl" 
              onClick={() => setDeleteModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative glass w-full max-w-sm rounded-[3rem] p-10 border border-brand-accent/20 text-center"
            >
              <div className="w-16 h-16 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <FiTrash2 size={28} />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tighter mb-4">Purge Schema?</h2>
              <p className="text-gray-400 font-medium text-sm mb-8">This will permanently remove the intelligence protocols from the active repository.</p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={deletePromptNow}
                  className="w-full py-4 bg-brand-accent text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-brand-accent/90 transition-all active:scale-[0.98] shadow-[0_10px_30px_rgba(244,63,94,0.2)] flex items-center justify-center"
                >
                  {deleteLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Confirm Purge"}
                </button>
                <button
                  onClick={() => setDeleteModal(false)}
                  className="w-full py-4 glass text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/5 transition-all"
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
