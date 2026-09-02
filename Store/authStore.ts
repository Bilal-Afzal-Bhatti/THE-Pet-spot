import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/utils/api/axiosInstance"; // Centralized API instance
import toast from "react-hot-toast";

const jsonHeaders = { "Content-Type": "application/json" };

export const authStore = create(
  persist(
    (set, get: any) => ({
      isSigningUp: false,
      authUser: null,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      isForgotPassword: false,
      isResetPassword: false,
      isVerifyingOtp: false,
      pendingEmail: null,
      lastLogout: null,

      // ✅ Signup
      signup: async (data: any) => {
        set({ isSigningUp: true });
        try {
          const res = await api.post("/api/users/register", data, {
            headers: jsonHeaders,
          });

          console.log("Signup response:", res.data);
          const email = res.data?.email || data.email;
          set({ pendingEmail: email });

          toast.success(res.data?.message || "OTP sent successfully to your email!");
          return res.data;
        } catch (error: any) {
          console.error("Signup error response:", error.response?.data || error.message);
          toast.error(error.response?.data?.message || "Signup failed");
          throw error;
        } finally {
          set({ isSigningUp: false });
        }
      },

      // ✅ Verify OTP
      verifyOtp: async (otp: string) => {
        set({ isVerifyingOtp: true });
        const email = get().pendingEmail;

        if (!email) {
          toast.error("No pending verification email found. Please sign up again.");
          set({ isVerifyingOtp: false });
          return false;
        }

        try {
          const res = await api.post("/api/users/verify-otp", { email, otp }, {
            headers: jsonHeaders,
          });

          set({ authUser: res.data.user || res.data.data, pendingEmail: null });
          toast.success("Email verified successfully!");
          return true;
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Invalid or expired OTP");
          return false;
        } finally {
          set({ isVerifyingOtp: false });
        }
      },

      // ✅ Login
      login: async (formData: any) => {
        set({ isLoggingIn: true });
        try {
          const res = await api.post("/api/users/login", formData, {
            headers: jsonHeaders,
          });
          set({ authUser: res.data.user });
          toast.success(
            `Welcome back, ${res.data.user.name || res.data.user.userName}!`
          );
          return true;
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Login failed");
          return false;
        } finally {
          set({ isLoggingIn: false });
        }
      },

      // ✅ Logout
      logout: async () => {
        try {
          const res = await api.get("/api/users/logout");
          console.log("api Called response", res.data);
          
          set({ authUser: null, lastLogout: Date.now() });
          
          localStorage.removeItem('auth-storage');
          localStorage.clear();
          sessionStorage.clear();
          
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          
          toast.success("Logged out successfully");
          return true;
        } catch (error) {
          set({ authUser: null, lastLogout: Date.now() });
          
          localStorage.removeItem('auth-storage');
          localStorage.clear();
          sessionStorage.clear();
          
          toast.error("Logout failed");
          
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          
          return false;
        }
      },

      // ✅ Check auth on page load
      checkAuth: async () => {
        if (typeof window !== 'undefined' && window.location.search.includes('logout=')) {
          console.log('Detected logout parameter, skipping auth check');
          set({ authUser: null, isCheckingAuth: false });
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        set({ isCheckingAuth: true });
        try {
          const res = await api.get("/api/users/me", {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log("Auth check successful:", res.data.user.name);
          set({ authUser: res.data.user });
        } catch (error) {
          console.log("Auth check failed, clearing state");
          set({ authUser: null });
          localStorage.removeItem('auth-storage');
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      // ✅ Update user profile
      updateUser: async (formData: FormData) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await api.patch("/api/users/profile", formData);
          set({ authUser: res.data.user });
          toast.success(res.data.message || "Profile updated successfully");
          return true;
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Profile update failed");
          return false;
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      // ✅ Change password
      changePassword: async (data: { oldPassword: string; newPassword: string }) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await api.patch("/api/users/change-password", data, {
            headers: jsonHeaders,
          });
          toast.success(res.data.message || "Password changed successfully");
          return true;
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Password change failed");
          return false;
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      // ✅ Forgot password
      forgotPassword: async (email: string) => {
        set({ isForgotPassword: true });
        try {
          const res = await api.post("/api/users/forgot-password", { email }, {
            headers: jsonHeaders,
          });
          toast.success(res.data.message || "OTP sent to your email");
          return true;
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to send OTP");
          return false;
        } finally {
          set({ isForgotPassword: false });
        }
      },

      // ✅ Reset password
      resetPassword: async (data: { otp: string; newPassword: string }) => {
        set({ isResetPassword: true });
        try {
          const res = await api.post("/api/users/reset-password", data, {
            headers: jsonHeaders,
          });
          toast.success(res.data.message || "Password reset successful");
          return true;
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Password reset failed");
          return false;
        } finally {
          set({ isResetPassword: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state: any) => ({ 
        authUser: state.authUser,
        lastLogout: state.lastLogout 
      }),
      onRehydrateStorage: () => (state: any) => {
        if (state?.lastLogout) {
          const timeSinceLogout = Date.now() - state.lastLogout;
          if (timeSinceLogout < 5000) {
            console.log('Recent logout detected, not restoring auth state');
            state.authUser = null;
          }
        }
      }
    }
  )
);