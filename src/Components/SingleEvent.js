import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import UpdateEvent from "../innerComponents/updateEvent";

export default function SingleEvent() {
  const { id } = useParams();
  const [authUserId, setAuthUserId] = useState();

  const [singleEventInfo, setSingleEventInfo] = useState({});
  const [relatedOrgName, setRelatedOrgName] = useState("");
  const [error, setError] = useState("");
  const [alreadyAdded, setAlreadyAdded] = useState(false);

  const fetchSingleEvent = useCallback(async () => {
    let { data: Events, error } = await supabase
      .from("Events")
      .select("*")
      .eq("id", id)
      .single();
    error ? setError(error.message) : setSingleEventInfo(Events);

    if (singleEventInfo.OrgId) {
      let { data: Organization } = await supabase
        .from("Organization")
        .select("name")
        .eq("id", singleEventInfo.OrgId)
        .single();

      setRelatedOrgName(Organization.name);
    }

    let userSession = await supabase.auth.getSession();
    if (userSession.data.session) {
      setAuthUserId(userSession.data.session.user.id);
    }
  }, [id, singleEventInfo.OrgId]);

  const handleAddedStatus = useCallback(async () => {
    if (authUserId) {
      let { data: user_added_events } = await supabase
        .from("user_added_events")
        .select("*")
        .eq("userId", authUserId)
        .eq("eventId", id)
        .single();
      user_added_events ? setAlreadyAdded(true) : setAlreadyAdded(false);
    }
  }, [authUserId, id]);

  useEffect(() => {
    fetchSingleEvent();
    handleAddedStatus();
  }, [fetchSingleEvent, handleAddedStatus]);

  const handleAddEvent = useCallback(async () => {
    const { error } = await supabase
      .from("user_added_events")
      .insert([{ userId: authUserId, eventId: id }]);
    if (!error) setAlreadyAdded(true);
  }, [authUserId, id]);

  const handleRemoveEvent = useCallback(async () => {
    const { error } = await supabase
      .from("user_added_events")
      .delete()
      .eq("userId", authUserId)
      .eq("eventId", id);
    if (!error) setAlreadyAdded(false);
  }, [authUserId, id]);

  let { title, description, date, time, location, imageUrl, OrgId } =
    singleEventInfo;

  return (
    <div>
      {error && !singleEventInfo.id ? (
        <div>
          <h1>Event Id Not Found!</h1>
          <h3>Error: {error}</h3>
        </div>
      ) : (
        singleEventInfo.id && (
          <div>
            <div className="single-event-info">
              <h1>{title}</h1>
              <p>
                Hosted by: <Link to={`/orgs/${OrgId}`}>{relatedOrgName}</Link>
              </p>
              {/* NOTE: PLACEHOLDER STYLING ON IMAGE TAG, TO BE REMOVED */}
              <img
                style={{
                  maxWidth: "400px",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
                alt="Organization Img"
                src={imageUrl}
              />
              <p>{description}</p>
              <h4>{date}</h4>
              <h4>{time}</h4>
              <h4>{location}</h4>
            </div>
            <UpdateEvent />
            {authUserId ? (
              !alreadyAdded ? (
                <button onClick={handleAddEvent}>Add Event</button>
              ) : (
                <button onClick={handleRemoveEvent}>Remove Event</button>
              )
            ) : (
              <p>
                <Link to={"/login"}>Log in</Link> or{" "}
                <Link to={"/signup"}>sign up</Link> to add events to your
                profile!
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
}
