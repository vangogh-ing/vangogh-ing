import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";

import Auth from "./Components/Auth";
import NewAccount from "./Components/NewAccount";
import Account from "./Components/Account";
import EditAccount from "./Components/EditAccount";

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
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route
            path="/welcome"
            element={<NewAccount key={session.user.id} session={session} />}
          />
          <Route
            path="/account"
            element={<Account key={session.user.id} session={session} />}
          />
          <Route
            path="/account/edit"
            element={<EditAccount key={session.user.id} session={session} />}
          />
        </Routes>
      )}
    </div>
  );
}
