import LoginForm from "../../features/auth/components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
            Servify
        </h2>
        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <LoginForm />
    </>
  );
};

export default LoginPage;