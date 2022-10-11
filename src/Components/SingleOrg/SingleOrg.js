import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import SingleOrgEvents from "./SingleOrgEvents";

export default function SingleOrg() {
  const { id } = useParams();
  const [authUserId, setAuthUserId] = useState();

  const [singleOrgInfo, setSingleOrgInfo] = useState({});
  const [error, setError] = useState("");
  const [alreadyFollows, setAlreadyFollows] = useState(false);

  const fetchOrgUserInfo = useCallback(async () => {
    let { data: Organization, error } = await supabase
      .from("Organization")
      .select("*")
      .eq("id", id)
      .single();
    error ? setError(error.message) : setSingleOrgInfo(Organization);
    let userSession = await supabase.auth.getSession();
    if (userSession.data.session) {
      setAuthUserId(userSession.data.session.user.id);
    }
  }, [id]);

  const handleFollowStatus = useCallback(async () => {
    if (authUserId) {
      let { data: user_followed_orgs } = await supabase
        .from("user_followed_orgs")
        .select("*")
        .eq("userId", authUserId)
        .eq("orgId", id)
        .single();
      user_followed_orgs ? setAlreadyFollows(true) : setAlreadyFollows(false);
    }
  }, [authUserId, id]);

  useEffect(() => {
    fetchOrgUserInfo();
    handleFollowStatus();

    return () => {
      setSingleOrgInfo({});
    };
  }, [fetchOrgUserInfo, handleFollowStatus]);

  const handleFollowOrg = useCallback(async () => {
    const { error } = await supabase
      .from("user_followed_orgs")
      .insert([{ userId: authUserId, orgId: id }]);
    if (!error) setAlreadyFollows(true);
  }, [authUserId, id]);

  const handleUnfollowOrg = useCallback(async () => {
    const { error } = await supabase
      .from("user_followed_orgs")
      .delete()
      .eq("userId", authUserId)
      .eq("orgId", id);
    if (!error) setAlreadyFollows(false);
  }, [authUserId, id]);

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
              {authUserId ? (
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
