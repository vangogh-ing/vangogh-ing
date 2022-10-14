import React, { useState, useCallback, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Rating, TextField, Button } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import Popup from "reactjs-popup";

export function ReviewForm(props) {
  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState(null);
  const [reviewError, setReviewError] = useState(false);
  const [reviewExists, setReviewExists] = useState(false);

  const fetchReview = useCallback(async () => {
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
    fetchReview();
  }, [fetchReview]);

  const handleReviewStateChange = useCallback(async (evt) => {
    setReviewContent(evt.target.value);
  }, []);

  const handleAddReview = useCallback(
    async (closeFunc) => {
      if (rating) {
        const { error } = await supabase.from("Review").upsert([
          {
            userId: props.userId,
            eventId: props.eventId,
            rating: rating,
            content: reviewContent,
          },
        ]);
        await setReviewError(false);
        fetchReview();
        closeFunc();
      } else {
        await setReviewError(true);
      }
    },
    [props.eventId, props.userId, rating, reviewContent, fetchReview]
  );

  const handleDeleteReview = useCallback(
    async (closeFunc) => {
      if (props.userId) {
        const { error } = await supabase
          .from("Review")
          .delete()
          .eq("userId", props.userId)
          .eq("eventId", props.eventId);

        if (!error) {
          setReviewExists(false);
          setReviewContent(null);
          setRating(null);
          closeFunc();
        }
      }
    },
    [props.eventId, props.userId]
  );

  return (
    <div>
      <Popup
        trigger={
          <button className="button">
            {reviewExists
              ? "Edit your review!"
              : "Attended? Click to leave a review!"}
          </button>
        }
        modal
        nested
        className="popup"
      >
        {(close) => (
          <div className="popup">
            <div className="popup_header">
              What did you think of: {props.singleEventInfo.title}?
              <button
                onClick={() => {
                  close();
                  setReviewError(false);
                }}
              >
                x
              </button>
            </div>
            <div className="content"></div>
            <div className="actions">
              <Rating
                name="simple-controlled"
                value={rating}
                size="large"
                precision={0.5}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
              <div>
                <TextField
                  fullWidth
                  multiline
                  id="review-content"
                  label="Your Review (optional)"
                  defaultValue={reviewContent}
                  onChange={handleReviewStateChange}
                />
              </div>
              <Button
                variant="contained"
                className="contained-button"
                size="small"
                endIcon={<PostAddIcon />}
                onClick={async () => {
                  await handleAddReview(close);
                }}
              >
                Submit
              </Button>
              {reviewExists && (
                <Button
                  variant="contained"
                  className="contained-button"
                  size="small"
                  endIcon={<DeleteIcon />}
                  color="error"
                  onClick={async () => {
                    await handleDeleteReview(close);
                  }}
                >
                  Delete
                </Button>
              )}
              {reviewError && (
                <p>Rate event before submitting review. Min: 1 star.</p>
              )}
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
}
