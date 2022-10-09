import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
//inner component
import DiscoverInfo from "../innerComponents/discoverInfo";
import CreateEvent from "../innerComponents/createEvent";

function Discover() {
  const [fetchError, setFetchError] = useState(null);
  const [events, setEvents] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("Events").select("*");

      if (error) {
        setFetchError("Could not fetch events");
        setEvents(null);
        console.log(error);
      }
      if (data) {
        setEvents(data);
        setFetchError(null);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h1> EVENTS </h1>
      {fetchError && <p>{fetchError}</p>}
      {events && (
        <div>
          {events.map((event) => (
            <DiscoverInfo key={event.id} event={event} />
          ))}
          <div>
            <CreateEvent />
          </div>
        </div>
      )}
    </div>
  );
}

export default Discover;
