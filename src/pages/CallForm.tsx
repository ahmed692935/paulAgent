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
import { Play, Shield, Zap, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
    <div className="py-8 space-y-12 animate-fadeIn max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white p-10 rounded-[14px] border border-slate-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-emerald-100">
              <Zap size={12} />
              <span>Outbound Calling System</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
              Calling <span className="text-brand-primary">System</span>
            </h1>
            <p className="text-slate-600 font-medium max-w-xl">
              Initialize and manage intelligent agents to handle outbound calling communications.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-2xl font-black text-emerald-500">100%</p>
             </div>
             <div className="h-12 w-px bg-slate-200 hidden sm:block" />
             <div className="p-3.5 bg-slate-50 text-brand-primary rounded-[14px] border border-slate-200 shadow-sm">
               <Shield size={24} />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Main Configuration Panel */}
        <div className="bg-white rounded-[14px] border border-slate-300 shadow-sm p-10 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -mr-20 -mt-20" />
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 relative z-10 text-left">
            {/* Identity Group */}
            {/* <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Neural Identification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Authorized Identity</label>
                  <input
                    type="text"
                    {...register("caller_name", { required: "Identity required" })}
                    className={`w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-[14px] text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-sm ${errors.caller_name ? "border-red-500" : ""}`}
                    placeholder="Your Professional Handle"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operational Email</label>
                  <input
                    type="email"
                    {...register("caller_email", { 
                      required: "Email required",
                      pattern: { value: /\S+@\S+\.\S+/, message: "Invalid format" }
                    })}
                    className={`w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-[14px] text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-sm ${errors.caller_email ? "border-red-500" : ""}`}
                    placeholder="name@organization.com"
                  />
                </div>
              </div>
            </div> */}

            {/* Distribution Network */}
            <div className="space-y-8 p-10 bg-slate-50/50 border border-slate-300 rounded-[14px] relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[14px] bg-brand-primary/10 text-brand-primary flex items-center justify-center shadow-sm">
                  <IoCall size={18} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Target Nodes</h3>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* Contacts Multi-Select */}
                <div className="relative space-y-3" ref={dropdownRef}>
                  <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Enter Numbers:</label>
                  <div className={`flex flex-wrap items-center gap-2 w-full min-h-[64px] px-5 py-3 bg-white border border-slate-300 rounded-[14px] focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/5 shadow-sm transition-all ${errors.phone_numbers ? "border-red-500" : ""}`} onClick={() => inputRef.current?.focus()}>
                    {selectedNumbers.map((num, index) => (
                      <span key={index} className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        {selectedNames[index] || "User"}: {num}
                        <button type="button" onClick={() => handleRemoveContact(index)} className="hover:text-brand-primary transition-colors">
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
                      className="flex-1 outline-none bg-transparent text-slate-900 font-bold text-base placeholder-slate-400 min-w-[150px]"
                      placeholder="Enter number..."
                    />
                    <Search className="text-slate-400 mr-2" size={18} />
                  </div>

                  {/* Contact Dropdown */}
                  <AnimatePresence>
                    {showDropdown && filteredContacts.length > 0 && (
                      <motion.ul initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-slate-300 rounded-[14px] shadow-2xl p-2 custom-scrollbar">
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
                            className="px-6 py-4 cursor-pointer hover:bg-slate-50 rounded-lg transition-all flex items-center justify-between group"
                          >
                            <span className="text-slate-900 font-black text-sm tracking-tight">{c.firstName}</span>
                            <span className="text-brand-primary text-xs font-bold opacity-50 group-hover:opacity-100 transition-opacity">{c.phoneNumber}</span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* Agent Selection */}
                {/* <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Neural Personality</label>
                  <select
                    {...register("voice", { required: "Agent required" })}
                    className={`w-full px-6 py-4 bg-white border border-slate-300 rounded-[14px] text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-sm appearance-none shadow-sm ${errors.voice ? "border-red-500" : ""}`}
                  >
                    <option value="" className="text-slate-400">Establish Neural Link...</option>
                    {loadingVoices ? (
                      <option disabled>Synchronizing personalities...</option>
                    ) : (
                      agentVoices.map((agent) => (
                        <option key={agent.voice_id} value={agent.voice_name}>
                          {agent.voice_name}
                        </option>
                      ))
                    )}
                  </select>
                </div> */}
              </div>

              {/* Context / Prompt Builder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div className="relative space-y-3">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Context:</label>
                  <input
                    value={typedContext}
                    onChange={(e) => {
                      setTypedContext(e.target.value);
                      setValue("context", e.target.value, { shouldValidate: true });
                      setShowPromptDropdown(true);
                    }}
                    onFocus={() => setShowPromptDropdown(true)}
                    placeholder="Search or define custom objective..."
                    className={`w-full px-6 py-4 bg-white border border-slate-300 rounded-[14px] text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-base shadow-sm placeholder-slate-400 ${errors.context ? "border-red-500" : ""}`}
                  />
                  
                  <AnimatePresence>
                    {showPromptDropdown && prompts.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute z-10 mt-2 w-full bg-white border border-slate-300 rounded-[14px] shadow-2xl max-h-60 overflow-y-auto p-2 custom-scrollbar">
                        {prompts
                          .filter((p) => p.prompt_name.toLowerCase().includes(typedContext.toLowerCase()))
                          .map((prompt) => (
                            <div
                              key={prompt.id}
                              className="px-6 py-4 hover:bg-slate-50 hover:text-brand-primary cursor-pointer rounded-lg text-slate-900 text-sm font-black transition-all text-left"
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

                <div className="flex flex-col sm:flex-row items-end gap-5">
                   <div className="flex-1 space-y-3 text-left">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Languages:</label>
                    <select
                      {...register("language")}
                      className="w-full px-6 py-4 bg-white border border-slate-300 rounded-[14px] text-slate-900 outline-none focus:border-brand-primary transition-all font-bold text-base appearance-none shadow-sm"
                    >
                      <option value="en">English (Neural Optimized)</option>
                      <option value="es">Spanish (Beta Link)</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddGroup}
                    className="h-14 px-8 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-[14px] hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Create Group
                  </button>
                </div>
              </div>
            </div>

            {/* Queue Preview */}
            <AnimatePresence>
              {groups.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="p-10 bg-white border border-slate-300 rounded-[14px] shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-brand-primary" />
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-3 text-left">
                      <Zap size={20} className="text-brand-primary" />
                      Groups ({groups.length})
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((grp, idx) => (
                      <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={idx} className="bg-slate-50 border border-slate-200 p-6 rounded-[14px] flex justify-between items-start group hover:border-brand-primary transition-all text-left">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                             <div className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-black uppercase">Batch {idx + 1}</div>
                             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{grp.contacts.length} Uplinks</p>
                          </div>
                          <p className="text-base font-black text-slate-900 line-clamp-2 leading-tight">{grp.context}</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveGroup(idx)} className="p-2.5 bg-white border border-slate-200 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all active:scale-90 shadow-sm ml-4">
                          <FiTrash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Deployment Console */}
            <div className="flex flex-col md:flex-row gap-5 pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex-2 flex items-center justify-center gap-4 py-6 bg-slate-900 text-white font-black uppercase tracking-widest text-sm rounded-[14px] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/10 disabled:opacity-50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-brand-primary to-brand-secondary opacity-0 group-hover:opacity-10 transition-opacity" />
                <span className="relative z-10 flex items-center gap-3">
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Start Calling
                      <IoCall size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              {(selectedNumbers.length > 1 || groups.length > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    const nums = selectedNumbers.length + groups.reduce((acc, g) => acc + g.contacts.length, 0);
                    localStorage.setItem("campaign_auto_name", `Quick Launch - ${nums} targets`);
                    toast.success("Redirecting to Campaign Hub...");
                    navigate("/campaigns");
                  }}
                  className="flex-1 flex items-center justify-center gap-3 py-6 bg-white border border-slate-300 text-slate-900 font-black uppercase tracking-widest text-xs rounded-[14px] hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                >
                  Create campaign
                  <Play size={14} className="text-brand-primary" fill="currentColor" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Modern Deployment Popup */}
      <AnimatePresence>
        {openPopup && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
              onClick={() => dispatch(togglePopup(false))} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white w-full max-w-md rounded-[14px] p-12 border border-slate-300 shadow-2xl text-center overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary shadow-[0_0_20px_rgba(14,165,233,0.5)]" />
               
               <div className="flex flex-col items-center justify-center py-6">
                <div className="relative mb-10 group">
                  <div className="absolute inset-0 rounded-full bg-brand-primary opacity-20 animate-ping group-hover:animate-none scale-150" />
                  <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center relative z-10 shadow-2xl">
                    <IoCall color="white" size={36} className="animate-pulse" />
                  </div>
                </div>
                
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 uppercase">Link Active</h2>
                <p className="text-slate-500 font-medium text-sm mb-12 leading-relaxed">Neural transmission in progress. Mission parameters are being uploaded to designated sectors. Standardizing uplink...</p>

                <button
                  onClick={() => dispatch(togglePopup(false))}
                  className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-[14px] hover:bg-slate-800 transition-all hover:shadow-xl active:scale-95"
                >
                  Confirm Operational Status
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Loader2 = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`animate-spin ${className}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default CallForm;
