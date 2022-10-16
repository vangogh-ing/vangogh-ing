import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import getProfile from "../../Utils/getProfile";

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userOrgId, setUserOrgId] = useState(null);
  const [orgName, setOrgName] = useState(null);

  const organizationName = useCallback(async () => {
    const { data } = await supabase
      .from("Organization")
      .select("id, name")
      .eq("id", userOrgId);

    if (data) {
      let userOrgName = data[0].name;
      setOrgName(userOrgName);
    }
  }, [userOrgId]);

  useEffect(() => {
    getProfile(session, setLoading, setName, setImageUrl, setUserOrgId);
    if (userOrgId) {
      organizationName();
    }
  }, [session, userOrgId, organizationName]);

  return (
    <div>
      {loading ? (
        "Loading..."
      ) : (
        <div className="account_container">
          <h1>Your Profile</h1>
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
              {userOrgId ? (
                <p className="account_org">
                  <span>Organization:</span>
                  {orgName}
                </p>
              ) : (
                <div className="account_org">
                  <p>No organization linked</p>
                  <a>create an org?</a>
                </div>
              )}
            </div>
            <div className="account_links">
              <Link to="/account/edit">Edit My Profile</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
