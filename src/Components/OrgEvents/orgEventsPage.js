import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";

//add on components
import DiscoverInfo from "../../innerComponents/discoverInfo";
import CreateEvent from "../../innerComponents/createEvent";

function OrgEventsPage({ session }) {
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
      console.log("SESSIONUSER: ", userOrg);
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
    <div>
      <h1>Org Events Page</h1>
      {fetchError && <p>{fetchError}</p>}
      {orgEvents && (
        <div>
          <CreateEvent />
          <h3>Org event map</h3>
          {orgEvents.map((orgEvent, idx) => {
            return (
              <div key={idx}>
                <DiscoverInfo
                  key={orgEvent.id}
                  session={session}
                  event={orgEvent}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrgEventsPage;
