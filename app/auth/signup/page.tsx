"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Eye, EyeOff, Mail, User, Lock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import * as Yup from "yup";
import Logo from "@/images/logo-image.png";
import AuthDesign from "@/images/auth-design.png";
import GoogleIcon from "@/images/google-icon.svg";

// Form constants
const initialValues = {
  fullname: "",
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  fullname: Yup.string()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    return Math.min(strength, 3); // Return 0-3 for the 4 segments (3 filled, 1 grey)
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSubmit = async (values: {
    fullname: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError("");

    try {
      // TODO: API call to signup endpoint
      // const response = await apiClient.post("/auth/signup", values)
      console.log("Signup attempt:", values);
      setError("");
      // router.push("/auth/login") after success
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

  const getStrengthLabel = () => {
    const strength = passwordStrength;
    if (strength === 0) return "Weak";
    if (strength === 1) return "Fair";
    if (strength === 2) return "Good";
    return "Strong";
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center px-6 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-12 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-full max-w-md my-auto py-4">
          {/* Logo and Header - Centered */}
          <div className="mb-6 lg:mb-8 text-center">
            <div className="flex justify-center mb-4 lg:mb-6">
              <Image src={Logo} alt="KONFERA" width={120} priority />
            </div>
            <h1 className="text-2xl sm:text-[30px] lg:text-[30px] leading-[38px] font-bold text-gray-900 mb-2 lg:mb-3 whitespace-nowrap">
              Let&apos;s create your account
            </h1>
            <p className="text-gray-500 text-sm lg:text-base">
              Sign up for free and get started.
            </p>
          </div>

          {/* Signup Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, isValid }) => (
              <Form className="space-y-4 lg:space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Fullname Field */}
                <div>
                  <Label
                    htmlFor="fullname"
                    className="text-gray-700 font-medium text-sm mb-2 block"
                  >
                    Fullname
                  </Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="fullname"
                      name="fullname"
                      type="text"
                      placeholder="John Doe"
                      className="pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.fullname}
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <ErrorMessage
                    name="fullname"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        handlePasswordChange(e);
                      }}
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

                  {/* Password Strength Indicator */}
                  {values.password && (
                    <div className="mt-3">
                      <div className="flex gap-1 h-1.5">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-colors ${
                              i < passwordStrength
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-500 text-xs mt-1.5">
                        Password strength: {getStrengthLabel()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Sign Up Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !isValid}
                  className="w-full py-3 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition-colors mt-6 lg:mt-8"
                  style={{ backgroundColor: "rgba(95, 0, 208, 1)" }}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </Button>

                {/* Google Sign Up Button */}
                <Button
                  type="button"
                  className="w-full py-3 rounded-full bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                >
                  <Image src={GoogleIcon} alt="Google" width={20} height={20} />
                  Sign Up With Google
                </Button>

                {/* Login Link */}
                <p className="text-center text-gray-600 text-sm mt-4 lg:mt-6">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: "rgba(95, 0, 208, 1)" }}
                  >
                    Sign In
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Right Side - Image Section */}
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
    </div>
  );
}
