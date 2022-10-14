import React, { useState, useCallback, useEffect } from "react";
import { supabase } from "../../supabaseClient";
// import { Rating, TextField, Button } from "@mui/material";
// import PostAddIcon from "@mui/icons-material/PostAdd";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Popup from "reactjs-popup";

export function ReviewForm(props) {
  const [rating, setRating] = useState(0);
  // const [rating, setRating] = useState(0);
  // const [reviewContent, setReviewContent] = useState(null);
  // const [reviewError, setReviewError] = useState(false);
  // const [reviewExists, setReviewExists] = useState(false);

  const fetchAllReviews = useCallback(async () => {
    if (props.userId) {
      let { data: Review } = await supabase
        .from("Review")
        .select("*")
        .eq("userId", props.userId)
        .eq("eventId", props.eventId)
        .single();
      if (Review) {
        setReviewExists(true);
        setRating(Review.rating);
        setReviewContent(Review.content);
      } else {
        setReviewExists(false);
      }
    }
  }, [props.eventId, props.userId]);

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  return <div></div>;
}
