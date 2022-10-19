import { supabase } from "../../supabaseClient";
import { useCallback, useEffect, useState } from "react";

//add on components
import ActiveViewInfo from "../../Utils/activeViewInfo";
import CreateEvent from "./createEvent";

function OrgActiveEvents({ session }) {
  const [fetchError, setFetchError] = useState(null);
  const [orgEvents, setOrgEvents] = useState(null);
  const [userOrg, setUserOrgId] = useState(null);
  const [orderBy] = useState("created_at");

  function isAfterToday(eventDate) {
    return eventDate > Date.now();
  }

  const handleDelete = (id) => {
    setOrgEvents((orgEvents) => {
      return orgEvents.filter((event) => event.id !== id);
    });
  };

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
      .select("*")
      .eq("OrgId", userOrg)
      .order(orderBy, { ascending: false });

    if (error) {
      console.log(error);
      setFetchError("Couldnt fetch orgs events");
      setOrgEvents(null);
    }
    if (data) {
      setOrgEvents(data);
      setFetchError(null);
    }
  }, [orderBy, userOrg]);

  useEffect(() => {
    userOrgId();
    if (userOrg) {
      fetchOrgEvents(userOrg);
    }
  }, [userOrg, orderBy, session]);

  return (
    <div className="container">
      {fetchError && <p>{fetchError}</p>}
      {orgEvents && (
        <div>
          <div className="activeEventsHeader">
            <h1>Org Events Page</h1>
            <div>
              <CreateEvent fetchOrgEvents={fetchOrgEvents} user={userOrg} />
            </div>
          </div>
          {orgEvents
            .filter((orgEvent) => {
              return isAfterToday(new Date(orgEvent.endDate).getTime());
            })
            .map((activeEvent, idx) => {
              return (
                <div className="cardContainer" key={idx}>
                  <ActiveViewInfo
                    key={activeEvent.id}
                    event={activeEvent}
                    onDelete={() => handleDelete(activeEvent.id)}
                    fetchOrgEvents={fetchOrgEvents}
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default OrgActiveEvents;
