import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImage] = useState("");
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase
      .from("Events")
      .update({ title, description, date, time, location, imageUrl })
      .eq("id", id)
      .select();

    if (error) {
      console.log(error);
      setFormError("Please fill in all fields correctly");
    }

    if (data) {
      setFormError(null);
      navigate("/discover");
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = supabase
        .from("Events")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        navigate("/discover", { replace: true });
      }

      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setDate(data.date);
        setTime(data.time);
        setLocation(data.location);
        setImage(data.image);
      }
    };

    fetchEvent();
  }, [id, navigate]);

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

        <label htmlFor="date">Date: </label>
        <input
          type="text"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />

        <label htmlFor="time">Time: </label>
        <input
          type="text"
          value={time}
          onChange={(event) => setTime(event.target.value)}
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

        <button>Update Event</button>

        {formError && <p>{formError}</p>}
      </form>
    </div>
  );
}

export default UpdateEvent;
