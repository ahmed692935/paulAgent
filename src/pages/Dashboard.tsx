// import { useEffect, useState } from "react";
// import type { RowData } from "../interfaces/dashboard";
// import { FiCheckCircle, FiPhone, FiXCircle } from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "../store/store";
// import {
//   fetchCallHistory,
//   fetchCallTranscript,
//   fetchRecordingStream,
// } from "../api/dashboard";
// import {
//   fetchCallsFailure,
//   fetchCallsStart,
//   fetchCallsSuccess,
// } from "../store/slices/dashboardSlice";
// import type { AxiosError } from "axios";
// import toast from "react-hot-toast";

// const Dashboard = () => {
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
//   const [activeTab, setActiveTab] = useState<"transcription" | "summary">(
//     "transcription"
//   );
//   const [transcriptLoading, setTranscriptLoading] = useState(false);
//   const [loadingRecordings, setLoadingRecordings] = useState<string | null>(
//     null
//   );

//   const dispatch = useDispatch<AppDispatch>();
//   const { calls, loading, error } = useSelector(
//     (state: RootState) => state.dashboard
//   );

//   const [currentPage, setCurrentPage] = useState(1); // ✅ pagination state
//   const pageSize = 10;

//   const token = useSelector(
//     (state: RootState) => state.auth.user?.access_token
//   );
//   const pagination = useSelector(
//     (state: RootState) => state.dashboard.pagination
//   );

//   const totalCalls = pagination?.total || 0;
//   const totalPages = Math.ceil(totalCalls / pageSize);

//   const successfulCalls = pagination?.completed_calls || 0;
//   const queuedCalls = pagination?.not_completed_calls || 0;

//   // const successfulCalls = calls.filter((c) => c.status === "completed").length;
//   // const failedCalls = calls.filter(
//   //   (c) => c.status === "failed" || c.status === "queued"
//   // ).length;

//   // const authState = useSelector((state: RootState) => state.auth);

//   // console.log(authState, "DATA");

//   useEffect(() => {
//     const loadHistory = async () => {
//       if (token) {
//         try {
//           dispatch(fetchCallsStart());
//           // const data = await fetchCallHistory(token, 1, 10);
//           const data = await fetchCallHistory(token, currentPage, pageSize);

//           dispatch(
//             fetchCallsSuccess({
//               calls: data.calls,
//               pagination: data.pagination,
//               // status_counts: data.status_counts,
//             })
//           );
//         } catch (err: unknown) {
//           console.error("Failed to fetch call history:", err);
//           let errorMessage = "Failed to fetch call history";

//           if (err instanceof Error) {
//             errorMessage = err.message;
//           }

//           dispatch(fetchCallsFailure(errorMessage));
//         }
//       }
//     };

//     loadHistory();
//   }, [dispatch, token, currentPage]);
//   // useEffect(() => {
//   //   const loadHistory = async () => {
//   //     if (token) {
//   //       try {
//   //         dispatch(fetchCallsStart());
//   //         const data = await fetchCallHistory(token, currentPage, pageSize);

//   //         dispatch(
//   //           fetchCallsSuccess({
//   //             calls: data.calls,
//   //             pagination: data.pagination,
//   //           })
//   //         );
//   //       } catch (err: unknown) {
//   //         console.error("Failed to fetch call history:", err);
//   //         let errorMessage = "Failed to fetch call history";

//   //         if (err instanceof Error) {
//   //           errorMessage = err.message;
//   //         }

//   //         dispatch(fetchCallsFailure(errorMessage));
//   //       }
//   //     }
//   //   };

//   //   // Initial load
//   //   loadHistory();

//   //   // Auto-refresh every 5s
//   //   const intervalId = window.setInterval(loadHistory, 5000);

//   //   // Cleanup
//   //   return () => window.clearInterval(intervalId);
//   // }, [dispatch, token, currentPage]);

//   // if (loading) return <p>Loading calls...</p>;
//   // if (loading)
//   //   return (
//   //     <div className="flex flex-col items-center justify-center h-screen space-y-4">
//   //       {/* Spinner */}
//   //       <div className="w-12 h-12 border-4 border-purple-300 border-t-[#391f52] rounded-full animate-spin"></div>

