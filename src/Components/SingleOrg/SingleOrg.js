import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import SingleOrgEvents from "./SingleOrgEvents";

export default function SingleOrg() {
  const { id } = useParams();

  const [singleOrgInfo, setSingleOrgInfo] = useState({});
  const [error, setError] = useState("");
  const [session, setSession] = useState("");
  const [alreadyFollows, setAlreadyFollows] = useState(false);

  const fetchSingleOrg = useCallback(async () => {
    let { data: Organization, error } = await supabase
      .from("Organization")
      .select("*")
      .eq("id", id)
      .single();
    error ? setError(error.message) : setSingleOrgInfo(Organization);
  }, [id]);

  const handleSession = useCallback(async () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    fetchSingleOrg();
    handleSession();

    return () => {
      setSingleOrgInfo({});
    };
  }, [fetchSingleOrg, handleSession]);

  const handleFollowStatus = useCallback(async () => {
    if (session.user) {
      let { data: user_followed_orgs, error } = await supabase
        .from("user_followed_orgs")
        .select("*")
        .eq("userId", session.user.id)
        .eq("orgId", id)
        .single();
      user_followed_orgs ? setAlreadyFollows(true) : setAlreadyFollows(false);
    }
  }, [session, id]);

  handleFollowStatus();

  const handleFollowOrg = useCallback(async () => {
    const { data, error } = await supabase
      .from("user_followed_orgs")
      .insert([{ userId: session.user.id, orgId: id }]);
    if (error) console.log(error);
    handleFollowStatus();
  }, [session, id, handleFollowStatus]);

  const handleUnfollowOrg = useCallback(async () => {
    const { data, error } = await supabase
      .from("user_followed_orgs")
      .delete()
      .eq("userId", session.user.id)
      .eq("orgId", id);

    if (error) console.log(error);
    handleFollowStatus();
  }, [session, id, handleFollowStatus]);

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
              <p>{address}</p>
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
              {/* {placeholder follow button} */}
              {session ? (
                !alreadyFollows ? (
                  <button onClick={handleFollowOrg}>Follow Organization</button>
                ) : (
                  <button onClick={handleUnfollowOrg}>
                    Unfollow Organization
                  </button>
                )
              ) : (
                <p>
                  <Link to={"/login"}>Log in</Link> or{" "}
                  <Link to={"/signup"}>sign up</Link> to follow organizations
                  like {name}!
                </p>
              )}
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
              <SingleOrgEvents orgName={name} />
            </div>
          </div>
        )
      )}
    </div>
  );
}
