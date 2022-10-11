import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
//inner components
import DiscoverInfo from "../innerComponents/discoverInfo";
import CreateEvent from "../innerComponents/createEvent";

function Discover() {
  const [fetchError, setFetchError] = useState(null);
  const [events, setEvents] = useState(null);
  const [session, setSession] = useState(null);

  function handleDelete(id) {
    setEvents((prevEvents) => {
      return prevEvents.filter((event) => event.id !== id);
    });
  }

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

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div>
      <h1> EVENTS </h1>
      {fetchError && <p>{fetchError}</p>}
      {events && (
        <div>
          {events.map((event) => (
            <div key={event.id}>
              <DiscoverInfo event={event} onDelete={handleDelete} />
            </div>
          ))}
          <div>
            <CreateEvent />
          </div>
          {session ? (
            <h2>Placeholder: LOGGED IN</h2>
          ) : (
            <h2>Placeholder: NOT LOGGED IN</h2>
          )}
        </div>
      )}
    </div>
  );
}

export default Discover;
