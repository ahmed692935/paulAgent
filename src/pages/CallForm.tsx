import { useForm } from "react-hook-form";
import type { CallFormInputs, CallGroup } from "../interfaces/callForm";
import {
  createCallFailure,
  createCallStart,
  createCallSuccess,
  togglePopup,
} from "../store/slices/callForm";
import { useDispatch, useSelector } from "react-redux";
import {
  initiateCall,
  getContacts,
  getAllPrompt,
} from "../api/Call";
import { getRetellFlowEditor } from "../api/retell";
import type { RootState } from "../store/store";
import { useRef, useEffect, useState } from "react";
import { IoCall } from "react-icons/io5";
import { FiX, FiTrash2 } from "react-icons/fi";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getAgentVoice } from "../api/Voice";
import type { RetellVoiceListItem } from "../interfaces/callForm";

function buildBulkCallSystemPrompt(
  settings: { global_prompt: string; intro_text: string } | null,
  templateBlock: string
): string {
  const parts: string[] = [];
  const globalPart = settings?.global_prompt?.trim() ?? "";
  const introPart = settings?.intro_text?.trim() ?? "";
  const templatePart = templateBlock?.trim() ?? "";
  if (globalPart) parts.push(globalPart);
  if (introPart) parts.push(`Call opening instructions:\n${introPart}`);
  if (templatePart) parts.push(templatePart);
  return parts.join("\n\n---\n\n");
}

function normalizeBulkCallResponse(res: unknown): string | null {
  if (res == null) return null;
  if (typeof res === "string") return res;
  if (typeof res === "object" && res !== null && "call_id" in res) {
    const id = (res as { call_id?: unknown }).call_id;
    return typeof id === "string" ? id : null;
  }
  return null;
}

