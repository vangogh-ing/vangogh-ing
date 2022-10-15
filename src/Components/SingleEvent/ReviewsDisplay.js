//
import React, { useState, useCallback, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { CircularProgress, Rating, Avatar } from "@mui/material";
// import { refresh } from "less";

export default function ReviewsDisplay(props) {
  // const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshReviews = useCallback(async () => {
    await props.fetchAllReviews();
    setLoading(false);
  }, [props]);

  useEffect(() => {
    refreshReviews();
  }, [refreshReviews]);

  return (
    <div>
      {loading ? (
        <CircularProgress color="success" />
      ) : !props.allReviews.length ? (
        <div>No reviews... yet!</div>
      ) : (
        <div>
          <section>
            Reviews:
            {props.allReviews
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
