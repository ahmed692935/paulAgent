import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { addAgentVoice, getAgentVoice, deleteVoice } from "../api/Voice";
import toast from "react-hot-toast";

function AgentVoice() {
    const [openModal, setOpenModal] = useState(false);
    const [saving, setSaving] = useState(false);

    // Start empty -> backend se fill hoga
    const [agentVoice, setAgentVoice] = useState<Array<{ voice_id: string; voice_name: string }>>([]);


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const token = localStorage.getItem("token");

    // -----------------------------------------
    // GET API → LOAD ALL VOICES
    // -----------------------------------------
    const [loadingVoices, setLoadingVoices] = useState(true);

    const fetchVoices = async () => {
        setLoadingVoices(true);   // start spinner
        if (!token) {
            toast.error("Missing authentication token");
            return;
        }

        try {
            const res = await getAgentVoice(token);

            // backend returns: { success, count, voices: [] }
            setAgentVoice(res.voices || []);
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.error || "Oops, an error occurred");
        }

        setLoadingVoices(false);  // stop spinner
    };

    useEffect(() => {
        fetchVoices();
    }, []);


    // -------------------------------------------------------
    // SUBMIT: ADD NEW AGENT VOICE THROUGH API
    // -------------------------------------------------------
    const onSubmit = async (data: any) => {
        setSaving(true);

        if (!token) {
            toast.error("Missing authentication token");
            setSaving(false);
            return;
        }

        try {
            await addAgentVoice(data, token);

            toast.success("Agent voice added successfully!");

            // Refresh table from backend
            fetchVoices();

            reset();
            setOpenModal(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.error || "Oops, an error occurred");
        }

        setSaving(false);
    };


    // -------------------------------------------------------
    // DELETE AGENT VOICE
    // -------------------------------------------------------
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (id: any) => {
        if (!token) {
            toast.error("Missing authentication token");
            return;
        }

        setDeletingId(id); // <-- spinner ON for this row

        try {
            // API CALL
            await deleteVoice(id, token);

            // UI se row remove
            setAgentVoice((prev) => prev.filter((item) => item.voice_id !== id));

            toast.success("Voice deleted successfully!");
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.error || "Delete failed");
        }

        setDeletingId(null); // <-- spinner OFF
    };


    return (
        <div className="max-w-3xl mx-auto p-8 mt-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-center mb-10 text-[#13243C]">
                Agents Voice
            </h1>

            {/* ADD BUTTON */}
            <button
                onClick={() => setOpenModal(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-white font-medium transition-all bg-[#13243C] cursor-pointer"
            >
                <FiPlus />
                Add Voice
            </button>

            {/* MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 w-[90%] max-w-2xl rounded-xl relative animate-fadeIn">
                        <button
                            onClick={() => setOpenModal(false)}
                            className="absolute top-3 right-3 text-gray-600 cursor-pointer"
                        >
                            <AiOutlineClose size={22} />
                        </button>

                        <h2 className="text-xl font-bold text-center mb-4">
                            Add Agent Voice
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            {/* Voice ID */}
                            <div>
                                <label className="block mb-1 font-medium">Agent ID:</label>
                                <input
                                    type="text"
                                    {...register("voice_id", { required: "Agent ID is required" })}
                                    className="w-full border px-3 py-2 rounded-lg"
                                />
                                {errors.voice_id && (
                                    <p className="text-red-500 text-sm">
                                        {typeof errors.voice_id.message === 'string' ? errors.voice_id.message : 'Invalid input'}
                                    </p>
                                )}
                            </div>

                            {/* Voice Name */}
                            <div>
                                <label className="block mb-1 font-medium">Agent Name:</label>
                                <input
                                    type="text"
                                    {...register("voice_name", { required: "Agent Name is required" })}
                                    className="w-full border px-3 py-2 rounded-lg"
                                />
                                {errors.voice_name && (
                                    <p className="text-red-500 text-sm">
                                        {typeof errors.voice_name.message === 'string' ? errors.voice_name.message : 'Invalid input'}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#13243C] text-white py-3 rounded-xl flex items-center gap-2 justify-center cursor-pointer"
                            >
                                {saving && (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* TABLE */}
            <table className="w-full rounded-xl mt-10 overflow-hidden">
                <thead>
                    <tr className="bg-[#13243C]">
                        <th className="px-4 py-4 text-left text-sm font-semibold text-white">
                            ID
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-white">
                            Agent Name
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-white">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {loadingVoices ? (
                        <tr>
                            <td colSpan={3} className="py-10 text-center">
                                <div className="w-8 h-8 border-4 border-[#13243C] border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </td>
                        </tr>
                    ) : agentVoice.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="py-8 text-center text-gray-500">
                                No agent voices found
                            </td>
                        </tr>
                    ) : (
                        agentVoice.map((agent) => (
                            <tr
                                key={agent.voice_id}
                                className="bg-white hover:bg-blue-50 transition-colors border-t border-[#13243C]"
                            >
                                <td className="px-4 py-2 text-gray-700">{agent.voice_id}</td>
                                <td className="px-4 py-2 text-gray-700">{agent.voice_name}</td>
                                <td className="px-4 py-2 text-gray-700">
                                    <button
                                        onClick={() => handleDelete(agent.voice_id)}
                                        className="text-red-600 hover:text-red-800 flex items-center justify-center w-6 h-6 cursor-pointer"
                                    >
                                        {deletingId === agent.voice_id ? (
                                            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <FiTrash2 size={20} />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>

            </table>

        </div>
    );
}

export default AgentVoice;
