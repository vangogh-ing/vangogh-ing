import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";

export default function Navbar({ session }) {
  const [userOrg, setUserOrgId] = useState(null);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
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

    if (session) {
      userOrgId();
    }
  }, [session]);

  return (
    <div className="navbar">
      <div className="navbar_name">
        VANGOGH
        <img src="/sunflower.png" alt="" />
        ING
      </div>
      {!session ? (
        //not logged in navbar
        <div className="navbar_links">
          <div>
            <Link to="/discover">Discover</Link>
          </div>
          <Link to="/login">Login</Link>
        </div>
      ) : userOrg !== null ? (
        //org user navbar
        <div className="navbar_links">
          <div>
            <Link to="/discover">Discover</Link>
            <Link to="/foryou">For You</Link>
            <Link to="/savedevents">Saved Events</Link>
            <Link to="/plan">Plan </Link>
          </div>
          <div>
            <Link to="/activeevents">Active Events</Link>
            <Link to="/pastevents">Past Events</Link>
          </div>
          <div>
            <Link to="/account">My Account</Link>
            <button
              type="button"
              className="button block"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        //reg user logged in
        <div className="navbar_links">
          <div>
            <Link to="/discover">Discover</Link>
            <Link to="/foryou">For You</Link>
            <Link to="/savedevents">Saved Events</Link>
            <Link to="/plan">Plan</Link>
          </div>
          <div>
            <Link to="/account">My Account</Link>
            <button
              type="button"
              className="button block"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
