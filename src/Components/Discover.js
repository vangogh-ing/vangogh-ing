import { supabase } from "../supabaseClient";
import { useCallback, useEffect, useState } from "react";
//inner components
import DiscoverInfo from "../innerEventInfo/discoverInfo";

function Discover() {
  const [fetchError, setFetchError] = useState(null);
  const [events, setEvents] = useState(null);
  const [session, setSession] = useState(null);
  const [orderBy, setOrderBy] = useState("startDate");
  const [userOrgId, setUserOrgId] = useState(null);

  let fetchEvents = useCallback(async () => {
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
  });

  let findUser = useCallback(async () => {
    const { data, error } = await supabase
      .from("User")
      .select("id, OrgId")
      .eq("id", session.user.id);

    if (error) {
      console.log(error);
      setUserOrgId(null);
    }

    if (data) {
      let orgId = data[0].OrgId;
      setUserOrgId(orgId);
    }
  });

  useEffect(() => {
    if (session) {
      findUser();
    }
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
      {!session ? (
        //not logged in view
        <div className="card-container">
          {fetchError && <p>{fetchError}</p>}
          <h1> DISCOVER </h1>
          <div className="order-buttons">
            <p> Order by: </p>
            <button
              className="orderButton"
              onClick={() => setOrderBy("startDate")}
            >
              Start Date
            </button>
            <button
              className="orderButton"
              onClick={() => setOrderBy("created_at")}
            >
              Newest
            </button>
            {orderBy}
          </div>
          {events && (
            <div>
              <h2>Placeholder: NOT LOGGED IN</h2>
              {events.map((event, idx) => (
                <div className="cardContainer" key={idx}>
                  <DiscoverInfo
                    key={event.id}
                    event={event}
                    userOrgId={userOrgId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        //logged in as reg user or org user
        <div className="card-container">
          {fetchError && <p>{fetchError}</p>}
          <h1> DISCOVER </h1>
          <div className="order-buttons">
            <p className="orderTitle"> Order by: </p>
            <button
              className="orderButton"
              onClick={() => setOrderBy("startDate")}
            >
              Start Date
            </button>
            <button
              className="orderButton"
              onClick={() => setOrderBy("created_at")}
            >
              Newest
            </button>
            {orderBy}
          </div>
          {events && (
            <div>
              <h2>Placeholder: Logged in</h2>
              {events.map((event, idx) => (
                <div className="cardContainer" key={idx}>
                  <DiscoverInfo
                    session={session}
                    key={event.id}
                    event={event}
                  />
                  <br />
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
