import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CourseDetailsForm = () => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    courseCode: "",
    session: "",
    batch: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseData.courseName || !courseData.courseCode || !courseData.session || !courseData.batch) {
      toast.error("All fields are required.");
      return;
    }

    try {
      setLoading(true);

      // Save data to backend at /api/course/save
      const response = await axios.post(
        "http://localhost:3000/api/course/save",
        courseData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Course details saved successfully!");

        // Store courseData in localStorage for later use
        localStorage.setItem("courseData", JSON.stringify(courseData));

        // Redirect to upload page
        setTimeout(() => navigate("/upload"), 1000);
      } else {
        toast.error("Failed to save course details.");
      }
    } catch (error) {
      toast.error("Error generating course summary.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="p-8 rounded-xl shadow-lg bg-gradient-to-br from-white to-blue-50 max-w-md mx-auto mt-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h2 
          className="text-2xl font-bold text-blue-600"
          variants={itemVariants}
        >
          <span className="border-b-4 border-amber-400 pb-1">Create New Course</span>
        </motion.h2>
        
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/dashboard">
            <button className="bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </button>
          </Link>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div variants={itemVariants} className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Course Name</label>
          <input 
            type="text" 
            name="courseName" 
            placeholder="e.g. Advanced Web Development" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white" 
            onChange={handleChange} 
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Course Code</label>
          <input 
            type="text" 
            name="courseCode" 
            placeholder="e.g. CS401" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white" 
            onChange={handleChange} 
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Session</label>
          <input 
            type="text" 
            name="session" 
            placeholder="e.g. Fall 2025" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white" 
            onChange={handleChange} 
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Batch</label>
          <input 
            type="text" 
            name="batch" 
            placeholder="e.g. 2022-2026" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white" 
            onChange={handleChange} 
          />
        </motion.div>
        
        <motion.button 
          type="submit" 
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow-md transition-all"
          disabled={loading}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Save Course Details
            </div>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CourseDetailsForm;