import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import UpdateEvent from "../../innerComponents/updateEvent";
import Popup from "reactjs-popup";

export default function SaveEvent(props) {
  // const [currentInterestLevel, setCurrentInterestLevel] = useState("");

  // const handleInterest = useCallback(
  //   async () => {
  //     setCurrentInterestLevel(props.currentInterestLevel)
  //   },
  //   [props.currentInterestLevel]
  // );

  // useEffect(() => {
  //   handleInterest();
  // }, [handleInterest]);

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
          <div className="header"> Want to gogh to this event? </div>
          <div className="content">
            {props.currentInterestLevel && (
              <span>
                You are currently: {props.currentInterestLevel}
                <br />
              </span>
            )}
            {props.alreadySaved ? "Edit" : "Indicate"} your preference.
          </div>
          <div className="actions">
            <button
              onClick={() => {
                props.handleSaveEvent("interested");
                close();
              }}
            >
              Interested
            </button>
            <button
              onClick={() => {
                props.handleSaveEvent("attending");
                close();
              }}
            >
              Attending
            </button>
            <div className="content">
              <br />
              See a calendar view of your saved events on the Plan page!
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
}
