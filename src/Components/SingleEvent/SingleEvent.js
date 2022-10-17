import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import SaveEventPopup from "./SaveEventPopup";
import { DateDisplay, TimeDisplay } from "./DateTimeDisplay";
import ReviewDisplay from "./ReviewDisplay";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SingleEvent() {
  const { id } = useParams();
  const [authUserId, setAuthUserId] = useState();
  const [singleEventInfo, setSingleEventInfo] = useState({});
  const [relatedOrgName, setRelatedOrgName] = useState("");
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [currentInterestLevel, setCurrentInterestLevel] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSingleEvent = useCallback(async () => {
    let { data: Events } = await supabase
      .from("Events")
      .select(
        `*,
         Organization (name)`
      )
      .eq("id", id);

    if (Events[0]) {
      setSingleEventInfo(Events[0]);
      setRelatedOrgName(Events[0].Organization.name);
    }

    let userSession = await supabase.auth.getSession();
    if (userSession.data.session) {
      setAuthUserId(userSession.data.session.user.id);
    }
    setLoading(false);
  }, [id]);

  const handleSavedStatus = useCallback(async () => {
    if (authUserId) {
      let { data: user_added_events } = await supabase
        .from("user_added_events")
        .select("*")
        .eq("userId", authUserId)
        .eq("eventId", id);

      if (user_added_events[0]) {
        setAlreadySaved(true);
        setCurrentInterestLevel(user_added_events[0].interest_level);
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

  return (
    <div>
      {loading ? (
        <LinearProgress
          sx={{
            height: 10,
          }}
          color="success"
        />
      ) : !singleEventInfo.id ? (
        <div>
          <h1>Event Not Found!</h1>
        </div>
      ) : (
        <div className="single-page">
          <div className="single-container">
            <header className="single-header">
              <div className="single-header-left">
                <h1>{singleEventInfo.title}</h1>
                <h2>
                  Hosted by:{" "}
                  <Link to={`/orgs/${singleEventInfo.OrgId}`}>
                    {relatedOrgName}
                  </Link>
                </h2>
              </div>
              <div className="single-buttons">
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
                      <IconButton
                        variant="contained"
                        className="remove-event-button"
                        color="error"
                        onClick={handleRemoveEvent}
                      >
                        <DeleteIcon
                          titleAccess="remove-event"
                          fontSize="large"
                        />
                      </IconButton>
                    </div>
                  )
                ) : (
                  <p>
                    <Link to={"/login"}>Log in</Link> or{" "}
                    <Link to={"/signup"}>sign up</Link> to save events!
                  </p>
                )}
              </div>
            </header>
            {/* NOTE: PLACEHOLDER STYLING ON IMAGE TAG, TO BE REMOVED */}
            <div className="single-info">
              {/* <div className="single-event-image"> */}
              <img alt="Organization Img" src={singleEventInfo.imageUrl} />
              {/* </div> */}
              <div className="single-details">
                <div className="single-details-top">
                  <DateDisplay
                    start={singleEventInfo.startDate}
                    end={singleEventInfo.endDate}
                  />
                  <TimeDisplay
                    startDate={singleEventInfo.startDate}
                    endDate={singleEventInfo.endDate}
                    startTime={singleEventInfo.startTime}
                    endTime={singleEventInfo.endTime}
                  />
                  <p>{singleEventInfo.location}</p>
                </div>
                <p>{singleEventInfo.description}</p>
              </div>
            </div>
          </div>
          <ReviewDisplay
            singleEventInfo={singleEventInfo}
            userId={authUserId}
            eventId={id}
          />
        </div>
      )}
    </div>
  );
}
