import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { DateDisplay } from "../SingleEvent/DateTimeDisplay";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function SingleOrgEvents(props) {
  const [filteredEvents, setFilteredEvents] = useState(
    props.orgEvents.filter(
      (eventEntry) => new Date(eventEntry.endDate).getTime() >= Date.now()
    )
  );
  const [eventStatus, setEventStatus] = React.useState("Current");

  const handleChange = useCallback(
    async (event) => {
      if (event.target.checked) {
        setFilteredEvents(
          props.orgEvents.filter(
            (eventEntry) => new Date(eventEntry.endDate).getTime() >= Date.now()
          )
        );
        setEventStatus("Current");
      } else {
        setFilteredEvents(
          props.orgEvents.filter(
            (eventEntry) => new Date(eventEntry.endDate).getTime() < Date.now()
          )
        );
        setEventStatus("Past");
      }
    },
    [props.orgEvents]
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="event-carousel-container">
      {console.log("filteredEvents: ", filteredEvents)}
      {filteredEvents.length ? (
        <header className="event-carousel-header">
          <FormControlLabel
            control={<Switch defaultChecked onChange={handleChange} />}
            label={`${eventStatus} Events: ${props.orgName}`}
          />
        </header>
      ) : (
        <header className="event-carousel-header">
          <FormControlLabel
            control={<Switch defaultChecked onChange={handleChange} />}
            label={`${eventStatus} Events: ${props.orgName}`}
          />
          <br />
          No {eventStatus[0].toLowerCase() + eventStatus.slice(1)} events posted
          yet, check again later!
        </header>
      )}
      {filteredEvents.length > 0 && (
        <Slider className="event-carousel-slider" {...settings}>
          {filteredEvents.map((event) => (
            <div key={event.id}>
              <p>
                <Link to={`/events/${event.id}`}>{event.title}</Link>
              </p>
              <img
                className="event-carousel-img"
                alt="Event Img"
                src={event.imageUrl}
              />
              <DateDisplay start={event.startDate} end={event.endDate} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
