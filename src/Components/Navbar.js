import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function Navbar({ session, propsOrgId }) {
  const [userOrg, setUserOrgId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    if (propsOrgId) {
      setUserOrgId(propsOrgId);
    }

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
  }, [session, propsOrgId]);

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
          <div>
            <Link to="/login">Login</Link>
          </div>
        </div>
      ) : userOrg !== null ? (
        //org user navbar
        <div className="navbar_links">
          <div>
            <Link to="/discover">Discover</Link>
            <Link to="/foryou">For You</Link>
            <Link to="/savedevents">Saved Events</Link>
            <Link to="/plan">Plan </Link>
            <button onClick={handleClick} className="navbar_org">
              My Org Events
            </button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClose} className="navbar_org_menu">
                <Link to="/activeevents">Active Events</Link>
              </MenuItem>
              <MenuItem onClick={handleClose} className="navbar_org_menu">
                <Link to="/pastevents">Past Events</Link>
              </MenuItem>
            </Menu>
          </div>
          <div>
            <Link to="/account">My Account</Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="navbar_signout"
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
              onClick={handleSignOut}
              className="navbar_signout"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
