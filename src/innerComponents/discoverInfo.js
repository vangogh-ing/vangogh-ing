import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

//component
import CreateEvent from "./createEvent";

function DiscoverInfo({ event, onDelete, session }) {
  const [userOrgId, setUserOrgId] = useState(null);

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("Events")
      .delete()
      .eq("id", event.id)
      .select();

    if (error) {
      console.log(error);
    }

    if (data) {
      console.log(data);
      onDelete(event.id);
      window.location.reload(false);
    }
  };

  useEffect(() => {
    const findUser = async () => {
      const { data, error } = await supabase
        .from("User")
        .select("id, OrgId")
        .eq("id", session.user.id);

      if (error) {
        console.log(error);
        setUserOrgId(null);
      }

      if (data) {
        console.log();
        let orgId = data[0].OrgId;
        setUserOrgId(orgId);
      }
    };
    findUser();
  }, []);

  return (
    <div>
      {session && userOrgId !== null ? (
        //Logged in as an org
        <div>
          <Link to={`/events/${event.id}`}>
            <img src={event.imageUrl} alt="" />
            <h3>{event.title}</h3>
            <div className="details">
              <p>
                {event.startTime} - {event.endTime}
              </p>
              <p>
                {event.startDate} / {event.endDate}
              </p>
              <p>{event.location}</p>
            </div>
          </Link>
          <p>{event.description}</p>
        </div>
      ) : (
        //logged in as regular user or not logged in at all
        <div>
          <Link to={`/events/${event.id}`}>
            <img src={event.imageUrl} alt="" />
            <h3>{event.title}</h3>
            <div className="details">
              <p>
                {event.startTime} - {event.endTime}
              </p>
              <p>
                {event.startDate} / {event.endDate}
              </p>
              <p>{event.location}</p>
            </div>
          </Link>
          <p>{event.description}</p>
        </div>
      )}
    </div>
  );
}

export default DiscoverInfo;
