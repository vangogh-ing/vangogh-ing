import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import UpdateEvent from "../Components/OrgEvents/updateEvent";
import {
  DateDisplay,
  TimeDisplay,
} from "../Components/SingleEvent/DateTimeDisplay";

function ActiveViewInfo({ event, onDelete }) {
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
      onDelete(data);
    }
  };

  return (
    <div>
      <div className="card">
        <Link to={`/events/${event.id}`}>
          <div className="imageCard">
            <img className="image" src={event.imageUrl} alt="" />
          </div>

          <div className="infoCard">
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
            <p className="description">{event.description}</p>
          </div>
        </Link>
        <div className="activeButtons">
          <UpdateEvent orgEvent={event} />
          <button onClick={() => handleDelete()} className="smallYellowButton">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActiveViewInfo;
