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
  const [orderBy, setOrderBy] = useState("startDate");

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("Events")
        .select("*")
        .order(orderBy, { ascending: false });

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
  }, [orderBy]);

  return (
    <div>
      <h1> EVENTS </h1>
      <div>
        {/* Order events needs to be turned into toggle */}
        <p>Order by: </p>
        <button onClick={() => setOrderBy("startDate")}>Start Date</button>
        <button onClick={() => setOrderBy("created_at")}>Created at</button>
        {orderBy}
      </div>
      {!session ? (
        <div>
          {fetchError && <p>{fetchError}</p>}
          {events && (
            <div>
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
              {events.map((event) => (
                <DiscoverInfo key={event.id} event={event} />
              ))}
              {/* {session && orgId !== null ? (
                <div>
                  <CreateEvent />
                </div>
              ) : (
                ""
              )} */}
            </div>
          )}
        </div>
      )}
      <h2>Placeholder: LOGGED IN</h2>
    </div>
  );
}

export default Discover;
