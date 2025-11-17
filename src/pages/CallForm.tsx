// // src/components/CallForm.jsx
// import { useForm } from "react-hook-form";
// import type { CallFormInputs } from "../interfaces/callForm";
// import {
//   createCallFailure,
//   createCallStart,
//   createCallSuccess,
//   resetCall,
//   setTranscript,
//   togglePopup,
//   //   togglePopup,
// } from "../store/slices/callForm";
// import { useDispatch, useSelector } from "react-redux";
// import { checkCallStatus, getSystemPrompt, initiateCall } from "../api/Call";
// // import { useNavigate } from "react-router-dom";
// import type { RootState } from "../store/store";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { IoCall } from "react-icons/io5";
// import type { AxiosError } from "axios";
// import toast from "react-hot-toast";
// // import { useState } from "react";
// // import type { TranscriptLine } from "../interfaces/dashboard";
// // import { useNavigate } from "react-router-dom";

// function CallForm() {
//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : null;
//   //   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//     reset,
//   } = useForm<CallFormInputs>({
//     defaultValues: {
//       caller_name: user?.username || "",
//       caller_email: user?.email || "",
//       caller_number: "",
//       outbound_number: "",
//       objective: "",
//       context: "",
//       language: "english",
//       voice: "",
//     },
//   });
//   const dispatch = useDispatch();
//   //   const navigate = useNavigate();
//   //   const [openPopup, setOpenPopup] = useState(false);
//   //   const [callId, setCallId] = useState<string | null>(null);
//   //   const [polling, setPolling] = useState<NodeJS.Timeout | null>(null);
//   //   const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
//   const token = useSelector(
//     (state: RootState) => state.auth.user?.access_token
//   );

//   const { callId, openPopup, transcript, status } = useSelector(
//     (state: RootState) => state.call
//   );

//   console.log(transcript, "call id");
//   const navigate = useNavigate();

//   const onSubmit = async (values: CallFormInputs) => {
//     try {
//       dispatch(resetCall());
//       dispatch(createCallStart());
//       if (!token) throw new Error("No token found. Please login again.");

//       const res = await initiateCall(values, token);
//       dispatch(createCallSuccess(res));

//       localStorage.setItem("lastCallId", res.call_id);
//       localStorage.setItem("callerEmail", values.caller_email);
//     } catch (err: unknown) {
//       // let message = "Failed to create call";
//       // if (err instanceof Error) {
//       //   message = err.message;
//       // }
//       const error = err as AxiosError<{ error: string }>;
//       toast.error(error?.response?.data?.error || "Oops an error occurred");
//       dispatch(createCallFailure(error.message));
//     }
//   };

//   const handlePoll = async (id: string, interval?: number) => {
//     if (!token) return;
//     try {
//       const res = await checkCallStatus(id, token);

//       // ✅ full response dispatch karo
//       dispatch(setTranscript(res));

//       // ✅ check status & stop polling
//       if (
//         res.status === "completed" ||
//         res.status === "busy" ||
//         res.status === "ended" ||
//         res.status === "unanswered"
//       ) {
//         if (interval) clearInterval(interval); // 👈 stop API hits
//         dispatch(togglePopup(false));

//         navigate("/call"); // 👈 redirect to dashboard
//         reset();
//       }
//     } catch (err) {
//       console.error("Polling failed", err);
//     }
//   };

//   // ✅ Polling every 3s when popup is open
//   useEffect(() => {
//     let interval: number;
//     if (openPopup && callId) {
//       interval = setInterval(() => {
//         handlePoll(callId, interval); // 👈 pass interval ref
//       }, 3000);
//     }
//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [openPopup, callId, token]);

//   const [loadingPrompt, setLoadingPrompt] = useState<boolean>(false);

//   // const token = useSelector((state: RootState) => state.auth.user?.access_token);

//   // ✅ Fetch System Prompt and auto-fill "context"
//   useEffect(() => {
//     const fetchPrompt = async () => {
//       try {
//         setLoadingPrompt(true);
//         if (!token) return;

//         const response = await getSystemPrompt(token);
//         if (response?.system_prompt) {
//           // ✅ Fill “Call Context” field automatically
//           setValue("context", response.system_prompt);
//         }
//       } catch (err) {
//         const error = err as AxiosError<{ error?: string }>;
//         toast.error(error.response?.data?.error || "Failed to load prompt.");
//         console.error("Prompt fetch error:", err);
//       } finally {
//         setLoadingPrompt(false);
//       }
//     };

