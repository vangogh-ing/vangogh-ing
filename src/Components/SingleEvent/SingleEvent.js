import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import UpdateEvent from "../../innerComponents/updateEvent";
import SaveEventPopup from "./SaveEventPopup";

export default function SingleEvent() {
  const { id } = useParams();
  const [authUserId, setAuthUserId] = useState();

  const [singleEventInfo, setSingleEventInfo] = useState({});
  const [relatedOrgName, setRelatedOrgName] = useState("");
  const [error, setError] = useState("");
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [currentInterestLevel, setCurrentInterestLevel] = useState("");
  // const [startDate, setStartDate] = useState("");

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
      // if (singleEventInfo.startDate)
      //   setStartDate(handleDateDisplay(singleEventInfo.startDate));
      // setStartDate(handleDateDisplay(singleEventInfo.startDate));
    }

    let userSession = await supabase.auth.getSession();
    if (userSession.data.session) {
      setAuthUserId(userSession.data.session.user.id);
    }
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

  const handleDateDisplay = useCallback((date) => {
    if (date) {
      let resultDate = date.split("-");
      resultDate = resultDate[1] + "/" + resultDate[2] + "/" + resultDate[0];
      return resultDate;
    }
  }, []);

  const handleTimeDisplay = useCallback(
    (startingOrEndingDate, startingOrEndingTime) => {
      // const formattedDateTime = `${startingOrEndingDate}T${startingOrEndingTime}`;
      const formattedDateTime = new Date(
        `${startingOrEndingDate}T${startingOrEndingTime}`
      );
      const options = {
        hour: "numeric",
        minute: "numeric",
      };
      const resultTime = new Intl.DateTimeFormat("en-US", options).format(
        formattedDateTime
      );
      return resultTime;
      // return formattedDateTime;
    },
    []
  );

  // const handleDateDisplay = useCallback(async (date) => {
  //   if (date) {
  //     let resultDate = date.split("-");
  //     resultDate = resultDate[1] + "/" + resultDate[2] + "/" + resultDate[0];
  //     return resultDate;
  //   }
  // }, []);

  // let startDate = singleEventInfo.startDate.split("-");
  // startDate = startDate[1] + "/" + startDate[2] + "/" + startDate[0];
  // let endDate = singleEventInfo.endDate.split("-");
  // endDate = endDate[1] + "/" + endDate[2] + "/" + endDate[0];

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
              <h4>
                {handleDateDisplay(startDate)} - {handleDateDisplay(endDate)}
              </h4>
              <h4>
                {handleTimeDisplay(startDate, startTime)}-
                {handleTimeDisplay(endDate, endTime)}
              </h4>
              <h4>{location}</h4>
            </div>
            <UpdateEvent />
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
          </div>
        )
      )}
    </div>
  );
}
