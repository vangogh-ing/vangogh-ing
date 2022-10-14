import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function AuthLogin() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      if (localStorage.length === 0) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/discover");
      } else {
        alert("You're already logged in");
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
          <h1>Log in</h1>
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
      <div>
        <p>Don't have an account?</p>
        <Link to="/signup">Sign up here</Link>
      </div>
    </div>
  );
}
