import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Cloud as UploadCloud, 
  Play, 
  BarChart3, 
  Users, 
  History, 
  Loader2, 
  ChevronRight,
  CheckCircle2,
  Target,
} from "lucide-react";
import type { RootState } from "../store/store";
import { 
  createCampaign, 
  listCampaigns, 
  getCampaignDetails, 
  uploadCampaignCsv, 
  runCampaign, 
  getCampaignStats,
  getRunStatus
} from "../api/Campaign";
import type { Campaign, CampaignDetail, CampaignStats, CampaignRun } from "../interfaces/campaign";

const Campaigns = () => {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [details, setDetails] = useState<CampaignDetail | null>(null);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  
  // Forms
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [batchSize, setBatchSize] = useState(15);
  const [activeRun, setActiveRun] = useState<CampaignRun | null>(null);

  const token = useSelector(
    (state: RootState) => state.auth.token ?? state.auth.user?.access_token ?? null
  );

  const fetchCampaigns = useCallback(async () => {
    if (!token) return;
    try {
      const data = await listCampaigns(token);
      setCampaigns(data);
    } catch (err) {
      toast.error("Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Handle auto-name from other pages
  useEffect(() => {
    const autoName = localStorage.getItem("campaign_auto_name");
    if (autoName) {
      setNewName(autoName);
      setIsCreating(true);
      localStorage.removeItem("campaign_auto_name");
    }
  }, []);

  // Polling for active run
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (activeRun && (activeRun.status === "running" || activeRun.status === "queued")) {
      interval = setInterval(async () => {
        try {
          if (!token) return;
          const updatedRun = await getRunStatus(activeRun.id, token);
          setActiveRun(updatedRun);
          
          // Also refresh stats when status changes or progress made
          if (selectedId) {
            const s = await getCampaignStats(selectedId, token);
            setStats(s);
          }
          
          if (updatedRun.status === "completed" || updatedRun.status === "failed") {
            clearInterval(interval);
            toast.success(`Operational run ${updatedRun.status}`);
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeRun, token, selectedId]);

  const fetchDetails = async (id: number) => {
    if (!token) return;
    try {
      const [d, s] = await Promise.all([
        getCampaignDetails(id, token),
        getCampaignStats(id, token)
      ]);
      setDetails(d);
      setStats(s);
    } catch (err) {
      toast.error("Error loading campaign details");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newName) return;
    try {
      await createCampaign({ name: newName, description: newDesc }, token);
      toast.success("Campaign created");
      setNewName("");
      setNewDesc("");
      setIsCreating(false);
      fetchCampaigns();
    } catch (err) {
      toast.error("Creation failed");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token || !selectedId) return;
    
    setIsUploading(true);
    try {
      const res = await uploadCampaignCsv(selectedId, file, token);
      toast.success(`Uploaded ${res.uploaded_rows} numbers`);
      fetchDetails(selectedId);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRun = async () => {
    if (!token || !selectedId) return;
    setIsRunning(true);
    try {
      const run = await runCampaign(selectedId, batchSize, token);
      toast.success("Campaign run initiated");
      setActiveRun(run);
    } catch (err) {
      toast.error("Failed to start run");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="py-8 space-y-12 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-10 rounded-[14px] border border-slate-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-brand-primary/20">
              <Target size={12} />
              <span>Calling Campaigns</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
              Campaign <span className="text-brand-primary">Control</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-tight max-w-xl">
              Initialize and manage high-volume calling campaigns across the network.
            </p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="group relative flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-[14px] transition-all hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/10 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus size={18} />
              New Campaign
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-brand-primary to-brand-secondary opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Campaign List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 bg-white rounded-[14px] border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Archive</h3>
               <div className="h-1 w-12 bg-slate-100 rounded-full" />
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 gap-4">
                <Loader2 className="animate-spin text-brand-primary" size={32} />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Loading...</p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-[14px] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-xs">No campaigns active.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((c) => (
                  <motion.button
                    key={c.id}
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      setSelectedId(c.id);
                      fetchDetails(c.id);
                    }}
                    className={`w-full flex items-center justify-between p-5 rounded-[14px] transition-all border ${
                      selectedId === c.id 
                        ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10" 
                        : "bg-white border-slate-300 text-slate-600 hover:border-brand-primary hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="text-left">
                      <p className={`font-black text-sm tracking-tight mb-1 ${selectedId === c.id ? 'text-white' : 'text-slate-900'}`}>{c.name}</p>
                      <p className={`text-[10px] uppercase font-bold tracking-widest ${selectedId === c.id ? 'text-white/50' : 'text-slate-400'}`}>
                        Deployed: {new Date(c.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight size={16} className={selectedId === c.id ? "text-brand-primary" : "text-slate-300"} />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Campaign Details & Actions */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedId ? (
              <motion.div
                key={selectedId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Total Numbers", value: stats?.total_contacts ?? details?.total_contacts ?? "0", icon: <Users size={20} />, color: "text-brand-primary", bg: "bg-brand-primary/5" },
                    { label: "Completed Calls", value: stats?.call_stats.completed_calls ?? "0", icon: <CheckCircle2 size={20} />, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Failed Calls", value: stats?.call_stats.total_calls ?? "0", icon: <History size={20} />, color: "text-slate-400", bg: "bg-slate-50" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[14px] p-8 border border-slate-300 shadow-sm flex flex-col items-center text-center group hover:border-brand-primary transition-all">
                      <div className={`w-14 h-14 rounded-[14px] ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        {stat.icon}
                      </div>
                      <h4 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{stat.value}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Operations Panel */}
                <div className="bg-white rounded-[14px] p-10 md:p-14 border border-slate-300 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16" />
                  
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-10 flex items-center gap-4 relative z-10">
                    <div className="w-1.5 h-8 bg-brand-primary rounded-full" />
                    Campaign Operation: <span className="text-brand-primary uppercase">{details?.campaign.name}</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                    {/* CSV Upload */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-slate-900">
                        <UploadCloud size={20} className="text-brand-primary" />
                        <h4 className="font-black text-xs uppercase tracking-widest">Upload Contacts CSV</h4>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">Upload your contact array with this campaign node via CSV.</p>
                      <label className={`group relative cursor-pointer w-full h-40 bg-slate-50 border-2 border-dashed rounded-[14px] flex flex-col items-center justify-center transition-all ${isUploading ? "border-brand-primary bg-brand-primary/5" : "border-slate-300 hover:border-brand-primary/50 hover:bg-white"}`}>
                        {isUploading ? (
                          <Loader2 className="animate-spin text-brand-primary" size={32} />
                        ) : (
                          <div className="flex flex-col items-center">
                            <UploadCloud className="text-slate-300 group-hover:text-brand-primary transition-colors mb-3" size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Upload Contact csv</span>
                          </div>
                        )}
                        <input type="file" accept=".csv" onChange={handleUpload} disabled={isUploading} className="hidden" />
                      </label>
                    </div>

                    {/* Batch Execution */}
                    <div className="space-y-6">
                      {/* <div className="flex items-center gap-3 text-slate-900">
                        <Play size={20} className="text-brand-primary" />
                        <h4 className="font-black text-xs uppercase tracking-widest">Protocol 02: Neural Launch</h4>
                      </div> */}
                      <div className="space-y-6">
                         <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Batch Intensity</label>
                          <input 
                            type="number"
                            value={batchSize}
                            onChange={(e) => setBatchSize(parseInt(e.target.value))}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-[14px] text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-black text-base shadow-inner"
                          />
                        </div>
                        <button 
                          onClick={handleRun}
                          disabled={isRunning || (details?.total_contacts ?? 0) === 0}
                          className="group relative w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-[14px] transition-all hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/20 disabled:opacity-30 active:scale-95 overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {isRunning ? <Loader2 className="animate-spin" /> : <>Initiate Call <ChevronRight size={16} /></>}
                          </span>
                          <div className="absolute inset-0 bg-linear-to-r from-brand-primary to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {activeRun && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-12 p-8 bg-slate-50 border border-slate-300 rounded-[14px] space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            {(activeRun.status === "running" || activeRun.status === "queued") ? (
                              <div className="w-14 h-14 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin" />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 size={24} />
                              </div>
                            )}
                            <Play size={14} className="absolute inset-0 m-auto text-brand-primary z-10 opacity-50" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1">Sequence ID: {activeRun.id}</p>
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                              <p className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">{activeRun.status}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
                           <p className="text-2xl font-black text-slate-900 tracking-tighter">
                             {activeRun.processed_contacts} <span className="text-slate-300">/</span> {activeRun.total_contacts}
                           </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(activeRun.processed_contacts / activeRun.total_contacts) * 100}%` }}
                            className="h-full bg-linear-to-r from-brand-primary to-brand-secondary shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                          <span className="text-slate-400">Deployed: <span className="text-slate-900">{activeRun.initiated_calls}</span></span>
                          <span className="text-slate-400">Offline: <span className="text-red-500">{activeRun.failed_calls}</span></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="h-[600px] bg-white rounded-[14px] border border-slate-300 shadow-sm flex flex-col items-center justify-center text-center p-14 group"
              >
                <div className="w-32 h-32 rounded-full bg-slate-50 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700">
                  <BarChart3 size={48} className="text-slate-200" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Select a Campaign</h3>
                <p className="text-slate-500 font-medium max-w-sm leading-relaxed">Select a campaign from the archive to synchronize your campaign command and monitor campaign progress.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
              onClick={() => setIsCreating(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white w-full max-w-md rounded-[14px] p-12 border border-slate-300 shadow-2xl"
            >
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                  <Plus size={32} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-8 text-center">Create Campaign</h2>
              <form onSubmit={handleCreate} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Name</label>
                  <input 
                    required 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-[14px] text-slate-900 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold" 
                    placeholder="E.g. Campaign Name"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Description</label>
                  <textarea 
                    value={newDesc} 
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-[14px] text-slate-900 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all h-32 resize-none font-medium" 
                    placeholder="Brief campaign description..."
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-[14px] hover:bg-slate-200 transition-all">Abort</button>
                  <button type="submit" className="flex-1 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-[14px] hover:bg-slate-800 transition-all shadow-xl">Initialize Campaign</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Campaigns;