//   //       {/* Text */}
//   //       <p className="text-lg font-semibold text-[#391f52]">
//   //         Loading analytics...
//   //       </p>
//   //     </div>
//   //   );

//   if (error) return <p className="text-red-500">{error}</p>;

//   // const handleOpenModal = (row: RowData) => {
//   //   setSelectedRow(row);
//   //   setActiveTab("transcription");
//   //   setOpenModal(true);
//   // };
//   const handleOpenModal = async (row: RowData) => {
//     setSelectedRow(row);
//     setActiveTab("transcription");
//     setOpenModal(true);

//     if (!token) {
//       toast.error("Missing authentication token");
//       return;
//     }
//     setTranscriptLoading(true);
//     try {
//       const data = await fetchCallTranscript(row.call_id, token);
//       setSelectedRow((prev) =>
//         prev
//           ? { ...prev, transcript: data.transcript }
//           : { ...row, transcript: data.transcript }
//       );
//     } catch (err) {
//       const error = err as AxiosError<{ error: string }>;
//       toast.error(error?.response?.data?.error || "Failed to load transcript");
//     } finally {
//       setTranscriptLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedRow(null);
//   };

//   // const handleListenRecording = async (callId: string) => {
//   //   if (!token) return alert("Missing authentication token");

//   //   try {
//   //     const audioUrl = await fetchRecordingStream(callId, token);

//   //     // ✅ Option 1: Open in new tab
//   //     window.open(audioUrl, "_blank");

//   //     // ✅ Option 2 (alternative): Play inline
//   //     // const audio = new Audio(audioUrl);
//   //     // audio.play();
//   //   } catch (err: unknown) {
//   //     const error = err as AxiosError<{ error: string }>;
//   //     toast.error(error?.response?.data?.error || "Oops an error occurred");
//   //     console.error(err);
//   //   }
//   //   // catch (error) {
//   //   //   console.error("Failed to fetch recording:", error);
//   //   //   // alert("Unable to fetch recording. Please try again later.");
//   //   // }
//   // };
//   const handleListenRecording = async (callId: string) => {
//     if (!token) {
//       toast.error("Missing authentication token");
//       return;
//     }

//     setLoadingRecordings(callId); // ✅ Start loading spinner

//     try {
//       const audioUrl = await fetchRecordingStream(callId, token);

//       // ✅ Open in new tab
//       window.open(audioUrl, "_blank");
//     } catch (err) {
//       const error = err as AxiosError<{ error: string }>;
//       toast.error(error?.response?.data?.error || "Oops an error occurred");
//       console.error(err);
//     } finally {
//       setLoadingRecordings(null); // ✅ Stop loader
//     }
//   };

//   return (
//     <div className="">
//       <div className=" py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-[#3F3EED] mb-2">
//             Analytics Dashboard
//           </h1>
//           <p className="text-black">Monitor and analyze agent interactions</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {/* Total Calls */}
//           <div
//             className="bg-white rounded-xl shadow-lg border border-blue-200 p-6 flex items-center justify-between
//                   transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fadeInUp"
//           >
//             <div>
//               <h3 className="text-lg font-semibold text-[#391f52]">
//                 Total Calls
//               </h3>
//               <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {totalCalls || 0}
//               </p>
//             </div>
//             <div className="bg-[#3F3EED] text-white p-4 rounded-lg flex items-center justify-center">
//               <FiPhone size={28} />
//             </div>
//           </div>

//           {/* Successful Calls */}
//           <div
//             className="bg-white rounded-xl shadow-lg border border-green-200 p-6 flex items-center justify-between
//                   transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fadeInUp delay-100"
//           >
//             <div>
//               <h3 className="text-lg font-semibold text-green-700">
//                 Successful Calls
//               </h3>
//               <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {successfulCalls}
//               </p>
//             </div>
//             <div className="bg-green-600 text-white p-4 rounded-lg flex items-center justify-center mr-4">
//               <FiCheckCircle size={24} />
//             </div>
//           </div>

//           {/* Failed Calls */}
//           <div
//             className="bg-white rounded-xl shadow-lg border border-red-200 p-6 flex items-center justify-between
//                   transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fadeInUp delay-200"
//           >
//             <div>
//               <h3 className="text-lg font-semibold text-red-700">Others</h3>
//               <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {queuedCalls}
//               </p>
//             </div>
//             <div className="bg-red-600 text-white p-4 rounded-lg flex items-center justify-center mr-4">
//               <FiXCircle size={24} />
//             </div>
//           </div>
//         </div>

