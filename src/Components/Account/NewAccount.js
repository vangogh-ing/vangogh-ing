import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import getProfile from "../../Utils/getProfile";

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    getProfile(session, setLoading, setName, setImageUrl);
  }, [session]);

  const handleUploadAvatar = async (e) => {
    let file;

    if (e.target.files) {
      file = e.target.files[0];
    }

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload("public/" + file?.name, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (data) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(`public/${file.name}`);

      if (data.error) {
        throw data.error;
      } else {
        const { user } = session;

        const avatar = {
          id: user.id,
          imageUrl: data.publicUrl,
        };

        let { error } = await supabase.from("User").upsert(avatar);
        setImageUrl(data.publicUrl);

        if (error) {
          throw error;
        }
      }
    } else if (error) {
      console.log(error);
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
      //LOCAL WORKAROUND - FIX FOR PRODUCTION
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
          <h2>Want to take a second to fill out your profile?</h2>
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
            <div>
              <h2>profile picture</h2>
              <div>
                {imageUrl === "" ? (
                  "no image uploaded"
                ) : (
                  <img
                    src={imageUrl}
                    alt=""
                    width="150"
                    height="150"
                    object-fit="cover"
                  />
                  /* NOTE: inline styling to be moved to css */
                )}
              </div>
              <label htmlFor="name">Upload an avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleUploadAvatar(e);
                }}
              />
            </div>
            <Link to="/account">I'll do it later.</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
