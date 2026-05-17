import { Link } from "react-router-dom";
import AuthInput from "../components/AuthInput";

function Login() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[350px]">
        <h1 className="text-center text-3xl mb-8">
          Albion Online
        </h1>

        <div className="space-y-4">
          <AuthInput
            type="email"
            placeholder="email"
          />

          <AuthInput
            type="password"
            placeholder="password"
          />
        </div>

        <div className="text-center mt-4 text-sm">
          <Link
            to="/register"
            className="block hover:underline"
          >
            Register here
          </Link>

          <Link
            to="/forgot-password"
            className="block hover:underline"
          >
            forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;