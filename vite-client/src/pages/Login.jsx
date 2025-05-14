import { Link, Navigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import Warning from "../components/Warning";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  const location = useLocation();
  const message = location.state?.message;

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const response = await axios.post("/user/login", { username, password });
      setUser(response.data);
      alert("Login succesful!");
      setRedirect(true);
    } catch (e) {
      alert("Login failed.");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-64">
          <h1 className="text-4xl text-center mb-4">Login</h1>

          <form className="w-full" onSubmit={handleLoginSubmit}>
            <input
              type="text"
              placeholder="John Doe"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <button className="primary">Login</button>
            <div className="text-center py-2 text-gray-500">
              Don't have an account yet?{" "}
              <Link className="underline text-black" to={"/register"}>
                Register now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
