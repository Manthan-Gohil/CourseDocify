import { useState, useRef } from "react";
import { uploadFiles } from "../services/fileServices";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt, FaFileAlt, FaTimesCircle, FaFolderOpen } from "react-icons/fa";

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    "Time Table",
    "Course Content/Syllabus",
    "Course Description and Objective",
    "Course Learning Outcomes & CO Mapping",
    "Detailed Session Plan",
    "Registered Student List",
    "Attendance",
  ];

  const handleFileChange = (e) => {
    if (!selectedCategory) {
      toast.error("Please select a category first!");
      return;
    }

    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      category: selectedCategory,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      id: `${file.name}-${Date.now()}`
    }));

    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!selectedCategory) {
      toast.error("Please select a category first!");
      return;
    }
    
    const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
      file,
      category: selectedCategory,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      id: `${file.name}-${Date.now()}`
    }));
    
    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const removeFile = (id) => {
    setSelectedFiles(selectedFiles.filter(fileObj => fileObj.id !== id));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    try {
      setUploading(true);
      const filesToUpload = selectedFiles.map((item) => item.file);
      const response = await uploadFiles(filesToUpload);
      
      // Add category info to uploaded files
      const filesWithCategory = response.uploadedFiles.map((file, index) => ({
        ...file,
        category: selectedFiles[index].category
      }));
      
      setUploadedFiles([...uploadedFiles, ...filesWithCategory]);

      toast.success("Files uploaded successfully!");
      setSelectedFiles([]);
      onUploadSuccess(filesWithCategory);
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Select Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
        >
          <option value="">-- Select Category --</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging ? "border-indigo-400 bg-indigo-50" : "border-gray-300 hover:border-indigo-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange} 
          multiple 
          className="hidden"
        />
        
        <FaCloudUploadAlt className="mx-auto text-5xl text-indigo-500 mb-4" />
        
        <motion.div
          initial={{ opacity: 0.8, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            y: { 
              duration: 0.5, 
              repeat: Infinity, 
              repeatType: "reverse" 
            } 
          }}
        >
          <p className="text-lg text-gray-600 mb-2">
            Drag and drop your files here
          </p>
        </motion.div>
        
        <p className="text-gray-500 mb-4">or</p>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBrowseClick}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium inline-flex items-center"
        >
          <FaFolderOpen className="mr-2" />
          Browse Files
        </motion.button>
      </div>

      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              <FaFileAlt className="mr-2 text-indigo-500" />
              Selected Files
            </h4>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2">
                {selectedFiles.map((fileObj, index) => (
                  <motion.li
                    key={fileObj.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center overflow-hidden">
                      <FaFileAlt className="text-indigo-400 flex-shrink-0 mr-2" />
                      <span className="truncate text-gray-700">{fileObj.file.name}</span>
                    </div>
                    <div className="flex items-center ml-2 flex-shrink-0">
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full mr-2">
                        {fileObj.category}
                      </span>
                      <button
                        onClick={() => removeFile(fileObj.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTimesCircle />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-all disabled:opacity-70 disabled:hover:bg-indigo-600"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="mr-2" />
                  Upload Files
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
