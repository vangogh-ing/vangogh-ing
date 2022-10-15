import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import SingleOrgEvents from "./SingleOrgEvents";
import { LinearProgress } from "@mui/material";

export default function SingleOrg() {
  const { id } = useParams();
  const [authUserId, setAuthUserId] = useState();

  const [singleOrgInfo, setSingleOrgInfo] = useState({});
  const [alreadyFollows, setAlreadyFollows] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrgUserInfo = useCallback(async () => {
    let { data: Organization } = await supabase
      .from("Organization")
      .select("*")
      .eq("id", id);

    if (Organization[0]) {
      setSingleOrgInfo(Organization[0]);
    }

    let userSession = await supabase.auth.getSession();
    if (userSession.data.session) {
      setAuthUserId(userSession.data.session.user.id);
    }
    setLoading(false);
  }, [id]);

  const handleFollowStatus = useCallback(async () => {
    if (authUserId) {
      let { data: user_followed_orgs } = await supabase
        .from("user_followed_orgs")
        .select("*")
        .eq("userId", authUserId)
        .eq("orgId", id);
      user_followed_orgs.length
        ? setAlreadyFollows(true)
        : setAlreadyFollows(false);
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

  return (
    <div>
      {loading ? (
        <LinearProgress
          sx={{
            height: 10,
          }}
          color="success"
        />
      ) : !singleOrgInfo.id ? (
        <div>
          <h1>Organization Not Found!</h1>
        </div>
      ) : (
        <div>
          <div className="single-org-info">
            <h1>{singleOrgInfo.name}</h1>
            <p>{singleOrgInfo.address}</p>
            {/* NOTE: PLACEHOLDER STYLING ON IMAGE TAG, TO BE REMOVED */}
            <img
              style={{
                maxWidth: "500px",
                maxHeight: "500px",
                objectFit: "contain",
              }}
              alt="Organization Img"
              src={singleOrgInfo.imageUrl}
            />
            <h3>{singleOrgInfo.description}</h3>
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
                <Link to={"/signup"}>sign up</Link> to follow organizations like{" "}
                {singleOrgInfo.name}!
              </p>
            )}
            <h4>
              Rating:{" "}
              {singleOrgInfo.rating ? singleOrgInfo.rating : "not available"}
            </h4>
            <h4>
              Website:{" "}
              {singleOrgInfo.webUrl ? (
                <a href={singleOrgInfo.webUrl} rel="noreferrer" target="_blank">
                  {singleOrgInfo.webUrl}
                </a>
              ) : (
                "not available"
              )}
            </h4>
            <h4>
              Hours:{" "}
              {singleOrgInfo.hours ? singleOrgInfo.hours : "not available"}
            </h4>
            <h4>
              Tel: {singleOrgInfo.phone ? singleOrgInfo.phone : "not available"}{" "}
            </h4>
            <h4>
              Email:{" "}
              {singleOrgInfo.email ? singleOrgInfo.email : "not available"}
            </h4>
          </div>
          <div className="related-event-container">
            <SingleOrgEvents orgName={singleOrgInfo.name} orgId={id} />
          </div>
        </div>
      )}
    </div>
  );
}
