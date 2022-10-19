import React, { useEffect, useCallback, useState } from "react";
import { supabase } from "../../supabaseClient";
import SavedEventInfo from "./SavedEventInfo";

export default function FollowedPage(props) {
  const userId = props.session.user.id;
  const [savedEvents, setSavedEvents] = useState();
  const [loading, setLoading] = useState(true);

  const fetchSavedEvents = useCallback(async () => {
    let { data: user_added_events } = await supabase
      .from("user_added_events")
      .select(
        `eventId,
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

  return (
    <div>
      {!loading && (
        <SavedEventInfo
          savedEvents={savedEvents}
          userId={userId}
          handleRemove={handleRemove}
        />
      )}
    </div>
  );
}