function CallForm() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    reset,
  } = useForm<CallFormInputs>({
    defaultValues: {
      caller_name: user?.username || "",
      caller_email: user?.email || "",
      caller_number: "",
      phone_numbers: [],
      objective: "",
      context: "",
      system_prompt: "",
      first_names: [],
      language: user?.language || "en",
      voice: "",
      groups: [],
    },
  });

  const dispatch = useDispatch();
  const token = useSelector(
    (state: RootState) => state.auth.token ?? state.auth.user?.access_token ?? null
  );
  const { openPopup } = useSelector((state: RootState) => state.call);

  const [groups, setGroups] = useState<CallGroup[]>([]);
  const [contacts, setContacts] = useState<{ firstName: string; phoneNumber: string }[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<typeof contacts>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [typedValue, setTypedValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [prompts, setPrompts] = useState<any[]>([]);
  const [typedContext, setTypedContext] = useState("");
  const [showPromptDropdown, setShowPromptDropdown] = useState(false);

  const [agentVoices, setAgentVoices] = useState<RetellVoiceListItem[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(true);
  const [settingsFlowPrompts, setSettingsFlowPrompts] = useState<{
    global_prompt: string;
    intro_text: string;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (!token) return;
        const response = await getContacts(token);
        setContacts(response);
        setFilteredContacts(response);
      } catch {
        setContacts([]);
        setFilteredContacts([]);
      }
    };
    fetchContacts();
  }, [token]);

  useEffect(() => {
    async function fetchPrompts() {
      try {
        if (!token) return;
        const response = await getAllPrompt(token);
        setPrompts(response);
      } catch (err) {
        console.error("Error loading prompts", err);
      }
    }
    fetchPrompts();
  }, [token]);

  useEffect(() => {
    const loadSettingsPrompts = async () => {
      if (!token) return;
      try {
        const data = await getRetellFlowEditor(token);
        setSettingsFlowPrompts({
          global_prompt: data.global_prompt ?? "",
          intro_text: data.intro_text ?? "",
        });
      } catch {
        setSettingsFlowPrompts(null);
      }
    };
    loadSettingsPrompts();
  }, [token]);

  useEffect(() => {
    const fetchVoices = async () => {
      setLoadingVoices(true);
      try {
        if (!token) return;
        const res = await getAgentVoice(token);
        setAgentVoices(res.voices || []);
        const defaultName = res.current_voice_id
          ? res.voices?.find((v) => v.voice_id === res.current_voice_id)?.voice_name
          : undefined;
        if (defaultName) {
          setValue("voice", defaultName, { shouldValidate: true });
        }
      } catch (error) {
        console.log(error);
      }
      setLoadingVoices(false);
    };
    fetchVoices();
  }, [token, setValue]);

  useEffect(() => {
    if (openPopup) {
      const timer = setTimeout(() => {
        dispatch(togglePopup(false));
        setSelectedNumbers([]);
        setSelectedNames([]);
        setTypedValue("");
        reset({
          caller_name: user?.username || "",
          caller_email: user?.email || "",
          language: user?.language || "en",
          caller_number: "",
          phone_numbers: [],
          objective: "",
          context: "",
          system_prompt: "",
          first_names: [],
          voice: "",
          groups: [],
        });
        setGroups([]);
        setTypedContext("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [openPopup, dispatch, reset, user]);

  const handleAddGroup = () => {
    const currentContext = typedContext || getValues("context");
    console.log(selectedNumbers);
    if (selectedNumbers.length === 0) {
      toast.error("Select targets first.");
      return;
    }
    if (!currentContext) {
      toast.error("Operational context required.");
      return;
    }

    const newGroup: CallGroup = {
      context: currentContext,
      system_prompt: getValues("system_prompt") || "",
      contacts: selectedNumbers.map((num, idx) => ({
        phone_number: num,
        first_name: selectedNames[idx] || "User",
      })),
    };

    setGroups([...groups, newGroup]);
    setSelectedNumbers([]);
    setSelectedNames([]);
    setValue("phone_numbers", []);
    setValue("first_names", []);
    setTypedValue("");
    setTypedContext("");
    setValue("context", "");
    setValue("system_prompt", "");
    toast.success("Node group staged.");
  };

  const handleRemoveGroup = (idx: number) => {
    setGroups(groups.filter((_, i) => i !== idx));
  };

  const handleRemoveContact = (index: number) => {
    const updatedNumbers = selectedNumbers.filter((_, i) => i !== index);
    const updatedNames = selectedNames.filter((_, i) => i !== index);
    setSelectedNumbers(updatedNumbers);
    setSelectedNames(updatedNames);
    setValue("phone_numbers", updatedNumbers);
    setValue("first_names", updatedNames);
  };

  const onSubmit = async (values: CallFormInputs) => {
    try {
      if (!token) throw new Error("Authentication link severed.");
      let finalGroups = [...groups];

      if (finalGroups.length === 0) {
        const currentContext = values.context || typedContext;
        if (selectedNumbers.length > 0 && currentContext) {
          finalGroups.push({
            context: currentContext,
            system_prompt: values.system_prompt || "",
            contacts: selectedNumbers.map((num, idx) => ({
              phone_number: num,
              first_name: selectedNames[idx] || "User",
            })),
          });
        } else {
          toast.error("Mission parameters incomplete.");
          return;
        }
      }

      for (const group of finalGroups) {
        const merged = buildBulkCallSystemPrompt(
          settingsFlowPrompts,
          group.system_prompt
        );
        if (!merged.trim()) {
          toast.error(
            "Add a global prompt under Settings, or pick a prompt template for this batch."
          );
          return;
        }
      }

      dispatch(createCallStart());

      for (const [index, group] of finalGroups.entries()) {
        const system_prompt = buildBulkCallSystemPrompt(
          settingsFlowPrompts,
          group.system_prompt
        );

        const payload = {
          phone_numbers: group.contacts.map((c) => c.phone_number),
          caller_name: values.caller_name,
          caller_email: values.caller_email,
          context: group.context,
          system_prompt,
          voice: values.voice?.trim() || "david",
          language: values.language || "en",
          first_names: group.contacts.map((c) => c.first_name || null),
        };

        try {
          if (finalGroups.length > 1) {
            toast.loading(`Deploying group ${index + 1}/${finalGroups.length}...`, { id: "call-loading" });
          }
          const res = await initiateCall(payload, token);
          const callId = normalizeBulkCallResponse(res);
          if (callId) {
            dispatch(createCallSuccess({ call_id: callId }));
            localStorage.setItem("lastCallId", callId);
          }
          localStorage.setItem("callerEmail", values.caller_email);
        } catch (err) {
          console.error(`Transmission error in group ${index + 1}`, err);
          const ax = err as AxiosError<{ detail?: unknown }>;
          const detail = ax.response?.data?.detail;
          const msg =
            Array.isArray(detail) && detail[0]?.msg
              ? String(detail[0].msg)
              : ax.response?.data &&
                  typeof ax.response.data === "object" &&
                  "message" in ax.response.data
                ? String((ax.response.data as { message: string }).message)
                : null;
          toast.error(msg || `Fault in group ${index + 1} deployment.`);
        }
      }

      toast.dismiss("call-loading");
      toast.success("Deployment sequence complete.");
      reset();
      setGroups([]);
      setSelectedNumbers([]);
      setSelectedNames([]);
      setTypedContext("");
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error?.response?.data?.error || "Neural link failure.");
      dispatch(createCallFailure(error.message));
    }
  };

  return (
    <div className="py-8 space-y-12 animate-fadeIn max-w-5xl mx-auto text-white">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
          Communication <span className="text-brand-primary">Engine</span>
        </h1>
        <p className="text-gray-400 font-medium tracking-tight max-w-2xl mx-auto">
          Deploy intelligent agents to handle your outbound communications with human-like precision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Configuration Card */}
        <div className="lg:col-span-12 glass rounded-[3.5rem] p-10 md:p-14 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Identity Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Authorized Identity</label>
                <input
                  type="text"
                  {...register("caller_name", { required: "Identity required" })}
                  className={`w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-white focus:border-brand-primary/30 outline-none transition-all font-medium text-sm ${errors.caller_name ? "border-brand-accent/50" : ""}`}
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Deployment Email</label>
                <input
                  type="email"
                  {...register("caller_email", { 
                    required: "Email required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid format" }
                  })}
                  className={`w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-white focus:border-brand-primary/30 outline-none transition-all font-medium text-sm ${errors.caller_email ? "border-brand-accent/50" : ""}`}
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Distribution Group */}
            <div className="space-y-8 p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <IoCall size={16} />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Transmission Targets</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contacts Multi-Select */}
                <div className="relative space-y-2" ref={dropdownRef}>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Search or Enter Numbers</label>
                  <div className={`flex flex-wrap items-center gap-2 w-full min-h-[58px] px-4 py-3 glass !bg-white/5 border border-white/5 rounded-2xl focus-within:border-brand-primary/30 transition-all ${errors.phone_numbers ? "border-brand-accent/50" : ""}`} onClick={() => inputRef.current?.focus()}>
                    {selectedNumbers.map((num, index) => (
                      <span key={index} className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
                        {selectedNames[index] || "User"}: {num}
                        <button type="button" onClick={() => handleRemoveContact(index)} className="hover:text-white transition-colors">
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                    <input
                      ref={inputRef}
                      type="text"
                      value={typedValue}
                      onFocus={() => setShowDropdown(true)}
                      onChange={(e) => setTypedValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "," || e.key === " ") {
                          e.preventDefault();
                          let numToValidate = typedValue.trim();
                          if (!numToValidate) return;
                          if (!numToValidate.startsWith("+")) numToValidate = "+" + numToValidate;
                          if (selectedNumbers.includes(numToValidate)) { toast.error("Redundant node."); return; }
                          if (groups.some(g => g.contacts.some(c => c.phone_number === numToValidate))) { toast.error("Node active in queue."); return; }
                          const updatedNumbers = [...selectedNumbers, numToValidate];
                          const updatedNames = [...selectedNames, "User"];
                          setSelectedNumbers(updatedNumbers);
                          setSelectedNames(updatedNames);
                          setValue("phone_numbers", updatedNumbers);
                          setValue("first_names", updatedNames);
                          setTypedValue("");
                        }
                      }}
                      className="flex-1 outline-none bg-transparent text-white text-sm placeholder-gray-600 min-w-[120px]"
                      placeholder="+1234567890"
                    />
                  </div>

                  {/* Contact Dropdown */}
                  <AnimatePresence>
                    {showDropdown && filteredContacts.length > 0 && (
                      <motion.ul initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto glass border border-white/10 rounded-2xl shadow-2xl p-2 dropdown">
                        {filteredContacts.map((c, idx) => (
                          <li
                            key={idx}
                            onClick={() => {
                              let number = c.phoneNumber;
                              if (!number.startsWith("+")) number = "+" + number;
                              if (selectedNumbers.includes(number)) { toast.error("Redundant node."); return; }
                              if (groups.some(g => g.contacts.some(contact => contact.phone_number === number))) { toast.error("Node active in queue."); return; }
                              const newNumbers = [...selectedNumbers, number];
                              const newNames = [...selectedNames, c.firstName];
                              setSelectedNumbers(newNumbers);
                              setSelectedNames(newNames);
                              setValue("phone_numbers", newNumbers);
                              setValue("first_names", newNames);
                              setTypedValue("");
                              setShowDropdown(false);
                            }}
                            className="px-6 py-4 cursor-pointer hover:bg-white/5 rounded-xl transition-all flex items-center justify-between group"
                          >
                            <span className="text-white font-bold text-sm tracking-tight">{c.firstName}</span>
                            <span className="text-brand-primary text-xs font-medium opacity-50 group-hover:opacity-100 transition-opacity">{c.phoneNumber}</span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* Agent Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Neural Personality</label>
                  <select
                    {...register("voice", { required: "Agent required" })}
                    className={`w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-white focus:border-brand-primary/30 outline-none transition-all font-medium text-sm appearance-none ${errors.voice ? "border-brand-accent/50" : ""}`}
                  >
                    <option value="" className="bg-dark-bg text-white">Establish Neural Link...</option>
                    {loadingVoices ? (
                      <option disabled className="bg-dark-bg text-white">Synchronizing personalities...</option>
                    ) : (
                      agentVoices.map((agent) => (
                        <option key={agent.voice_id} value={agent.voice_name} className="bg-dark-bg text-white">
                          {agent.voice_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Context / Prompt Builder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div className="relative space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Operational Context</label>
                  <input
                    value={typedContext}
                    onChange={(e) => {
                      setTypedContext(e.target.value);
                      setValue("context", e.target.value, { shouldValidate: true });
                      setShowPromptDropdown(true);
                    }}
                    onFocus={() => setShowPromptDropdown(true)}
                    placeholder="Define or select logic..."
                    className={`w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-white focus:border-brand-primary/30 outline-none transition-all font-medium text-sm ${errors.context ? "border-brand-accent/50" : ""}`}
                  />
                  
                  <AnimatePresence>
                    {showPromptDropdown && prompts.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute z-10 mt-2 w-full glass border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2 dropdown">
                        {prompts
                          .filter((p) => p.prompt_name.toLowerCase().includes(typedContext.toLowerCase()))
                          .map((prompt) => (
                            <div
                              key={prompt.id}
                              className="px-6 py-4 hover:bg-brand-primary/10 hover:text-brand-primary cursor-pointer rounded-xl text-white text-sm font-bold transition-all text-left"
                              onClick={() => {
                                setTypedContext(prompt.prompt_name);
                                setValue("context", prompt.prompt_name);
                                setValue("system_prompt", prompt.system_prompt);
                                setShowPromptDropdown(false);
                              }}
                            >
                              {prompt.prompt_name}
                            </div>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-4">
                   <div className="flex-1 space-y-2 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Neural Protocol</label>
                    <select
                      {...register("language")}
                      className="w-full px-6 py-4 glass !bg-white/5 border border-white/5 rounded-2xl text-white outline-none transition-all font-medium text-sm appearance-none"
                    >
                      <option value="en" className="bg-dark-bg text-white">English V4.0</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddGroup}
                    className="px-8 py-4 bg-brand-secondary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-brand-secondary/80 transition-all active:scale-95 shadow-[0_15px_30px_rgba(99,102,241,0.2)]"
                  >
                    Stage Group
                  </button>
                </div>
              </div>
            </div>

            {/* Queue Preview */}
            <AnimatePresence>
              {groups.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-10 glass border border-white/10 rounded-[2.5rem] bg-white/[0.01]">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-white tracking-tighter flex items-center gap-3 text-left">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-secondary"></span>
                      </span>
                      Transmission Queue ({groups.length})
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groups.map((grp, idx) => (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={idx} className="glass border border-white/5 p-6 rounded-3xl flex justify-between items-center group hover:border-brand-secondary/30 transition-all text-left">
                        <div className="space-y-2">
                          <p className="text-xs font-black text-brand-secondary uppercase tracking-widest">Logic Node {idx + 1}</p>
                          <p className="text-sm font-medium text-white line-clamp-1">{grp.context}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            {grp.contacts.length} Targets Synchronized
                          </p>
                        </div>
                        <button type="button" onClick={() => handleRemoveGroup(idx)} className="p-3 glass rounded-xl text-brand-accent hover:bg-brand-accent/20 transition-all active:scale-90">
                          <FiTrash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-6 bg-brand-primary text-white font-black uppercase tracking-widest text-sm rounded-[2rem] hover:bg-brand-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_25px_50px_rgba(14,165,233,0.3)] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Start the call
                    <IoCall size={20} className="rotate-12" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ==== Popup ==== */}
      <AnimatePresence>
        {openPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark-bg/80 backdrop-blur-xl" 
              onClick={() => dispatch(togglePopup(false))} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative glass w-full max-w-lg rounded-[3.5rem] p-10 md:p-14 border border-white/10 shadow-2xl text-center"
            >
              <div className="flex flex-col items-center justify-center py-5">
                <div className="relative mb-12">
                  <span className="absolute inset-0 rounded-full bg-brand-primary opacity-20 animate-ping"></span>
                  <div className="w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center shadow-[0_0_50px_rgba(14,165,233,0.4)] relative overflow-hidden">
                    <IoCall color="white" size={36} className="animate-pulse" />
                  </div>
                </div>
                
                <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Transmission Active</h2>
                <p className="text-gray-400 font-medium text-sm mb-10">Initializing neural links across all programmed nodes. Redirecting to mission control...</p>

                <div className="flex justify-center">
                  <button
                    onClick={() => dispatch(togglePopup(false))}
                    className="px-10 py-4 glass border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/5 transition-all focus:outline-none"
                  >
                    Dismiss Uplink
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CallForm;
