import React, { useEffect, useCallback, useState } from "react";
// import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { DateDisplay } from "../SingleEvent/DateTimeDisplay";

export default function SingleOrgEvents(props) {
  const [relatedEventInfo, setRelatedEventInfo] = useState([]);

  const fetchRelatedEventInfo = useCallback(async () => {
    let { data: Events } = await supabase
      .from("Events")
      .select("*")
      .eq("OrgId", props.orgId);
    setRelatedEventInfo(Events);
  }, [props.orgId]);

  useEffect(() => {
    fetchRelatedEventInfo();
  }, [fetchRelatedEventInfo]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="event-carousel-container">
      {relatedEventInfo.length ? (
        <header className="event-carousel-header">
          Events Happening at {props.orgName}
        </header>
      ) : (
        <header className="event-carousel-header">
          No events posted yet, check again later!
        </header>
      )}
      {relatedEventInfo.length > 0 && (
        <Slider className="event-carousel-slider" {...settings}>
          {relatedEventInfo.map((event) => (
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
