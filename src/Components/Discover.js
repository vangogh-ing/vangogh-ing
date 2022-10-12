import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
//inner components
import DiscoverInfo from "../innerComponents/discoverInfo";
import CreateEvent from "../innerComponents/createEvent";
import Navbar from "./Navbar";

function Discover() {
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
      {!session ? (
        <div>
          {fetchError && <p>{fetchError}</p>}
          {events && (
            <div>
              <Navbar />
              {events.map((event) => (
                <DiscoverInfo key={event.id} event={event} />
              ))}
            </div>
          )}
          <h2>Placeholder: NOT LOGGED IN</h2>
        </div>
      ) : (
        <div>
          {fetchError && <p>{fetchError}</p>}
          {events && (
            <div>
              <Navbar />
              {events.map((event) => (
                <DiscoverInfo key={event.id} event={event} />
              ))}
              <div>
                <CreateEvent />
              </div>
            </div>
          )}
        </div>
      )}
      <h2>Placeholder: LOGGED IN</h2>
    </div>
  );
}

export default Discover;
