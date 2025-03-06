import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import toast from "react-hot-toast";
import { generateCourseFile } from "../services/fileServices";
import { FaCloudUploadAlt, FaFileAlt, FaBook } from "react-icons/fa";

const Upload = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

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
      setIsGenerating(true);
      const response = await generateCourseFile();
      toast.success("Course file generated successfully!");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      toast.error("Failed to generate course file.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto p-6 pt-26">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center mb-8">
            <FaCloudUploadAlt className="text-indigo-600 text-4xl mr-3" />
            <h2 className="text-3xl font-bold text-gray-800 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Upload Course Materials
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center">
                Upload your course files and we'll organize them for you.
                Select a category for each file to ensure proper classification.
              </p>
              
              <FileUpload onUploadSuccess={handleUploadSuccess} />
              
              {uploadedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-8"
                >
                  <div className="flex items-center mb-4">
                    <FaFileAlt className="text-indigo-500 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-800">Uploaded Files</h3>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                    <ul className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center text-gray-700 bg-white p-3 rounded-lg shadow-sm"
                        >
                          <FaFileAlt className="text-indigo-400 mr-2" />
                          <span>{file.name || file.fileName}</span>
                          <span className="ml-auto text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                            {file.category}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerateCourseFile}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition-all disabled:opacity-70"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FaBook className="mr-2" />
                        Generate Course File
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-gray-500 text-sm"
          >
            Need help? Contact our support team for assistance.
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;