//     fetchPrompt();
//   }, [token, setValue]);

//   // ✅ Status check function
//   //   const handlePoll = async (id: string) => {
//   //     if (!token) return;
//   //     try {
//   //       const res = await checkCallStatus(id, token);

//   //       dispatch(setTranscript(res));
//   //     } catch (err) {
//   //       console.error("Polling failed", err);
//   //     }
//   //   };

//   //   useEffect(() => {
//   //     let interval: NodeJS.Timeout;
//   //     if (openPopup && callId) {
//   //       interval = setInterval(() => {
//   //         handlePoll(callId);
//   //       }, 3000);
//   //     }
//   //     return () => {
//   //       if (interval) clearInterval(interval);
//   //     };
//   //   }, [openPopup, callId, token]);

//   //   const onSubmit = async (data: CallFormInputs) => {
//   //     console.log(data, "FORM DATA");
//   //     try {
//   //       const response = await fetch(`${backendUrl}api/assistant-initiate-call`, {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify(data),
//   //       });

//   //       if (!response.ok) throw new Error("Failed to initiate call");

//   //       const res = await response.json();
//   //       localStorage.setItem("lastCallId", res.call_id);
//   //       localStorage.setItem("callerEmail", data.caller_email);

//   //       navigate("/call-details");
//   //     } catch (err) {
//   //       console.error(err);
//   //       alert("Failed to initiate call. Please try again.");
//   //     }
//   //   };

//   return (
//     <>
//       {/* <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8"> */}
//       <div className="max-w-3xl mx-auto p-8 mt-8">
//         <h1 className="text-2xl font-bold text-center mb-10 text-[#3F3EED]">
//           Let AI Handle Your Next Call
//         </h1>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Name + Email */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Your Name
//               </label>
//               <input
//                 type="text"
//                 {...register("caller_name", { required: "Name is required" })}
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#3F3EED] hover:border-blue-400
//  ${errors.caller_name ? "border-red-500" : "border-gray-300"}`}
//                 placeholder="Your Name"
//               />
//               {errors.caller_name && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.caller_name.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Your Email
//               </label>
//               <input
//                 type="email"
//                 {...register("caller_email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /\S+@\S+\.\S+/,
//                     message: "Email is invalid",
//                   },
//                 })}
//                 className={`w-full px-4 hover:border-blue-400
//  py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#3F3EED]  ${errors.caller_email ? "border-red-500" : "border-gray-300"
//                   }`}
//                 placeholder="name@example.com"
//               />
//               {errors.caller_email && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.caller_email.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Phone Numbers */}
//           <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//             {/* <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Your Phone Number
//               </label>
//               <input
//                 type="tel"
//                 {...register("caller_number", {
//                   required: "Caller number is required",
//                   pattern: {
//                     value: /^\+?[1-9]\d{1,14}$/,
//                     message: "Enter a valid phone number",
//                   },
//                 })}
//                 className={`w-full px-4 py-2 border rounded-md hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-[#3F3EED]  ${
//                   errors.caller_number ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="+1234567890"
//               />
//               {errors.caller_number && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.caller_number.message}
//                 </p>
//               )}
//             </div> */}

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Number to Call
//               </label>
//               <input
//                 type="tel"
//                 {...register("outbound_number", {
//                   required: "Outbound number is required",
//                   pattern: {
//                     value: /^\+?[1-9]\d{1,14}$/,
//                     message: "Enter a valid phone number",
//                   },
//                 })}
//                 className={`w-full px-4 py-2 border rounded-md hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-[#3F3EED]  ${errors.outbound_number ? "border-red-500" : "border-gray-300"
//                   }`}
//                 placeholder="+1234567890"
//               />
//               {errors.outbound_number && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.outbound_number.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Agent Name (New Field) */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Agent Name
//             </label>
//             <select
//               {...register("voice", { required: "Agent name is required" })}
//               className={`w-full px-4 py-2 border rounded-md hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-[#3F3EED] ${errors.voice ? "border-red-500" : "border-gray-300"
//                 }`}
//             >
//               <option value="">Select Agent</option>
//               <option value="david">David - english (Male)</option>
//               <option value="ravi">Ravi - english (Male)</option>
//               <option value="emily-british">Emily - english (Female)</option>
//               <option value="alice-british">Alice - english (Female)</option>
//               <option value="julia-british">Julia - english (Female)</option>
//               <option value="julio">Julio - spanish (Male)</option>
//               <option value="donato">Donato - spanish (Male)</option>
//               <option value="helena-spanish">Helena - spanish (Female)</option>
//               <option value="rosa">Rosa - spanish (Female)</option>
//               <option value="mariam">Mariam - spanish (Female)</option>
//             </select>
//             {errors.voice && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.voice.message}
//               </p>
//             )}
//           </div>

