import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("User")
        .select(`name, email, imageUrl`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setName(data.name);
        setImageUrl(data.imageUrl);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div aria-live="polite">
      {loading ? (
        "Loading..."
      ) : (
        <div>
          <img src={imageUrl} alt="" />
          <p>Name: {name || "NOT YET SET"}</p>
          <p>Email: {session.user.email}</p>
          <Link to="/account/edit">Edit Info</Link>
        </div>
      )}
    </div>
  );
};

export default Account;
