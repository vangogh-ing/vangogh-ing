import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import SaveEventPopup from "./SaveEventPopup";
import { DateDisplay, TimeDisplay } from "./DateTimeDisplay";
import ReviewDisplay from "./ReviewDisplay";
import { LinearProgress } from "@mui/material";

export default function SingleEvent() {
  const { id } = useParams();
  const [authUserId, setAuthUserId] = useState();
  const [singleEventInfo, setSingleEventInfo] = useState({});
  const [relatedOrgName, setRelatedOrgName] = useState("");
  const [error, setError] = useState("");
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [currentInterestLevel, setCurrentInterestLevel] = useState("");
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  }, [id, singleEventInfo.OrgId]);

  const handleSavedStatus = useCallback(async () => {
    if (authUserId) {
      let { data: user_added_events } = await supabase
        .from("user_added_events")
        .select("*")
        .eq("userId", authUserId)
        .eq("eventId", id)
        .single();
      if (user_added_events) {
        setAlreadySaved(true);
        setCurrentInterestLevel(user_added_events.interest_level);
      } else {
        setAlreadySaved(false);
      }
    }
  }, [authUserId, id]);

  useEffect(() => {
    fetchSingleEvent();
    handleSavedStatus();
  }, [fetchSingleEvent, handleSavedStatus]);

  const handleSaveEvent = useCallback(
    async (interestLevel) => {
      const { data, error } = await supabase
        .from("user_added_events")
        .upsert([
          { userId: authUserId, eventId: id, interest_level: interestLevel },
        ])
        .single()
        .select();
      if (!error) setAlreadySaved(true);
      setCurrentInterestLevel(data.interest_level);
    },
    [authUserId, id]
  );

  const handleRemoveEvent = useCallback(async () => {
    const { error } = await supabase
      .from("user_added_events")
      .delete()
      .eq("userId", authUserId)
      .eq("eventId", id);
    if (!error) setAlreadySaved(false);
    setCurrentInterestLevel("");
  }, [authUserId, id]);

  let {
    title,
    description,
    startDate,
    endDate,
    startTime,
    endTime,
    location,
    imageUrl,
    OrgId,
  } = singleEventInfo;

  return (
    <div>
      {loading ? (
        <LinearProgress
          sx={{
            height: 10,
          }}
          color="success"
        />
      ) : error && !singleEventInfo.id ? (
        <div>
          <h1>Event Not Found!</h1>
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
              <DateDisplay start={startDate} end={endDate} />
              <TimeDisplay
                startDate={startDate}
                endDate={endDate}
                startTime={startTime}
                endTime={endTime}
              />
              <h4>{location}</h4>
            </div>
            {authUserId ? (
              !alreadySaved ? (
                <SaveEventPopup
                  userId={authUserId}
                  handleSaveEvent={handleSaveEvent}
                  handleRemoveEvent={handleRemoveEvent}
                  alreadySaved={false}
                  currentInterestLevel={currentInterestLevel}
                />
              ) : (
                <div>
                  <SaveEventPopup
                    userId={authUserId}
                    handleSaveEvent={handleSaveEvent}
                    handleRemoveEvent={handleRemoveEvent}
                    alreadySaved={true}
                    currentInterestLevel={currentInterestLevel}
                  />
                  <button onClick={handleRemoveEvent}>
                    Remove Event from Profile
                  </button>
                </div>
              )
            ) : (
              <p>
                <Link to={"/login"}>Log in</Link> or{" "}
                <Link to={"/signup"}>sign up</Link> to add events to your
                profile!
              </p>
            )}
            <ReviewDisplay
              singleEventInfo={singleEventInfo}
              userId={authUserId}
              eventId={id}
            />
          </div>
        )
      )}
    </div>
  );
}
