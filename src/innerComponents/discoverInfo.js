function DiscoverInfo({ event }) {
  return (
    <div>
      <h3>{event.title}</h3>
      <p>
        {event.time} | {event.date} | {event.location}
      </p>
      <p>{event.description}</p>
    </div>
  );
}

export default DiscoverInfo;
