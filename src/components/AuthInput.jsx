function AuthInput({ type, placeholder }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="
        w-full
        bg-gray-300
        p-2
        rounded
        outline-none
      "
    />
  );
}

export default AuthInput;