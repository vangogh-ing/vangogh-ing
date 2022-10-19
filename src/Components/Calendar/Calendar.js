import React, { useEffect, useCallback, useState } from "react";
import { supabase } from "../../supabaseClient";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Popup from "reactjs-popup";
import LinearProgress from "@mui/material/LinearProgress";

const Calendar = ({ session }) => {
  const userId = session.user.id;
  const [loading, setLoading] = useState(true);

  const [isInterested, setIsInterested] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [savedEvents, setSavedEvents] = useState();

  const [open, setOpen] = useState(false);
  const closePopup = () => setOpen(false);

  const [popupTitle, setPopupTitle] = useState("");
  const [popupStart, setPopupStart] = useState("");
  const [popupEnd, setPopupEnd] = useState("");
  const [popupDesc, setPopupDesc] = useState("");

  const fetchSavedEvents = useCallback(async () => {
    let userEvents;

    if (isInterested) {
      let { data } = await supabase
        .from("user_added_events")
        .select(
          `eventId,
          Events (*)`
        )
        .eq("userId", userId)
        .eq("interest_level", "interested");
      userEvents = data;
    } else if (isAttending) {
      let { data } = await supabase
        .from("user_added_events")
        .select(
          `eventId,
          Events (*)`
        )
        .eq("userId", userId)
        .eq("interest_level", "attending");
      userEvents = data;
    } else {
      let { data } = await supabase
        .from("user_added_events")
        .select(
          `eventId,
          Events (*)`
        )
        .eq("userId", userId);
      userEvents = data;
    }

    let eventData = userEvents.map((event) => {
      return {
        id: event.eventId,
        title: event.Events.title,
        start: `${event.Events.startDate}T${event.Events.startTime}`,
        end: `${event.Events.endDate}T${event.Events.endTime}`,
        description: event.Events.description,
      };
    });

    setSavedEvents({
      events: [...eventData],
      color: isInterested ? "#6E8774" : isAttending ? "#677DA2" : "#837F27",
    });
    setLoading(false);
  }, [userId, isInterested, isAttending]);

  useEffect(() => {
    fetchSavedEvents();
  }, [fetchSavedEvents]);

  const allButton = {
    text: "all",
    click: () => {
      setIsInterested(false);
      setIsAttending(false);
    },
  };
  const interestedButton = {
    text: "interested",
    click: () => {
      setIsInterested(true);
      setIsAttending(false);
    },
  };
  const attendingButton = {
    text: "attending",
    click: function () {
      setIsAttending(true);
      setIsInterested(false);
    },
  };

  function renderEventContent(info) {
    setOpen(true);

    const eventTitle = info.event.title;

    const options = {
      hour: "numeric",
      minute: "numeric",
    };
    const startDate = new Intl.DateTimeFormat("en-US", options).format(
      info.event.start
    );
    const endDate = new Intl.DateTimeFormat("en-US", options).format(
      info.event.end
    );

    const eventDescription = info.event.extendedProps.description;

    setPopupTitle(eventTitle);
    setPopupStart(startDate);
    setPopupEnd(endDate);
    setPopupDesc(eventDescription);
  }

  return (
    <div>
      {loading ? (
        <LinearProgress
          sx={{
            height: 10,
            marginTop: "2rem",
          }}
          color="success"
        />
      ) : (
        <div>
          <div id="full_calendar">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              customButtons={{ allButton, interestedButton, attendingButton }}
              headerToolbar={{
                left: "title",
                right:
                  "allButton interestedButton attendingButton today prev next",
              }}
              events={savedEvents}
              eventClick={renderEventContent}
              handleWindowResize="true"
            />
          </div>
          <Popup
            open={open}
            closeOnDocumentClick
            onClose={closePopup}
            className="popup"
          >
            <div className="popup">
              <div className="popup_header">
                <h1>{popupTitle}</h1>
                <button onClick={closePopup}>x</button>
              </div>
              <h2>
                {popupStart} - {popupEnd}
              </h2>
              <h3>{popupDesc}</h3>
            </div>
          </Popup>
        </div>
      )}
    </div>
  );
};

export default Calendar;
