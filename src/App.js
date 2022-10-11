import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";

import AuthLogin from "./Components/AuthLogin";
import AuthSignup from "./Components/AuthSignup";
import NewAccount from "./Components/NewAccount";
import Account from "./Components/Account";
import EditAccount from "./Components/EditAccount";
import Navbar from "./Components/Navbar";
import SingleOrg from "./Components/SingleOrg/SingleOrg";
import SingleEvent from "./Components/SingleEvent";
import Discover from "./Components/Discover";
import FollowedPage from "./Components/FollowedOrgs/FollowedPage";

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
      <Navbar session={session || null} />
      {!session ? (
        <Routes>
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/signup" element={<AuthSignup />} />
          <Route path="/events/:id" element={<SingleEvent />} />
          <Route path="/orgs/:id" element={<SingleOrg />} />
          <Route path="/discover" element={<Discover />} />
        </Routes>
      ) : (
        <Routes>
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
          <Route path="/discover" element={<Discover />} />
          <Route path="/events/:id" element={<SingleEvent />} />
          <Route path="/orgs/:id" element={<SingleOrg />} />
          <Route
            path="/followedorgs"
            element={<FollowedPage session={session} />}
          />
        </Routes>
      )}
    </div>
  );
}
