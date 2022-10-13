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
        <div className="infoCard">
          <Link to={`/events/${event.id}`}>
            <div className="imageCard">
              <img className="image" src={event.imageUrl} alt="" />
            </div>

            <h3 className="eventTitle">{event.title}</h3>
            <div className="details">
              <p>
                {event.startTime} - {event.endTime} | {event.startDate} /
                {event.endDate} | {event.location}
              </p>
            </div>
          </Link>
          <p className="description">{event.description}</p>
        </div>
      ) : (
        //logged in as regular user or not logged in at all
        <div className="infoCard">
          <Link to={`/events/${event.id}`}>
            <div className="imageCard">
              <img className="image" src={event.imageUrl} alt="" />
            </div>
            <h3 className="eventTitle">{event.title}</h3>
            <div className="details">
              <p>
                {event.startTime} - {event.endTime} | {event.startDate} /
                {event.endDate} | {event.location}
              </p>
            </div>
          </Link>
          <p className="description">{event.description}</p>
        </div>
      )}
    </div>
  );
}

export default DiscoverInfo;
