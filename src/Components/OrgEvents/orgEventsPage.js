import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";
import ActiveView from "./activeView";

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

    console.log("USERORGID: ", userOrg);

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

  console.log("ORGEVENTS: ", orgEvents);

  return (
    <div>
      <h1>Org Events Page</h1>
      {fetchError && <p>{fetchError}</p>}
      {orgEvents && (
        <div>
          <h3>Org event map</h3>
          {orgEvents.map((orgEvent) => {
            return (
              <div>
                <p>{orgEvent.title}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrgEventsPage;
