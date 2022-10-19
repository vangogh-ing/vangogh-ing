import React from "react";
import { Link } from "react-router-dom";
import SingleOrgEvents from "../SingleOrg/SingleOrgEvents";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";

export default function ForYouInfo(props) {
  return (
    <div className="saved-page">
      {!props.followedOrgs.length ? (
        <div>
          <header className="saved-header">
            <h1>Your Followed Organizations:</h1>
          </header>
          <div className="saved-container">
            <h2 className="none-saved">
              You do not follow any organizations.
              <br />
              Visit our <Link to={"/discover"}>discover page</Link> to explore
              arts & culture events and organizations in the city!
            </h2>
          </div>
        </div>
      ) : (
        <div>
          <header className="saved-header">
            <h1>Your Followed Organizations:</h1>
          </header>
          <div className="saved-container" id="for-you-container">
            {props.followedOrgs.map((entry) => (
              <div key={entry.orgId} className="for-you-org">
                <div className="for-you-org-info">
                  <h2>
                    <Link to={`/orgs/${entry.orgId}`}>
                      {entry.Organization.name}
                    </Link>
                  </h2>
                  <div className="saved-info-row">
                    <div className="saved-info-left">
                      <Link to={`/orgs/${entry.orgId}`}>
                        <img
                          className="for-you-org-img"
                          alt="Org Img"
                          src={entry.Organization.imageUrl}
                        />
                      </Link>
                    </div>
                    <div className="saved-info-right">
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
                    orgName={entry.Organization.name}
                    orgEvents={entry.Organization.Events}
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
