import { useState, useEffect } from "react";
import axios from "axios";

import StudentCard from "../components/StudentCard";

// Import the string from the .env with URL of the API/server - http://localhost:5005
const API_URL = import.meta.env.VITE_API_URL;

function StudentListPage() {
  const [students, setStudents] = useState([]);
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    axios
      .get(`${API_URL}/api/students?$`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setStudents(response.data)})
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="StudentListPage">
      <div className="flex justify-between items-center p-2 font-bold border-b">
        <span className="flex items-center justify-center" style={{ flexBasis: "20%" }}>Image</span>
        <span style={{ flexBasis: "20%" }}>Name</span>
        <span style={{ flexBasis: "20%" }}>Program</span>
        <span style={{ flexBasis: "20%" }}>Email</span>
        <span style={{ flexBasis: "20%" }}>Phone</span>
      </div>

      {students && students.map((student, index) => (
          <StudentCard key={student._id} {...student} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"} />
      ))}
    </div>
  );
}

export default StudentListPage;
