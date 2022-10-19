import React from "react";
// import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { DateDisplay } from "../SingleEvent/DateTimeDisplay";

export default function SingleOrgEvents(props) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="event-carousel-container">
      {props.orgEvents.length ? (
        <header className="event-carousel-header">
          Events Happening at {props.orgName}
        </header>
      ) : (
        <header className="event-carousel-header">
          No events posted yet, check again later!
        </header>
      )}
      {props.orgEvents.length > 0 && (
        <Slider className="event-carousel-slider" {...settings}>
          {props.orgEvents.map((event) => (
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
