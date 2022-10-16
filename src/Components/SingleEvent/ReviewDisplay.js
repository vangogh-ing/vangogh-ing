import React, { useState, useCallback, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import {
  Rating,
  TextField,
  Button,
  CircularProgress,
  Avatar,
} from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import Popup from "reactjs-popup";

export default function ReviewDisplay(props) {
  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState(null);
  const [reviewError, setReviewError] = useState(false);
  const [reviewExists, setReviewExists] = useState(false);
  const [allReviews, setAllReviews] = useState([]);
  const [ratingAverage, setRatingAverage] = useState(null);
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

    let userReview = Review.filter((review) => review.userId === props.userId);
    if (userReview.length) {
      setReviewExists(true);
      setRating(userReview[0].rating);
      setReviewContent(userReview[0].content);
    } else {
      setReviewExists(false);
    }

    setLoading(false);

    if (Review.length) {
      setRatingAverage(
        (
          Review.map((review) => review.rating).reduce(
            (prev, curr) => prev + curr
          ) / Review.length
        ).toFixed(1)
      );
    }
  }, [props.eventId, props.userId]);

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

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
        if (!error) {
          await setReviewError(false);
          fetchAllReviews();
          closeFunc();
        }
      } else {
        await setReviewError(true);
      }
    },
    [props.eventId, props.userId, rating, reviewContent, fetchAllReviews]
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
          fetchAllReviews();
          closeFunc();
        }
      }
    },
    [props.eventId, props.userId, fetchAllReviews]
  );

  return (
    <div>
      <section>
        {loading ? (
          <CircularProgress color="success" />
        ) : (
          <div>
            User rating:
            <Rating
              name="average"
              value={+ratingAverage}
              size="large"
              precision={0.1}
              readOnly
            />
            {` (${ratingAverage})`}
          </div>
        )}
      </section>
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
    </div>
  );
}
