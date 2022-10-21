import { supabase } from "../../supabaseClient";
import { useCallback, useEffect, useState } from "react";

//add on components
import DiscoverInfo from "../../Utils/discoverInfo";
import LinearProgress from "@mui/material/LinearProgress";

function OrgPastEvents({ session }) {
  const [fetchError, setFetchError] = useState(null);
  const [orgEvents, setOrgEvents] = useState(null);
  const [userOrg, setUserOrgId] = useState(null);
  const [loading, setLoading] = useState(true);

  function isBeforeToday(eventDate) {
    return eventDate < Date.now();
  }

  let userOrgId = useCallback(async () => {
    const { data } = await supabase
      .from("User")
      .select("id, OrgId")
      .eq("id", session.user.id);

    if (data) {
      let userOrg = data[0].OrgId;
      setUserOrgId(userOrg);
    }
  }, [session]);

  let fetchOrgEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from("Events")
      .select("*, Organization (name)")
      .eq("OrgId", userOrg);

    if (error) {
      console.log(error);
      setFetchError("Couldnt fetch orgs events");
      setOrgEvents(null);
    }
    if (data) {
      setOrgEvents(data);
      setFetchError(null);
    }
    setLoading(false);
  }, [userOrg]);

  useEffect(() => {
    userOrgId();
    if (userOrg) {
      fetchOrgEvents(userOrg);
    }
  }, [userOrg, session]);

  return loading ? (
    <div className="loadingComponent">
      <LinearProgress
        sx={{
          height: 10,
          marginTop: "2rem",
        }}
        color="success"
      />
    </div>
  ) : (
    <div className="container">
      {fetchError && <p>{fetchError}</p>}
      {orgEvents && (
        <div>
          <div className="activeEventsHeader">
            <h1>Organizations Past Events</h1>
          </div>
          {orgEvents
            .filter((orgEvent) => {
              return isBeforeToday(new Date(orgEvent.endDate).getTime());
            })
            .map((activeEvent, idx) => {
              return (
                <div className="cardContainer" key={idx}>
                  <DiscoverInfo
                    key={activeEvent.id}
                    session={session}
                    event={activeEvent}
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default OrgPastEvents;
