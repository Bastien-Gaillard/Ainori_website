import { useEffect, useState } from "react";
import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

const FromPassenger = ({ trajetId }) => {
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const dataSend = {
            allUserRout: trajetId,
        };
        const result = await instance.post("view/allUserRout", dataSend, { headers: { "content-type": "application/json" } })
        setPassengers(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPassengers();
  }, [trajetId]);

  return (
    <div>
      <h2>Liste des passagers du trajet {trajetId}</h2>
      <ul>
        {passengers.map((passenger) => (
          <li key={passenger.id}>{passenger.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FromPassenger;
