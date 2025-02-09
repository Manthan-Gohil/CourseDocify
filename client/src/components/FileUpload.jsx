import { useState } from "react";
import { uploadFiles } from "../services/fileServices";
import toast from "react-hot-toast";

const FileUpload = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]); // ✅ Handle multiple files
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // ✅ Store multiple files in state
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    try {
      setUploading(true);
      const response = await uploadFiles(files); // ✅ Send multiple files
      toast.success(response.message);
      setFiles([]); // ✅ Clear selected files after upload
      onUploadSuccess(); // ✅ Refresh file list after upload
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <input type="file" onChange={handleFileChange} multiple className="mb-2" />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-green-500 px-4 py-2 rounded text-white"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default FileUpload;