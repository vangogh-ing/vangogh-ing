import React from "react";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

export default function SaveEventPopup(props) {
  return (
    <Popup
      trigger={
        props.alreadySaved ? (
          <Button
            variant="contained"
            className="contained-button"
            size="small"
            color="primary"
            endIcon={<EditIcon />}
          >
            {props.currentInterestLevel}
          </Button>
        ) : (
          <Button
            variant="contained"
            className="contained-button"
            size="medium"
            endIcon={<BookmarkBorderIcon />}
            color="success"
          >
            Save
          </Button>
        )
      }
      modal
      nested
      className="interactive-popup"
    >
      {(close) => (
        <div className="interactive-popup">
          <div className="interactive-popup_header">
            Want to gogh to this event?
            <button className="close" onClick={close}>
              &times;
            </button>
          </div>
          <div className="interactive-popup_actions">
            {props.currentInterestLevel && (
              <span>You are currently: {props.currentInterestLevel}.</span>
            )}
            <div>
              See a calendar view of your saved events{" "}
              <Link style={{ color: "#666D24" }} to="/plan">
                here!
              </Link>
            </div>
            <div>
              {props.alreadySaved ? "Edit" : "Indicate"} your preference:
            </div>
            <div className="interactive-popup-buttons">
              <Button
                variant="contained"
                className="contained-button"
                size="small"
                endIcon={<BookmarkBorderIcon />}
                onClick={async () => {
                  await props.handleSaveEvent("interested");
                  close();
                }}
              >
                Interested
              </Button>
              <Button
                variant="contained"
                className="contained-button"
                size="small"
                endIcon={<EventAvailableIcon />}
                onClick={async () => {
                  await props.handleSaveEvent("attending");
                  close();
                }}
              >
                Attending
              </Button>
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
}