//         {/* Table Container */}
//         <div className="bg-white rounded-xl border border-blue-200 shadow-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 {/* <tr className="bg-[#391f52] to-purple-700 border-b border-purple-500"> */}
//                 <tr className="bg-[#3F3EED] border-b border-blue-500">
//                   <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
//                     User Info
//                   </th>
//                   <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
//                     Agent Name
//                   </th>
//                   <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
//                     Receiver Number
//                   </th>
//                   <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
//                     Call Status
//                   </th>
//                   <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
//                     Call Creation
//                   </th>
//                   {/* <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
//                     Call Duration (sec)
//                   </th> */}
//                   <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
//                     Recording Url
//                   </th>
//                   <th className="px-4 py-4 text-center text-sm font-semibold text-white whitespace-nowrap">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               {/* <tbody>
//                 {calls?.map((row, index) => (
//                   <tr
//                     key={row.id}
//                     className={`border-b border-purple-100 hover:bg-purple-50 transition-colors duration-200 ${
//                       index % 2 === 0 ? "bg-purple-25" : "bg-white"
//                     }`}
//                   >
//                     <td className="px-4 py-4 text-gray-800 whitespace-nowrap">
//                       {row.username}
//                       <p className="text-xs">{row.email}</p>
//                       <p className="text-xs">{row.from_number || "N/A"}</p>
//                     </td>
//                     <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
//                       {row.voice_name}
//                     </td>
//                     <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
//                       {row.to_number}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 py-1 rounded-full font-semibold
//       ${row.status === "completed" ? "bg-green-100 text-green-800" : ""}
//       ${row.status === "queued" ? "bg-gray-200 text-gray-800" : ""}
//       ${row.status === "failed" ? "bg-red-100 text-red-800" : ""}
//     `}
//                       >
//                         {row.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
//                       {row.started_at
//                         ? new Date(row.started_at).toLocaleString()
//                         : "N/A"}
//                     </td>
//                     <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
//                       {row.duration || "N/A"}
//                     </td>
//                     <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
//                       {row.recording_url ? (
//                         <a
//                           href={row.recording_url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-purple-600 underline"
//                         >
//                           Listen
//                         </a>
//                       ) : (
//                         "N/A"
//                       )}
//                     </td>
//                     <td className="px-4 py-4 text-center whitespace-nowrap">
//                       <button
//                         onClick={() => handleOpenModal(row)}
//                         className="px-4 py-2 cursor-pointer text-sm font-medium bg-[#391f52] text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
//                       >
//                         Details
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody> */}
//               <tbody>
//                 {/* ✅ Table level loading state */}
//                 {loading ? (
//                   <tr>
//                     <td
//                       colSpan={8}
//                       className="text-center py-10 text-[#391f52] font-medium"
//                     >
//                       <div className="flex flex-col items-center space-y-2">
//                         <div className="w-8 h-8 border-4 border-[#3F3EED] border-t-[#5454f9] rounded-full animate-spin"></div>
//                         <p className="text-[#3F3EED]">Loading calls...</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   calls?.map((row, index) => (
//                     <tr
//                       key={row.id}
//                       className={`border-b border-blue-100 hover:bg-blue-50 transition-colors duration-200 ${
//                         index % 2 === 0 ? "bg-blue-25" : "bg-white"
//                       }`}
//                     >
//                       <td className="px-4 py-4 text-gray-800 whitespace-nowrap">
//                         {row.username}
//                         <p className="text-xs">{row.email}</p>
//                         {/* <p className="text-xs">{row.from_number || "N/A"}</p> */}
//                       </td>
//                       <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
//                         {row.voice_name}
//                       </td>
//                       <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
//                         {row.to_number}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap">
//                         <span
//                           className={`px-2 py-1 rounded-full font-semibold
//                     ${
//                       row.status === "completed" || row.status === "connected"
//                         ? "bg-green-100 text-green-800"
//                         : ""
//                     }
//                     ${
//                       row.status === "not_attended" ||
//                       row.status === "unanswered"
//                         ? "bg-gray-200 text-gray-800"
//                         : ""
//                     }
//                     ${
//                       row.status === "no-answer" || row.status === "busy"
//                         ? "bg-red-100 text-red-800"
//                         : ""
//                     }
//                     ${row.status === "busy" ? "bg-red-100 text-red-800" : ""}`}
//                         >
//                           {row.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
//                         {row.started_at
//                           ? new Date(row.started_at).toLocaleString()
//                           : "N/A"}
//                       </td>
//                       {/* <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
//                         {row.duration ? Number(row.duration).toFixed(2) : "N/A"}
//                       </td> */}
//                       {/* <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
//                         {row.recording_url ? (
//                           <a
//                             href={row.recording_url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-[#3F3EED] underline"
//                           >
//                             Listen
//                           </a>
//                         ) : (
//                           "N/A"
//                         )}
//                       </td> */}
//                       {/* <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
//                         <button
//                           onClick={() => handleListenRecording(row.call_id)}
//                           className="text-[#3F3EED] underline cursor-pointer hover:text-blue-700"
//                         >
//                           Listen
//                         </button>
//                       </td> */}
//                       <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
//                         <button
//                           onClick={() => handleListenRecording(row.call_id)}
//                           disabled={loadingRecordings === row.call_id}
//                           className={`flex items-center gap-2 text-[#3F3EED] underline cursor-pointer
//       ${
//         loadingRecordings === row.call_id
//           ? "opacity-60 pointer-events-none"
//           : "hover:text-blue-700"
//       }`}
//                         >
//                           {loadingRecordings === row.call_id ? (
//                             <>
//                               <div className="w-4 h-4 border-2 border-[#3F3EED] border-t-transparent rounded-full animate-spin"></div>
//                               <span>Listen</span>
//                             </>
//                           ) : (
//                             "Listen"
//                           )}
//                         </button>
//                       </td>

