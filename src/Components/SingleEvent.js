import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function SingleEvent() {
  const { id } = useParams();

  const [singleEventInfo, setSingleEventInfo] = useState({});
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);

  const fetchSingleEvent = useCallback(async () => {
    let { data: Events, error } = await supabase
      .from("Events")
      .select("*")
      .eq("id", id)
      .single();
    error ? setError(error.message) : setSingleEventInfo(Events);
  }, [id]);

  useEffect(() => {
    fetchSingleEvent();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [fetchSingleEvent]);

  let { title, description, date, time, location, imageUrl } = singleEventInfo;

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
              <img
                style={{
                  maxWidth: "400px",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
                alt="Organization Img"
                src={imageUrl}
              />
              <h3>{description}</h3>
              <h4>{date}</h4>
              <h4>{time}</h4>
              <h4>{location}</h4>
            </div>
            {session ? (
              <button>Add Event to Profile</button>
            ) : (
              <p>
                <Link to={"/login"}>Log in</Link> or sign up to add events to
                your profile!
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
}