//           {/* Objective */}
//           {/* <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Call Objective
//             </label>
//             <input
//               type="text"
//               {...register("objective", { required: "Objective is required" })}
//               className={`w-full px-4 py-2 border rounded-md hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-[#3F3EED]  ${
//                 errors.objective ? "border-red-500" : "border-gray-300"
//               }`}
//               placeholder="Schedule a meeting"
//             />
//             {errors.objective && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.objective.message}
//               </p>
//             )}
//           </div> */}

//           {/* Context */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Call Context
//             </label>
//             {/* <textarea
//               {...register("context", { required: "Context is required" })}
//               className={`w-full px-4 py-2 border rounded-md hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-[#3F3EED]  ${
//                 errors.context ? "border-red-500" : "border-gray-300"
//               }`}
//               placeholder="Provide any additional context for the call..."
//             ></textarea> */}
//             <textarea
//               {...register("context", { required: "Context is required" })}
//               disabled={loadingPrompt} // ✅ disable while loading
//               placeholder={
//                 loadingPrompt
//                   ? "Loading system prompt..."
//                   : "Provide any additional context for the call..."
//               }
//               className={`w-full px-4 py-2 border rounded-md hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-[#3F3EED] ${errors.context ? "border-red-500" : "border-gray-300"
//                 }`}
//             />

//             {errors.context && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.context.message}
//               </p>
//             )}
//           </div>

//           {/* Language */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Language
//             </label>
//             <select
//               {...register("language")}
//               className="w-full px-4 py-2 border border-gray-300 hover:border-blue-400 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3F3EED] "
//             >
//               <option value="en">English</option>
//               <option value="es">Spanish</option>
//             </select>
//           </div>

//           {/* Submit */}
//           <div className="flex justify-center">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-6 py-3 bg-[#3F3EED] w-full cursor-pointer text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-[#3F3EED]  focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? "Initiating Call..." : "Initiate Call"}
//             </button>
//           </div>
//         </form>
//       </div>
//       {/* ==== Popup ==== */}
//       {openPopup && (
//         <div
//           className="fixed inset-0  flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
//           onClick={() => dispatch(togglePopup(false))}
//         >
//           <div
//             className="bg-white rounded-lg shadow-lg w-[50%] text-center"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-xl font-bold mb-4 p-6">Call Initiated</h2>
//             <div className="flex flex-wrap items-center mb-4 px-6">
//               <span className="font-medium">Call ID:</span>
//               <span className="md:px-3 md:mx-5 py-1 bg-gray-100 rounded">
//                 {callId}
//               </span>
//             </div>
//             {/* Transcript Box */}
//             {/* <div className="flex justify-between border border-purple-200 bg-purple-50 px-6 p-2">
//               <p className="text-base font-semibold text-[#391f52] text-start mb-1 ">
//                 Call Transcript
//               </p>
//               <p className="text-base">
//                 <span className="font-bold">Status:</span>{" "}
//                 {status ?? "Pending..."}
//               </p>
//             </div> */}
//             <div className="rounded-lg">
//               {/* Caller Section */}
//               <div className="flex flex-col items-center justify-center py-5">
//                 {/* Animated Circle */}
//                 <div className="relative">
//                   {/* Outer Animated Pulse */}
//                   <span className="absolute inset-0 rounded-full bg-blue-300 opacity-60 animate-ping"></span>

//                   {/* Inner Static Circle */}
//                   <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center shadow-md relative overflow-hidden">
//                     <IoCall color="white" size={30} />
//                   </div>
//                 </div>

//                 {/* Status Below */}
//                 <p className="mt-6 text-lg font-medium text-[#3F3EED] animate-pulse">
//                   {status ?? "Connecting..."}
//                 </p>
//               </div>
//             </div>

