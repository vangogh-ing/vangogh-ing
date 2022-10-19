import { Link } from "react-router-dom";
import {
  DateDisplay,
  TimeDisplay,
} from "../Components/SingleEvent/DateTimeDisplay";

function DiscoverInfo({ event, session, userOrgId }) {
  return (
    <div>
      {session && userOrgId !== null ? (
        //Logged in as an org
        <div className="card">
          <Link className="underlineOliveLink" to={`/events/${event.id}`}>
            <div className="imageCard">
              <img className="image" src={event.imageUrl} alt="" />
            </div>
          </Link>
          <div className="infoCard">
            <Link className="underlineOliveLink" to={`/events/${event.id}`}>
              <h3 className="eventTitle">{event.title}</h3>
              <div className="details">
                <DateDisplay start={event.startDate} end={event.endDate} />
                <TimeDisplay
                  startDate={event.startDate}
                  endDate={event.endDate}
                  startTime={event.startTime}
                  endTime={event.endTime}
                />
              </div>
            </Link>

            <Link className="underlineOliveLink" to={`/orgs/${event.OrgId}`}>
              <p>Hosted By: {event.Organization.name}</p>
            </Link>
            <div>
              <p className="description">{event.description}</p>
            </div>
          </div>
        </div>
      ) : (
        //logged in as regular user or not logged in at all
        <div className="card">
          <Link className="underlineOliveLink" to={`/events/${event.id}`}>
            <div className="imageCard">
              <img className="image" src={event.imageUrl} alt="" />
            </div>
          </Link>
          <div className="infoCard">
            <Link to={`/events/${event.id}`}>
              <h3 className="eventTitle">{event.title}</h3>
              <div className="details">
                <DateDisplay start={event.startDate} end={event.endDate} />
                <TimeDisplay
                  startDate={event.startDate}
                  endDate={event.endDate}
                  startTime={event.startTime}
                  endTime={event.endTime}
                />
              </div>
            </Link>

            <p>Hosted By: {event.Organization.name}</p>
            <div>
              <p className="description">{event.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiscoverInfo;
