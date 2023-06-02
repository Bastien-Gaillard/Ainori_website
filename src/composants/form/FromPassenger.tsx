import { useEffect, useState } from "react";
import axios from "axios";
import LogoutIcon from '@mui/icons-material/Logout';
import LeaveRouteAdmin from '../Routes/features/LeaveRouteAdmin'

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

const FromPassenger = ({ trajetId ,socket}) => {
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const dataSend = {
            idRoute: trajetId,
        };
        const result = await axios.post("views/allUserRout", dataSend, { headers: { "content-type": "application/json" } })
        console.log(result);
        setPassengers(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPassengers();
  }, [trajetId]);

  return (
    <div>
      {passengers.length > 0 ? (
        <ul>
          {passengers.map((passenger) => (
            <li key={passenger.user_has_route_user_id} style={{display:'flex',alignItems:'center'}}>
              {passenger.participant}
              <LeaveRouteAdmin  routeId={trajetId} userHasRouteId={passenger.user_has_route_id} userId={passenger.user_has_route_user_id} socket={socket} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun passager pour ce trajet.</p>
      )}
    </div>
  );
};

export default FromPassenger;
