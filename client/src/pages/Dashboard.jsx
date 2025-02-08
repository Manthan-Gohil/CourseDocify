// pages/Dashboard.jsx
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import FileTable from "../components/FileTable";
import { fetchFiles } from "../services/fileServices";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await fetchFiles();
      setFiles(data.files);
    } catch (error) {
        toast.error("Failed to load files.", { id: "file-error" }); // Prevent duplicate toast
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(); // ✅ Only one API call when Dashboard mounts
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <FileUpload onUploadSuccess={loadFiles} /> 
        <FileTable files={files} loading={loading} onDeleteSuccess={loadFiles} />
      </div>
    </div>
  );
};

export default Dashboard;
