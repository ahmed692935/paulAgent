import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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
    <div className="max-w-4xl mx-auto py-12 px-6 animate-fadeIn">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
          Data <span className="text-brand-primary">Import</span>
        </h1>
        <p className="text-gray-400 font-medium tracking-tight max-w-lg mx-auto">
          Synchronize your audience data. Upload CSV or Excel files to initialize AI communication protocols.
        </p>
      </div>

      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative glass rounded-[3.5rem] p-12 md:p-20 border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center text-center ${
          dragActive ? "border-brand-primary bg-brand-primary/5 scale-[1.02]" : "border-white/10 hover:border-white/20"
        }`}
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${
          dragActive ? "bg-brand-primary text-white scale-110 shadow-[0_0_50px_rgba(14,165,233,0.3)]" : "bg-white/5 text-gray-500"
        }`}>
          {loading ? (
            <Loader2 size={40} className="animate-spin text-brand-primary" />
          ) : (
            <UploadCloud size={40} />
          )}
        </div>

        <div className="space-y-4 mb-10 w-full max-w-sm">
          <h2 className="text-2xl font-black text-white tracking-tight">
            {dragActive ? "Ready for Import" : "Select Data Source"}
          </h2>
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Campaign Name (Optional)</label>
            <input 
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="E.g. Q2 Outreach Campaign"
              className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-white focus:border-brand-primary outline-none transition-all font-medium text-sm"
            />
          </div>
          <p className="text-gray-500 font-medium text-sm">
            Drag and drop your file here, or click to browse.
          </p>
        </div>

        <label className="group relative cursor-pointer px-10 py-4 bg-brand-primary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-brand-primary/90 transition-all active:scale-95 shadow-[0_20px_40px_rgba(14,165,233,0.2)]">
          Browse Directory
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Specs */}
        <div className="mt-12 flex items-center gap-6 justify-center">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <CheckCircle2 size={14} className="text-brand-primary" />
            CSV supported
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <CheckCircle2 size={14} className="text-brand-primary" />
            Excel supported
          </div>
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark-bg/60 backdrop-blur-md rounded-[3.5rem] flex flex-col items-center justify-center z-10"
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                <FileText size={24} className="absolute inset-0 m-auto text-brand-primary animate-pulse" />
              </div>
              <p className="mt-6 text-white font-black uppercase tracking-widest text-[10px]">Processing Node Data...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pro Tip */}
      <div className="mt-10 flex items-center gap-4 p-6 glass rounded-[2rem] border border-white/5 max-w-md mx-auto">
        <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center shrink-0">
          <AlertCircle size={20} />
        </div>
        <p className="text-xs text-gray-400 font-medium italic">
          Tip: Ensure your CSV has headers like <span className="text-white font-bold">name</span> and <span className="text-white font-bold">phone</span> for optimal mapping.
        </p>
      </div>
    </div>
  );
}

export default UploadCsv;
