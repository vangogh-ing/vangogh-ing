import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import LinearProgress from "@mui/material/LinearProgress";

import getProfile from "../../Utils/getProfile";
import CreateOrgPopup from "./CreateOrgPopup";
import EditOrgPopup from "./EditOrgPopup";
import DeleteOrgPopup from "./DeleteOrgPopup";

const Account = ({ session, handleAccount }) => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userOrgId, setUserOrgId] = useState(null);
  const [orgName, setOrgName] = useState(null);

  const [open, setOpen] = useState(false);
  const closePopup = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const closeDeletePopup = () => setOpenDelete(false);

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

  function handleOrgClick() {
    setOpen(true);
  }

  function handleDeleteClick() {
    setOpenDelete(true);
  }

  function handleOrg(orgId) {
    setUserOrgId(orgId);
    handleAccount(orgId);
  }

  return (
    <div>
      {loading ? (
        <div className="loadingComponent">
          <LinearProgress
            sx={{
              height: 10,
              marginTop: "2rem",
            }}
            color="success"
          />
        </div>
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
                <div className="account_org">
                  <p>
                    <span>Organization:</span>
                    <Link to={`/orgs/${userOrgId}`}>{orgName}</Link>
                  </p>
                  <a href="#editOrg" onClick={handleOrgClick}>
                    edit your org?
                  </a>
                  <EditOrgPopup
                    open={open}
                    closePopup={closePopup}
                    session={session}
                    orgId={userOrgId}
                  />
                  <br />
                  <a href="#deleteOrg" onClick={handleDeleteClick}>
                    delete your org?
                  </a>
                  <DeleteOrgPopup
                    open={openDelete}
                    closePopup={closeDeletePopup}
                    orgId={userOrgId}
                    session={session}
                    setUserOrgId={handleOrg}
                  />
                </div>
              ) : (
                <div className="account_org">
                  <p>No organization linked</p>
                  <a href="#createOrg" onClick={handleOrgClick}>
                    create an org?
                  </a>
                  <CreateOrgPopup
                    open={open}
                    closePopup={closePopup}
                    session={session}
                    setUserOrgId={handleOrg}
                  />
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
