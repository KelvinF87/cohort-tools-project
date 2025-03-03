
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Import the string from the .env with URL of the API/server - http://localhost:5005
const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_STUDENT_FORM_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  linkedinUrl: "",
  languages: [],
  program: "",
  background: "",
  image: "",
  cohort: "",
};

function StudentEditPage() {
  const token = localStorage.getItem("authToken");

  const [student, setStudent] = useState({ ...DEFAULT_STUDENT_FORM_VALUES });
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  
  const { studentId } = useParams();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestBody = { ...student };

    setLoading(true);

    axios
      .put(`${API_URL}/api/students/${student._id}`, requestBody , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        navigate(`/students/details/${student._id}`);
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = () => {
    axios
      .delete(`${API_URL}/api/students/${student._id}` , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        navigate(`/cohorts/details/${student.cohort._id}`);
      })
      .catch((error) => console.log(error));
  };

  const handleChange = (e) => {
    const { name, value, type, checked, options, multiple } = e.target;

    let inputValue = type === "checkbox" ? checked : value;

    if (multiple && options) {
      inputValue = [];
      for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          inputValue.push(options[i].value);
        }
      }
    }

    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: inputValue,
    }));
  };

  useEffect(() => {
    const getStudent = () => {
      axios
        .get(`${API_URL}/api/students/${studentId}` , {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const studentData = response.data;
          setStudent(studentData);
        })
        .catch((error) => console.log(error));
    };

    const getCohorts = () => {
      axios
        .get(`${API_URL}/api/cohorts` , {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const cohortList = response.data;
          setCohorts(cohortList);
        })
        .catch((error) => console.log(error));
    };

    getStudent();
    getCohorts();
    setLoading(false);
  }, [studentId]);

  return (
    <div className="p-8 pb-16 mb-10 mt-10 rounded-lg shadow-md flex flex-col h-full relative w-full max-w-3xl mx-auto bg-white">
    <h3 className="text-2xl font-semibold text-gray-700 mb-6">Edit Student</h3>

    {showDeleteConfirmation && (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
        <div className="bg-black opacity-50 absolute w-full h-full"></div>

        <div className="bg-white w-96 p-6 rounded-lg z-10 shadow-xl relative">
            <p className="text-lg mb-6 text-gray-700 font-semibold">Are you sure you want to delete this student?</p>
            
            <div className="flex justify-end space-x-4">
                <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition ease-in-out duration-150">Yes</button>
                <button onClick={() => setShowDeleteConfirmation(false)} className="bg-gray-400 hover:bg-gray-500 text-black font-semibold py-2 px-4 rounded-md transition ease-in-out duration-150">No</button>
            </div>
        </div>
    </div>
)}


    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mt-6 px-4">
        <label className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold">First Name:</label>
        <input type="text" name="firstName" value={student.firstName} onChange={handleChange} className="border rounded p-2 w-full mb-6"/>

        <label className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold">Last Name:</label>
        <input type="text" name="lastName" value={student.lastName} onChange={handleChange} className="border rounded p-2 w-full mb-6"/>

        <label className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold">Email:</label>
        <input type="email" name="email" value={student.email} onChange={handleChange} className="border rounded p-2 w-full mb-6"/>

        <label className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold">Phone:</label>
        <input type="tel" name="phone" value={student.phone} onChange={handleChange} className="border rounded p-2 w-full mb-6"/>

        <label className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold">LinkedIn URL:</label>
        <input type="url" name="linkedinUrl" value={student.linkedinUrl} onChange={handleChange} className="border rounded p-2 w-full mb-6"/>

        <label className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold">Languages:</label>
        <select name="languages" value={student.languages} onChange={handleChange} multiple className="border rounded p-2 w-full mb-6 bg-gray-50">
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Portuguese">Portuguese</option>
          <option value="Dutch">Dutch</option>
          <option value="Other">Other</option>
        </select>

        <label className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold">Program:</label>
        <select name="program" value={student.program} onChange={handleChange} className="border rounded p-2 w-full mb-6 bg-gray-50">
          <option value="">-- Select a program --</option>
          <option value="Web Dev">Web Dev</option>
          <option value="UX/UI">UX/UI</option>
          <option value="Data Analytics">Data Analytics</option>
          <option value="Cybersecurity">Cybersecurity</option>
        </select>

        <label className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold">Background:</label>
        <textarea type="text" name="background" value={student.background} onChange={handleChange} className="border rounded p-2 w-full mb-6"/>

        <label className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold">Image:</label>
        <input type="text" name="image" value={student.image} onChange={handleChange} className="border rounded p-2 w-full mb-6"/>

        <label className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold">Cohort:</label>
        <select name="cohort" value={student.cohort._id} onChange={handleChange} className="border rounded p-2 w-full mb-6 bg-gray-50">
        <option value="">-- Select a cohort --</option>
          {cohorts.map((cohort) => (
            <option key={cohort._id} value={cohort._id}>
              {cohort.cohortName}
            </option>
          ))}
        </select>

        <button disabled={loading} type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 transition duration-150 ease-in-out">Save</button>
        <button disabled={loading} type="button" onClick={()=> setShowDeleteConfirmation(true)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4 transition duration-150 ease-in-out">Delete</button>
    </form>
</div>
  );
}

export default StudentEditPage;
