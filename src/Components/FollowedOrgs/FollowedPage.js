import React, { useEffect, useCallback, useState } from "react";
import { supabase } from "../../supabaseClient";
import FollowedInfo from "./FollowedInfo";

export default function FollowedPage(props) {
  const userId = props.session.user.id;
  const [followedOrgs, setFollowedOrgs] = useState();
  const [loading, setLoading] = useState(true);

  const fetchFollowedOrgs = useCallback(async () => {
    let { data: user_followed_orgs } = await supabase
      .from("user_followed_orgs")
      .select(
        `orgId,
         Organization (*)`
      )
      .eq("userId", userId);
    setFollowedOrgs(user_followed_orgs);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchFollowedOrgs();
  }, [fetchFollowedOrgs]);

  const handleUnfollow = useCallback(
    async (orgId) => {
      const { error } = await supabase
        .from("user_followed_orgs")
        .delete()
        .eq("userId", userId)
        .eq("orgId", orgId);
      if (!error) fetchFollowedOrgs();
    },
    [userId, fetchFollowedOrgs]
  );

  return (
    <div>
      {!loading && (
        <FollowedInfo
          followedOrgs={followedOrgs}
          userId={userId}
          handleUnfollow={handleUnfollow}
        />
      )}
    </div>
  );
}
