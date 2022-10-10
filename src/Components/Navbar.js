import { Link } from "react-router-dom";

export default function Navbar({ session }) {
  return (
    <div>
      {!session ? (
        <div>
          <Link to="/login">login</Link>
        </div>
      ) : (
        <div>
          <Link to="/account">my account</Link>
        </div>
      )}
    </div>
  );
}
