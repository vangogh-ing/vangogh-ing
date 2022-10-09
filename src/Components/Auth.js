import { useState } from "react";

import { supabase } from "../supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      if (localStorage.length === 0) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        alert("Logged in");
        window.location.href = "http://localhost:3000/account";
      } else {
        alert("You're already logged in");
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (email, password) => {
    try {
      setLoading(true);

      const { data } = await supabase.from("User").select().eq("email", email);

      if (data.length === 0) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Signed up");
        window.location.href = "http://localhost:3000/welcome";
      } else {
        alert("Email already in use");
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        "Loading..."
      ) : (
        <div>
          <input
            id="email"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}
      <button onClick={() => handleLogin(email, password)}>login</button>
      <button onClick={() => handleSignup(email, password)}>signup</button>
    </div>
  );
}
