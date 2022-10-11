import { useState } from "react";

import { supabase } from "../../supabaseClient";

export default function AuthSignIn() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (email, password) => {
    try {
      setLoading(true);

      const { data } = await supabase.from("User").select().eq("email", email);

      if (data.length === 0) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Signed up");
        //LOCAL WORKAROUND - FIX FOR PRODUCTION
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
          <h1>Make a new account</h1>
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
      <button onClick={() => handleSignup(email, password)}>sign up</button>
    </div>
  );
}
