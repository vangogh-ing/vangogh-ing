import { useState } from "react";
import { supabase } from "../../supabaseClient";

function CreateEvent({ user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImage] = useState("");
  const [formError, setFormError] = useState(null);

  const OrgId = user;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase
      .from("Events")
      .insert([
        {
          title,
          description,
          startDate,
          endDate,
          startTime,
          endTime,
          location,
          imageUrl,
          OrgId,
        },
      ])
      .select();

    if (error) {
      console.log(error);
      setFormError("Please fill in all fields correctly");
    }
    if (data) {
      console.log(data);
      setFormError(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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

        <label htmlFor="endTime">End Time: </label>
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

        <button>Create Event</button>

        {formError && <p>{formError}</p>}
      </form>
    </div>
  );
}

export default CreateEvent;