import { useEffect, useState } from "react";
import { fetchFiles } from "../services/fileServices";

const FileTable = () => {
  const [files, setFiles] = useState([]); // ✅ Always an array

  useEffect(() => {
    const loadFiles = async () => {
        try {
          const response = await fetchFiles();
        //   console.log("Fetched files:", response); // ✅ Debug API response
          setFiles(Array.isArray(response.files) ? response.files : []); 
        //   console.log(response.files);
          
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      };

    loadFiles();
  }, []);

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold">Uploaded Files</h2>
      {Array.isArray(files) && files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file._id} className="p-2 border-1">{file.filename}</li>
          ))}
        </ul>
      ) : (
        <p>No files uploaded yet.</p>
      )}
    </div>
  );
};

export default FileTable;
