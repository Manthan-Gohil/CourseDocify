// pages/Upload.jsx
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import toast from "react-hot-toast";

const Upload = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    toast.success("Files uploaded successfully!");
    navigate("/dashboard"); // ✅ Redirect to dashboard after upload
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Upload Files</h2>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
};

export default Upload;