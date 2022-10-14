import React, { useState, useCallback } from "react";
import { Rating } from "@mui/material";
import Popup from "reactjs-popup";

export function ReviewForm(props) {
  const [rating, setRating] = useState(null);

  return (
    <div>
      <Popup
        trigger={
          <button className="button">Attended? Click to leave a review!</button>
        }
        modal
        nested
        className="save-event-modal"
        // singleEventInfo={props.singleEventInfo}
      >
        {(close) => (
          <div className="save-event-modal">
            <button className="close" onClick={close}>
              &times;
            </button>
            <div className="header">
              What did you think of: {props.singleEventInfo.title}?
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
            </div>
            {console.log(rating)}
          </div>
        )}
      </Popup>
    </div>
  );
}
