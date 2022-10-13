import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import UpdateEvent from "../../innerComponents/updateEvent";
import Popup from "reactjs-popup";

export default function SaveEvent(props) {
  return (
    <Popup
      trigger={
        <button className="button">
          {props.alreadySaved ? "Edit Interest Level" : "Save Event"}
        </button>
      }
      modal
      nested
      className="save-event-modal"
    >
      {(close) => (
        <div className="save-event-modal">
          <button className="close" onClick={close}>
            &times;
          </button>
        </div>
      )}
    </Popup>
  );
}
