import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function Navbar({ session, propsOrgId }) {
  const [userOrg, setUserOrgId] = useState(null);

  const [planMenu, setPlanMenu] = useState(null);
  const [orgMenu, setOrgMenu] = useState(null);
  const openPlan = Boolean(planMenu);
  const openOrg = Boolean(orgMenu);

  const handlePlan = (event) => {
    setPlanMenu(event.currentTarget);
  };
  const handlePlanClose = () => {
    setPlanMenu(null);
  };

  const handleOrg = (event) => {
    setOrgMenu(event.currentTarget);
  };
  const handleOrgClose = () => {
    setOrgMenu(null);
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
            <Link to="/foryou">For&nbsp; You </Link>

            <button onClick={handlePlan} className="navbar_org">
              Plan
            </button>
            <Menu anchorEl={planMenu} open={openPlan} onClose={handlePlanClose}>
              <MenuItem onClick={handlePlanClose} className="navbar_org_menu">
                <Link to="/savedevents">Saved Events</Link>
              </MenuItem>
              <MenuItem onClick={handlePlanClose} className="navbar_org_menu">
                <Link to="/plan">Calendar</Link>
              </MenuItem>
            </Menu>

            <button onClick={handleOrg} className="navbar_org">
              My Org Events
            </button>
            <Menu anchorEl={orgMenu} open={openOrg} onClose={handleOrgClose}>
              <MenuItem onClick={handleOrgClose} className="navbar_org_menu">
                <Link to="/activeevents">Active Events</Link>
              </MenuItem>
              <MenuItem onClick={handleOrgClose} className="navbar_org_menu">
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
            <Link to="/foryou">For&nbsp; You</Link>

            <button onClick={handlePlan} className="navbar_org">
              Plan
            </button>
            <Menu anchorEl={planMenu} open={openPlan} onClose={handlePlanClose}>
              <MenuItem onClick={handlePlanClose} className="navbar_org_menu">
                <Link to="/savedevents">Saved Events</Link>
              </MenuItem>
              <MenuItem onClick={handlePlanClose} className="navbar_org_menu">
                <Link to="/plan">Calendar</Link>
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
      )}
    </div>
  );
}
