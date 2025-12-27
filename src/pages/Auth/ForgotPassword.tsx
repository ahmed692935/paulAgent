import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { Link } from "react-router-dom";

import { sendResetLink } from "../../api/auth";

interface ForgotPasswordForm {
    email: string;
}

function ForgotPassword() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordForm>();

    const navigate = useNavigate();

    const onSubmit = async (data: ForgotPasswordForm) => {
        try {
            const response = await sendResetLink(data.email);
            toast.success(
                response?.message ||
                "A password reset link has been sent to your email!"
            );
            navigate("/signin");
        } catch (err: unknown) {
            const error = err as AxiosError<{ error: string }>;
            toast.error(error?.response?.data?.error || "Failed to send reset link");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-rotate">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-lg rounded-xl p-5 md:p-8 w-full max-w-md text-center m-5 md:p-0"
            >

                {/* Title */}
                <div className="text-2xl font-bold text-gray-800 mb-2">
                    Forget Password
                </div>

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

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#13243C] hover:opacity-90 text-white py-2 rounded-lg transition-all cursor-pointer mb-4"
                >
                    {isSubmitting ? "Sending..." : "Send Password"}
                </button>

                {/* Bottom text */}
                <Link to="/signin" className="text-sm text-gray-500 hover:underline">
                    Back to Sign In
                </Link>

            </form>
        </div >
    )
}

export default ForgotPassword;
