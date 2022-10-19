import React, { useEffect, useCallback, useState } from "react";
import { supabase } from "../../supabaseClient";
import SavedEventInfo from "./SavedEventInfo";
import LinearProgress from "@mui/material/LinearProgress";

export default function FollowedPage(props) {
  const userId = props.session.user.id;
  const [savedEvents, setSavedEvents] = useState();
  const [loading, setLoading] = useState(true);

  const fetchSavedEvents = useCallback(async () => {
    let { data: user_added_events } = await supabase
      .from("user_added_events")
      .select(
        `eventId, interest_level,
         Events (*)`
      )
      .eq("userId", userId);
    setSavedEvents(
      user_added_events.sort(
        (a, b) => new Date(a.Events.startDate) - new Date(b.Events.startDate)
      )
    );
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchSavedEvents();
  }, [fetchSavedEvents]);

  const handleRemove = useCallback(
    async (eventId) => {
      const { error } = await supabase
        .from("user_added_events")
        .delete()
        .eq("userId", userId)
        .eq("eventId", eventId);
      if (!error) fetchSavedEvents();
    },
    [userId, fetchSavedEvents]
  );

  const handleSaveEvent = useCallback(
    async (interestLevel, eventId) => {
      const { error } = await supabase
        .from("user_added_events")
        .upsert([
          { userId: userId, eventId: eventId, interest_level: interestLevel },
        ])
        .single()
        .select();
      if (!error) {
        fetchSavedEvents();
      }
    },
    [userId, fetchSavedEvents]
  );

  return (
    <div>
      {loading ? (
        <LinearProgress
          sx={{
            height: 10,
            marginTop: "2rem",
          }}
          color="success"
        />
      ) : (
        <SavedEventInfo
          savedEvents={savedEvents}
          userId={userId}
          handleRemove={handleRemove}
          handleSaveEvent={handleSaveEvent}
        />
      )}
    </div>
  );
}
