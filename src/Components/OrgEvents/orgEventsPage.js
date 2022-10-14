import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";

//add on components
import DiscoverInfo from "../../innerComponents/discoverInfo";
import CreateEvent from "../../innerComponents/createEvent";

function OrgEventsPage({ session }) {
  const todaysdate = Date.now();

  const [fetchError, setFetchError] = useState(null);
  const [orgEvents, setOrgEvents] = useState(null);
  const [userOrg, setUserOrgId] = useState(null);
  // const [activeEvent, setActiveEvent] = useState(null);

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
      // let activeEvents = data.filter((event) => {
      //   const eventDate = new Date(event.endDate).getTime();

      //   if (eventDate > todaysdate) {
      //     return eventDate;
      //   }
      // });
      // setActiveEvent(activeEvents);
      // console.log("ACTIVEEVENTS: ", activeEvents);
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
          <CreateEvent />
          {/* <button onClick={setActiveEvent}>Active Events</button> */}
          <h3>Org event map</h3>
          {/* {orgEvents.map((orgEvent, idx) => {
            return (
              <div className="card" key={idx}>
                <DiscoverInfo
                  key={orgEvent.id}
                  session={session}
                  event={orgEvent}
                />
              </div>
            );
          })} */}

          {orgEvents
            .filter((orgEvent) => {
              const eventDate = new Date(orgEvent.endDate).getTime();
              if (eventDate > todaysdate) {
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

export default OrgEventsPage;
