import React, { useEffect, useCallback, useState } from "react";
import { supabase } from "../../supabaseClient";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Popup from "reactjs-popup";

const Calendar = ({ session }) => {
  const userId = session.user.id;
  const [loading, setLoading] = useState(true);
  const [savedEvents, setSavedEvents] = useState();
  const [open, setOpen] = useState(false);
  const closePopup = () => setOpen(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupStart, setPopupStart] = useState("");
  const [popupEnd, setPopupEnd] = useState("");
  const [popupDesc, setPopupDesc] = useState("");

  const fetchSavedEvents = useCallback(async () => {
    let { data: user_added_events } = await supabase
      .from("user_added_events")
      .select(
        `eventId,
         Events (*)`
      )
      .eq("userId", userId);

    let eventData = user_added_events.map((event) => {
      return {
        id: event.eventId,
        title: event.Events.title,
        start: `${event.Events.startDate}T${event.Events.startTime}`,
        end: `${event.Events.endDate}T${event.Events.endTime}`,
        description: event.Events.description,
      };
    });

    setSavedEvents(eventData);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchSavedEvents();
  }, [fetchSavedEvents]);

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
        "Loading..."
      ) : (
        <div>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            dayMaxEvents={true}
            events={savedEvents}
            eventClick={renderEventContent}
          />
          <Popup open={open} closeOnDocumentClick onClose={closePopup}>
            <button onClick={closePopup}>&times;</button>
            <h1>{popupTitle}</h1>
            <h2>
              {popupStart} - {popupEnd}
            </h2>
            <h3>{popupDesc}</h3>
          </Popup>
        </div>
      )}
    </div>
  );
};

export default Calendar;
