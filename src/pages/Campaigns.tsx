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
    <div className="py-8 space-y-12 animate-fadeIn max-w-6xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
            Mission <span className="text-brand-primary">Control</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-tight">
            Manage your communication campaigns and batch operations.
          </p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-primary/90 transition-all shadow-[0_15px_30px_rgba(14,165,233,0.2)]"
        >
          <Plus size={18} />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Campaign List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 glass rounded-[2rem] border border-white/5 bg-white/[0.02]">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6">Active Campaigns</h3>
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-primary" /></div>
            ) : campaigns.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-8">No campaigns found.</p>
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
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                      selectedId === c.id 
                        ? "bg-brand-primary/10 border border-brand-primary/30 text-white" 
                        : "bg-white/5 border border-transparent text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-bold text-sm truncate">{c.name}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                    <ChevronRight size={16} className={selectedId === c.id ? "text-brand-primary" : "text-gray-600"} />
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
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass rounded-[2rem] p-6 border border-white/5 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
                      <Users size={20} />
                    </div>
                    <p className="text-2xl font-black text-white">{details?.total_contacts ?? "0"}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Total Contacts</p>
                  </div>
                  <div className="glass rounded-[2rem] p-6 border border-white/5 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                      <CheckCircle2 size={20} />
                    </div>
                    <p className="text-2xl font-black text-white">{stats?.call_stats.completed ?? "0"}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Completed</p>
                  </div>
                  <div className="glass rounded-[2rem] p-6 border border-white/5 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center mb-4">
                      <History size={20} />
                    </div>
                    <p className="text-2xl font-black text-white">{stats?.call_stats.total ?? "0"}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Total Run</p>
                  </div>
                </div>

                {/* Operations Card */}
                <div className="glass rounded-[3.5rem] p-10 border border-white/5 bg-white/[0.01]">
                  <h3 className="text-xl font-black text-white tracking-tighter mb-8 flex items-center gap-3">
                    Mission Operation: <span className="text-brand-primary">{details?.campaign.name}</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* CSV Upload */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-brand-primary">
                        <UploadCloud size={20} />
                        <h4 className="font-bold text-sm uppercase tracking-widest">Data Ingestion</h4>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">Upload your contact list to sync with this campaign node.</p>
                      <label className={`group relative cursor-pointer w-full h-32 glass border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${isUploading ? "border-brand-primary opacity-50" : "border-white/10 hover:border-brand-primary/50"}`}>
                        {isUploading ? <Loader2 className="animate-spin text-brand-primary" /> : <UploadCloud className="text-gray-600 group-hover:text-brand-primary transition-colors" />}
                        <span className="text-[10px] font-black uppercase tracking-widest mt-2 text-gray-500 group-hover:text-white transition-colors">Select CSV</span>
                        <input type="file" accept=".csv" onChange={handleUpload} disabled={isUploading} className="hidden" />
                      </label>
                    </div>

                    {/* Batch Execution */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-brand-secondary">
                        <Play size={20} />
                        <h4 className="font-bold text-sm uppercase tracking-widest">Neural Deployment</h4>
                      </div>
                      <div className="space-y-4">
                         <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Batch Intensity</label>
                          <input 
                            type="number"
                            value={batchSize}
                            onChange={(e) => setBatchSize(parseInt(e.target.value))}
                            className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-white focus:border-brand-primary/30 outline-none transition-all font-medium text-sm"
                          />
                        </div>
                        <button 
                          onClick={handleRun}
                          disabled={isRunning || (details?.total_contacts ?? 0) === 0}
                          className="w-full flex items-center justify-center gap-3 py-4 bg-brand-primary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-brand-primary/90 transition-all shadow-[0_20px_40px_rgba(14,165,233,0.2)] disabled:opacity-30"
                        >
                          {isRunning ? <Loader2 className="animate-spin" /> : <>Initiate Batch Run <ChevronRight size={14} /></>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {activeRun && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10 p-8 glass border border-brand-primary/20 bg-brand-primary/5 rounded-[2.5rem] space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {(activeRun.status === "running" || activeRun.status === "queued") ? (
                              <>
                                <div className="w-10 h-10 rounded-full border-2 border-brand-primary/20 border-t-brand-primary animate-spin" />
                                <Play size={12} className="absolute inset-0 m-auto text-brand-primary" />
                              </>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                <CheckCircle2 size={20} className="text-brand-primary" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-black text-brand-primary uppercase tracking-widest">Run ID: {activeRun.id}</p>
                            <p className="text-sm font-medium text-white uppercase tracking-widest">{activeRun.status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Progress</p>
                           <p className="text-lg font-black text-white">{activeRun.processed_contacts} / {activeRun.total_contacts}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(activeRun.processed_contacts / activeRun.total_contacts) * 100}%` }}
                            className="h-full bg-brand-primary shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                          <span>Initiated: <span className="text-white">{activeRun.initiated_calls}</span></span>
                          <span>Failed: <span className="text-brand-accent">{activeRun.failed_calls}</span></span>
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
                className="h-full min-h-[400px] glass rounded-[3.5rem] border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8">
                  <BarChart3 size={40} className="text-gray-600" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tighter mb-4">Select Campaign</h3>
                <p className="text-gray-500 font-medium max-w-sm">Choose a campaign node from the sidebar to initialize operations and monitor mission progress.</p>
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
              className="absolute inset-0 bg-dark-bg/80 backdrop-blur-xl" 
              onClick={() => setIsCreating(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative glass w-full max-w-lg rounded-[3.5rem] p-10 border border-white/10 shadow-2xl"
            >
              <h2 className="text-3xl font-black text-white tracking-tighter mb-8 text-center">New Campaign</h2>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Campaign Name</label>
                  <input 
                    required 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-white outline-none focus:border-brand-primary" 
                    placeholder="E.g. Summer Outreach 2024"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Strategic Description</label>
                  <textarea 
                    value={newDesc} 
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-white outline-none focus:border-brand-primary h-32 resize-none" 
                    placeholder="Optional details..."
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-4 glass text-gray-400 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:text-white transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-brand-primary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-brand-primary/90 transition-all shadow-lg">Initialize Node</button>
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
