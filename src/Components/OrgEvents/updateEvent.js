import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import React from "react";
import Popup from "reactjs-popup";

function UpdateEvent({ orgEvent, onUpdate }) {
  const [title, setTitle] = useState(orgEvent.title);
  const [description, setDescription] = useState(orgEvent.description);
  const [startDate, setStartDate] = useState(orgEvent.startDate);
  const [endDate, setEndDate] = useState(orgEvent.endDate);
  const [startTime, setStartTime] = useState(orgEvent.startTime);
  const [endTime, setEndTime] = useState(orgEvent.endTime);
  const [location, setLocation] = useState(orgEvent.location);
  const [imageUrl, setImage] = useState(orgEvent.imageUrl);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase
      .from("Events")
      .update({
        title,
        description,
        startDate,
        endDate,
        startTime,
        endTime,
        location,
        imageUrl,
      })
      .eq("id", orgEvent.id);

    if (error) {
      console.log(error);
      setFormError("Please fill in all fields correctly");
    }

    if (data) {
      setFormError(null);
      return data;
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = supabase
        .from("Events")
        .select()
        .eq("id", orgEvent.id)
        .single();

      if (error) {
        console.log(error);
      }

      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        setStartTime(data.startTime);
        setEndTime(data.endTime);
        setLocation(data.location);
        setImage(data.image);
      }
    };

    fetchEvent();
  }, [orgEvent.id]);

  return (
    <Popup
      trigger={<button className="smallYellowButton">Update Event</button>}
      modal
      nested
    >
      {(close) => (
        <div className="popup">
          <button onClick={close}>&times;</button>
          <form onSubmit={handleSubmit}>
            <div className="popup-content">
              <label htmlFor="title">Title: </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>

            <div className="popup-content">
              <label htmlFor="description">Description: </label>
              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>

            <div className="popup-content">
              <label htmlFor="startDate">Start Date: </label>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                required
              />
            </div>

            <div className="popup-content">
              <label htmlFor="endDate">End Date: </label>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                required
              />
            </div>

            <div className="popup-content">
              <label htmlFor="startTime">Start Time: </label>
              <input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                required
              />
            </div>

            <div className="popup-content">
              <label htmlFor="endtime">End Time: </label>
              <input
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                required
              />
            </div>

            <div className="popup-content">
              <label htmlFor="location">Location: </label>
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                required
              />
            </div>

            <div className="popup-content">
              <label htmlFor="imageUrl">Image: </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(event) => setImage(event.target.value)}
              />
            </div>

            <div>
              <button>Update</button>
            </div>

            {formError && <p>{formError}</p>}
          </form>
        </div>
      )}
    </Popup>
  );
}

export default UpdateEvent;
