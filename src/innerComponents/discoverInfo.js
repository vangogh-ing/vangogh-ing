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

  //need to query user id and match it to event.orgId

  return (
    <div>
      {session && userOrgId !== null ? (
        <div>
          <Link to={`/events/${event.id}`}>
            <h3>{event.title}</h3>
            <p>
              {event.time} | {event.date} | {event.location}
            </p>
            <img src={event.imageUrl} alt="" />
          </Link>
          <p>{event.description}</p>
          <button onClick={handleDelete}>Delete</button>
        </div>
      ) : (
        <div>
          <Link to={`/events/${event.id}`}>
            <h3>{event.title}</h3>
            <p>
              {event.time} | {event.date} | {event.location}
            </p>
            <img src={event.imageUrl} alt="" />
          </Link>
          <p>{event.description}</p>
        </div>
      )}
    </div>
  );
}

export default DiscoverInfo;
