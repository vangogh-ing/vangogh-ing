import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
//inner components
import DiscoverInfo from "../innerComponents/discoverInfo";

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
    <div className="container">
      <h1> EVENTS </h1>
      <div className="order-buttons">
        {/* Order events needs to be turned into toggle */}
        <p>Order by: </p>
        <button onClick={() => setOrderBy("startDate")}>Start Date</button>
        <button onClick={() => setOrderBy("created_at")}>Created at</button>
        {orderBy}
      </div>
      {!session ? (
        //not logged in view
        <div className="card-container">
          {fetchError && <p>{fetchError}</p>}
          {events && (
            <div>
              <h2>Placeholder: NOT LOGGED IN</h2>
              {events.map((event) => (
                <div className="card">
                  <DiscoverInfo key={event.id} event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        //logged in as reg user or org user
        <div className="card-container">
          {fetchError && <p>{fetchError}</p>}
          {events && (
            <div>
              <h2>Placeholder: Logged in</h2>
              {events.map((event) => (
                <div className="card">
                  <DiscoverInfo
                    session={session}
                    key={event.id}
                    event={event}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Discover;
