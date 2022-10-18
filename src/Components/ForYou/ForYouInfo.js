import React from "react";
import { Link } from "react-router-dom";
import SingleOrgEvents from "../SingleOrg/SingleOrgEvents";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";

export default function ForYouInfo(props) {
  return (
    <div className="for-you-page">
      {!props.followedOrgs.length ? (
        <div>
          <header className="for-you-header">
            <h1>Your Followed Organizations:</h1>
          </header>
          <div className="for-you-container">
            {/* <div className="for-you-header"> */}
            {/* <h1>You do not follow any organizations.</h1> */}
            <h2 className="for-you-none-followed">
              You do not follow any organizations.
              <br />
              Visit our <Link to={"/discover"}>discover page</Link> to explore
              arts & culture events and organizations in the city!
            </h2>
            {/* </div> */}
          </div>
        </div>
      ) : (
        <div>
          <header className="for-you-header">
            <h1>Your Followed Organizations:</h1>
          </header>
          <div className="for-you-container">
            {/* <header className="for-you-header">
            <h1>Your Followed Organizations:</h1>
          </header> */}
            {props.followedOrgs.map((entry) => (
              <div key={entry.orgId} className="for-you-org">
                <div className="for-you-org-info">
                  <h2>
                    <Link to={`/orgs/${entry.orgId}`}>
                      {entry.Organization.name}
                    </Link>
                  </h2>
                  <div className="for-you-org-info-row">
                    <div className="for-you-org-info-left">
                      <Link to={`/orgs/${entry.orgId}`}>
                        <img
                          className="for-you-org-img"
                          alt="Org Img"
                          src={entry.Organization.imageUrl}
                        />
                      </Link>
                      {/* <img alt="Org Img" src={entry.Organization.imageUrl} /> */}
                    </div>
                    <div className="for-you-org-info-right">
                      <p>{entry.Organization.address}</p>
                      <Button
                        variant="contained"
                        className="contained-button"
                        color="primary"
                        size="small"
                        endIcon={<RemoveIcon />}
                        onClick={async () => {
                          props.handleUnfollow(entry.orgId);
                        }}
                      >
                        Unfollow
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="for-you-org-events">
                  <SingleOrgEvents
                    orgInfo={entry.Organization}
                    orgId={entry.orgId}
                    orgName={entry.Organization.name}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