//             {/* <div className="p-6 max-h-96 overflow-y-auto border-t border-blue-200 bg-blue-50 "> */}
//             <div className="text-gray-700 leading-relaxed">
//               {/* {Array.isArray(transcript) && transcript.length > 0 ? (
//                   <ul className="space-y-2"> */}
//               {/* {transcript.map((line, idx) => (
//                       <li key={idx} className="text-sm">
//                         {typeof line === "object" ? (
//                           <>
//                             <span className="font-semibold text-[#391f52]">
//                               {line.role}:
//                             </span>{" "}
//                             {line.text}
//                           </>
//                         ) : (
//                           <span>{line}</span>
//                         )}
//                       </li>
//                     ))} */}
//               {/* {Array.isArray(transcript) && transcript.length > 0 ? (
//                       <div className="space-y-1">
//                         {transcript.map((line, idx) => (
//                           <p key={idx} className="text-sm">
//                             <span className="font-semibold text-[#391f52]">
//                               {line.role}:
//                             </span>{" "}
//                             {line.text}
//                           </p>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-500 text-sm">
//                         No transcript yet...
//                       </p>
//                     )}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-500 text-sm">No transcript yet...</p>
//                 )} */}
//             </div>
//             {/* </div> */}

//             {/* <div className="flex-1 overflow-y-auto border rounded-md p-3 mb-4 bg-gray-50 text-left">
//               {transcript.length === 0 ? (
//                 <p className="text-gray-500 text-sm">No transcript yet...</p>
//               ) : (
//                 transcript.map((line, idx) => (
//                   <p key={idx} className="text-sm mb-1">
//                     {line}
//                   </p>
//                 ))
//               )}
//             </div> */}
//             <div className="p-6 border-t border-blue-200 flex justify-center">
//               <button
//                 onClick={() => callId && handlePoll(callId)}
//                 className="w-full cursor-pointer sm:w-auto px-6 py-2 bg-[#3F3EED] text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg"
//               >
//                 Check Status Now
//               </button>
//               <button
//                 onClick={() => dispatch(togglePopup(false))}
//                 className="ml-4 px-6 py-2 bg-gray-300 text-black rounded-lg cursor-pointer"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default CallForm;

// Abdullah Code

// src/components/CallForm.jsx
import { useForm } from "react-hook-form";
import type { CallFormInputs } from "../interfaces/callForm";
import {
  createCallFailure,
  createCallStart,
  createCallSuccess,
  resetCall,
  setTranscript,
  togglePopup,
  //   togglePopup,
} from "../store/slices/callForm";
import { useDispatch, useSelector } from "react-redux";
import { checkCallStatus, initiateCall, getContacts } from "../api/Call";
// import { useNavigate } from "react-router-dom";
import type { RootState } from "../store/store";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCall } from "react-icons/io5";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
// import { useState } from "react";
// import type { TranscriptLine } from "../interfaces/dashboard";
// import { useNavigate } from "react-router-dom";

