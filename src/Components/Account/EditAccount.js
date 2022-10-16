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
    }
  };

  return (
    <div aria-live="polite">
      {loading ? (
        "Saving..."
      ) : (
        <div className="editAccount_container">
          <h1>Update Your Account</h1>
          <Link to="/account">Return to account</Link>
          <div>
            <div className="account_img">
              {imageUrl === "" ? (
                "no image uploaded"
              ) : (
                <img src={imageUrl} alt="" />
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
          <form onSubmit={updateProfile} className="form-widget">
            <div>Email: {session.user.email}</div>
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
              <button className="button primary block" disabled={loading}>
                Update profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Account;
