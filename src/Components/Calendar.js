import FullCalendar from "@fullcalendar/react"; // must go before plugins

//plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!

const events = [
  {
    id: 1,
    title: "event 1",
    start: "2021-06-14T10:00:00",
    end: "2021-06-14T12:00:00",
  },
  {
    id: 2,
    title: "event 2",
    start: "2022-10-16T13:00:00",
    end: "2022-10-16T18:00:00",
  },
  { id: 3, title: "event 3", start: "2021-06-17", end: "2021-06-20" },
];

function Calendar() {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick
      />
    </div>
  );
}
export default Calendar;
