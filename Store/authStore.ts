import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";

const Base_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

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

      // ✅ Signup (Store pending email for OTP stage & throw on failure)
      signup: async (data: any) => {
        set({ isSigningUp: true });
        try {
          const res = await axios.post(`${Base_URL}/api/users/register`, data, {
            withCredentials: true,
            headers: jsonHeaders,
          });

          console.log("Signup response:", res.data);
          
          // Store pending email from response or payload
          const email = res.data?.email || data.email;
          set({ pendingEmail: email });

          toast.success(res.data?.message || "OTP sent successfully to your email!");
          return res.data;
        } catch (error: any) {
          console.error("Signup error response:", error.response?.data || error.message);
          toast.error(error.response?.data?.message || "Signup failed");
          throw error; // Re-throw so page.tsx catches it and prevents navigation
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
          const res = await axios.post(
            `${Base_URL}/api/users/verify-otp`,
            { email, otp },
            {
              withCredentials: true,
              headers: jsonHeaders,
            }
          );

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
          const res = await axios.post(
            `${Base_URL}/api/users/login`,
            formData,
            {
              withCredentials: true,
              headers: jsonHeaders,
            }
          );
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
          const res = await axios.get(`${Base_URL}/api/users/logout`, {
            withCredentials: true
          });
          console.log("api Called response", res.data);
          
          // Immediately clear user state and set logout timestamp
          set({ authUser: null, lastLogout: Date.now() });
          
          // Aggressively clear all storage
          localStorage.removeItem('auth-storage');
          localStorage.clear(); // Clear all localStorage
          sessionStorage.clear(); // Clear all sessionStorage
          
          // Redirect to home page
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          
          toast.success("Logged out successfully");
          return true;
        } catch (error) {
          // Even if logout API fails, clear local state aggressively
          set({ authUser: null, lastLogout: Date.now() });
          
          // Clear all storage even on error
          localStorage.removeItem('auth-storage');
          localStorage.clear();
          sessionStorage.clear();
          
          if (axios.isAxiosError(error)) {
            console.error("Logout error:", error);
            toast.error("Logout failed");
          } else {
            toast.error("Logout failed");
          }
          
          // Redirect to home page even on error
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          
          return false;
        }
      },

      // ✅ Check auth on page load
      checkAuth: async () => {
        // Check if we just logged out (from URL parameter)
        if (typeof window !== 'undefined' && window.location.search.includes('logout=')) {
          console.log('Detected logout parameter, skipping auth check');
          set({ authUser: null, isCheckingAuth: false });
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        set({ isCheckingAuth: true });
        try {
          const res = await axios.get(`${Base_URL}/api/users/me`, {
            withCredentials: true,
            // Remove cache control headers that cause CORS issues
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log("Auth check successful:", res.data.user.name);
          set({ authUser: res.data.user });
        } catch (error) {
          console.log("Auth check failed, clearing state");
          set({ authUser: null });
          // Clear any stale localStorage data
          localStorage.removeItem('auth-storage');
        } finally {
          set({ isCheckingAuth: false });
        }
      },

    // ✅ Update user profile
updateUser: async (formData: FormData) => {
  set({ isUpdatingProfile: true });
  try {
    const res = await axios.patch(`${Base_URL}/api/users/profile`, formData, {
      withCredentials: true,
      // Removed manual Content-Type header so the browser sets the boundary correctly
    });
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
          const res = await axios.patch(`${Base_URL}/api/users/change-password`, data, {
            withCredentials: true,
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
          const res = await axios.post(`${Base_URL}/api/users/forgot-password`, { email }, {
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
          const res = await axios.post(`${Base_URL}/api/users/reset-password`, data, {
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
      name: "auth-storage", // persisted in localStorage
      partialize: (state: any) => ({ 
        authUser: state.authUser,
        lastLogout: state.lastLogout 
      }), // persist authUser and logout timestamp
      onRehydrateStorage: () => (state: any) => {
        // Check if we recently logged out
        if (state?.lastLogout) {
          const timeSinceLogout = Date.now() - state.lastLogout;
          // If logged out less than 5 seconds ago, don't restore state
          if (timeSinceLogout < 5000) {
            console.log('Recent logout detected, not restoring auth state');
            state.authUser = null;
          }
        }
      }
    }
  )
);
