import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import toast from "react-hot-toast";
import { generateCourseFile } from "../services/fileServices";

const Upload = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  

  const handleUploadSuccess = (files) => {
    setUploadedFiles(files);
    toast.success("Files uploaded successfully!");
  };

  const handleGenerateCourseFile = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please upload files before generating the course file.");
      return;
    }

    try {
      const response = await generateCourseFile();
      toast.success("Course file generated successfully!");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      toast.error("Failed to generate course file.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Upload Files</h2>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
        {uploadedFiles.length > 0 && (
          <button
            onClick={handleGenerateCourseFile}
            className="mt-4 bg-blue-500 px-4 py-2 rounded text-white"
          >
            Generate Course File
          </button>
        )}
      </div>
    </div>
  );
};

export default Upload;
