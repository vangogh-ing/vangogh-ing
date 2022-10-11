import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

function DiscoverInfo({ event, onDelete }) {
  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("Events")
      .delete()
      .eq("id", event.id);

    if (error) {
      console.log(error);
    }

    if (data) {
      console.log(data);
      onDelete(event.id);
      window.location.reload(false);
    }
  };

  return (
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
  );
}

export default DiscoverInfo;
