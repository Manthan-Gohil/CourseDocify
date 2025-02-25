import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

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
      await axios.post("http://localhost:3000/api/course/generate", courseData, { withCredentials: true });
      toast.success("Course Summary Generated!");

      navigate("/dashboard"); // Navigate to Dashboard after success
    } catch (error) {
      toast.error("Error generating course summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold mb-4">Enter Course Details</h2>
      <Link to={"/dashboard"}> <button className=" bg-amber-400 px-3 py-2 cursor-pointer font-semibold rounded-md mb-4">Dashboard</button></Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="courseName" placeholder="Course Name" className="w-full p-2 border rounded" onChange={handleChange} />
        <input type="text" name="courseCode" placeholder="Course Code" className="w-full p-2 border rounded" onChange={handleChange} />
        <input type="text" name="session" placeholder="Session" className="w-full p-2 border rounded" onChange={handleChange} />
        <input type="text" name="batch" placeholder="Batch" className="w-full p-2 border rounded" onChange={handleChange} />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded" disabled={loading}>
          {loading ? "Generating..." : "Generate Course Summary"}
        </button>
      </form>
    </div>
  );
};

export default CourseDetailsForm;
