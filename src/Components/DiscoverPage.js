import { useState } from "react";
import { supabase } from "../supabaseClient";

function DiscoverPage() {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const events = await supabase.from("Events").select("*").range(0, 9);
      const data = events.json();
      setEvents(data);
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  return (
    <div>
      <button onClick={fetchEvents}>Events</button>
      {events.map((event) => {
        return (
          <div key={event.id}>
            <p>{event.title}</p>
            <p>{event.location}</p>
          </div>
        );
      })}
    </div>
  );
}

export default DiscoverPage;
