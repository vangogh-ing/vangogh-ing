import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";

//add on components
import DiscoverInfo from "../../innerComponents/discoverInfo";

function OrgPastEvents({ session }) {
  const todaysdate = Date.now();

  const [fetchError, setFetchError] = useState(null);
  const [orgEvents, setOrgEvents] = useState(null);
  const [userOrg, setUserOrgId] = useState(null);

  const userOrgId = async () => {
    const { data } = await supabase
      .from("User")
      .select("id, OrgId")
      .eq("id", session.user.id);

    if (data) {
      let userOrg = data[0].OrgId;
      setUserOrgId(userOrg);
    }
  };

  const fetchOrgEvents = async () => {
    const { data, error } = await supabase
      .from("Events")
      .select("*")
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
  };

  useEffect(() => {
    userOrgId();
    if (userOrg) {
      fetchOrgEvents(userOrg);
    }
  }, [userOrg]);

  return (
    <div className="container">
      <h1>Org Events Page</h1>
      {fetchError && <p>{fetchError}</p>}
      {orgEvents && (
        <div className="card-container">
          {orgEvents
            .filter((orgEvent) => {
              const eventDate = new Date(orgEvent.endDate).getTime();
              if (eventDate < todaysdate) {
                return orgEvent;
              }
            })
            .map((activeEvent, idx) => {
              return (
                <div className="card" key={idx}>
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
