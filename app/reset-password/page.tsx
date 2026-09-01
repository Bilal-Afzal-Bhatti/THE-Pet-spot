"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/Store/authStore";
// Import FontAwesome for eye icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface AuthStore {
  resetPassword: (data: { otp: string; newPassword: string }) => Promise<boolean>;
  isResetPassword: boolean;
  authUser: any;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
}

export default function ResetPasswordPage() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [passwordReset, setPasswordReset] = useState(false);

  const router = useRouter();
  const store = authStore() as AuthStore;
  const { resetPassword, isResetPassword, authUser, isCheckingAuth, checkAuth } = store;

  // Check authentication on mount and handle redirects
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
    };
    verifyAuth();
  }, [checkAuth]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isCheckingAuth && authUser) {
      router.push('/dashboard');
    }
  }, [authUser, isCheckingAuth, router]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      newErrors.otp = "Please enter a valid 6-digit OTP";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const success = await resetPassword({
      otp: otp.trim(),
      newPassword
    });

    if (success) {
      setPasswordReset(true);
      // Redirect to login page after successful password reset
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    switch (field) {
      case 'otp':
        setOtp(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-5 pb-10" style={{background: 'var(--gradient-hero)'}}>
      <div className="w-full max-w-5xl bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)] grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-4xl">
        {/* Left Section */}
        <div className="relative flex flex-col justify-center items-center text-white px-10 py-16">
          <Image
            src="/signup-bg.webp"
            alt="bg"
            fill
            className="object-cover z-0"
          />
          <div className="absolute inset-0 bg-(--bg-dark-accent)/70 z-10" />
          <div className="relative z-20 text-center max-w-sm">
            <Image
              src="/petLogoAuth.png"
              alt="logo"
              width={180}
              height={180}
              className="mx-auto mb-6"
            />
            <h2 className="text-3xl font-semibold leading-snug mb-2 text-(--color-primary)">
              Reset Your Password
            </h2>
            <p className="text-lg leading-snug font-medium">
              Enter the OTP sent to your email <br /> and create a new password.
            </p>
          </div>
          {/* <Image
            src="/taddy.png"
            alt="pets"
            width={260}
            height={260}
            className="relative z-20 mt-8"
          /> */}
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-center px-20 py-14">
          <h2 className="text-2xl font-semibold text-center mb-2 text-(--color-primary)">
            Create New Password
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8">
            Check your email for the 6-digit OTP and enter it below along with your new password.
          </p>

          <hr className="mb-4 font-light text-gray-200" />

          {/* Form */}
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => handleInputChange('otp', e.target.value)}
                className={`w-full p-3 bg-[#F1F1F1] rounded-md text-sm focus:outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) text-center tracking-widest ${
                  errors.otp ? 'border-red-300' : ''
                }`}
                maxLength={6}
                required
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={`w-full p-3 bg-[#F1F1F1] rounded-md text-sm focus:outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) ${
                  errors.newPassword ? 'border-red-300' : ''
                }`}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                style={{ fontSize: 20 }}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full p-3 bg-[#F1F1F1] rounded-md text-sm focus:outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) ${
                  errors.confirmPassword ? 'border-red-300' : ''
                }`}
                required
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                style={{ fontSize: 20 }}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isResetPassword}
              className={`w-full py-2 rounded-md font-medium text-white transition ${
                isResetPassword
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-(--color-primary) hover:bg-(--color-primary-hover)"
              }`}
            >
              {isResetPassword ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Remember your password?
              <a
                href="/login"
                className="text-(--color-secondary) ml-1 font-medium hover:underline"
              >
                Back to Login
              </a>
            </p>
          </div>

          {/* Password Requirements */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• At least 6 characters long</li>
              <li>• Use a strong combination of letters, numbers, and symbols</li>
            </ul>
          </div>

          {passwordReset && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-green-800">
                  Password reset successful! Redirecting to login page...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}