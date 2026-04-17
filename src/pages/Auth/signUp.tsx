import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
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
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus } from "lucide-react";

const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { signupLoading } = useSelector((state: RootState) => state.auth);

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
      toast.success("Account created successfully!");
      reset();
      navigate("/signin");
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error?.response?.data?.error || "Registration failed");
      dispatch(signupFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen w-full bg-dark-bg relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-secondary/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-primary/10 blur-[120px] animate-pulse-slow" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand Section */}
        <div className="text-center mb-10">
          <Link to="/" className="text-4xl font-black tracking-tighter text-white inline-block mb-4">
            Paul<span className="text-brand-primary">.ai</span>
          </Link>
          <p className="text-gray-400 font-medium text-sm tracking-widest uppercase">Start Your Intelligence Journey</p>
        </div>

        {/* Form Card */}
        <div className="glass p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Create Account</h2>
            <p className="text-gray-500 text-sm font-medium">Join the next generation of AI communication.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Full Identity</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("username", { required: "Username is required" })}
                  className="w-full pl-14 pr-6 py-4 glass !bg-white/5 rounded-2xl text-white placeholder-gray-600 border-white/5 focus:border-brand-primary/30 outline-none transition-all font-medium text-sm"
                />
              </div>
              {errors.username && <p className="text-brand-accent text-[10px] font-bold uppercase ml-4 mt-1 tracking-wider">{errors.username.message}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Work Email</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  {...register("email", { required: "Email is required" })}
                  className="w-full pl-14 pr-6 py-4 glass !bg-white/5 rounded-2xl text-white placeholder-gray-600 border-white/5 focus:border-brand-primary/30 outline-none transition-all font-medium text-sm"
                />
              </div>
              {errors.email && <p className="text-brand-accent text-[10px] font-bold uppercase ml-4 mt-1 tracking-wider">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Secure Passkey</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                  className="w-full pl-14 pr-6 py-4 glass !bg-white/5 rounded-2xl text-white placeholder-gray-600 border-white/5 focus:border-brand-primary/30 outline-none transition-all font-medium text-sm"
                />
              </div>
              {errors.password && <p className="text-brand-accent text-[10px] font-bold uppercase ml-4 mt-1 tracking-wider">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={signupLoading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-brand-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(14,165,233,0.2)] disabled:opacity-50 mt-4"
            >
              {signupLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Organization
                  <UserPlus size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-xs font-medium">
              Already integrated?{" "}
              <Link to="/signin" className="text-brand-primary font-bold hover:underline">Access Workspace</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
