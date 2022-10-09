import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function SingleOrg() {
  const { id } = useParams();

  const [singleOrgInfo, setSingleOrgInfo] = useState({});
  const [relatedEventInfo, setRelatedEventInfo] = useState([]);
  const [error, setError] = useState("");

  const fetchSingleOrg = useCallback(async () => {
    let { data: Organization, error } = await supabase
      .from("Organization")
      .select("*")
      .eq("id", id)
      .single();
    error ? setError(error.message) : setSingleOrgInfo(Organization);
  }, [id]);

  const fetchRelatedEventInfo = useCallback(async () => {
    let { data: Events, error } = await supabase
      .from("Events")
      .select("*")
      .eq("OrgId", id);
    setRelatedEventInfo(Events);
  }, [id]);

  useEffect(() => {
    fetchSingleOrg();
    fetchRelatedEventInfo();
    return () => {
      setSingleOrgInfo({});
    };
  }, [fetchSingleOrg, fetchRelatedEventInfo]);

  let {
    name,
    address,
    phone,
    email,
    description,
    imageUrl,
    rating,
    hours,
    webUrl,
  } = singleOrgInfo;

  // notes: some basic sizing styling applied to image
  // questions for wireframing: should the info be displayed alone, or with a title like "email: "?
  // should information not available notice be displayed? seems useful for dev purposes
  // but might not be needed for users
  return (
    <div>
      {error && !singleOrgInfo.id ? (
        <div>
          <h1>Organization Id Not Found!</h1>
          <h3>Error: {error}</h3>
        </div>
      ) : (
        singleOrgInfo.id && (
          <div>
            <div className="single-org-info">
              <h1>{name}</h1>
              <h4>{address}</h4>
              <img
                style={{
                  maxWidth: "500px",
                  maxHeight: "500px",
                  objectFit: "contain",
                }}
                alt="Organization Img"
                src={imageUrl}
              />
              <h3>{description}</h3>
              <h4>Rating: {rating ? rating : "not available"}</h4>
              <h4>
                Website:{" "}
                {webUrl ? (
                  <a href={webUrl} rel="noreferrer" target="_blank">
                    {webUrl}
                  </a>
                ) : (
                  "not available"
                )}
              </h4>
              <h4>Hours: {hours ? hours : "not available"}</h4>
              <h4>Tel: {phone ? phone : "not available"} </h4>
              <h4>Email: {email ? email : "not available"}</h4>
            </div>
            <div className="related-event-container">
              {relatedEventInfo.length ? (
                <h2>Events Happening at {name}</h2>
              ) : (
                <h2>No events posted yet, check again later!</h2>
              )}
              {relatedEventInfo.length > 0 &&
                relatedEventInfo.map((event) => (
                  <div key={event.id}>
                    <h4>{event.title}</h4>
                    <img
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        objectFit: "contain",
                      }}
                      alt="Event Img"
                      src={event.imageUrl}
                    />
                    <h5>{event.date}</h5>
                  </div>
                ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
