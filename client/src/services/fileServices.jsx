// services/fileService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/files";

export const uploadFiles = async (files) => {
    const formData = new FormData();

    // ✅ Ensure 'files' is always an array
    const filesArray = Array.isArray(files) ? files : Array.from(files);

    // ✅ Append multiple files
    filesArray.forEach((file) => {
        formData.append("files", file);
    });

    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true, // ✅ Add if using authentication
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Upload failed");
    }
};
  

export const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/files", {
        withCredentials: true, // ✅ If using authentication
      });
      return response.data; 
    } catch (error) {
      console.error("Error fetching files:", error);
      return { success: false, files: [] };
    }
  };
  
export const deleteFile = async (fileId) => {
  try {
    const res = await axios.delete(`${API_URL}/${fileId}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    throw new Error("Failed to delete file.");
  }
};