function CallForm() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  //   const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<CallFormInputs>({
    defaultValues: {
      caller_name: user?.username || "",
      caller_email: user?.email || "",
      caller_number: "",
      outbound_number: "",
      objective: "",
      context: "",
      language: user?.language || "en",
      voice: "",
    },
  });
  const dispatch = useDispatch();
  //   const navigate = useNavigate();
  //   const [openPopup, setOpenPopup] = useState(false);
  //   const [callId, setCallId] = useState<string | null>(null);
  //   const [polling, setPolling] = useState<NodeJS.Timeout | null>(null);
  //   const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const token = useSelector(
    (state: RootState) => state.auth.user?.access_token
  );

  const { callId, openPopup, transcript, status } = useSelector(
    (state: RootState) => state.call
  );

  console.log(transcript, "call id");
  const navigate = useNavigate();

  const onSubmit = async (values: CallFormInputs) => {
    try {
      dispatch(resetCall());
      dispatch(createCallStart());
      if (!token) throw new Error("No token found. Please login again.");

      const res = await initiateCall(values, token);
      dispatch(createCallSuccess(res));

      localStorage.setItem("lastCallId", res.call_id);
      localStorage.setItem("callerEmail", values.caller_email);
    } catch (err: unknown) {
      // let message = "Failed to create call";
      // if (err instanceof Error) {
      //   message = err.message;
      // }
      const error = err as AxiosError<{ error: string }>;
      toast.error(error?.response?.data?.error || "Oops an error occurred");
      dispatch(createCallFailure(error.message));
    }
  };

  const handlePoll = async (id: string, interval?: number) => {
    if (!token) return;
    try {
      const res = await checkCallStatus(id, token);

      // ✅ full response dispatch karo
      dispatch(setTranscript(res));

      // ✅ check status & stop polling
      if (
        res.status === "completed" ||
        res.status === "busy" ||
        res.status === "ended" ||
        res.status === "unanswered"
      ) {
        if (interval) clearInterval(interval); // 👈 stop API hits
        dispatch(togglePopup(false));

        navigate("/call"); // 👈 redirect to dashboard
        reset();
      }
    } catch (err) {
      console.error("Polling failed", err);
    }
  };

  // ✅ Polling every 3s when popup is open
  useEffect(() => {
    let interval: number;
    if (openPopup && callId) {
      interval = setInterval(() => {
        handlePoll(callId, interval); // 👈 pass interval ref
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [openPopup, callId, token]);

  // const [loadingPrompt, setLoadingPrompt] = useState<boolean>(false);

  // // const token = useSelector((state: RootState) => state.auth.user?.access_token);

  // // ✅ Fetch System Prompt and auto-fill "context"
  // useEffect(() => {
  //   const fetchPrompt = async () => {
  //     try {
  //       setLoadingPrompt(true);
  //       if (!token) return;

  //       const response = await getSystemPrompt(token);
  //       if (response?.system_prompt) {
  //         // ✅ Fill “Call Context” field automatically
  //         setValue("context", response.system_prompt);
  //       }
  //     } catch (err) {
  //       const error = err as AxiosError<{ error?: string }>;
  //       toast.error(error.response?.data?.error || "Failed to load prompt.");
  //       console.error("Prompt fetch error:", err);
  //     } finally {
  //       setLoadingPrompt(false);
  //     }
  //   };

  //   fetchPrompt();
  // }, [token, setValue]);

  // Input tel: Name or phone search in api
  const [contacts, setContacts] = useState<
    { firstName: string; phoneNumber: string }[]
  >([]);
  const [filteredContacts, setFilteredContacts] = useState<typeof contacts>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (!token) return;
        const response = await getContacts(token); // ye ab filtered array return karega
        setContacts(response); // full array
        setFilteredContacts(response); // dropdown filter
      } catch (err) {
        console.error("Failed to fetch contacts", err);
        toast.error("Failed to load contacts");
      }
    };

    fetchContacts();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setFilteredContacts(
      contacts.filter(
        (c) =>
          c.phoneNumber.includes(value) ||
          c.firstName.toLowerCase().includes(value)
      )
    );
  };

  return (
    <>
      {/* <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8"> */}
      <div className="max-w-3xl mx-auto p-8 mt-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-10 text-[#13243C]">
          Let AI Handle Your Next Call
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div>
              <label className="block text-sm font-semibold text-[#13243C] mb-1">
                Your Name
              </label>
              <input
                type="text"
                {...register("caller_name", { required: "Name is required" })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 hover:border-blue-900
 ${errors.caller_name ? "border-red-500" : "border-gray-300"}`}
                placeholder="Your Name"
              />
              {errors.caller_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.caller_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#13243C] mb-1">
                Your Email
              </label>
              <input
                type="email"
                {...register("caller_email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Email is invalid",
                  },
                })}
                className={`w-full px-4 hover:border-blue-900
 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900  ${
   errors.caller_email ? "border-red-500" : "border-gray-300"
 }`}
                placeholder="name@example.com"
              />
              {errors.caller_email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.caller_email.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-semibold text-[#13243C] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("outbound_number", {
                  required: "Outbound number is required",
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: "Enter a valid phone number",
                  },
                })}
                onFocus={() => setShowDropdown(true)}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md hover:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 ${
                  errors.outbound_number ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="+1234567890"
              />
              {showDropdown && filteredContacts.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
                  {filteredContacts.map((c, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setValue("outbound_number", c.phoneNumber);
                        setShowDropdown(false);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                    >
                      <span className="font-medium">{c.firstName}</span> -{" "}
                      {c.phoneNumber}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Agent Name (New Field) */}
          <div>
            <label className="block text-sm font-semibold text-[#13243C] mb-1">
              Agent Name
            </label>
            <select
              {...register("voice", { required: "Agent name is required" })}
              className={`w-full px-4 py-2 border rounded-md hover:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 ${
                errors.voice ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Agent</option>
              <option value="david">David - english (Male)</option>
              <option value="ravi">Ravi - english (Male)</option>
              <option value="emily-british">Emily - english (Female)</option>
              <option value="alice-british">Alice - english (Female)</option>
              <option value="julia-british">Julia - english (Female)</option>
              <option value="julio">Julio - spanish (Male)</option>
              <option value="donato">Donato - spanish (Male)</option>
              <option value="helena-spanish">Helena - spanish (Female)</option>
              <option value="rosa">Rosa - spanish (Female)</option>
              <option value="mariam">Mariam - spanish (Female)</option>
            </select>
            {errors.voice && (
              <p className="text-red-500 text-xs mt-1">
                {errors.voice.message}
              </p>
            )}
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm font-semibold text-[#13243C] mb-1">
              Call Context
            </label>
            <textarea
              {...register("context", { required: "Context is required" })}
              // disabled={loadingPrompt} // ✅ disable while loading
              // placeholder={
              //   loadingPrompt
              //     ? "Loading system prompt..."
              //     : "Provide any additional context for the call..."
              // }
              className={`w-full px-4 py-2 border rounded-md hover:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 ${
                errors.context ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.context && (
              <p className="text-red-500 text-xs mt-1">
                {errors.context.message}
              </p>
            )}
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-[#13243C] mb-1">
              Language
            </label>
            <select
              {...register("language")}
              className="w-full px-4 py-2 border border-gray-300 hover:border-blue-900 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#13243C] text-lg hover:opacity-90 font-semibold w-full cursor-pointer text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-blue-900 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed in_hover"
            >
              {isSubmitting ? "Initiating Call..." : "Initiate Call"}
            </button>
          </div>
        </form>
      </div>
      {/* ==== Popup ==== */}

      {openPopup && (
        // <div
        //   className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-md"
        //   onClick={() => dispatch(togglePopup(false))}
        // >
        //   <div
        //     className="relative bg-gradient-to-br from-[#ffffff10] to-[#e9f0ff40] border border-blue-300/40 rounded-2xl shadow-2xl w-[90%] sm:w-[70%] md:w-[45%] text-center p-6 backdrop-blur-lg"
        //     onClick={(e) => e.stopPropagation()}
        //   >
        //     <div className="absolute inset-0 rounded-2xl border border-blue-400/30 animate-[pulseBorder_3s_ease-in-out_infinite] pointer-events-none"></div>

        //     <h2 className="text-3xl font-bold text-blue-900 mb-6 tracking-wide">
        //       Call Initiated
        //     </h2>

        //     <div className="flex flex-wrap items-center justify-center mb-6 text-gray-800">
        //       <span className="font-medium">Call ID:</span>
        //       <span className="ml-3 text-blue-700 font-semibold">{callId}</span>
        //     </div>

        //     <div className="flex flex-col items-center justify-center">
        //       <div className="relative w-28 h-28 flex items-center justify-center">
        //         <div className="absolute w-full h-full rounded-full border-4 border-blue-400/30 animate-spin-slow"></div>
        //         <div className="absolute w-[80%] h-[80%] rounded-full border-4 border-blue-500/50 animate-spin-reverse"></div>

        //         <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow-[0_0_30px_#3b82f6aa] animate-pulse">
        //           <IoCall color="white" size={36} className="animate-bounce" />
        //         </div>
        //       </div>

        //       <p className="mt-6 text-lg font-semibold text-blue-900 animate-pulse">
        //         {status ?? "Connecting..."}
        //       </p>
        //     </div>

        //     <div className="mt-8 border-t border-blue-200/50 pt-6 flex justify-center space-x-4">
        //       <button
        //         onClick={() => callId && handlePoll(callId)}
        //         className="px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        //       >
        //         Check Status Now
        //       </button>
        //       <button
        //         onClick={() => dispatch(togglePopup(false))}
        //         className="px-6 py-2 border border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 transition-all duration-300"
        //       >
        //         Close
        //       </button>
        //     </div>
        //   </div >
        // </div >

        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => dispatch(togglePopup(false))}
        >
          {" "}
          <div
            className="bg-white rounded-lg shadow-lg w-[95%] sm:w-[75%] md:w-[50%] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {" "}
            <h2 className="text-3xl text-[#13243C] text-center font-bold mb-4 p-5">
              Call Initiated
            </h2>{" "}
            <div className="flex flex-wrap items-center mb-4 px-6">
              {" "}
              <span className="font-medium">Call ID:</span>{" "}
              <span className="md:px-3 md:mx-5 py-1 text-gray-700 rounded-lg">
                {" "}
                {callId}{" "}
              </span>{" "}
            </div>{" "}
            <div className="rounded-lg">
              {" "}
              {/* Caller Section */}{" "}
              <div className="flex flex-col items-center justify-center py-5">
                {" "}
                {/* Animated Circle */}{" "}
                <div className="relative">
                  {" "}
                  {/* Outer Animated Pulse */}{" "}
                  <span className="absolute inset-0 rounded-full bg-[#13243C] opacity-60 animate-ping"></span>{" "}
                  {/* Inner Static Circle */}{" "}
                  <div className="w-20 h-20 rounded-full bg-[#13243C] flex items-center justify-center shadow-md relative overflow-hidden">
                    {" "}
                    <IoCall color="white" size={30} />{" "}
                  </div>{" "}
                </div>{" "}
                {/* Status Below */}{" "}
                <p className="mt-6 text-lg font-medium text-[#13243C] animate-pulse">
                  {" "}
                  {status ?? "Connecting..."}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            {/* <div className="p-6 max-h-96 overflow-y-auto border-t border-blue-200 bg-blue-50 "> */}{" "}
            <div className="text-gray-700 leading-relaxed"> </div>{" "}
            <div className="p-6 border-t border-[#d1d5dc] flex justify-center">
              {" "}
              <button
                onClick={() => callId && handlePoll(callId)}
                className="w-full cursor-pointer sm:w-auto px-2 sm:px-6 py-2 bg-[#13243C] text-white rounded-lg hover:opacity-90 transform transition-all duration-200 font-medium text-base font-semibold shadow-lg"
              >
                {" "}
                Check Status Now{" "}
              </button>{" "}
              <button
                onClick={() => dispatch(togglePopup(false))}
                className="ml-4 px-6 py-2 bg-white border border-[#13243C] text-[#13243C] text-base font-semibold rounded-lg cursor-pointer"
              >
                {" "}
                Close{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>

        // <div
        //   className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-md"
        //   onClick={() => dispatch(togglePopup(false))}
        // >
        //   <div
        //     className="relative bg-gradient-to-br from-[#ffffff10] to-[#e9f0ff40] border border-blue-300/40 rounded-2xl shadow-2xl w-[90%] sm:w-[70%] md:w-[45%] text-center p-6 backdrop-blur-lg"
        //     onClick={(e) => e.stopPropagation()}
        //   >
        //     {/* Glowing border animation */}
        //     <div className="absolute inset-0 rounded-2xl border border-blue-400/30 animate-[pulseBorder_3s_ease-in-out_infinite] pointer-events-none"></div>

        //     <h2 className="text-3xl font-bold text-blue-900 mb-6 tracking-wide">
        //       Call Initiated
        //     </h2>

        //     <div className="flex flex-wrap items-center mb-6 text-black">
        //       <span className="font-medium">Call ID:</span>
        //       <span className="ml-3 text-black font-semibold">{callId}</span>
        //     </div>

        //     {/* Animated phone section */}
        //     <div className="flex flex-col items-center justify-center">
        //       <div className="relative w-28 h-28 flex items-center justify-center">
        //         {/* Rotating ring glow */}
        //         <div className="absolute w-full h-full rounded-full border-4 border-blue-400/30 animate-spin-slow"></div>
        //         <div className="absolute w-[80%] h-[80%] rounded-full border-4 border-blue-500/50 animate-spin-reverse"></div>

        //         {/* Pulsing inner circle */}
        //         <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow-[0_0_30px_#3b82f6aa] animate-pulse">
        //           <IoCall color="white" size={36} className="animate-bounce mt-2" />
        //         </div>
        //       </div>

        //       {/* Connecting text */}
        //       <p className="mt-6 text-lg font-semibold text-blue-900 animate-pulse">
        //         {status ?? "Connecting..."}
        //       </p>
        //     </div>

        //     {/* Buttons */}
        //     <div className="mt-8 border-t border-gray-200/50 pt-6 flex justify-center space-x-4">
        //       <button
        //         onClick={() => callId && handlePoll(callId)}
        //         className="px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
        //       >
        //         Check Status Now
        //       </button>
        //       <button
        //         onClick={() => dispatch(togglePopup(false))}
        //         className="px-6 py-2 border border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 transition-all duration-300 cursor-pointer"
        //       >
        //         Close
        //       </button>
        //     </div>
        //   </div>
        // </div>
      )}
    </>
  );
}

export default CallForm;
