import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Navbar({ session }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    //LOCAL WORKAROUND - FIX FOR PRODUCTION
    window.location.href = "http://localhost:3000/login";
  };

  return (
    <div>
      {!session ? (
        <div>
          <Link to="/login">login</Link>
        </div>
      ) : (
        <div>
          <Link to="/account">my account</Link>
          <Link to="/foryou"> | for you </Link>
          <Link to="/savedevents"> | saved events </Link>
          <Link to="/plan"> | plan </Link>
          <button
            type="button"
            className="button block"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
