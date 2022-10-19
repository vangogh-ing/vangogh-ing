import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCallback } from "react";
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
      onDelete(data);
    }
  };

  return (
    <div className="card">
      <div className="imageCard">
        <img className="image" src={event.imageUrl} alt="" />
      </div>
      <div>
        <div className="activeViewHeader">
          <h3>{event.title}</h3>
          <div className="activeButtons">
            <UpdateEvent orgEvent={event} />
            <button
              onClick={() => handleDelete()}
              className="smallYellowButton"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="infoCard">
          <Link className="underlineOliveLink" to={`/events/${event.id}`}>
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

          <div>
            <p className="description">{event.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActiveViewInfo;
