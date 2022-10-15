import React from "react";
import Popup from "reactjs-popup";
import { Button } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

export default function SaveEventPopup(props) {
  return (
    <Popup
      trigger={
        props.alreadySaved ? (
          <Button
            variant="contained"
            className="contained-button"
            size="small"
            endIcon={<EditIcon />}
            color="success"
          >
            {`${props.currentInterestLevel}`}
            {/* {props.alreadySaved
            ? `${props.currentInterestLevel} (edit)`
            : "Save Event"} */}
          </Button>
        ) : (
          <Button
            variant="contained"
            className="contained-button"
            size="small"
            endIcon={<BookmarkBorderIcon />}
            color="success"
          >
            Save
            {/* {props.alreadySaved
              ? `${props.currentInterestLevel} (edit)`
              : "Save Event"} */}
          </Button>
        )
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
