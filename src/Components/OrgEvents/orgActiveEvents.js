import { supabase } from "../../supabaseClient";
import { useCallback, useEffect, useState } from "react";

//add on components
import DiscoverInfo from "../../innerEventInfo/discoverInfo";
import CreateEvent from "./createEvent";
import UpdateEvent from "./updateEvent";

function OrgActiveEvents({ session }) {
  const [fetchError, setFetchError] = useState(null);
  const [orgEvents, setOrgEvents] = useState(null);
  const [userOrg, setUserOrgId] = useState(null);
  const [orderBy] = useState("created_at");

  function isAfterToday(eventDate) {
    return eventDate > Date.now();
  }

  const handleDelete = async (orgId) => {
    const { data, error } = await supabase
      .from("Events")
      .delete()
      .eq("id", orgId)
      .select();

    if (error) {
      console.log(error);
    }

    if (data) {
      setOrgEvents((prevEvents) => {
        return prevEvents.filter((event) => event.id !== orgId);
      });
    }
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
  });

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
  });

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
          <h1>Org Events Page</h1>
          <CreateEvent user={userOrg} />
          {orgEvents
            .filter((orgEvent) => {
              return isAfterToday(new Date(orgEvent.endDate).getTime());
            })
            .map((activeEvent, idx) => {
              return (
                <div className="cardContainer" key={idx}>
                  <DiscoverInfo
                    key={activeEvent.id}
                    session={session}
                    event={activeEvent}
                  />
                  <button onClick={() => handleDelete(activeEvent.id)}>
                    Delete
                  </button>
                  <UpdateEvent orgEvent={activeEvent} />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default OrgActiveEvents;
