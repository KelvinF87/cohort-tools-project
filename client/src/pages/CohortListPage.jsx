import { useState, useEffect } from "react";
import axios from "axios";
import CohortFilterBar from "../components/CohortFilterBar";
import CohortCard from "../components/CohortCard";

// Import the string from the .env with URL of the API/server - http://localhost:5005
const API_URL = import.meta.env.VITE_API_URL;

function CohortListPage() {
  const [cohorts, setCohorts] = useState([]);
  const [campusQuery, setCampusQuery] = useState("");
  const [programQuery, setProgramQuery] = useState("");
 const token = localStorage.getItem("authToken");
  const handleChange = (event, updateState) => {
    updateState(event.target.value);
  };

  useEffect(() => {
    let queryString = "";
    if (campusQuery) queryString += `campus=${campusQuery}&`;
    if (programQuery) queryString += `program=${programQuery}`;
   
    axios

      .get(`${API_URL}/api/cohorts?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCohorts(response.data);
      })
      .catch((error) => console.log(error));
  }, [campusQuery, programQuery]);

  const getAllCohorts = () => {
    axios
      .get(`${API_URL}/api/cohorts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCohorts(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllCohorts();
  }, []);

  return (
    <div className="CohortListPage">
      <CohortFilterBar
        campusQuery={campusQuery}
        setCampusQuery={setCampusQuery}
        programQuery={programQuery}
        setProgramQuery={setProgramQuery}
        handleChange={handleChange}
      />

      <div className="flex justify-between items-center p-2 font-bold border-b">
        <span style={{ flexBasis: "25%" }}>Cohort</span>
        <span style={{ flexBasis: "15%" }}>Program</span>
        <span style={{ flexBasis: "15%" }}>Format</span>
        <span style={{ flexBasis: "15%" }}>Ongoing</span>
        <span style={{ flexBasis: "25%" }}>Id</span>
      </div>

      {cohorts &&
        cohorts.map((cohort, index) => (
          <CohortCard
            key={cohort._id}
            {...cohort}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
          />
        ))}
    </div>
  );
}

export default CohortListPage;
