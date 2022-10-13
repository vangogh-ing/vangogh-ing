import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

function ActiveView({ event, session }) {
  // const [userOrg, setUserOrg] = useState(null);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const { data, error } = await supabase
  //       .from("User")
  //       .select("id, OrgId")
  //       .eq("id", session.user.id);

  //     if (error) {
  //       console.log(error);
  //       setUserOrg(null);
  //     }

  //     if (data) {
  //       let userOrg = data[0].OrgId;
  //       setUserOrg(userOrg);
  //       console.log("SESSIONUSER: ", userOrg);
  //     }
  //   };
  //   fetchUser();
  // }, []);

  return (
    <div>
      <h2>Active View</h2>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
    </div>
  );
}

export default ActiveView;
