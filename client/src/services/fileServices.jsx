// services/fileService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/files";

// ✅ Upload Files
export const uploadFiles = async (files) => {
  const formData = new FormData();
  const filesArray = Array.isArray(files) ? files : [files];

  filesArray.forEach((file) => {
    formData.append("files", file);
  });

  try {
    console.log("Uploading files:", filesArray);
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    console.log("Upload response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Upload failed");
  }
};

// ✅ Fetch Uploaded Files
export const fetchFiles = async () => {
  try {
    const response = await axios.get(API_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    return { success: false, files: [] };
  }
};

// ✅ Download File
export const downloadFile = async (fileId, filename) => {
  try {
    const response = await axios.get(`${API_URL}/download/${fileId}`, {
      responseType: "blob",
      withCredentials: true,
    });

    let downloadFilename = filename || "DownloadedFile.pdf";
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match && match[1]) {
        downloadFilename = match[1];
      }
    }

    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", downloadFilename);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(fileURL);
    return true;
  } catch (error) {
    console.error("Download failed:", error);
    return false;
  }
};

// ✅ Delete File
export const deleteFile = async (fileId) => {
  try {
    const res = await axios.delete(`${API_URL}/${fileId}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    throw new Error("Failed to delete file.");
  }
};

// ✅ Generate Course File
export const generateCourseFile = async (courseDetails) => {
  try {
    const response = await axios.post(`${API_URL}/generate-course-file`, courseDetails, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to generate course file:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Generation failed");
  }
};
