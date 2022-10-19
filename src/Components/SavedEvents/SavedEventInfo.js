import React from "react";
import { Link } from "react-router-dom";
import { DateDisplay, TimeDisplay } from "../SingleEvent/DateTimeDisplay";

export default function SavedEventInfo(props) {
  return (
    <div className="saved-page">
      {!props.savedEvents.length ? (
        <div>
          <header className="saved-header">
            <h1>Your Followed Organizations:</h1>
          </header>
          <div className="saved-container">
            <h2 className="none-saved">
              You have not saved any events.
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
                      <img
                        className="saved-event-img"
                        alt="Event Img"
                        src={entry.Events.imageUrl}
                      />
                    </div>
                    <div className="saved-info-right">
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
                      <button onClick={() => props.handleRemove(entry.eventId)}>
                        Remove from Calendar
                      </button>
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
