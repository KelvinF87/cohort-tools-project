import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import StudentCard from "../components/StudentCard";
import StudentCreateForm from "../components/StudentCreateForm";

// Import the string from the .env with URL of the API/server - http://localhost:5005
const API_URL = import.meta.env.VITE_API_URL;

function CohortDetailsPage() {
  const token = localStorage.getItem("authToken");
  const [cohort, setCohort] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDrawer, setShowDrawer] = useState(false);

  const { cohortId } = useParams();

  const getCohort = useCallback(() => {
    axios
      .get(`${API_URL}/api/cohorts/${cohortId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const oneCohort = response.data;
        setCohort(oneCohort);
      })
      .catch((error) => console.log(error));
  }, [cohortId]);

  const getStudents = useCallback(() => {
    axios
      .get(`${API_URL}/api/students/cohort/${cohortId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const allStudents = response.data;
        setStudents(allStudents);
      })
      .catch((error) => console.log(error));
  }, [cohortId]);

  useEffect(() => {
    getCohort();
    getStudents();
    setLoading(false);
  }, [cohortId, getCohort, getStudents]);

  return (
    <div className={`CohortDetails bg-gray-100 py-6 px-4`}>
      {/* Drawer */}
      <div
className={`drawer transition-transform transform ${
       showDrawer ? "translate-x-0" : "translate-x-full"
     } fixed right-0 top-0 h-full bg-white shadow-md z-10`}
      >
        {cohort && showDrawer && (
          <StudentCreateForm
            cohortId={cohort._id}
            cohortName={cohort.cohortName}
            callback={() => {
              setShowDrawer(false);
              getStudents();
            }}
            closeCallback={() => setShowDrawer(false)}
          />
        )}
      </div>


      <div
        className={`CohortDetails bg-gray-100 py-6 px-4 ${
          showDrawer ? "opacity-30 pointer-events-none" : ""
        }`}
      >
        {/* Cohort details */}
        <div className="bg-white p-8  px-24 rounded-lg shadow-md mb-6">
          {cohort && (
            <>
              <h1 className="text-2xl font-semibold mb-4">
                {cohort.cohortName}
              </h1>
              <br />

              <div className="grid grid-cols-2 gap-6 mb-4 border-b pb-4">
                <div className="text-left pr-4 border-r">
                  <p className="mb-2 border-b pb-2">
                    <strong>Program:</strong> {cohort.program}
                  </p>
                  <p className="mb-2 border-b pb-2">
                    <strong>Campus:</strong> {cohort.campus}
                  </p>
                  <p className="mb-2 border-b pb-2">
                    <strong>Start Date:</strong> {cohort.startDate}
                  </p>
                  <p className="mb-2 border-b pb-2">
                    <strong>End Date:</strong> {cohort.endDate}
                  </p>
                </div>
                <div className="text-left pl-4">
                  <p className="mb-2 border-b pb-2">
                    <strong>Status:</strong>{" "}
                    {cohort.inProgress ? "In Progress" : "Not Started"}
                  </p>
                  <p className="mb-2 border-b pb-2">
                    <strong>Total Hours:</strong> {cohort.totalHours}
                  </p>
                  <p className="mb-2 border-b pb-2">
                    <strong>Program Manager:</strong> {cohort.programManager}
                  </p>
                  <p className="mb-2 border-b pb-2">
                    <strong>Lead Teacher:</strong> {cohort.leadTeacher}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 mt-6 w-2/3 mx-auto">
                <Link to={`/cohorts/edit/${cohortId}`} className="w-full">
                  <button
                    disabled={showDrawer}
                    className={`transition duration-300 ease-in-out text-white px-4 py-2 w-full rounded ${
                      showDrawer
                        ? "bg-gray-500 hover:bg-gray-500"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    Edit Cohort
                  </button>
                </Link>
                <button
                  disabled={showDrawer}
                  className={`transition duration-300 ease-in-out text-white px-4 py-2 w-full rounded hover:bg-blue-600 ${
                    showDrawer
                      ? "bg-gray-500 hover:bg-gray-500"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  onClick={() => setShowDrawer(true)}
                >
                  Add Student
                </button>
              </div>
            </>
          )}
        </div>

        <h2 className="text-xl mb-4">Students</h2>

        {loading && <div>Loading...</div>}

        {students &&
          students.map((student) => (
            <StudentCard key={student._id} {...student} />
          ))}
      </div>
    </div>
  );
}

export default CohortDetailsPage;
