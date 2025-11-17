import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { SignupData } from "../../interfaces/auth";
import {
  signupFailure,
  signupStart,
  signupSuccess,
} from "../../store/slices/authSlice";
import { signupUser } from "../../api/auth";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, signupLoading } = useSelector((state: RootState) => state.auth);
  console.log(user, "user");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupData>();

  const onSubmit = async (data: SignupData) => {
    try {
      dispatch(signupStart());
      const response = await signupUser(data);

      dispatch(signupSuccess(response));
      toast.success("Sign-up successful! Please Sign in");
      reset();
      navigate("/signin");
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;

      toast.error(error?.response?.data?.error || "Oops an error occurred");
      dispatch(signupFailure(error.message));
    }
  };

  const handleNavigate = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-rotate">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl p-5 md:p-8 w-full max-w-md text-center m-5"
      >
        {/* Header */}
        <div className="flex justify-center mb-2 mt-5">
          <div className="text-[#13243C] font-base font-bold">
            Start your Journey
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-2">
          Sign up to continue
        </h2>

        {/* Username */}
        <label className="block mb-5 font-semibold text-sm text-left">
          Username
          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: "Username is required" })}
            className="w-full px-4 py-2 mb-1 border border-gray-300 mt-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 placeholder-gray-300"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mb-3">
              {errors.username.message}
            </p>
          )}
        </label>

        {/* Email */}
        <label className="block mb-5 font-semibold text-sm text-left">
          Email
          <input
            type="email"
            placeholder="You@example.com"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 mb-1 border border-gray-300 mt-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 placeholder-gray-300"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>
          )}
        </label>

        {/* Password */}
        <label className="block mb-8 font-semibold text-sm text-left">
          Password
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-1 focus:ring-blue-900 placeholder-gray-300"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-5">
              {errors.password.message}
            </p>
          )}
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={signupLoading}
          className={`w-full cursor-pointer flex items-center justify-center gap-2 text-white py-2 rounded-lg transition-all ${
            signupLoading
              ? "bg-[#13243C] opacity-70 cursor-not-allowed"
              : "bg-[#13243C] hover:opacity-90"
          }`}
        >
          {signupLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Signing Up...
            </span>
          ) : (
            <>Sign Up</>
          )}
        </button>

        {/* Bottom */}
        <p className="mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <button
            className="text-[#13243C] cursor-pointer hover:underline"
            onClick={handleNavigate}
          >
            Sign in now
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
