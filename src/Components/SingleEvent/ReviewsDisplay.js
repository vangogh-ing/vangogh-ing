import React, { useState, useCallback, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { CircularProgress, Rating, Avatar } from "@mui/material";

export default function ReviewsDisplay(props) {
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllReviews = useCallback(async () => {
    let { data: Review } = await supabase
      .from("Review")
      .select(
        `*,
      User ("*")`
      )
      .eq("eventId", props.eventId);
    setAllReviews(Review);
    setLoading(false);
  }, [props.eventId]);

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  return (
    <div>
      {loading ? (
        <CircularProgress color="success" />
      ) : !allReviews.length ? (
        <div>No reviews... yet!</div>
      ) : (
        <div>
          <section>
            Reviews:
            {allReviews
              .filter((review) => review.content)
              .map((review) => (
                <div key={review.id}>
                  <Avatar alt={review.User.name} src={review.User.imageUrl} />
                  {review.User.name}:
                  <Rating
                    name="read-only"
                    value={review.rating}
                    size="small"
                    precision={0.5}
                    readOnly
                  />
                  <span>{review.content}</span>
                </div>
              ))}
          </section>
        </div>
      )}
    </div>
  );
}
