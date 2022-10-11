import React from "react";
import { Link } from "react-router-dom";

export default function FollowedInfo(props) {
  return (
    <div>
      {!props.followedOrgs.length ? (
        <h1>
          You do not follow any organizations. <br /> Visit our discovery page
          to explore arts & culture events and organizations in the city!
        </h1>
      ) : (
        <div>
          <h1>Your Followed Organizations:</h1>
          {props.followedOrgs.map((entry) => (
            <div key={entry.orgId}>
              <h2>
                <Link to={`/orgs/${entry.orgId}`}>
                  {entry.Organization.name}
                </Link>
              </h2>
              <img
                style={{
                  minWidth: "200px",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
                alt="Org Img"
                src={entry.Organization.imageUrl}
              />
              <p>{entry.Organization.address}</p>
              <button onClick={() => props.handleUnfollow(entry.orgId)}>
                Unfollow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
