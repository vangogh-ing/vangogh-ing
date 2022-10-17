import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DateDisplay,
  TimeDisplay,
} from "../Components/SingleEvent/DateTimeDisplay";
import { supabase } from "../supabaseClient";

function DiscoverInfo({ event, session }) {
  const [userOrgId, setUserOrgId] = useState(null);
  useEffect(() => {
    const findUser = async () => {
      const { data, error } = await supabase
        .from("User")
        .select("id, OrgId")
        .eq("id", session.user.id);

      //NOTE: need edge case if user is not logged in -> they have no user id

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
    //findUser();

    if (session) {
      findUser();
    }
  }, [session]);

  return (
    <div>
      {session && userOrgId !== null ? (
        //Logged in as an org
        <div className="card">
          <Link to={`/events/${event.id}`}>
            <div className="imageCard">
              <img className="image" src={event.imageUrl} alt="" />
            </div>
            <div className="infoCard">
              <h3 className="eventTitle">{event.title}</h3>
              <div className="details">
                <p>
                  {event.startTime} - {event.endTime} | {event.startDate} /
                  {event.endDate} | {event.location}
                </p>
              </div>
              <p className="description">{event.description}</p>
            </div>
          </Link>
        </div>
      ) : (
        //logged in as regular user or not logged in at all
        <div className="card">
          <Link to={`/events/${event.id}`}>
            <div className="imageCard">
              <img className="image" src={event.imageUrl} alt="" />
            </div>
            <div className="infoCard">
              <h3 className="eventTitle">{event.title}</h3>
              <div className="details">
                <DateDisplay start={event.startDate} end={event.endDate} />
                <p>
                  {event.startTime} - {event.endTime}
                </p>
                {/* <TimeDisplay
                startDate={event.startDate}
                endDate={event.endDate}
                startTime={event.startTime}
                endTime={event.endTime}
              /> */}
              </div>
              <p className="description">{event.description}</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default DiscoverInfo;
