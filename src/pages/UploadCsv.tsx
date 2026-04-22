import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Database, ArrowRight, ShieldCheck } from "lucide-react";
import { createCampaign, uploadCampaignCsv } from "../api/Campaign";

function UploadCsv() {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  const processFile = async (file: File) => {
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.endsWith(".csv") &&
      !file.name.endsWith(".xls") &&
      !file.name.endsWith(".xlsx")
    ) {
      toast.error("Invalid format. Please upload CSV or Excel.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create a campaign
      const name = campaignName.trim() || `Import - ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const campaign = await createCampaign({ name, description: `Imported via Data Import on ${new Date().toLocaleString()}` }, token);
      
      // 2. Upload CSV to that campaign
      const res = await uploadCampaignCsv(campaign.id, file, token);
      
      toast.success(`Campaign initialized with ${res.uploaded_rows} records.`);
      navigate("/campaigns");
    } catch (error) {
      console.error(error);
      toast.error("Data transmission failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-fadeIn">
      {/* Header Section */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-primary/20 mx-auto">
          <Database size={12} />
          <span>Audience Synchronization</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
          Data <span className="text-brand-primary">Import</span>
        </h1>
        <p className="text-slate-500 font-medium tracking-tight max-w-xl mx-auto leading-relaxed">
          Ingest your audience repository into our neural network. Initialize communication protocols with structured CSV or Excel assets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Main Upload Zone */}
        <div className="lg:col-span-8">
          <motion.div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative bg-white rounded-[14px] p-12 md:p-20 border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${
              dragActive ? "border-brand-primary bg-brand-primary/5 scale-[0.99]" : "border-slate-300 hover:border-brand-primary/50 group/zone"
            }`}
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${
              dragActive ? "bg-brand-primary text-white scale-110 shadow-2xl shadow-brand-primary/20" : "bg-slate-50 text-slate-400 group-hover/zone:scale-110 group-hover/zone:bg-white group-hover/zone:shadow-sm"
            }`}>
              {loading ? (
                <Loader2 size={40} className="animate-spin text-brand-primary" />
              ) : (
                <UploadCloud size={40} className={dragActive ? "text-white" : "group-hover/zone:text-brand-primary transition-colors"} />
              )}
            </div>

            <div className="space-y-4 mb-10 w-full max-w-sm">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {dragActive ? "Release to Sync" : "Deploy Data Asset"}
              </h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">
                {dragActive ? "Commencing Data Transfer..." : "Drag and drop your audience file here, or use the manual browser below."}
              </p>
            </div>

            <label className="group relative cursor-pointer px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-[14px] hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10 flex items-center gap-3 overflow-hidden">
               <span className="relative z-10 flex items-center gap-3">
                 Browse Local Storage <ArrowRight size={16} />
               </span>
               <div className="absolute inset-0 bg-linear-to-r from-brand-primary to-brand-secondary opacity-0 group-hover:opacity-10 transition-opacity" />
              <input
                type="file"
                accept=".csv, .xls, .xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Form Phase Overlay (Loading) */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-[14px] flex flex-col items-center justify-center z-10"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin" />
                    <Database size={28} className="absolute inset-0 m-auto text-brand-primary animate-pulse" />
                  </div>
                  <div className="mt-8 text-center space-y-2">
                    <p className="text-slate-900 font-black uppercase tracking-[0.2em] text-xs">Node Transmission</p>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Syncing audience clusters...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Configuration Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-[14px] border border-slate-300 p-8 shadow-sm text-left">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <ShieldCheck className="text-brand-primary" size={14} />
                Asset Logic
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Identifier</label>
                  <input 
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="E.g. Q2 Outreach Alpha"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[14px] text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-sm shadow-inner"
                  />
                  <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed ml-1 italic opacity-70">Optional: Used to label the imported audience cluster.</p>
                </div>
              </div>
           </div>

           {/* Specs Card */}
           <div className="bg-slate-900 rounded-[14px] p-8 shadow-xl text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 relative z-10">Validation Protocols</h3>
              <div className="space-y-5 relative z-10">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={12} />
                  </div>
                  CSV format (UTF-8)
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={12} />
                  </div>
                  Excel (XLS/XLSX)
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <ShieldCheck size={12} />
                  </div>
                  Encryption Active
                </div>
              </div>
           </div>

           {/* Pro Tip */}
           <div className="bg-brand-primary/5 rounded-[14px] border border-brand-primary/20 p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white text-brand-primary flex items-center justify-center shadow-sm border border-brand-primary/10 shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Optimization Tip</p>
                <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                  Ensure headers like <span className="text-slate-900 font-black">name</span> and <span className="text-slate-900 font-black">phone</span> exist for automated mapping.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default UploadCsv;
