import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { getAgentVoice, setRetellAgentVoice } from "../api/Voice";
import toast from "react-hot-toast";
import { Mic, Volume2, Loader2, Headphones, CheckCircle2, PlayCircle } from "lucide-react";
import type { AxiosError } from "axios";
import type { RetellVoiceListItem } from "../interfaces/callForm";

function AgentVoice() {
  const token = useSelector(
    (s: RootState) => s.auth.token ?? s.auth.user?.access_token ?? null
  );
  const [loadingVoices, setLoadingVoices] = useState(true);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [currentVoiceId, setCurrentVoiceId] = useState<string>("");
  const [voices, setVoices] = useState<RetellVoiceListItem[]>([]);

  const fetchVoices = async () => {
    if (!token) {
      toast.error("Missing authentication.");
      setLoadingVoices(false);
      return;
    }
    setLoadingVoices(true);
    try {
      const res = await getAgentVoice(token);
      setVoices(res.voices || []);
      setCurrentVoiceId(res.current_voice_id || "");
    } catch (error: unknown) {
      const ax = error as AxiosError<{ detail?: string; error?: string }>;
      toast.error(
        ax.response?.data?.detail ||
          ax.response?.data?.error ||
          "Could not load Retell voices."
      );
    } finally {
      setLoadingVoices(false);
    }
  };

  useEffect(() => {
    fetchVoices();
  }, [token]);

  const currentVoiceName =
    voices.find((v) => v.voice_id === currentVoiceId)?.voice_name ?? null;

  const handleSetVoice = async (voice_id: string) => {
    if (!token) return;
    setSettingId(voice_id);
    try {
      await setRetellAgentVoice(voice_id, token);
      setCurrentVoiceId(voice_id);
      toast.success("Active voice updated.");
      await fetchVoices();
    } catch (error: unknown) {
      const ax = error as AxiosError<{ detail?: string; error?: string }>;
      toast.error(
        ax.response?.data?.detail ||
          ax.response?.data?.error ||
          "Could not set voice."
      );
    } finally {
      setSettingId(null);
    }
  };

  const filteredVoices = voices.filter(
    (v) =>
      v.gender?.toLowerCase() === "male" && v.accent?.toLowerCase() === "american"
  );

  return (
    <div className="py-8 space-y-12 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-white p-10 rounded-[14px] border border-slate-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-brand-primary/20">
              <Mic size={12} />
              <span>Agents</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
              Agents <span className="text-brand-primary">Voice</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-tight max-w-xl">
              Configure the auditory experience for your customers. Showing exclusively American voice models.
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3 translate-y-2">
            {currentVoiceId ? (
              <div className="bg-slate-50 border border-slate-200 rounded-[14px] p-4 pr-6 flex items-center gap-4 shadow-sm group hover:border-brand-primary transition-all">
                <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center animate-pulse border border-brand-primary/20 shadow-inner">
                  <Headphones size={20} />
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Voice Profile</p>
                   <p className="text-lg font-black text-slate-900 tracking-tight">{currentVoiceName ?? currentVoiceId}</p>
                </div>
              </div>
            ) : (
                <div className="text-xs font-black text-slate-300 uppercase tracking-widest bg-slate-50 border border-slate-200 rounded-[14px] px-6 py-4 border-dashed">
                  No Voice Synchronized
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Repository Section */}
      <div className="bg-white rounded-[14px] border border-slate-300 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 tracking-widest uppercase flex items-center gap-3">
             <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
             Agents Voice Models
          </h2>
          <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-xs">
            {filteredVoices.length} Compatible Models
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Agents</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Voices Preview</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loadingVoices ? (
                <tr>
                  <td colSpan={3} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-brand-primary" size={32} />
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Retrieving Neural Samples...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredVoices.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-24 text-center">
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[14px] p-10 max-w-md mx-auto">
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-wide">No American male voice models found in repository.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVoices.map((v) => {
                  const active = v.voice_id === currentVoiceId;
                  return (
                    <tr
                      key={v.voice_id}
                      className={`group transition-all duration-300 ${
                        active ? "bg-brand-primary/5" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${active ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/10" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-sm"}`}>
                             <p className="font-black text-xs uppercase">{v.voice_name.charAt(0)}</p>
                           </div>
                           <div>
                              <p className="font-black text-slate-900 text-sm tracking-tight">{v.voice_name}</p>
                              {v.accent && (
                                <span className="flex items-center gap-1.5 text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">
                                  {v.accent} <span className="w-1 h-1 rounded-full bg-slate-200" /> Male
                                </span>
                              )}
                           </div>
                        </div>
                      </td>
                     
                      <td className="px-10 py-6 text-center">
                        <div className="flex justify-center">
                          {v.preview_audio_url ? (
                            <div className="relative group/audio max-w-[240px] w-full">
                              <audio
                                controls
                                className="h-8 w-full opacity-0 absolute top-0 left-0 z-20 cursor-pointer"
                                src={v.preview_audio_url}
                                preload="none"
                              />
                              <div className="bg-slate-50 border border-slate-300 rounded-[14px] px-4 py-2 flex items-center gap-3 group-hover/audio:border-brand-primary transition-all relative z-10 shadow-inner group-hover/audio:bg-white">
                                <PlayCircle className="text-brand-primary/60 group-hover/audio:text-brand-primary transition-colors" size={16} />
                                <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="w-1/3 h-full bg-brand-primary/30 group-hover/audio:bg-brand-primary/50 transition-all" />
                                </div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sample</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">— No Sample —</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-10 py-6 text-center">
                        <div className="flex justify-center">
                          {active ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-lg border border-brand-primary/20">
                              <CheckCircle2 size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Current Active</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetVoice(v.voice_id)}
                              disabled={settingId !== null}
                              className="group/btn relative flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all shadow-md active:scale-95 disabled:opacity-50 overflow-hidden"
                            >
                              {settingId === v.voice_id ? (
                                <Loader2 className="animate-spin" size={14} />
                              ) : (
                                <Volume2 size={14} />
                              )}
                              <span>Deploy Voice</span>
                              <div className="absolute inset-0 bg-linear-to-r from-brand-primary to-brand-secondary opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Information Alert */}
      {/* <div className="bg-slate-50 rounded-[14px] border border-slate-200 p-6 flex items-start gap-4 max-w-2xl">
         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
           <Info className="text-slate-400" size={20} />
         </div>
         <div className="space-y-1">
           <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Acoustic Optimization Note</p>
           <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
             Only high-performance American male voices are currently listed to ensure consistency across active campaign nodes. For additional voice architectures, please contact system administration.
           </p>
         </div>
      </div> */}
    </div>
  );
}

export default AgentVoice;
