import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import Popup from "reactjs-popup";

export default function EditOrgPopup(props) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [hours, setHours] = useState("");
  const [webUrl, setWebUrl] = useState("");

  const navigate = useNavigate();

  const orgInfo = useCallback(async () => {
    const { data } = await supabase
      .from("Organization")
      .select(
        "id, name, address, phone, email, description, imageUrl, hours, webUrl"
      )
      .eq("id", props.orgId);

    if (data) {
      const info = data[0];

      setName(info.name || "");
      setAddress(info.address || "");
      setPhone(info.phone || "");
      setEmail(info.email || "");
      setDescription(info.description || "");
      setImageUrl(info.imageUrl || "");
      setHours(info.hours || "");
      setWebUrl(info.webUrl || "");
    }
  }, [props.orgId]);

  useEffect(() => {
    if (props.orgId) {
      orgInfo();
    }
  }, [props.orgId, orgInfo]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const updates = {
        id: props.orgId,
        name,
        address,
        phone,
        email,
        description,
        imageUrl,
        hours,
        webUrl,
      };

      let { error } = await supabase.from("Organization").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      props.closePopup();
      navigate("/account");
    }
  };

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
        const avatar = {
          id: props.orgId,
          imageUrl: data.publicUrl,
        };

        let { error } = await supabase.from("Organization").upsert(avatar);
        setImageUrl(data.publicUrl);

        if (error) {
          throw error;
        }
      }
    } else if (error) {
      console.log(error);
    }
  };

  return (
    <Popup
      open={props.open}
      closeOnDocumentClick
      onClose={props.closePopup}
      className="popup"
    >
      {loading ? (
        <div className="popup">
          <div className="popup_header">Loading...</div>
        </div>
      ) : (
        <div className="createOrgPopup">
          <div className="createOrgPopup_header">
            <h1>Edit Your Organization</h1>
            <button onClick={props.closePopup}>x</button>
          </div>
          <form onSubmit={handleSubmit} className="createOrgPopup_form">
            <label htmlFor="name">Organization Name: </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <label htmlFor="name">Email: </label>
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <label htmlFor="name">Address: </label>
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
            <label htmlFor="name">Phone Number: </label>
            <input
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <label htmlFor="name">Hours: </label>
            <input
              type="text"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
            />
            <label htmlFor="name">URL: </label>
            <input
              type="text"
              value={webUrl}
              onChange={(event) => setWebUrl(event.target.value)}
            />
            <label htmlFor="name">Description: </label>
            <textarea
              type="text"
              cols="100"
              rows="5"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <div className="org_avatar">
              <div className="org_avatar_img">
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
            <button>Update the Org!</button>
          </form>
        </div>
      )}
    </Popup>
  );
}
