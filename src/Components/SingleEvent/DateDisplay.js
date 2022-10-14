import React, { useCallback } from "react";

export default function DateDisplay(props) {
  const handleDate = useCallback((date) => {
    if (date) {
      let resultDate = date.split("-");
      resultDate = resultDate[1] + "•" + resultDate[2] + "•" + resultDate[0];
      return resultDate;
    }
  }, []);

  return (
    <>
      {props.start === props.end ? (
        handleDate(props.start)
      ) : (
        <span>
          {handleDate(props.start)} —— {handleDate(props.end)}
        </span>
      )}
    </>
  );
}
