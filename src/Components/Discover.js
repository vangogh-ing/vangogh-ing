import { supabase } from "../supabaseClient";
import { useCallback, useEffect, useState } from "react";
//inner components
import DiscoverInfo from "../Utils/discoverInfo";

function Discover() {
  const [fetchError, setFetchError] = useState(null);
  const [events, setEvents] = useState(null);
  const [session, setSession] = useState(null);
  const [orderBy, setOrderBy] = useState("startDate");
  const [userOrgId, setUserOrgId] = useState(null);

  let fetchEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from("Events")
      .select("*, Organization (name)")
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
  }, [orderBy]);

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
  }, [session]);

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
          <div className="header">
            <h1> DISCOVER </h1>
            <div className="order-buttons">
              <p className="orderTitle"> Order by: </p>
              <button
                className="smallYellowButton"
                onClick={() => setOrderBy("startDate")}
              >
                Start Date
              </button>
              <button
                className="smallYellowButton"
                onClick={() => setOrderBy("created_at")}
              >
                Newest
              </button>
            </div>
          </div>
          {events && (
            <div>
              {events.map((event, idx) => (
                <div className="cardContainer" key={idx}>
                  <DiscoverInfo
                    key={event.id}
                    event={event}
                    userOrgId={userOrgId}
                  />
                  <br />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        //logged in as reg user or org user
        <div className="card-container">
          {fetchError && <p>{fetchError}</p>}
          <div className="header">
            <h1> DISCOVER </h1>
            <div className="order-buttons">
              <p className="orderTitle"> Order by: </p>
              <button
                className="smallYellowButton"
                onClick={() => setOrderBy("startDate")}
              >
                Start Date
              </button>
              <button
                className="smallYellowButton"
                onClick={() => setOrderBy("created_at")}
              >
                Newest
              </button>
            </div>
          </div>
          {events && (
            <div>
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
