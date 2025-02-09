// components/FileTable.jsx
import { useEffect, useState } from "react";
import { fetchFiles, downloadFile } from "../services/fileServices";
import toast from "react-hot-toast";

const FileTable = () => {
  const [files, setFiles] = useState([]); 

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const response = await fetchFiles();
        setFiles(Array.isArray(response.files) ? response.files : []);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    loadFiles();
  }, []);


  const handleDownload = async (fileId, filename) => {
    const success = await downloadFile(fileId, filename);
    if (success) {
      toast.success("Downloaded Successfully..")
    } else {
      toast.error("Download error");
    }
  };
  
  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold">Uploaded & Generated Files</h2>
      {Array.isArray(files) && files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file._id} className="p-2 border-1 rounded-sm flex justify-between mt-2">
              {file.filename}
              <button
                className="bg-white text-[#060606] border border-black cursor-pointer px-2 py-1 rounded"
                onClick={() => handleDownload(file._id, file.filename)}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files uploaded yet.</p>
      )}
    </div>
  );
};  

export default FileTable;
