import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
//inner components
import DiscoverInfo from "../innerComponents/discoverInfo";
import CreateEvent from "../innerComponents/createEvent";
import { useParams } from "react-router-dom";

function Discover() {
  const { id } = useParams();

  const [fetchError, setFetchError] = useState(null);
  const [events, setEvents] = useState(null);
  const [session, setSession] = useState(null);

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
            <DiscoverInfo key={event.id} event={event} />
          ))}
          <div>
            <CreateEvent />
          </div>
          {session ? (
            <h1>Placeholder: LOGGED IN</h1>
          ) : (
            <h1>Placeholder: NOT LOGGED IN</h1>
          )}
        </div>
      )}
    </div>
  );
}

export default Discover;
