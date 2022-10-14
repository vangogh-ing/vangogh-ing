import React from "react";
import { Link } from "react-router-dom";
import { DateDisplay, TimeDisplay } from "../SingleEvent/DateTimeDisplay";

export default function SavedEventInfo(props) {
  return (
    <div>
      {!props.savedEvents.length ? (
        <h1>
          You have not saved any events. <br /> Visit our discovery page to
          explore arts & culture events and organizations in the city!
        </h1>
      ) : (
        <div>
          <h1>Your Saved Events:</h1>
          {props.savedEvents.map((entry) => (
            <div key={entry.eventId}>
              <h2>
                <Link to={`/events/${entry.eventId}`}>
                  {entry.Events.title}
                </Link>
              </h2>
              {/* NOTE: PLACEHOLDER STYLING ON IMAGE TAG, TO BE REMOVED */}
              <img
                style={{
                  minWidth: "200px",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
                alt="Event Img"
                src={entry.Events.imageUrl}
              />
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
          ))}
        </div>
      )}
    </div>
  );
}
