import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useState } from "react";

export default function Navbar({ session }) {
  const [userOrg, setUserOrgId] = useState(null);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const userOrgId = async () => {
    const { data, error } = await supabase
      .from("User")
      .select("id, OrgId")
      .eq("id", session.user.id);

    if (error) {
      console.log(error);
    }

    if (data) {
      let userOrg = data[0].OrgId;
      setUserOrgId(userOrg);
    }
  };
  userOrgId();

  return (
    <div>
      {!session ? (
        //not logged in navbar
        <div>
          <Link to="/login">login</Link>
        </div>
      ) : userOrg !== null ? (
        //org user navbar
        <div>
          <Link to="/account">my account</Link>
          <Link to="/discover"> | Discover</Link>
          <Link to="/activeevents"> | Active Events</Link>
          <Link to="/pastevents"> | Past Events</Link>
          <Link to="/plan"> | plan </Link>
          <button
            type="button"
            className="button block"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
          <div>
            <Link to="/plan">Plan</Link>
          </div>
        </div>
      ) : (
        //reg user logged in
        <div>
          <Link to="/account">my account</Link>
          <Link to="/discover"> | Discover</Link>
          <Link to="/foryou"> | for you </Link>
          <Link to="/savedevents"> | saved events </Link>
          <Link to="/plan"> | plan </Link>
          <button
            type="button"
            className="button block"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
          <div>
            <Link to="/plan">Plan</Link>
          </div>
        </div>
      )}
    </div>
  );
}
