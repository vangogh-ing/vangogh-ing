import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import React from "react";
import Popup from "reactjs-popup";

function UpdateEvent({ orgEvent }) {
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
  }, [orgEvent.id, orgEvent]);

  return (
    <div>
      <Popup
        trigger={<button className="smallYellowButton">Update Event</button>}
        modal
        nested
      >
        {(close) => (
          <div className="popup">
            <div className="createOrgPopup_header">
              <h1> Update Event Form</h1>
              <button onClick={close}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="createOrgPopup_form">
              <label htmlFor="title">Title: </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />

              <label htmlFor="description">Description: </label>
              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />

              <label htmlFor="startDate">Start Date: </label>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                required
              />

              <label htmlFor="endDate">End Date: </label>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                required
              />

              <label htmlFor="startTime">Start Time: </label>
              <input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                required
              />

              <label htmlFor="endtime">End Time: </label>
              <input
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                required
              />

              <label htmlFor="location">Location: </label>
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                required
              />

              <label htmlFor="imageUrl">Image: </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(event) => setImage(event.target.value)}
              />

              <button onClick={() => window.location.reload(false)}>
                Update
              </button>

              {formError && <p>{formError}</p>}
            </form>
          </div>
        )}
      </Popup>
    </div>
  );
}

export default UpdateEvent;
