import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import Popup from "reactjs-popup";

export default function SaveEventPopup(props) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState("");
  const [webUrl, setWebUrl] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    try {
      setLoading(true);
      event.preventDefault();

      const { data, error } = await supabase
        .from("Organization")
        .insert([
          {
            name,
            address,
            phone,
            email,
            hours,
            webUrl,
          },
        ])
        .select();
      if (error) {
        throw error;
      }
      if (data) {
        let newOrgId = data[0].id;

        const updates = {
          id: props.session.user.id,
          OrgId: newOrgId,
          updated_at: new Date(),
        };

        let { error } = await supabase.from("User").upsert(updates);
        if (error) {
          throw error;
        } else {
          props.setUserOrgId(newOrgId);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      props.closePopup();
      navigate("/account");
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
            <h1>Create an Organization</h1>
            <button onClick={props.closePopup}>x</button>
          </div>
          <p>must provide at least organization name and email</p>
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
            <button>Create the Org!</button>
          </form>
        </div>
      )}
    </Popup>
  );
}
