// import { FiDownload } from "react-icons/fi";
// import Logo from "../../../public/images/sumaLogo.png";
import { useForm, type SubmitHandler } from "react-hook-form";
// import { TiArrowRight } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess } from "../../store/slices/authSlice";
import { loginUser } from "../../api/auth";
import type { SignInData } from "../../interfaces/auth";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInData>();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loginLoading } = useSelector((state: RootState) => state.auth);

  const onSubmit: SubmitHandler<SignInData> = async (data: SignInData) => {
    console.log(data, "Data");
    try {
      dispatch(loginStart());
      const response = await loginUser(data);
      console.log(response, "LOGIN RESPONSE");

      // ✅ Extract token + user from API response
      const token = response.access_token;
      const user = { ...response.user, access_token: token };

      dispatch(loginSuccess({ user, token }));

      toast.success("Sign-in successful!");
      navigate("/dashboard");
      reset();
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error?.response?.data?.error || "Oops an error occurred");
      console.error(err);
    } finally {
      dispatch({ type: "auth/loginFailure", payload: null });
    }
  };

  const handleNavigate = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl p-5 md:p-8 w-full max-w-md text-center m-5 md:p-0"
      >
        {/* Rotated Download Icon */}
        <div className="flex justify-center mb-2 mt-5">
          {/* <div className="bg-gradient-to-l from-[#05A3A9] to-[#6BEE2E] p-2 rounded-lg shadow-lg"> */}
          {/* <div>
            <img src={Logo} width={150}></img>
          </div> */}
          {/* <div className="bg-gradient-to-r from-[#6d0f78] to-[#0a0f2d] p-2 rounded-lg shadow-lg">
            <FiDownload className="text-white text-4xl rotate-270" />
          </div> */}
          <div className="text-[#3F3EED] font-bold">Welcome Back</div>
        </div>

        {/* Title */}
        <div className="text-2xl font-bold text-gray-800 mb-2">
          Login to continue
        </div>
        {/* <p className="text-gray-500 text-base mb-6 leading-tight">
          Welcome back! Please sign in to your account
        </p> */}

        {/* Email */}
        <label className=" block mb-5 font-semibold text-sm text-left">
          {" "}
          Email
          <input
            type="email"
            placeholder="You@example.com"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 mb-1 border border-gray-300 mt-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3F3EED] placeholder-gray-300"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>
          )}
        </label>

        {/* Password */}
        <label className=" block mb-8 font-semibold text-sm text-left">
          {" "}
          Password
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-1 focus:ring-[#3F3EED] placeholder-gray-300"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-5">
              {errors.password.message}
            </p>
          )}
        </label>

        {/* Sign In Button */}
        {/* <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6d0f78] to-[#0a0f2d] text-white py-2 rounded-lg transition-all cursor-pointer"
        >
          Sign In
          <TiArrowRight size={24} className="mt-1" />
        </button> */}
        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loginLoading}
          // className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6d0f78] to-[#0a0f2d] text-white py-2 rounded-lg transition-all cursor-pointer ${
          className={`w-full flex items-center justify-center gap-2 bg-[#3F3EED] text-white py-2 rounded-lg transition-all cursor-pointer ${loginLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
          {loginLoading ? (
            <>
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
              <span>Signing In...</span>
            </>
          ) : (
            <>
              Sign In
              {/* <TiArrowRight size={24} className="mt-1" /> */}
            </>
          )}
        </button>

        {/* Bottom text */}
        <p className="mt-4 text-sm text-gray-500">
          Don’t have an account?{" "}
          <button
            // className="text-green-600 cursor-pointer hover:underline"
            className="text-[#3F3EED] cursor-pointer hover:underline"
            onClick={handleNavigate}
          >
            Sign up now
          </button>
        </p>
        {/* {loading && <p className="text-red-500 mt-5">Signing In...</p>} */}
        {/* {error && <p className="text-red-500">{error}</p>} */}
      </form>
    </div>
  );
};

export default SignIn;







// MY CODE

// // import { FiDownload } from "react-icons/fi";
// // import Logo from "../../../public/images/sumaLogo.png";
// import { useForm, type SubmitHandler } from "react-hook-form";
// // import { TiArrowRight } from "react-icons/ti";
// import { useNavigate } from "react-router-dom";
// import type { AppDispatch, RootState } from "../../store/store";
// import { useDispatch, useSelector } from "react-redux";
// import { loginStart, loginSuccess } from "../../store/slices/authSlice";
// // import { loginUser } from "../../api/auth"; // COMMENTED OUT: API function not needed for bypass
// import type { SignInData } from "../../interfaces/auth";
// import toast from "react-hot-toast";
// // import type { AxiosError } from "axios"; // COMMENTED OUT: Error type not needed for bypass

// const SignIn: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<SignInData>();

//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const { loginLoading } = useSelector((state: RootState) => state.auth);

//   const onSubmit: SubmitHandler<SignInData> = async (data: SignInData) => {
//     console.log(data, "Data");

//     // --- START OF AUTHENTICATION BYPASS LOGIC ---

//     dispatch(loginStart()); // Sets loading state

//     // 1. Define Fake/Dummy User Data and Token
//     const FAKE_TOKEN = "DEBUG_TOKEN_987654321";
//     const FAKE_USER_DATA = {
//       id: 1,
//       email: data.email, // Use the email entered in the form
//       name: "Bypass User",
//       role: "admin",
//       // ... add any other required user properties
//     };

//     // 2. Simulate a slight delay to mimic network latency (optional)
//     await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay

//     // 3. Dispatch Success Action with Fake Data
//     const user = { ...FAKE_USER_DATA, access_token: FAKE_TOKEN };
//     dispatch(loginSuccess({ user, token: FAKE_TOKEN }));

//     toast.success("Bypass Successful: Navigating to Dashboard!");
//     navigate("/dashboard");
//     reset();

//     // Note: The 'finally' block with loginFailure is unnecessary here
//     // but keeping it commented out for reference.

//     // --- END OF AUTHENTICATION BYPASS LOGIC ---

//     /*
//     // --- ORIGINAL API CALL LOGIC (Commented Out) ---
//     try {
//       dispatch(loginStart());
//       const response = await loginUser(data);
//       console.log(response, "LOGIN RESPONSE");

//       // ✅ Extract token + user from API response
//       const token = response.access_token;
//       const user = { ...response.user, access_token: token };

//       dispatch(loginSuccess({ user, token }));

//       toast.success("Sign-in successful!");
//       navigate("/dashboard");
//       reset();
//     } catch (err: unknown) {
//       const error = err as AxiosError<{ error: string }>;
//       toast.error(error?.response?.data?.error || "Oops an error occurred");
//       console.error(err);
//     } finally {
//       dispatch({ type: "auth/loginFailure", payload: null });
//     }
//     */
//   };

//   const handleNavigate = () => {
//     navigate("/signup");
//   };

//   // ... (rest of the component's JSX remains the same)

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="bg-white shadow-lg rounded-xl p-5 md:p-8 w-full max-w-md text-center m-5 md:p-0"
//       >
//         {/* Rotated Download Icon */}
//         <div className="flex justify-center mb-2 mt-5">
//           {/* <div className="bg-gradient-to-l from-[#05A3A9] to-[#6BEE2E] p-2 rounded-lg shadow-lg"> */}
//           {/* <div>
//             <img src={Logo} width={150}></img>
//           </div> */}
//           {/* <div className="bg-gradient-to-r from-[#6d0f78] to-[#0a0f2d] p-2 rounded-lg shadow-lg">
//             <FiDownload className="text-white text-4xl rotate-270" />
//           </div> */}
//           <div className="text-[#3F3EED] font-bold">Welcome Back</div>
//         </div>

//         {/* Title */}
//         <div className="text-2xl font-bold text-gray-800 mb-2">
//           Login to continue
//         </div>
//         {/* <p className="text-gray-500 text-base mb-6 leading-tight">
//           Welcome back! Please sign in to your account
//         </p> */}

//         {/* Email */}
//         <label className=" block mb-5 font-semibold text-sm text-left">
//           {" "}
//           Email
//           <input
//             type="email"
//             placeholder="You@example.com"
//             {...register("email", { required: "Email is required" })}
//             className="w-full px-4 py-2 mb-1 border border-gray-300 mt-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3F3EED] placeholder-gray-300"
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>
//           )}
//         </label>

//         {/* Password */}
//         <label className=" block mb-8 font-semibold text-sm text-left">
//           {" "}
//           Password
//           <input
//             type="password"
//             placeholder="Password"
//             {...register("password", { required: "Password is required" })}
//             className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-1 focus:ring-[#3F3EED] placeholder-gray-300"
//           />
//           {errors.password && (
//             <p className="text-red-500 text-sm mb-5">
//               {errors.password.message}
//             </p>
//           )}
//         </label>

//         {/* Sign In Button */}
//         {/* <button
//           type="submit"
//           className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6d0f78] to-[#0a0f2d] text-white py-2 rounded-lg transition-all cursor-pointer"
//         >
//           Sign In
//           <TiArrowRight size={24} className="mt-1" />
//         </button> */}
//         {/* Sign In Button */}
//         <button
//           type="submit"
//           disabled={loginLoading}
//           // className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6d0f78] to-[#0a0f2d] text-white py-2 rounded-lg transition-all cursor-pointer ${
//           className={`w-full flex items-center justify-center gap-2 bg-[#3F3EED] text-white py-2 rounded-lg transition-all cursor-pointer ${loginLoading ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//         >
//           {loginLoading ? (
//             <>
//               <svg
//                 className="animate-spin h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                 ></path>
//               </svg>
//               <span>Signing In...</span>
//             </>
//           ) : (
//             <>
//               Sign In
//               {/* <TiArrowRight size={24} className="mt-1" /> */}
//             </>
//           )}
//         </button>

//         {/* Bottom text */}
//         <p className="mt-4 text-sm text-gray-500">
//           Don’t have an account?{" "}
//           <button
//             // className="text-green-600 cursor-pointer hover:underline"
//             className="text-[#3F3EED] cursor-pointer hover:underline"
//             onClick={handleNavigate}
//           >
//             Sign up now
//           </button>
//         </p>
//         {/* {loading && <p className="text-red-500 mt-5">Signing In...</p>} */}
//         {/* {error && <p className="text-red-500">{error}</p>} */}
//       </form>
//     </div>
//   );
// };

// export default SignIn;