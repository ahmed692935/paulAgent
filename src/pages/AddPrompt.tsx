// import { useState } from "react";
// import { FiPlus, FiEdit2, FiCheck } from "react-icons/fi";
// import { updateSystemPrompt } from "../api/Call";

// const AddPrompt = () => {
//   const [prompt, setPrompt] = useState("");
//   const [savedPrompt, setSavedPrompt] = useState("");
//   const [isEditing, setIsEditing] = useState(false);

//   // const handleAddOrUpdate = () => {
//   //   if (!prompt.trim()) return;
//   //   setSavedPrompt(prompt.trim());
//   //   setPrompt("");
//   //   setIsEditing(false);
//   // };

//   const handleAddOrUpdate = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const data = { system_prompt: prompt };
//       const response = await updateSystemPrompt(data, token);
//       setSavedPrompt(prompt.trim());
//       console.log("Prompt updated successfully:", response);
//     } catch (error) {
//       console.error("Failed to update prompt:", error);
//     }
//   };

//   const handleEditPrompt = () => {
//     setPrompt(savedPrompt);
//     setIsEditing(true);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center px-4 py-10">
//       <div className="w-full max-w-2xl p-8">
//         {/* Header Section */}
//         <h1 className="text-4xl font-bold text-[#3F3EED] text-center mb-2">
//           Prompt Manager
//         </h1>
//         <p className="text-gray-600 text-center mb-8">
//           Add or edit your custom AI prompt below. You can only have one active
//           prompt at a time.
//         </p>

//         {/* Input Section */}
//         <textarea
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           rows={3}
//           placeholder="Type your prompt here..."
//           className="w-full border border-[#3F3EED] rounded-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#3F3EED] mb-4 resize-none"
//         />

//         <button
//           onClick={handleAddOrUpdate}
//           disabled={!prompt.trim()}
//           className={`w-full flex items-center justify-center cursor-pointer gap-2 rounded-xl py-3 text-white font-medium transition-all ${
//             !prompt.trim()
//               ? "bg-[#3F3EED]/50 cursor-not-allowed"
//               : "bg-[#3F3EED] hover:bg-[#2d2ce0]"
//           }`}
//         >
//           {isEditing ? <FiCheck /> : <FiPlus />}
//           {isEditing ? "Update Prompt" : "Add Prompt"}
//         </button>

//         {/* Table Section */}
//         {savedPrompt && (
//           <div className="mt-8">
//             <h2 className="text-lg font-semibold text-[#3F3EED] mb-3">
//               Saved Prompt
//             </h2>
//             <table className="w-full border border-[#3F3EED] rounded-xl overflow-hidden">
//               <thead className="bg-[#3F3EED]/10 text-[#3F3EED] text-left">
//                 <tr>
//                   <th className="py-2 px-4">Prompt</th>
//                   <th className="py-2 px-4 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="border-t border-[#3F3EED]/20">
//                   <td className="py-3 px-4 text-gray-700">{savedPrompt}</td>
//                   <td className="py-3 px-4 text-center flex justify-center gap-4">
//                     <button
//                       onClick={handleEditPrompt}
//                       className="text-[#3F3EED] hover:text-[#2d2ce0] transition-colors cursor-pointer"
//                     >
//                       <FiEdit2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddPrompt;






// Previous Code
import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiCheck } from "react-icons/fi";
import { updateSystemPrompt, getSystemPrompt } from "../api/Call";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

interface SystemPromptResponse {
  system_prompt: string;
}

interface UpdatePromptPayload {
  system_prompt: string;
}

const AddPrompt = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [savedPrompt, setSavedPrompt] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // ✅ Button loader state

  // ✅ Fetch existing prompt
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const response: SystemPromptResponse = await getSystemPrompt(token);
        if (response?.system_prompt) {
          setSavedPrompt(response.system_prompt);
        }
      } catch (error) {
        console.error("Failed to fetch prompt:", error);
        toast.error("Failed to load prompt.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, []);

  // ✅ Add or update prompt
  const handleAddOrUpdate = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setIsSubmitting(true);
      const data: UpdatePromptPayload = { system_prompt: prompt.trim() };
      const response = await updateSystemPrompt(data, token);

      setSavedPrompt(prompt.trim());
      setPrompt("");
      setIsEditing(false);
      toast.success("Prompt updated successfully!");
      console.log("Response:", response);
    } catch (err) {
      const error = err as AxiosError<{
        detail?: { msg: string }[];
        message?: string;
        error?: string;
      }>;

      const message =
        error.response?.data?.detail?.[0]?.msg ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Oops! An unexpected error occurred.";

      toast.error(message);
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPrompt = (): void => {
    setPrompt(savedPrompt);
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl p-7">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-10 text-blue-500">
          Prompt Manager
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Add or edit your custom AI prompt below. You can only have one active
          prompt at a time.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="Type your prompt here..."
          className="w-full border border-blue-500 rounded-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4 resize-none"
        />

        {/* ✅ Loader-enabled Button */}
        <button
          onClick={handleAddOrUpdate}
          disabled={!prompt.trim() || isSubmitting}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-white font-medium transition-all ${!prompt.trim() || isSubmitting
            ? "bg-blue-500/50 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-900 cursor-pointer"
            }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isEditing ? (
            <FiCheck />
          ) : (
            <FiPlus />
          )}
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Update Prompt"
              : "Add Prompt"}
        </button>

        {/* ✅ Table Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-blue-500 mb-3">
            Saved Prompt
          </h2>
          <table className="w-full border border-blue-500 rounded-xl overflow-hidden">
            <thead className="bg-blue-500/10 text-blue-900 text-left">
              <tr>
                <th className="py-2 px-4">Prompt</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={2}
                    className="py-6 text-center text-gray-500 italic"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#3F3EED] border-t-transparent rounded-full animate-spin" />
                      Loading prompt...
                    </div>
                  </td>
                </tr>
              ) : savedPrompt ? (
                <tr className="border-t border-[#3F3EED]/20">
                  <td className="py-3 px-4 text-gray-700">{savedPrompt}</td>
                  <td className="py-3 px-4 text-center flex justify-center gap-4">
                    <button
                      onClick={handleEditPrompt}
                      className="text-[#3F3EED] hover:text-[#2d2ce0] transition-colors cursor-pointer"
                    >
                      <FiEdit2 size={18} />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="py-6 text-center text-gray-500 italic"
                  >
                    No prompt found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddPrompt;

