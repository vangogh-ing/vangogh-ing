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
          <img src={imageUrl} alt="" />
          <p>Name: {name || "NOT YET SET"}</p>
          <p>Email: {session.user.email}</p>
          <Link to="/account/edit">Edit Info</Link>
        </div>
      )}
    </div>
  );
};

export default Account;
