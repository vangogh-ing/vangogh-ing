import React from "react";

export default function NotFoundPage(props) {
  return (
    <div className="not-found-page">
      <h1>{props.type ? props.type : "Page"} Not Found!</h1>
      <img
        alt="At Eternity's Gate by Van Gogh"
        src="/notfoundvangogh.jpeg"
        className="not-found-image"
      />
    </div>
  );
}
