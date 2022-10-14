import React, { useEffect, useCallback, useState } from "react";
// import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SingleOrgEvents(props) {
  // const { id } = useParams();

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

  const handleDateDisplay = useCallback((date) => {
    if (date) {
      let resultDate = date.split("-");
      resultDate = resultDate[1] + "•" + resultDate[2] + "•" + resultDate[0];
      return resultDate;
    }
  }, []);

  return (
    <div>
      {relatedEventInfo.length ? (
        <h2>Events Happening at {props.orgName}</h2>
      ) : (
        <h2>No events posted yet, check again later!</h2>
      )}
      {relatedEventInfo.length > 0 && (
        <Slider
          {...settings}
          style={{
            marginLeft: "30px",
            width: "25em",
            textAlign: "center",
          }}
        >
          {relatedEventInfo.map((event) => (
            <div key={event.id}>
              <h4>
                <Link to={`/events/${event.id}`}>{event.title}</Link>
              </h4>
              {/* NOTE: PLACEHOLDER STYLING ON IMAGE TAG, TO BE CHANGED */}
              <img
                style={{
                  minWidth: "200px",
                  maxHeight: "200px",
                  objectFit: "contain",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                alt="Event Img"
                src={event.imageUrl}
              />
              {event.startDate === event.endDate && (
                <h5>{handleDateDisplay(event.startDate)}</h5>
              )}
              {event.startDate !== event.endDate && (
                <h5>
                  {handleDateDisplay(event.startDate)} ——{" "}
                  {handleDateDisplay(event.endDate)}
                </h5>
              )}
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