//                       <td className="px-4 py-4 text-center whitespace-nowrap">
//                         <button
//                           onClick={() => handleOpenModal(row)}
//                           className="px-4 py-2 cursor-pointer text-sm font-medium bg-[#3F3EED] text-white rounded-lg hover:scale-105 transition"
//                         >
//                           Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className="flex justify-between items-center mt-6">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer "
//           >
//             Previous
//           </button>

//           <span className="text-sm text-gray-600">
//             Page {currentPage} of {totalPages}
//           </span>

//           <button
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Modal Overlay */}
//       {openModal && selectedRow && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           {/* Background Overlay */}
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={handleCloseModal}
//           ></div>

//           {/* Modal Content */}
//           <div className="relative bg-white w-full max-w-2xl rounded-xl border border-blue-200 shadow-2xl overflow-hidden">
//             {/* Modal Header */}
//             {/* <div className="p-6 border-b border-blue-200 bg-gradient-to-b from-[#6d0f78] to-[#0a0f2d]"> */}
//             <div className="p-6 border-b border-blue-200 bg-gradient-to-r from-[#2A1EB3] via-[#3F3EED] to-[#7C78FF]">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-xl font-bold text-white mb-2">
//                     Call Details
//                   </h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 mt-3 gap-1 md:gap-30 text-sm">
//                     {/* Left Column */}
//                     <div className="space-y-1">
//                       <p className="text-white">
//                         <span className="text-white">User ID:</span>{" "}
//                         {selectedRow.user_id || "N/A"}
//                       </p>
//                       <p className="text-white">
//                         <span className="text-white">Agent ID:</span>{" "}
//                         {selectedRow.voice_id || "N/A"}
//                       </p>
//                       <p className="text-white">
//                         <span className="text-white">Call ID:</span>{" "}
//                         {selectedRow.call_id || "N/A"}
//                       </p>
//                     </div>

