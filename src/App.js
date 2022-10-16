import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import AuthLogin from "./Components/Auth/AuthLogin";
import AuthSignup from "./Components/Auth/AuthSignup";
import NewAccount from "./Components/Account/NewAccount";
import Account from "./Components/Account/Account";
import EditAccount from "./Components/Account/EditAccount";
import Navbar from "./Components/Navbar";
import SingleOrg from "./Components/SingleOrg/SingleOrg";
import SingleEvent from "./Components/SingleEvent/SingleEvent";
import Discover from "./Components/Discover";
import ForYouPage from "./Components/ForYou/ForYouPage";
import SavedEventPage from "./Components/SavedEvents/SavedEventPage";
import Calendar from "./Components/Calendar/Calendar";
import OrgActiveEvents from "./Components/OrgEvents/orgActiveEvents";
import OrgPastEvents from "./Components/OrgEvents/orgPastEvents";

// notes: material ui theme test:
const theme = createTheme({
  palette: {
    primary: {
      main: "#4C5E7D",
      contrastText: "#fff",
    },
    secondary: {
      main: "#BCA32D",
      contrastText: "#fff",
    },
    success: {
      main: "#495A20",
      contrastText: "#fff",
    },
    error: {
      main: "#B74815",
      contrastText: "#fff",
    },
  },
});

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
    <ThemeProvider theme={theme}>
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
            <Route
              path="/discover"
              element={<Discover key={session.user} session={session} />}
            />
            <Route path="/events/:id" element={<SingleEvent />} />
            <Route path="/orgs/:id" element={<SingleOrg />} />
            <Route path="/foryou" element={<ForYouPage session={session} />} />
            <Route
              path="/savedevents"
              element={<SavedEventPage session={session} />}
            />
            <Route
              path="/activeevents"
              element={
                <OrgActiveEvents key={session.user.id} session={session} />
              }
            />
            <Route
              path="/pastevents"
              element={
                <OrgPastEvents key={session.user.id} session={session} />
              }
            />
            <Route
              path="/plan"
              element={<Calendar key={session.user.id} session={session} />}
            />
          </Routes>
        )}
      </div>
    </ThemeProvider>
  );
}
