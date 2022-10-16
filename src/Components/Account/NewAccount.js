import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import getProfile from "../../Utils/getProfile";

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

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
      navigate("/discover");
    }
  };

  return (
    <div>
      {loading ? (
        "Saving..."
      ) : (
        <div className="editAccount_container">
          <h1>Welcome!</h1>
          <div className="editAccount">
            <h2>Want to take a second to fill out your profile?</h2>
            <h3>
              <Link to="/discover">I'll do it later.</Link>
            </h3>
            <div className="editAccount_info">
              <div className="editAccount_avatar">
                <div className="editAccount_img">
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
              <div className="editAccount_profile">
                <div className="editAccount_bio">
                  <div>
                    <span>Name: </span>
                    <input
                      id="name"
                      type="text"
                      value={name || ""}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <span>Email: </span>
                    {session.user.email}
                  </div>
                </div>
                <div>
                  <button disabled={loading} onClick={updateProfile}>
                    Update profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
