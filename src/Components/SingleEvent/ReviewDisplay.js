import React, { useState, useCallback, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import ReviewCard from "./ReviewCard";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterVintageIcon from "@mui/icons-material/FilterVintage";
import EditIcon from "@mui/icons-material/Edit";
import Popup from "reactjs-popup";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#D59E20",
  },
  "& .MuiRating-iconHover": {
    color: "#faaf00",
  },
});

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
    } else {
      setRatingAverage(null);
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
    <div className="reviews-display">
      <section className="reviews-header">
        {loading ? (
          <CircularProgress color="success" />
        ) : (
          <div className="average-rating-container">
            Average user rating:
            <StyledRating
              readOnly
              name="average-rating"
              value={+ratingAverage}
              precision={0.1}
              size="large"
              sx={{
                fontSize: "2rem",
              }}
              icon={<FilterVintageIcon fontSize="inherit" />}
              emptyIcon={<FilterVintageIcon fontSize="inherit" />}
              className="average-rating"
            />
            {ratingAverage ? ` (${ratingAverage})` : " (no reviews)"}
          </div>
        )}
        {props.userId && (
          <Popup
            trigger={
              <Button
                variant="contained"
                className="contained-button"
                size="small"
                endIcon={reviewExists ? <EditIcon /> : <PostAddIcon />}
              >
                {reviewExists ? "Edit review" : "Review!"}
              </Button>
            }
            modal
            nested
            className="interactive-popup"
          >
            {(close) => (
              <div className="interactive-popup">
                <div className="interactive-popup_header">
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
                <div className="interactive-popup_actions">
                  <StyledRating
                    name="rating-input"
                    value={rating}
                    precision={0.5}
                    size="large"
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                    icon={<FilterVintageIcon fontSize="inherit" />}
                    emptyIcon={<FilterVintageIcon fontSize="inherit" />}
                  />
                  <div className="review-text-field">
                    <TextField
                      fullWidth
                      multiline
                      id="review-content"
                      label="Your Review (optional)"
                      defaultValue={reviewContent}
                      onChange={handleReviewStateChange}
                    />
                  </div>
                  <div className="interactive-popup-buttons">
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
                  </div>
                  {reviewError && (
                    <p>Rate event before submitting review. Min: 1 star.</p>
                  )}
                </div>
              </div>
            )}
          </Popup>
        )}
      </section>
      <div>
        {loading ? (
          <CircularProgress color="success" />
        ) : !allReviews.length ? (
          <div>No reviews... yet!</div>
        ) : (
          <section className="reviews-list">
            {allReviews
              .filter((review) => review.content)
              .map((review) => (
                <div key={review.id}>
                  <ReviewCard review={review} />
                </div>
              ))}
          </section>
        )}
      </div>
    </div>
  );
}
