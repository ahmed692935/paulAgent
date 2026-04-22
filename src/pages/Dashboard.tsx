import { useEffect, useState } from "react";
import type { DailyData, RowData } from "../interfaces/dashboard";
import { Phone, Mic, X, Clock, TrendingUp, Activity, RefreshCw, Calendar, Zap } from "lucide-react";
import { motion } from "framer-motion";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  fetchCallHistory,
  getAnalyticsSummary,
} from "../api/dashboard";
import {
  fetchCallsFailure,
  fetchCallsStart,
  fetchCallsSuccess,
} from "../store/slices/dashboardSlice";
import toast from "react-hot-toast";
import type { AnalyticsSummary } from "../interfaces/dashboard";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [activeTab, setActiveTab] = useState<"transcription" | "summary">(
    "transcription"
  );
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [playingRecordingUrl, setPlayingRecordingUrl] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { calls, loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const token = useSelector(
    (state: RootState) => state.auth.user?.access_token
  );
  const pagination = useSelector(
    (state: RootState) => state.dashboard.pagination
  );

  const totalCalls = pagination?.total || 0;
  const totalPages = Math.ceil(totalCalls / pageSize);
  // const successfulCalls = pagination?.completed_calls || 0;
  // const queuedCalls = pagination?.not_completed_calls || 0;

  useEffect(() => {
    const loadHistory = async () => {
      if (token) {
        try {
          dispatch(fetchCallsStart());
          
          // Fetch both concurrently
          const [callsData, analyticsData] = await Promise.all([
            fetchCallHistory(token, currentPage, pageSize),
            getAnalyticsSummary(token)
          ]);

          dispatch(fetchCallsSuccess({ 
            calls: callsData.calls, 
            pagination: callsData.pagination 
          }));

          if (analyticsData.success) {
            setAnalytics(analyticsData.data);
          }
        } catch (err: unknown) {
          console.error("Failed to fetch dashboard data:", err);
          let errorMessage = "Failed to fetch dashboard data";
          if (err instanceof Error) errorMessage = err.message;
          dispatch(fetchCallsFailure(errorMessage));
        }
      }
    };
    loadHistory();
  }, [dispatch, token, currentPage]);

  const handleOpenModal = (row: RowData) => {
    setSelectedRow(row);
    setActiveTab("transcription");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  const handleListenRecording = (recordingUrl: string | null) => {
    if (!recordingUrl) {
      toast.error("Recording URL not available");
      return;
    }
    setPlayingRecordingUrl(recordingUrl);
    setAudioModalOpen(true);
  };

  // Helper to ensure 7 days of data for the momentum chart
  const getPaddedDailyData = (data: DailyData[] = []) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      const dayName = days[date.getDay()];
      
      const existing = data.find(d => d.date === dateString);
      result.push(existing || { date: dateString, day: dayName, calls: 0 });
    }
    return result;
  };

  const trendData = analytics?.trends?.daily_data ? getPaddedDailyData(analytics.trends.daily_data) : [];

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="p-4 bg-red-50 rounded-full text-red-500">
        <X size={40} />
      </div>
      <p className="text-red-500 font-bold text-lg">{error}</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm tracking-widest uppercase">Retry Connection</button>
    </div>
  );

  return (
    <div className="py-8 space-y-8 bg-[#f8fafc]/50 min-h-screen">
      {/* Premium Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[14px] border border-slate-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 flex items-center gap-2">
                <Activity size={12} />
                Analytics Overview
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">
                CallFlow <span className="text-brand-primary">Performance</span> Dashboard
              </h1>
              <p className="text-slate-500 font-medium tracking-tight max-w-2xl leading-relaxed">
                Unified command view for call volume trends, agent performance signals, and week-over-week momentum.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-6">
            {analytics?.comparison.vs_last_week_percent !== undefined && (
              <div className="flex items-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm animate-pulse-slow">
                <TrendingUp size={16} />
                <span className="text-xs font-black tracking-tight">
                  {analytics.comparison.vs_last_week_percent >= 0 ? '+' : ''}{analytics.comparison.vs_last_week_percent}% vs last week
                </span>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              disabled={loading}
              className="group flex items-center gap-2 px-8 py-3.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-black text-xs uppercase tracking-widest hover:border-brand-primary/50 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <RefreshCw size={18} className={`text-brand-primary ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {/* Analytics Stats Grid - 3x3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Total Calls", value: analytics?.summary?.total_calls, unit: "calls", icon: <Phone size={18} />, color: "emerald" },
          { label: "Avg Duration (sec)", value: analytics?.summary?.avg_call_duration_seconds?.toFixed(0), unit: "sec", icon: <Clock size={18} />, color: "cyan" },
          { label: "Avg Duration (min)", value: analytics?.summary?.avg_call_duration_minutes?.toFixed(2), unit: "min", icon: <Clock size={18} />, color: "cyan" },
          
          { label: "Total Talk Time (sec)", value: analytics?.summary?.total_talk_time_seconds, unit: "sec", icon: <Activity size={18} />, color: "teal" },
          { label: "Total Talk Time (min)", value: analytics?.summary?.total_talk_time_minutes?.toFixed(2), unit: "min", icon: <Activity size={18} />, color: "teal" },
          { label: "Daily Average", value: analytics?.trends?.daily_average?.toFixed(2), unit: "calls/day", icon: <Calendar size={18} />, color: "brand" },

          { label: "Peak Day", value: analytics?.trends?.peak_day, unit: "", icon: <Zap size={18} />, color: "orange" },
          { label: "Days With Calls", value: analytics?.trends?.total_days_with_calls, unit: "days", icon: <Zap size={18} />, color: "orange" },
          { label: "Weekly Growth", value: analytics?.comparison?.vs_last_week_percent, unit: "%", icon: <TrendingUp size={18} />, color: "emerald", isGrowth: true }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-8 rounded-[14px] border border-slate-300 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 group"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3.5 rounded-[14px] bg-slate-50 text-slate-500 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <h3 className="text-[11px] font-bold text-slate-400 tracking-[0.05em] uppercase">{stat.label}</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-slate-900 tracking-tighter">
                {stat.isGrowth && stat.value !== undefined ? (stat.value >= 0 ? `+${stat.value}` : stat.value) : (stat.value || "0")}
              </p>
              {stat.unit && <span className="text-sm font-bold text-slate-400 lowercase tracking-tight">{stat.unit}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid: Distribution & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Daily Call Momentum (Area Chart) */}
        <div className="bg-white p-8 rounded-[14px] border border-slate-300 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Daily Call Momentum
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rolling 7-day volume signal</p>
            </div>
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-brand-primary text-white text-[9px] font-black uppercase rounded-[14px] shadow-lg shadow-brand-primary/20">7D</span>
               <span className="px-3 py-1 text-slate-400 text-[9px] font-black uppercase cursor-not-allowed">14D</span>
               <span className="px-3 py-1 text-slate-400 text-[9px] font-black uppercase cursor-not-allowed">30D</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full mt-4">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '16px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="calls" 
                    stroke="#0ea5e9" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorCalls)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm font-bold uppercase tracking-widest">
                Analyzing momentum...
              </div>
            )}
          </div>
        </div>

        {/* Weekly Delta & Share (Bar + Donut) */}
        <div className="bg-white p-8 rounded-[14px] border border-slate-300 shadow-sm flex flex-col gap-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Weekly Delta</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Comparison with previous cycle</p>
            </div>
            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-full border border-emerald-100">
              Live Feed
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Bar Comparison */}
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: "Last Week", calls: analytics?.comparison?.last_week_calls || 0, fill: "#f1f5f9" },
                  { name: "This Week", calls: analytics?.comparison?.this_week_calls || 0, fill: "#0ea5e9" }
                ]}>
                  <XAxis dataKey="name" hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar dataKey="calls" radius={[8, 8, 8, 8]} barSize={50} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-around mt-4">
                <div className="text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Last Week</span>
                  <span className="text-sm font-black text-slate-900">{analytics?.comparison?.last_week_calls || 0}</span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">This Week</span>
                  <span className="text-sm font-black text-brand-primary">{analytics?.comparison?.this_week_calls || 0}</span>
                </div>
              </div>
            </div>

            {/* Replacement Visualization for Success Share: Avg Duration Efficiency */}
            <div className="flex flex-col items-center">
               <div className="h-[160px] w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                        data={[
                          { name: "Talk Time", value: analytics?.summary?.total_talk_time_minutes || 0 },
                          { name: "Potential", value: Math.max((analytics?.summary?.total_calls || 0) * 1 - (analytics?.summary?.total_talk_time_minutes || 0), 0) },
                        ]}
                        innerRadius={55}
                        outerRadius={75}
                        startAngle={180}
                        endAngle={0}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="#0ea5e9" />
                        <Cell fill="#f1f5f9" />
                      </Pie>
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 pointer-events-none">
                    <span className="text-2xl font-black text-slate-900">
                      {analytics?.summary?.avg_call_duration_minutes?.toFixed(1) || 0}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Avg Min/Call</span>
                 </div>
               </div>
               <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">Duration Profile</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-8 mt-auto">
             <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Total Impact</p>
                <p className="text-sm font-black text-slate-900">{analytics?.summary?.total_talk_time_minutes?.toFixed(1)} mins</p>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-brand-primary" style={{ width: '100%' }} />
                </div>
             </div>
             <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Daily Pace</p>
                <p className="text-sm font-black text-slate-900">{analytics?.trends?.daily_average?.toFixed(1)} calls</p>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-slate-300" style={{ width: `${(analytics?.trends?.daily_average || 0) / (analytics?.trends?.total_calls || 1) * 100}%` }} />
                </div>
             </div>
             <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Cycle Growth</p>
                <div className="flex items-center gap-1">
                  {analytics?.comparison?.vs_last_week_percent !== undefined && (
                    <p className={`text-sm font-black ${analytics.comparison.vs_last_week_percent >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {analytics.comparison.vs_last_week_percent >= 0 ? '+' : ''}{analytics.comparison.vs_last_week_percent}%
                    </p>
                  )}
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2" />
             </div>
          </div>
        </div>
      </div>


        {/* Table Area */}
        <div className="bg-white rounded-[14px] border border-slate-300 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {["User Info", "Agent Name", "Number", "Status", "Outcome", "Created", "Recording", "Details"].map((header) => (
                    <th key={header} className="px-10 py-8 text-left text-xs font-black text-slate-400 uppercase tracking-widest">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-24">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin" />
                        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase animate-pulse">Synchronizing Data...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  calls?.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-10 py-8">
                        <div>
                          <p className="text-sm font-black text-slate-900 tracking-tighter">{row.username || "N/A"}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{row.email || "N/A"}</p>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-xs font-bold text-slate-600 tracking-tight">{row.voice_name || "N/A"}</td>
                      <td className="px-10 py-8 text-xs font-bold text-slate-600 tracking-tight">{row.to_number || "N/A"}</td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          row.status === 'completed' || row.status === 'call_ended' || row.status === 'call_analyzed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
                        }`}>
                          {row.status?.replace('_', ' ') || 'N/A'}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          row.call_outcome_status === 'Interested' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-slate-50 text-slate-500'
                        }`}>
                          {row.call_outcome_status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-[11px] font-bold text-slate-500 tracking-tight">
                          {row.started_at ? new Date(row.started_at).toLocaleDateString() : 'N/A'} <br/>
                          <span className="text-[10px] font-medium opacity-60">
                            {row.started_at ? new Date(row.started_at).toLocaleTimeString() : ''}
                          </span>
                        </p>
                      </td>
                      <td className="px-10 py-8">
                        <button
                          onClick={() => handleListenRecording(row.recording_url)}
                          disabled={!row.recording_url}
                          className={`flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest ${
                            row.recording_url 
                            ? 'text-brand-primary hover:bg-brand-primary/10 hover:scale-105 active:scale-95' 
                            : 'text-slate-300 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <Mic size={14} className={row.recording_url ? 'animate-pulse-slow' : ''} />
                          Listen
                        </button>
                      </td>
                      <td className="px-10 py-8">
                        <button
                          onClick={() => handleOpenModal(row)}
                          className="group/btn relative px-6 py-2.5 bg-slate-900 text-white rounded-[14px] font-black text-[10px] uppercase tracking-widest transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/10 active:scale-95 overflow-hidden"
                        >
                          <span className="relative z-10">Details</span>
                          <div className="absolute inset-0 bg-linear-to-r from-brand-primary to-brand-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-auto p-10 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-white shadow-sm rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-700 disabled:opacity-30 hover:bg-slate-50 border border-slate-300 transition-all active:scale-95"
            >
              Previous
            </button>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-4">
              Page <span className="text-slate-900 text-sm font-black">{currentPage}</span> of <span className="text-slate-900 text-sm font-black">{totalPages || 1}</span>
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-6 py-3 bg-white shadow-sm rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-700 disabled:opacity-30 hover:bg-slate-50 border border-slate-300 transition-all active:scale-95"
            >
              Next
            </button>
          </div>
        </div>

      {/* Session Details Modal */}
      {openModal && selectedRow && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center p-6 text-slate-900">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={handleCloseModal}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white w-full max-w-2xl rounded-[14px] border border-slate-300 shadow-2xl overflow-hidden"
          >
            <div className="p-10 border-b border-slate-100 bg-linear-to-br from-brand-primary/5 via-transparent to-transparent">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-brand-primary/20">
                    Call Intelligence
                  </span>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Session Details</h3>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4 pt-4">
                    {[
                      { label: "Call ID", val: selectedRow.call_id },
                      { label: "Duration", val: `${selectedRow.duration?.toFixed(1) || 0}s` },
                      { label: "Agent Name", val: selectedRow.voice_name || "N/A" },
                      { label: "Timeline", val: selectedRow.started_at ? new Date(selectedRow.started_at).toLocaleString() : "N/A" },
                      { label: "From", val: selectedRow.from_number || "N/A" },
                      { label: "To", val: selectedRow.to_number || "N/A" }
                    ].map((info, i) => (
                      <div key={i} className="space-y-0.5">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{info.label}</p>
                        <p className="text-xs text-slate-700 font-medium tracking-tight truncate max-w-[200px]">{info.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={handleCloseModal} className="p-3 bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all hover:bg-slate-200 active:scale-90">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex px-10 border-b border-slate-100 bg-slate-50/30">
              {["transcription", "summary"].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-6 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? "text-brand-primary" : "text-slate-400 hover:text-slate-600"
                  }`}
                  onClick={() => setActiveTab(tab as any)}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="modalTab" className="absolute bottom-4 left-6 right-6 h-0.5 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-10 max-h-[40vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                {activeTab === "transcription" ? (
                  selectedRow.transcript?.transcript_with_tool_calls?.length ? (
                    <div className="space-y-4">
                      {selectedRow.transcript.transcript_with_tool_calls
                        .filter(item => ["assistant", "agent", "user"].includes(item.role))
                        .map((item, idx) => (
                        <div key={idx} className={`p-5 rounded-[14px] ${["assistant", "agent"].includes(item.role) ? "bg-brand-primary/5 ml-8 border border-brand-primary/10" : "bg-slate-50 mr-8 border border-slate-300"}`}>
                          <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-50 text-slate-500">
                            {["assistant", "agent"].includes(item.role) ? "Neural Agent" : "User Interaction"}
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            {Array.isArray(item.content) ? item.content.join(" ") : item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-[14px] border-dashed border-slate-300 border">
                      <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">No Neural Data Logged</p>
                    </div>
                  )
                ) : (
                  <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-6 rounded-[14px] border border-slate-300">
                    {selectedRow.summary || "No automated summary generated for this session."}
                  </p>
                )}
              </div>
            </div>

            <div className="p-10 border-t border-slate-300 bg-slate-50/30">
              <button onClick={handleCloseModal} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs rounded-[14px] transition-all shadow-xl active:scale-[0.98]">
                Close Intelligent Modal
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Audio Player Modal */}
      {audioModalOpen && playingRecordingUrl && (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={() => setAudioModalOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white w-full max-w-md rounded-[14px] border border-slate-300 shadow-2xl overflow-hidden p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-[14px]">
                  <Mic size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">Call Recording</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audio Playback</p>
                </div>
              </div>
              <button onClick={() => setAudioModalOpen(false)} className="p-2 bg-slate-100 rounded-[14px] text-slate-400 hover:text-slate-600 transition-all hover:bg-slate-200">
                <X size={16} />
              </button>
            </div>
            <div className="bg-slate-50 p-6 rounded-[14px] border border-slate-300">
               <audio src={playingRecordingUrl} controls autoPlay className="w-full accent-brand-primary">
                Your browser does not support the audio element.
              </audio>
            </div>
            <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-[0.2em] mt-6">
              Recording hosted securely via Cloudfront
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;