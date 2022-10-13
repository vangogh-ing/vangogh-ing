import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import UpdateEvent from "../../innerComponents/updateEvent";

export default function SaveEvent(props) {
  return <button onClick={props.handleSaveEvent}>Save Event</button>;
}
