import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import Popup from "reactjs-popup";

export default function DeleteOrgPopup(props) {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("Organization")
        .delete()
        .eq("id", props.orgId);

      if (error) {
        throw error;
      } else {
        const updates = {
          id: props.session.user.id,
          OrgId: null,
          updated_at: new Date(),
        };

        let { error } = await supabase.from("User").upsert(updates);
        if (error) {
          throw error;
        } else {
          props.setUserOrgId(null);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      props.closePopup();
      navigate("/account");
    }
  };

  return (
    <Popup
      open={props.open}
      closeOnDocumentClick
      onClose={props.closePopup}
      className="popup"
    >
      {loading ? (
        <div className="popup">
          <div className="popup_header">Loading...</div>
        </div>
      ) : (
        <div className="createOrgPopup">
          <div className="createOrgPopup_header">
            <h1>Are you sure you want to delete?</h1>
            <button onClick={props.closePopup}>x</button>
          </div>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={props.closePopup}>No</button>
        </div>
      )}
    </Popup>
  );
}
