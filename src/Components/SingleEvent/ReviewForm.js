import React, { useState, useCallback } from "react";
import { Rating, TextField } from "@mui/material";
import Popup from "reactjs-popup";

export function ReviewForm(props) {
  const [rating, setRating] = useState(null);
  const [reviewContent, setReviewContent] = useState(null);
  const dummy = "hellotestnow";

  //    _handleTextFieldChange: function(e) {
  //     this.setState({
  //       textFieldValue: e.target.value
  //   });
  // },

  // render: function() {
  //   return (
  //       <div>
  //           <TextField value={this.state.textFieldValue} onChange={this._handleTextFieldChange} />
  //       </div>
  //   )
  // }

  const handleReviewChange = useCallback(async (evt) => {
    setReviewContent(evt.target.value);
  }, []);

  return (
    <div>
      <Popup
        trigger={
          <button className="button">Attended? Click to leave a review!</button>
        }
        modal
        nested
        className="popup"
        // singleEventInfo={props.singleEventInfo}
      >
        {(close) => (
          <div className="popup">
            <div className="popup_header">
              What did you think of: {props.singleEventInfo.title}?
              <button onClick={() => close()}>x</button>
            </div>
            <div className="content"></div>
            <div className="actions">
              <Rating
                name="simple-controlled"
                value={rating}
                size="large"
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
              <div>
                <TextField
                  fullWidth
                  multiline
                  id="review-content"
                  label="Your Review"
                  onChange={handleReviewChange}
                />
              </div>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
}
