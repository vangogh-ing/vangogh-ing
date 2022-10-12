import React, { useEffect, useCallback, useState } from "react";
import { supabase } from "../../supabaseClient";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendar = ({ session }) => {
  const userId = session.user.id;
  const [loading, setLoading] = useState(true);
  const [savedEvents, setSavedEvents] = useState();

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
    const popup = document.getElementById("popup");

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

    popup.innerHTML = `<h1>${eventTitle}</h1>
    <h2>${startDate} - ${endDate}<h2>
    <h3>${eventDescription}</h3>
    `;
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
          <div id="popup"></div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
