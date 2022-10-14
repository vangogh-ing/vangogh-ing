import React from "react";
import Popup from "reactjs-popup";

export default function SaveEventPopup(props) {
  return (
    <Popup
      trigger={
        <button className="button">
          {props.alreadySaved
            ? `Edit Interest Level (${props.currentInterestLevel})`
            : "Save Event"}
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