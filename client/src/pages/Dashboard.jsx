import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FileTable from "../components/FileTable";
import { fetchFiles } from "../services/fileServices";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await fetchFiles();
      setFiles(data.files);
    } catch (error) {
      toast.error("Failed to load files.", { id: "file-error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const childVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Navbar />
      <div className="container mx-auto pt-26 px-4 sm:px-6 lg:px-8">
        <motion.div variants={childVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your course files and documents</p>
        </motion.div>
        
        <motion.div variants={childVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to={"/fileupload"}>
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Course Documents</h3>
              <p className="text-gray-600">Access and manage your course materials</p>
            </motion.div>
            </Link>
            <Link to={"/upload"}>
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Upload Files</h3>
              <p className="text-gray-600">Add new materials to your courses</p>
            </motion.div>
            </Link>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Generated Summaries</h3>
              <p className="text-gray-600">View and download AI-generated summaries</p>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div variants={childVariants}>
          <FileTable files={files} loading={loading} refreshFiles={loadFiles} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;