//                     {/* Right Column */}
//                     <div className="space-y-1">
//                       <p className="text-white">
//                         <span className="text-white">Call Started:</span>{" "}
//                         {selectedRow.started_at
//                           ? new Date(selectedRow.started_at).toLocaleString()
//                           : "N/A"}
//                       </p>
//                       <p className="text-white">
//                         <span className="text-white">Call Ended:</span>{" "}
//                         {selectedRow.ended_at
//                           ? new Date(selectedRow.ended_at).toLocaleString()
//                           : "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleCloseModal}
//                   className="text-blue-200 hover:text-white transition-colors p-1 cursor-pointer"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {transcriptLoading && (
//               <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
//                 <div className="w-10 h-10 border-4 border-[#3F3EED] border-t-transparent rounded-full animate-spin"></div>
//                 <p className="text-[#3F3EED] mt-3 font-medium">
//                   Loading transcript...
//                 </p>
//               </div>
//             )}

//             {/* Tab Navigation */}
//             <div className="flex border-b border-blue-200 bg-blue-50">
//               <button
//                 className={`px-6 py-4 text-sm font-medium transition-all duration-200 relative ${
//                   activeTab === "transcription"
//                     ? "text-[#3F3EED] bg-white"
//                     : "text-blue-900 hover:text-blue-700 hover:bg-blue-100"
//                 }`}
//                 onClick={() => setActiveTab("transcription")}
//               >
//                 Transcription
//                 {activeTab === "transcription" && (
//                   <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F3EED]"></div>
//                 )}
//               </button>
//               {/* <button
//                 className={`px-6 py-4 text-sm font-medium transition-all duration-200 relative ${
//                   activeTab === "summary"
//                     ? "text-[#3F3EED] bg-white"
//                     : "text-blue-900 hover:text-blue-700 hover:bg-blue-100"
//                 }`}
//                 onClick={() => setActiveTab("summary")}
//               >
//                 Summary
//                 {activeTab === "summary" && (
//                   <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F3EED]"></div>
//                 )}
//               </button> */}
//             </div>

//             {/* Tab Content */}
//             <div className="p-6 max-h-96 overflow-y-auto">
//               <div className="text-gray-700 leading-relaxed">
//                 {activeTab === "transcription" ? (
//                   <div>
//                     <h4 className="text-[#3F3EED] font-semibold mb-3">
//                       Call Transcription
//                     </h4>
//                     {/* <p className="text-gray-600">{selectedRow.transcription}</p> */}
//                     {/* {selectedRow.transcript ? (
//                       <ul className="space-y-2">
//                         {selectedRow.transcript.map((line, idx) => (
//                           <li key={idx} className="text-sm">
//                             <span className="font-semibold text-[#3F3EED]">
//                               {line.role}:
//                             </span>{" "}
//                             {line.text}
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p className="text-gray-600">
//                         No transcription available
//                       </p>
//                     )} */}

//                     {/* {selectedRow.transcript &&
//                     Array.isArray(selectedRow.transcript.items) ? (
//                       <ul className="space-y-2">
//                         {selectedRow.transcript.items.map((item, idx) => (
//                           <li key={idx} className="text-sm">
//                             <span className="font-semibold text-[#3F3EED]">
//                               {item.role === "assistant" ? "Agent" : "User"}:
//                             </span>{" "}
//                             {Array.isArray(item.content)
//                               ? item.content.join(" ")
//                               : item.content || ""}
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p className="text-gray-600">
//                         No transcription available
//                       </p>
//                     )} */}
//                     {selectedRow.transcript &&
//                     Array.isArray(selectedRow.transcript.items) &&
//                     selectedRow.transcript.items.length > 0 ? (
//                       <ul className="space-y-2">
//                         {selectedRow.transcript.items.map((item, idx) => (
//                           <li key={idx} className="text-sm">
//                             <span className="font-semibold text-[#3F3EED]">
//                               {item.role === "assistant" ? "Agent" : "User"}:
//                             </span>{" "}
//                             {Array.isArray(item.content)
//                               ? item.content.join(" ")
//                               : item.content || ""}
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p className="text-gray-600">
//                         {selectedRow.transcript?.note ||
//                           "No transcript available"}
//                       </p>
//                     )}
//                   </div>
//                 ) : (
//                   <div>
//                     <h4 className="text-[#3F3EED] font-semibold mb-3">
//                       Call Summary
//                     </h4>
//                     <p className="text-gray-600">
//                       {selectedRow.summary || "No summary available"}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="p-6 border-t border-blue-200 bg-blue-50 flex justify-center">
//               <button
//                 onClick={handleCloseModal}
//                 className="w-full cursor-pointer sm:w-auto px-6 py-2 bg-[#3F3EED] text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

