import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import placeholderImage from "./../assets/placeholder.png";
// Importa la URL de la API desde el archivo .env
const API_URL = import.meta.env.VITE_API_URL;
function StudentDetailsPage() {
  const token = localStorage.getItem("authToken");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { studentId } = useParams();
  useEffect(() => {
    const getStudent = () => {
      axios
        .get(`${API_URL}/api/students/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          setStudent(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching student data:", error);
          setLoading(false); // Asegúrate de que loading se establezca en false incluso si hay un error
        });
    };
    getStudent();
  }, [studentId, token]); // Añadido token a las dependencias
  if (loading) return <div>Loading...</div>;
  return (
    <div className="StudentDetailsPage bg-gray-100 py-6 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md mb-6">
        {student && (
          <>
            <img
              src={student.image || placeholderImage}
              alt="profile-photo"
              className="rounded-full w-32 h-32 object-cover border-2 border-gray-300"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // Evita un bucle infinito
                currentTarget.src = placeholderImage;
              }}
            />
            <h1 className="text-2xl mt-4 font-bold">{student.firstName} {student.lastName}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-4 border-b pb-4">
              <p className="text-left mb-2 border-b pb-2">
                <strong>Email:</strong> {student.email}
              </p>
              <p className="mb-2 text-left">
                <strong>Phone:</strong> {student.phone}
              </p>
              <p className="text-left mb-2 border-b pb-2">
                <strong>LinkedIn:</strong> {student.linkedinUrl}
              </p>
              <p className="text-left mb-2 border-b pb-2">
                <strong>Languages:</strong> {student.languages ? student.languages.join(", ") : "No languages available"}
              </p>
              <p className="text-left mb-2 border-b pb-2">
                <strong>Program:</strong> {student.program}
              </p>
              <p className="text-left mb-2 border-b pb-2">
                <strong>Background:</strong> {student.background}
              </p>
              <p className="text-left mb-2 border-b pb-2">
                <strong>Cohort:</strong> 
                <Link className="ml-2 text-blue-500 hover:underline" to={`/cohorts/details/${student.cohort._id}`}>
                  {student.cohort.cohortName}
                </Link>
              </p>
              {student.projects && student.projects.length > 0 && (
                <p className="text-left mb-2 border-b pb-2">
                  <strong>Projects:</strong> {student.projects.join(", ")}
                </p>
              )}
            </div>
            <div className="mt-4">
              <Link to={`/students/edit/${student._id}`}>
                <button className="text-white px-4 py-2 rounded bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out">
                  Edit
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default StudentDetailsPage;