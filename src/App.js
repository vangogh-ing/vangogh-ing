import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";

import Auth from "./Components/Auth";

import SingleEvent from "./Components/SingleEvent";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div>
      {!session ? (
        <Routes>
          <Route path="/login" element={<Auth />} />

          <Route path="/events/:id" element={<SingleEvent />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Auth />} />

          <Route path="/events/:id" element={<SingleEvent />} />
        </Routes>
      )}
    </div>
  );
}