// My code

// Everything are working

import { useEffect, useState } from "react";
import type { RowData } from "../interfaces/dashboard";
import { Phone, CircleCheckBig, PhoneMissed, LayoutDashboard, Mic, X } from "lucide-react";
import { motion } from "framer-motion";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  fetchCallHistory,
  fetchCallTranscript,
  fetchRecordingStream,
} from "../api/dashboard";
import {
  fetchCallsFailure,
  fetchCallsStart,
  fetchCallsSuccess,
} from "../store/slices/dashboardSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

import { getGoogleAuth } from "../api/dashboard";
// import { callOutcomes } from "../api/Call";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [activeTab, setActiveTab] = useState<"transcription" | "summary">(
    "transcription"
  );
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [loadingRecordings, setLoadingRecordings] = useState<string | null>(
    null
  );

  const dispatch = useDispatch<AppDispatch>();
  const { calls, loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  const [currentPage, setCurrentPage] = useState(1); // ✅ pagination state
  const pageSize = 10;

  const token = useSelector(
    (state: RootState) => state.auth.user?.access_token
  );
  const pagination = useSelector(
    (state: RootState) => state.dashboard.pagination
  );

  const totalCalls = pagination?.total || 0;
  const totalPages = Math.ceil(totalCalls / pageSize);

  const successfulCalls = pagination?.completed_calls || 0;
  const queuedCalls = pagination?.not_completed_calls || 0;

  useEffect(() => {
    const loadHistory = async () => {
      if (token) {
        try {
          dispatch(fetchCallsStart());
          // const data = await fetchCallHistory(token, 1, 10);
          const data = await fetchCallHistory(token, currentPage, pageSize);

          dispatch(
            fetchCallsSuccess({
              calls: data.calls,
              pagination: data.pagination,
              // status_counts: data.status_counts,
            })
          );
        } catch (err: unknown) {
          console.error("Failed to fetch call history:", err);
          let errorMessage = "Failed to fetch call history";

          if (err instanceof Error) {
            errorMessage = err.message;
          }

          dispatch(fetchCallsFailure(errorMessage));
        }
      }
    };

    loadHistory();
  }, [dispatch, token, currentPage]);


  if (error) return <p className="text-red-500">{error}</p>;

  const handleOpenModal = async (row: RowData) => {
    setSelectedRow(row);
    setActiveTab("transcription");
    setOpenModal(true);

    if (!token) {
      toast.error("Missing authentication token");
      return;
    }
    setTranscriptLoading(true);
    try {
      const data = await fetchCallTranscript(row.call_id, token);
      setSelectedRow((prev: RowData | null) =>
        prev
          ? { ...prev, transcript: data.transcript }
          : { ...row, transcript: data.transcript }
      );
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error?.response?.data?.error || "Failed to load transcript");
    } finally {
      setTranscriptLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  // const handleListenRecording = async (callId: string) => {
  //   if (!token) {
  //     toast.error("Missing authentication token");
  //     return;
  //   }

  //   setLoadingRecordings(callId); // ✅ Start loading spinner

  //   try {
  //     const audioUrl = await fetchRecordingStream(callId, token);

  //     // ✅ Open in new tab
  //     window.open(audioUrl, "_blank");
  //   } catch (err) {
  //     const error = err as AxiosError<{ error: string }>;
  //     toast.error(error?.response?.data?.error || "Oops an error occurred");
  //     console.error(err);
  //   } finally {
  //     setLoadingRecordings(null); // ✅ Stop loader
  //   }
  // };

  const handleListenRecording = async (callId: string) => {
    if (!token) {
      toast.error("Missing authentication token");
      return;
    }

    setLoadingRecordings(callId);

    try {
      const data = await fetchRecordingStream(callId, token);

      const audioUrl = data?.recording_url;  // correct JSON key

      if (!audioUrl) {
        toast.error("Recording URL not found");
        return;
      }

      // open audio file
      window.open(audioUrl, "_blank");
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error?.response?.data?.error || "Oops an error occurred");
    } finally {
      setLoadingRecordings(null);
    }
  };




  const [ready, setReady] = useState(false);
  useEffect(() => {
    setTimeout(() => setReady(true), 50);
  }, []);


  //=====================
  // Google Button Auth
  // ====================

  const [googleLoading, setLoading] = useState(false);

  // const handleCalendarClick = async () => {
  //   if (!token) {
  //     toast.error("Missing authentication token");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const data = await getGoogleAuth(token);

  //     if (data?.authorization_url) {
  //       // Open URL in new tab
  //       window.open(data.authorization_url, "_blank");
  //     } else {
  //       toast.error("Authorization URL not found");
  //     }
  //   } catch (error: any) {
  //     console.error("Google Auth Error:", error);
  //     toast.error(error?.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleCalendarClick = async () => {
    if (!token) {
      toast.error("Missing authentication token");
      return;
    }

    setLoading(true);
    try {
      const data = await getGoogleAuth(token);

      if (data?.authorization_url) {
        // Redirect in same tab
        window.location.href = data.authorization_url;
      } else {
        toast.error("Authorization URL not found");
      }
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  // -----------------------
  // Call Outcome
  // ----------------------
  const statusStyles: Record<string, string> = {
    booked: "text-emerald-500 font-bold",
    call_again: "text-amber-500 font-bold",
    do_not_call: "text-rose-500 font-bold",
  };

  return (
    <div className="py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between animate-fadeIn">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            Analytics <span className="text-brand-primary">Dashboard</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-tight">Monitor and analyze agent interactions in real-time.</p>
        </div>
        <button
          onClick={handleCalendarClick}
          disabled={googleLoading}
          className="group flex items-center gap-2 px-8 py-4 glass rounded-2xl text-white font-bold hover:bg-white/10 transition-all border border-white/5 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <LayoutDashboard size={20} className="text-brand-primary group-hover:scale-110 transition-transform" />
          )}
          Connect Calendar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { label: "Total Calls", value: totalCalls, icon: <Phone size={24} />, color: "brand-primary" },
          { label: "Successful", value: successfulCalls, icon: <CircleCheckBig size={24} />, color: "brand-secondary" },
          { label: "Other Status", value: queuedCalls, icon: <PhoneMissed size={24} />, color: "brand-accent" }
        ].map((stat, idx) => (
          <div
            key={idx}
            className="glass p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/5 transition-all duration-500 border border-white/5 hover:border-white/10"
          >
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{stat.label}</h3>
              <p className="text-4xl font-black text-white tracking-tighter">{stat.value || 0}</p>
            </div>
            <div className={`p-4 rounded-2xl bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl shadow-${stat.color}/20`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-8 items-start">
        {/* Graph Section */}
        <div className="glass p-8 rounded-[3rem] border border-white/5 space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-primary" />
            Call Distribution
          </h3>
          <div className="h-[300px] w-full relative">
            {ready && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Successful", value: successfulCalls || 0 },
                      { name: "Failed", value: queuedCalls || 0 },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    stroke="none"
                  >
                    <Cell fill="var(--color-brand-primary)" />
                    <Cell fill="var(--color-brand-secondary)" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff'
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="xl:col-span-2 glass rounded-[3rem] border border-white/5 overflow-hidden flex flex-col h-full">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  {["User Info", "Agent Name", "Number", "Status", "Outcome", "Created", "Recording", "Action"].map((head) => (
                    <th key={head} className="px-6 py-6 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-24">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                        <p className="text-gray-500 font-bold text-sm tracking-widest uppercase animate-pulse">Synchronizing Data...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  calls?.map((row) => (
                    <tr
                      key={row.id}
                      className="group border-b border-white/5 hover:bg-white/[0.03] transition-all duration-300"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <p className="text-sm font-bold text-white tracking-tight">{row.username}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{row.email}</p>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-300 font-medium tracking-tight">
                        {row.voice_name}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-300 font-medium">
                        {row.to_number}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                          ${row.status === "completed" || row.status === "connected" 
                            ? "bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                            : row.status === "busy" || row.status === "no-answer" || row.status === "unanswered"
                            ? "bg-rose-500/10 text-rose-500"
                            : "bg-gray-500/10 text-gray-500"
                          }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[11px] font-bold tracking-tight ${statusStyles[(row.call_outcome_status || "") as string] || "text-gray-500"}`}>
                          {row.call_outcome_status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[11px] text-gray-500 font-medium tracking-tight">
                        {row.started_at ? new Date(row.started_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-5">
                        <button
                          onClick={() => handleListenRecording(row.call_id)}
                          disabled={loadingRecordings === row.call_id}
                          className="flex items-center gap-2 text-brand-primary hover:text-white transition-all text-xs font-bold tracking-tight disabled:opacity-50"
                        >
                          {loadingRecordings === row.call_id ? (
                            <div className="w-3 h-3 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                          ) : <Mic size={14} />}
                          Listen
                        </button>
                      </td>
                      <td className="px-6 py-5">
                        <button
                          onClick={() => handleOpenModal(row)}
                          className="px-4 py-2 glass rounded-xl text-xs font-bold text-white hover:bg-brand-primary/20 hover:border-brand-primary/30 transition-all border border-white/5 active:scale-95"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="mt-auto p-8 border-t border-white/5 flex justify-between items-center bg-white/[0.01]">
            <button
              onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-2.5 glass rounded-xl text-xs font-black uppercase tracking-widest text-white disabled:opacity-30 hover:bg-white/5 border border-white/5 transition-all"
            >
              Previous
            </button>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-3">
              Page <span className="text-white text-sm font-black">{currentPage}</span> of <span className="text-white text-sm font-black">{totalPages || 1}</span>
            </div>
            <button
              onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-6 py-2.5 glass rounded-xl text-xs font-black uppercase tracking-widest text-white disabled:opacity-30 hover:bg-white/5 border border-white/5 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {openModal && selectedRow && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-dark-bg/80 backdrop-blur-xl"
            onClick={handleCloseModal}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative glass w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-10 border-b border-white/5 bg-gradient-to-br from-brand-primary/20 via-transparent to-transparent">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    Call Intelligence
                  </span>
                  <h3 className="text-3xl font-black text-white tracking-tighter">Session Details</h3>
                  
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4 pt-4">
                    {[
                      { label: "Session ID", val: selectedRow.call_id },
                      { label: "Agent Name", val: selectedRow.voice_name },
                      { label: "Timeline", val: selectedRow.started_at ? new Date(selectedRow.started_at).toLocaleString() : 'N/A' },
                      { label: "Result", val: selectedRow.call_outcome_status || 'Ongoing' }
                    ].map((info, i) => (
                      <div key={i} className="space-y-0.5">
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{info.label}</p>
                        <p className="text-xs text-gray-200 font-medium tracking-tight truncate max-w-[150px]">{info.val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="p-3 glass rounded-2xl text-white/50 hover:text-white transition-all hover:bg-white/5 active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex px-10 border-b border-white/5 bg-white/[0.01]">
              {["transcription", "summary"].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-6 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? "text-brand-primary" : "text-gray-500 hover:text-white"
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

            {/* Tab Content */}
            <div className="p-10 max-h-[40vh] overflow-y-auto custom-scrollbar">
              {transcriptLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                  <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">Deciphering Transcript...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeTab === "transcription" ? (
                    selectedRow.transcript?.items?.length ? (
                      <div className="space-y-4">
                        {selectedRow.transcript.items.map((item, idx) => (
                          <div key={idx} className={`p-5 rounded-2xl ${item.role === 'assistant' ? 'bg-brand-primary/5 ml-8 border border-brand-primary/10' : 'bg-white/5 mr-8 border border-white/5'}`}>
                            <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-50">
                              {item.role === "assistant" ? "Neural Agent" : "User Interaction"}
                            </p>
                            <p className="text-sm text-gray-300 leading-relaxed font-medium">
                              {Array.isArray(item.content) ? item.content.join(" ") : item.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 glass rounded-3xl border-dashed border-white/10">
                        <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">No Neural Data Logged</p>
                      </div>
                    )
                  ) : (
                    <p className="text-sm text-gray-300 leading-relaxed font-medium bg-white/5 p-6 rounded-2xl border border-white/5">
                      {selectedRow.summary || "No automated summary generated for this session."}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-10 border-t border-white/5 bg-white/[0.01]">
              <button
                onClick={handleCloseModal}
                className="w-full py-4 glass bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all border border-white/5 active:scale-[0.98]"
              >
                Close Intelligent Modal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;