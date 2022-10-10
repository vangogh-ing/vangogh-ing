import { Link } from "react-router-dom";

function DiscoverInfo({ event }) {
  return (
    <div>
      <Link to={`/events/${event.id}`}>
        <h3>{event.title}</h3>
        <p>
          {event.time} | {event.date} | {event.location}
        </p>
        <img src={event.imageUrl} />
      </Link>
      <p>{event.description}</p>
    </div>
  );
}

export default DiscoverInfo;
