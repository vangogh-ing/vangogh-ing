import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("User")
        .select(`name, email`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setName(data.name);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        id: user.id,
        name,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("User").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      window.location.href = "http://localhost:3000/account";
    }
  };

  return (
    <div aria-live="polite">
      {loading ? (
        "Saving..."
      ) : (
        <div>
          <h1>Welcome!</h1>
          <h3>Want to take a second to fill out your profile?</h3>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <button
              className="button primary block"
              disabled={loading}
              onClick={updateProfile}
            >
              Update profile
            </button>
            <Link to="/account">I'll do it later.</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
