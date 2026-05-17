import AuthInput from "../components/AuthInput";

function Register() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[400px]">
        <h1 className="text-2xl mb-6">
          Register Here
        </h1>

        <div className="space-y-4">
          <AuthInput
            type="text"
            placeholder="username"
          />

          <AuthInput
            type="email"
            placeholder="email"
          />

          <AuthInput
            type="password"
            placeholder="Password"
          />

          <AuthInput
            type="password"
            placeholder="Reenter Password"
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="
              bg-gray-300
              px-6
              py-2
              rounded-full
              hover:bg-gray-400
            "
          >
            sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;