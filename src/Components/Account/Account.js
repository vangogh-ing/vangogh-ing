import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import getProfile from "../../Utils/getProfile";

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    getProfile(session, setLoading, setName, setImageUrl);
  }, [session]);

  return (
    <div aria-live="polite">
      {loading ? (
        "Loading..."
      ) : (
        <div>
          <div className="account_container">
            <div className="account_info">
              <div className="account_img">
                <img src={imageUrl} alt="" />
              </div>
              <div className="account_text">
                <p>
                  <span>Name:</span> {name || "NOT YET SET"}
                </p>
                <p>
                  <span>Email:</span> {session.user.email}
                </p>
              </div>
              <div className="account_links">
                <Link to="/account/edit">Edit My Profile</Link>
                <p>No organization linked</p>
                <a>create an org?</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
