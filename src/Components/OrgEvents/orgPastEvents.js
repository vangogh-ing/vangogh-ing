import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";

//add on components
import DiscoverInfo from "../../innerEventInfo/discoverInfo";

function OrgPastEvents({ session }) {
  const [fetchError, setFetchError] = useState(null);
  const [orgEvents, setOrgEvents] = useState(null);
  const [userOrg, setUserOrgId] = useState(null);

  function isBeforeToday(eventDate) {
    return eventDate < Date.now();
  }
  useEffect(() => {
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
    userOrgId();
    if (userOrg) {
      fetchOrgEvents(userOrg);
    }
  }, [userOrg, session]);

  return (
    <div className="container">
      {fetchError && <p>{fetchError}</p>}
      {orgEvents && (
        <div>
          <h1>Org Events Page</h1>
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
