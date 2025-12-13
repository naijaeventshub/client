"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/images/logo-image.png";
import AuthDesign from "@/images/auth-design2.png";
import GoogleIcon from "@/images/google-icon.svg";

// Form constants
const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSubmit = async (values: typeof initialValues) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.error ?? "Invalid email or password. Please try again."
        );
        setIsLoading(false);
      } else if (result?.ok) {
        if (callbackUrl) {
          router.push(callbackUrl);
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={AuthDesign}
            alt="3D Design"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center px-6 sm:px-8 lg:px-12 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Header - Centered */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-6">
              <Image src={Logo} alt="KONFERA" width={120} priority />
            </div>
            <h1 className="text-2xl sm:text-[30px] lg:text-[30px] leading-[38px] font-bold text-gray-900 mb-3 whitespace-nowrap">
              Welcome back
            </h1>
            <p className="text-gray-500 text-base">
              Let's sign in to your account and get started.
            </p>
          </div>

          {/* Sign In Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, isValid }) => (
              <Form className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Email Field */}
                <div>
                  <Label
                    htmlFor="email"
                    className="text-gray-700 font-medium text-sm mb-2 block"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@event.com"
                      className="pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium text-sm mb-2 block"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-12 pr-12 py-3 rounded-full border border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Remember & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-purple-600"
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-gray-600 text-sm cursor-pointer"
                    >
                      Remember For 30 Days
                    </label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-semibold hover:opacity-80 transition-opacity flex items-center gap-1"
                    style={{ color: "rgba(95, 0, 208, 1)" }}
                  >
                    Forgot Password
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !isValid}
                  className="w-full py-3 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition-colors mt-8"
                  style={{ backgroundColor: "rgba(95, 0, 208, 1)" }}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </Button>

                {/* Google Sign In Button */}
                <Button
                  type="button"
                  className="w-full py-3 rounded-full bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                >
                  <Image src={GoogleIcon} alt="Google" width={20} height={20} />
                  Sign In With Google
                </Button>

                {/* Sign Up Link */}
                <p className="text-center text-gray-600 text-sm mt-6">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: "rgba(95, 0, 208, 1)" }}
                  >
                    Sign Up
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
