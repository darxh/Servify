import RegisterForm from "../../features/auth/components/RegisterForm";

const RegisterPage = () => {
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
            Servify
        </h2>
        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join as a User or Service Provider
        </p>
      </div>

      <RegisterForm />
    </>
  );
};

export default RegisterPage;