import { useState } from "react";
import { uploadFiles } from "../services/fileServices";
import toast from "react-hot-toast";

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);


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
    }));

    setSelectedFiles([...selectedFiles, ...newFiles]);
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
      setUploadedFiles([...uploadedFiles, ...response.uploadedFiles]);

      toast.success("Files uploaded successfully!");
      setSelectedFiles([]);
      onUploadSuccess(response.uploadedFiles);
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <label className="block mb-2 font-bold">Select Category</label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full border p-2 mb-2"
      >
        <option value="">-- Select --</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      <input type="file" onChange={handleFileChange} multiple className="mb-2" />

      {selectedFiles.length > 0 && (
        <div className="mb-2">
          <h4 className="font-bold">Selected Files:</h4>
          <ul>
            {selectedFiles.map((fileObj, index) => (
              <li key={index}>
                {fileObj.file.name} ({fileObj.category})
              </li>
            ))}
          </ul>
        </div>
      )}

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
