// services/fileService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/files";

export const uploadFiles = async (files) => {
  const formData = new FormData();

  // ✅ Ensure files is an array
  const filesArray = Array.isArray(files) ? files : [files];

  // ✅ Append files correctly (Field name MUST match Multer config)
  filesArray.forEach((file) => {
    formData.append("files", file); // "files" must match backend multer field
  });

  try {
    console.log("Uploading files:", filesArray); // Debugging

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    console.log("Upload response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
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

  export const downloadFile = async (fileId, filename) => {
    try {
      const response = await axios.get(`${API_URL}/download/${fileId}`, {
        responseType: "blob",
        withCredentials: true, // Ensure cookies are sent with the request
      });
  
      // Extract filename from response headers (if available)
      let downloadFilename = filename || "DownloadedFile.pdf"; // Default filename
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) {
          downloadFilename = match[1];
        }
      }
  
      // Create a URL for the downloaded file
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", downloadFilename);
      
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(fileURL);
      
      return true; // Indicate success
    } catch (error) {
      console.error("Download failed:", error);
      return false; // Indicate failure
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
