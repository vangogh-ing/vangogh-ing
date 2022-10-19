import React from "react";
import { Link } from "react-router-dom";
import { DateDisplay, TimeDisplay } from "../SingleEvent/DateTimeDisplay";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SavedEventInfo(props) {
  return (
    <div className="saved-page">
      {!props.savedEvents.length ? (
        <div>
          <header className="saved-header">
            <h1>Your Saved Events:</h1>
          </header>
          <div className="saved-container">
            <h2 className="none-saved">
              You have no saved events.
              <br />
              Visit our <Link to={"/discover"}>discover page</Link> to explore
              arts & culture events and organizations in the city!
            </h2>
          </div>
        </div>
      ) : (
        <div>
          <header className="saved-header">
            <h1>Your Saved Events:</h1>
          </header>
          <div className="saved-container" id="saved-events-container">
            {props.savedEvents.map((entry) => (
              <div key={entry.eventId} className="saved-event">
                <div className="saved-event-info">
                  <h2>
                    <Link to={`/events/${entry.eventId}`}>
                      {entry.Events.title}
                    </Link>
                  </h2>
                  <div className="saved-info-row">
                    <div className="saved-info-left">
                      <Link to={`/events/${entry.eventId}`}>
                        <img
                          className="saved-event-img"
                          alt="Event Img"
                          src={entry.Events.imageUrl}
                        />
                      </Link>
                    </div>
                    <div className="saved-info-right">
                      <div>
                        <DateDisplay
                          start={entry.Events.startDate}
                          end={entry.Events.endDate}
                        />
                        <TimeDisplay
                          startDate={entry.Events.startDate}
                          startTime={entry.Events.startTime}
                          endDate={entry.Events.endDate}
                          endTime={entry.Events.endTime}
                        />
                      </div>
                      <Button
                        variant="contained"
                        className="contained-button"
                        color="primary"
                        size="small"
                        endIcon={<DeleteIcon />}
                        onClick={async () => {
                          props.handleRemove(entry.eventId);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
