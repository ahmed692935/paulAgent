import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { uploadContactsFile } from "../api/Call";

function UploadCsv() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ useNavigate hook

  // Token
  const token = localStorage.getItem("token") || "";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.endsWith(".csv") &&
      !file.name.endsWith(".xls") &&
      !file.name.endsWith(".xlsx")
    ) {
      toast.error("Only Excel or CSV files allowed!");
      return;
    }

    setLoading(true);

    try {
      const res = await uploadContactsFile(file, token);

      // Suppose backend response me ye data milta hai:
      localStorage.setItem("uploadedContacts", JSON.stringify(res.data));

      toast.success("Successfully uploaded file!");
      navigate("/call"); // redirect after success
    } catch (error) {
      toast.error("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8">
      <Toaster position="top-right" />

      <h1 className="text-2xl sm:text-4xl mb-8 font-bold text-center text-[#13243C]">
        CSV Excel
      </h1>

      <p className="text-gray-600 text-center mb-10">
        Upload your Excel or CSV file quickly and easily.
      </p>

      <div className="border-2 border-dashed border-[#13243C] rounded-2xl p-10 bg-white shadow-md transition-all flex flex-col">
        <label className="text-lg font-semibold text-[#13243C] mb-4 text-center">
          Upload Excel / CSV File
        </label>

        <label className="cursor-pointer bg-[#13243C] text-white text-center px-6 py-3 rounded-lg shadow hover:bg-blue-900 transition-all max-w-2xs w-full mx-auto">
          Choose File
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {loading && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="w-12 h-12 border-4 border-[#13243C] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#13243C] font-medium">Uploading...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadCsv;
