import AuthInput from "../components/AuthInput";

function ForgotPassword() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[350px]">
        <h1 className="text-center text-xl mb-6">
          Forgot Password
        </h1>

        <div className="space-y-4">
          <AuthInput
            type="password"
            placeholder="new password"
          />

          <AuthInput
            type="password"
            placeholder="reenter new password"
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="
              bg-gray-300
              px-8
              py-2
              rounded-full
              hover:bg-gray-400
            "
          >
            submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;