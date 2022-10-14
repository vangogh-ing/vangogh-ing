import React, { useCallback } from "react";

export function DateDisplay(props) {
  const handleDate = useCallback((date) => {
    if (date) {
      let resultDate = date.split("-");
      resultDate = resultDate[1] + "•" + resultDate[2] + "•" + resultDate[0];
      return resultDate;
    }
  }, []);

  return (
    <div>
      {props.start === props.end ? (
        handleDate(props.start)
      ) : (
        <span>
          {handleDate(props.start)} — {handleDate(props.end)}
        </span>
      )}
    </div>
  );
}

export function TimeDisplay(props) {
  const handleTime = useCallback((startOrEndDate, startOrEndTime) => {
    const formattedDateTime = new Date(`${startOrEndDate}T${startOrEndTime}`);
    const options = {
      hour: "numeric",
      minute: "numeric",
    };
    const resultTime = new Intl.DateTimeFormat("en-US", options).format(
      formattedDateTime
    );
    return resultTime;
  }, []);

  return (
    <div>
      {props.startTime === props.endTime ? (
        handleTime(props.startDate, props.startTime)
      ) : (
        <span>
          {handleTime(props.startDate, props.startTime)} —{" "}
          {handleTime(props.endDate, props.endTime)}
        </span>
      )}
    </div>
  );
}
