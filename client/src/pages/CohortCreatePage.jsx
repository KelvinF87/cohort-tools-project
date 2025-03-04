import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createCohortSlug, convertSlugToName } from "../utils/index";

// Import the string from the .env with URL of the API/server - http://localhost:5005
const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_COHORT_FORM_VALUES = {
  cohortSlug: "format-program-campus-startDate",
  cohortName: "",
  format: "",
  program: "",
  campus: "",
  startDate: "2030-01-01",
  endDate: "2030-01-01",
  inProgress: false,
  programManager: "",
  leadTeacher: "",
  totalHours: 0,
};

function CohortCreatePage() {
  const token = localStorage.getItem("authToken");

  const [cohort, setCohort] = useState({ ...DEFAULT_COHORT_FORM_VALUES });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const cohortSlug = createCohortSlug({ ...cohort, [name]: value });
    const cohortName = convertSlugToName(cohortSlug);

    setCohort((prevCohort) => ({
      ...prevCohort,
      cohortSlug,
      cohortName,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestBody = {
      ...cohort,
    };

    axios
      .post(`${API_URL}/api/cohorts`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const newCohort = response.data;

        navigate(`/cohorts/details/${newCohort._id}`);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="CohortCreatePage p-8 pb-16 mb-10 mt-10 rounded-lg shadow-md flex flex-col h-full relative w-full max-w-3xl mx-auto">
    <div className="flex justify-center bg-white items-center mb-4 pt-8 absolute top-0 left-0 right-0 py-2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 border-b border-gray-300 shadow-sm"></div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 overflow-y-auto mt-12 px-4"
      >
        <h3 className="text-2xl font-semibold text-gray-700 mb-6 sticky left-0">
          Create Cohort
        </h3>

        <label
          htmlFor="cohortSlug"
          className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold"
        >
          Cohort Id
        </label>
        <input
          type="text"
          name="cohortSlug"
          id="cohortSlug"
          value={cohort.cohortSlug}
          onChange={handleChange}
          disabled
          className="border rounded p-2 w-full mb-6"
        />

        <label
          htmlFor="cohortName"
          className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold"
        >
          Cohort Name
        </label>
        <input
          type="text"
          name="cohortName"
          id="cohortName"
          value={cohort.cohortName}
          onChange={handleChange}
          disabled
          className="border rounded p-2 w-full mb-6"
        />

        <label
          htmlFor="format"
          className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold"
        >
          Format
        </label>
        <select
          name="format"
          id="format"
          value={cohort.format}
          onChange={handleChange}
          className="border rounded p-2 w-full mb-6 bg-gray-50"
        >
          <option value="">-- Select Format --</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
        </select>

        <label
          htmlFor="program"
          className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold"
        >
          Program
        </label>
        <select
          name="program"
          id="program"
          value={cohort.program}
          onChange={handleChange}
          className="border rounded p-2 w-full mb-6 bg-gray-50"
        >
          <option value="">-- Select Program --</option>
          <option value="Web Dev">Web Development</option>
          <option value="UX/UI">UX/UI</option>
          <option value="Data Analytics">Data Analytics</option>
          <option value="Cybersecurity">Cybersecurity</option>
        </select>

        <label
          htmlFor="campus"
          className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold"
        >
          Campus
        </label>
        <select
          name="campus"
          id="campus"
          value={cohort.campus}
          onChange={handleChange}
          className="border rounded p-2 w-full mb-6 bg-gray-50"
        >
          <option value="">-- Select Campus --</option>
          <option value="Madrid">Madrid</option>
          <option value="Barcelona">Barcelona</option>
          <option value="Miami">Miami</option>
          <option value="Paris">Paris</option>
          <option value="Berlin">Berlin</option>
          <option value="Amsterdam">Amsterdam</option>
          <option value="Lisbon">Lisbon</option>
          <option value="Remote">Remote</option>
        </select>

        <label
          htmlFor="startDate"
          className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold"
        >
          Start Date:
        </label>
        <input
          type="date"
          name="startDate"
          id="startDate"
          value={cohort.startDate}
          onChange={handleChange}
          className="border rounded p-2 w-full mb-6 bg-gray-50 h-10"
        />

        <label
          htmlFor="endDate"
          className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold"
        >
          End Date:
        </label>
        <input
          type="date"
          name="endDate"
          id="endDate"
          value={cohort.endDate}
          onChange={handleChange}
          className="border rounded p-2 w-full mb-6 bg-gray-50 h-10"
        />

        <div className="flex items-center mt-6 mb-6">
          <label
            htmlFor="inProgress"
            className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold"
          >
            In Progress
          </label>
          <input
            type="checkbox"
            name="inProgress"
            id="inProgress"
            value={cohort.inProgress}
            onChange={handleChange}
            className="-left-24 mt-2 relative leading-tight"
          />
        </div>

        <label
          htmlFor="programManager"
          className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold"
        >
          Program Manager
        </label>
        <input
          type="text"
          name="programManager"
          id="programManager"
          value={cohort.programManager}
          onChange={handleChange}
          className="border rounded p-2 w-full mb-6"
        />

        <label
          htmlFor="leadTeacher"
          className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold"
        >
          Lead Teacher
        </label>
        <input
          type="text"
          name="leadTeacher"
          id="leadTeacher"
          value={cohort.leadTeacher}
          onChange={handleChange}
          className="border rounded p-2 w-full mb-6"
        />

        <label
          htmlFor="totalHours"
          className="text-gray-600 text-left ml-1 -mb-2 text-l font-bold"
        >
          Total Hours
        </label>
        <input
          type="number"
          name="totalHours"
          id="totalHours"
          value={cohort.totalHours}
          onChange={handleChange}
          className="border rounded p-2 w-full mb-6"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 transition duration-150 ease-in-out"
        >
          Create Cohort
        </button>
      </form>
    </div>
  );
}

export default CohortCreatePage;
