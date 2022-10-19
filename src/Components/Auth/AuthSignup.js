import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import LinearProgress from "@mui/material/LinearProgress";

export default function AuthSignIn() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (email, password) => {
    try {
      setLoading(true);

      const { data } = await supabase.from("User").select().eq("email", email);

      if (data.length === 0) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        navigate("/welcome");
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
        <LinearProgress
          sx={{
            height: 10,
            marginTop: "2rem",
          }}
          color="success"
        />
      ) : (
        <div className="auth_container">
          <div className="auth">
            <h1>
              <img src="/wheat.png" alt="" className="auth_icon" />
              &nbsp; Make a new account &nbsp;
              <img src="/wheat.png" alt="" className="auth_icon" />
            </h1>
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
            <button onClick={() => handleSignup(email, password)}>
              sign up
            </button>
            <div className="auth_redirect">
              <p>Already have an account?</p>
              <Link to="/login">Log in here</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
