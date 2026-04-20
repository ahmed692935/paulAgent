import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { getAgentVoice, setRetellAgentVoice } from "../api/Voice";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { RetellVoiceListItem } from "../interfaces/callForm";
import { Mic, Volume2 } from "lucide-react";

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
    <div className="py-8 space-y-10 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 flex items-center gap-3">
          <Mic className="text-brand-primary" size={36} />
          Agents <span className="text-brand-primary">Voice</span>
        </h1>
        <p className="text-gray-400 font-medium tracking-tight">
          Choose the voice callers hear. Showing only American male voices.
        </p>
        {currentVoiceId && (
          <p className="text-sm text-gray-500 mt-3">
            Current voice:{" "}
            <span className="text-brand-primary font-bold">
              {currentVoiceName ?? currentVoiceId}
            </span>
          </p>
        )}
      </div>

      <div className="glass rounded-[3rem] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.02]">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Voice
                </th>
                
                <th className="px-8 py-5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Preview
                </th>
                <th className="px-8 py-5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingVoices ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="w-10 h-10 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredVoices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-500 text-sm">
                    No American male voices found.
                  </td>
                </tr>
              ) : (
                filteredVoices.map((v) => {
                  const active = v.voice_id === currentVoiceId;
                  return (
                    <tr
                      key={v.voice_id}
                      className={`border-t border-white/5 hover:bg-white/[0.02] transition-colors ${
                        active ? "bg-brand-primary/5" : ""
                      }`}
                    >
                      <td className="px-8 py-5">
                        <span className="text-white font-bold text-sm">{v.voice_name}</span>
                        {v.accent && (
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                            {v.accent}
                            {/* {v.provider ? ` · ${v.provider}` : ""} */}
                          </span>
                        )}
                      </td>
                     
                      <td className="px-8 py-5 text-center">
                        {v.preview_audio_url ? (
                          <audio
                            controls
                            className="h-8 max-w-[200px] mx-auto opacity-90"
                            src={v.preview_audio_url}
                            preload="none"
                          />
                        ) : (
                          <span className="text-gray-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-center">
                        {active ? (
                          <span className="text-brand-primary text-xs font-black uppercase tracking-widest">
                            Active
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetVoice(v.voice_id)}
                            disabled={settingId !== null}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-secondary text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-secondary/90 disabled:opacity-50 transition-all"
                          >
                            {settingId === v.voice_id ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <Volume2 size={14} />
                            )}
                            Set voice
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AgentVoice;
