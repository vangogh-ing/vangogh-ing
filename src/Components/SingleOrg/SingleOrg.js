import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import SingleOrgEvents from "./SingleOrgEvents";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function SingleOrg() {
  const { id } = useParams();
  const [authUserId, setAuthUserId] = useState();

  const [singleOrgInfo, setSingleOrgInfo] = useState({});
  const [alreadyFollows, setAlreadyFollows] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrgUserInfo = useCallback(async () => {
    let { data: Organization } = await supabase
      .from("Organization")
      .select(
        `*,
    Events (*)`
      )
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
        <div className="loadingComponent">
          <LinearProgress
            sx={{
              height: 10,
              marginTop: "2rem",
            }}
            color="success"
          />
        </div>
      ) : !singleOrgInfo ? (
        <div>
          <h1>Organization Not Found!</h1>
        </div>
      ) : (
        <div className="single-page">
          <div className="single-org-container">
            <header className="single-header">
              <div className="single-header-left">
                <h1>{singleOrgInfo.name}</h1>
                <p>{singleOrgInfo.address}</p>
              </div>
              <div className="single-buttons">
                {authUserId ? (
                  <Button
                    variant="contained"
                    className="contained-button"
                    color={!alreadyFollows ? "success" : "primary"}
                    endIcon={!alreadyFollows ? <AddIcon /> : <RemoveIcon />}
                    onClick={async () => {
                      !alreadyFollows
                        ? await handleFollowOrg()
                        : await handleUnfollowOrg();
                    }}
                  >
                    {!alreadyFollows ? "Follow" : "Unfollow"}
                  </Button>
                ) : (
                  <p>
                    <Link to={"/login"}>Log in</Link> or{" "}
                    <Link to={"/signup"}>sign up</Link> to follow organizations
                    like {singleOrgInfo.name}!
                  </p>
                )}
              </div>
            </header>
            <div className="single-info">
              <img alt="Organization Img" src={singleOrgInfo.imageUrl} />
              <div className="single-details">
                <div className="single-details-top">
                  <p>{singleOrgInfo.description}</p>
                  <p>
                    Website:{" "}
                    {singleOrgInfo.webUrl ? (
                      <a
                        href={singleOrgInfo.webUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {singleOrgInfo.webUrl}
                      </a>
                    ) : (
                      "not available"
                    )}
                  </p>
                </div>
                <div className="single-details-bottom">
                  <p>
                    Hours:{" "}
                    {singleOrgInfo.hours
                      ? singleOrgInfo.hours
                      : "not available"}
                  </p>
                  <p>
                    Tel:{" "}
                    {singleOrgInfo.phone
                      ? singleOrgInfo.phone
                      : "not available"}{" "}
                  </p>
                  <p>
                    Email:{" "}
                    {singleOrgInfo.email
                      ? singleOrgInfo.email
                      : "not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="related-event-container">
            <SingleOrgEvents
              orgName={singleOrgInfo.name}
              orgEvents={singleOrgInfo.Events}
            />
          </div>
        </div>
      )}
    </div>
  );
}
