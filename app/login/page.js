"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";

import GoogleButton from "../components/GoogleButton";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  console.log("prefersDark:", prefersDark);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const res = await fetch(`${apiGatewayUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(
          setCredentials({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })
        );
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex flex-row items-center justify-center h-[calc(100vh-100px)] bg-[#fdfdfd]">
      <div className="flex-1/2 w-full h-full px-20 py-10 hidden sm:hidden md:hidden lg:flex lg:items-center lg:justify-center">
        <div className="flex items-center justify-center h-full w-full bg-[#eeeeee]">
          Promotional content
        </div>
      </div>
      <div className="flex-1/2 w-full flex items-center justify-center">
        <div className="bg-[#eeeeee] p-8 rounded-lg max-w-md w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-[#121212]">App name</h1>
            <p className="text-[#5a5a5a]">
              Sign in to continue to your account.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-[#121212] text-sm">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full text-sm bg-[#fdfdfd] rounded-md border px-3 py-2 border-[#bababa] placeholder:text-sm text-[#121212] focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="text-[#121212] text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-10 w-full text-sm bg-[#fdfdfd] rounded-md border px-3 py-2 border-[#bababa] placeholder:text-sm text-[#121212] focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-custom-secondary-text"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <a
                href="/forgot-password"
                className="text-sm text-custom-brand hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="my-6">
              <div className="flex justify-center text-[#eb5757] text-sm">
                {error && error}
              </div>
              <button
                className={`w-full py-2 rounded-md text-sm bg-[#E90E0E] hover:bg-[#E90E0E]/70 text-white cursor-pointer`}
                type="submit"
              >
                Log in
              </button>
            </div>
          </form>

          <div className="flex items-center my-6 w-full">
            <div className="flex-1 h-0.5 w-full bg-[#E0E0E0]" />
            <span className="px-4 text-sm text-[#5A5A5A] whitespace-nowrap">
              or continue with
            </span>
            <div className="flex-1 h-0.5 w-full bg-[#E0E0E0]" />
          </div>

          <GoogleButton />

          <div className="mt-8">
            <p className="text-[#121212] text-sm mb-3">
              Don&apos;t have an account <span className="font-medium">?</span>
            </p>
            <button
              variant="outline"
              className="w-full py-2 rounded-md text-sm bg-[#bababa] text-[#fafafa] hover:bg-[#fdfdfd] hover:text-[#5a5a5a] cursor-pointer border border-[#bababa]"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
