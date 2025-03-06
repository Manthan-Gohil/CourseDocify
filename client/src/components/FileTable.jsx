import { useEffect, useState } from "react";
import { fetchFiles, downloadFile } from "../services/fileServices";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const FileTable = ({ files: propFiles, loading, refreshFiles }) => {
  const [files, setFiles] = useState([]);
  const [sortField, setSortField] = useState("filename");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (propFiles) {
      setFiles(Array.isArray(propFiles) ? propFiles : []);
    } else {
      const loadFiles = async () => {
        try {
          const response = await fetchFiles();
          setFiles(Array.isArray(response.files) ? response.files : []);
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      };

      loadFiles();
    }
  }, [propFiles]);

  const handleDownload = async (fileId, filename) => {
    toast.loading("Downloading file...", { id: "download" });
    
    const success = await downloadFile(fileId, filename);
    
    if (success) {
      toast.success("Downloaded Successfully!", { id: "download" });
    } else {
      toast.error("Download failed. Please try again.", { id: "download" });
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedFiles = [...files].sort((a, b) => {
    if (sortField === "filename") {
      return sortDirection === "asc" 
        ? a.filename.localeCompare(b.filename)
        : b.filename.localeCompare(a.filename);
    }
    
    // Add more sort fields if needed
    return 0;
  }).filter(file => 
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <motion.h2 
            className="text-xl font-bold text-gray-800 mb-3 sm:mb-0"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Uploaded & Generated Files
          </motion.h2>
          
          <motion.div 
            className="relative w-full sm:w-64"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <input
              type="text"
              placeholder="Search files..."
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-20 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
            ></motion.div>
            <p className="mt-4 text-gray-500">Loading files...</p>
          </div>
        ) : sortedFiles.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("filename")}
                >
                  <div className="flex items-center">
                    Filename
                    {sortField === "filename" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {sortedFiles.map((file, index) => (
                  <motion.tr 
                    key={file._id}
                    variants={itemVariants}
                    className="hover:bg-gray-50 transition-colors"
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {file.filename.toLowerCase().endsWith(".pdf") ? (
                          <svg className="h-6 w-6 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.5 3.5a2 2 0 0 1 2-2h5a2 2 0 0 1 1.414.586l4.5 4.5A2 2 0 0 1 21 8v12a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2V3.5zm9.5 3h3.5l-3.5-3.5V6.5z"/>
                            <path d="M10.83 10.5c.7 0 1.3-.1 1.7-.3.4-.2.7-.5.9-.9.2-.4.3-.7.3-1.2 0-.5-.1-.9-.3-1.2-.2-.4-.5-.6-.9-.8-.4-.2-.9-.3-1.7-.3h-2.3v7.2h1.3v-2.5h1zm-.1-3.6c.6 0 1 .1 1.3.3.3.2.4.5.4.9 0 .4-.1.7-.4.9-.3.2-.7.3-1.3.3h-1v-2.4h1zM15.03 8h-1.3v7.2h1.3V8zM16.33 15.2h1.3v-3c0-.3.1-.6.2-.8.1-.2.3-.4.5-.5.2-.1.5-.2.8-.2.1 0 .2 0 .3.1.1 0 .2 0 .2.1v-1.2c-.2-.1-.4-.1-.6-.1-.3 0-.5.1-.8.2-.2.1-.4.3-.5.5-.1.2-.2.5-.2.8V8h-1.3v7.2z"/>
                          </svg>
                        ) : file.filename.toLowerCase().endsWith(".docx") ? (
                          <svg className="h-6 w-6 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.5 3.5a2 2 0 0 1 2-2h5a2 2 0 0 1 1.414.586l4.5 4.5A2 2 0 0 1 21 8v12a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2V3.5zm9.5 3h3.5l-3.5-3.5V6.5z"/>
                            <path d="M17 14.9v-5.8h1.7v7.2h-8.4v-7.2h1.7v5.8h5z"/>
                          </svg>
                        ) : (
                          <svg className="h-6 w-6 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        <span className="font-medium text-gray-800">{file.filename}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <motion.button
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center ml-auto"
                        onClick={() => handleDownload(file._id, file.filename)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <p className="mt-4 text-gray-500">No files uploaded yet.</p>
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm inline-flex items-center"
                onClick={() => window.location.href = '/upload'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Files
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
      
      {sortedFiles.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {sortedFiles.length} {sortedFiles.length === 1 ? 'file' : 'files'}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default FileTable;