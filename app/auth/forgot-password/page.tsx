'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Mail } from 'lucide-react';
import LogoImage from '@/images/logo-image.png';
import AuthDesign3 from '@/images/auth-design3.png';
import LockIcon from '@/images/lock-icon.svg';

// Form validation schema
const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

// Form initial values
const forgotPasswordInitialValues = {
  email: '',
};

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (
    values: typeof forgotPasswordInitialValues,
    { setSubmitting }: any
  ) => {
    setIsLoading(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Call forgot password API endpoint
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send reset email');
      }

      setSubmitSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center px-6 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-12 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-full max-w-md my-auto py-4">
          {/* Logo and Header - Centered */}
          <div className="mb-6 lg:mb-8 text-center">
            <div className="flex justify-center mb-4 lg:mb-6">
              <Image src={LogoImage} alt="Logo" width={120} priority />
            </div>
            <h1 className="text-2xl sm:text-[30px] lg:text-[30px] leading-[38px] font-bold text-gray-900 mb-2 lg:mb-3 whitespace-nowrap">
              Forgot Password
            </h1>
            <p className="text-gray-500 text-sm lg:text-base">
              Don&apos;t worry! We can restore it for you.
            </p>
          </div>

          {/* Forgot Password Form */}
          <Formik
            initialValues={forgotPasswordInitialValues}
            validationSchema={forgotPasswordValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, isValid, dirty }) => (
              <Form className="space-y-4 lg:space-y-6">
                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{submitError}</p>
                  </div>
                )}

                {submitSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">
                      Password reset link has been sent to your email!
                    </p>
                  </div>
                )}

                {/* Email Input Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Mail size={20} />
                    </div>
                    <Field
                      as="input"
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      aria-label="Email address"
                    />
                  </div>
                  <ErrorMessage name="email">
                    {(msg) => (
                      <p className="text-red-500 text-sm mt-1">{msg}</p>
                    )}
                  </ErrorMessage>
                </div>

                {/* Reset Password Button */}
                <button
                  type="submit"
                  disabled={isLoading || !isValid || !values.email}
                  className="w-full py-3 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition-colors mt-6 lg:mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'rgba(95, 0, 208, 1)',
                  }}
                  aria-label="Reset password"
                >
                  <span>{isLoading ? 'Sending...' : 'Reset Password'}</span>
                  <Image src={LockIcon} alt="Lock" width={18} height={22} />
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Right Side - 3D Design Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={AuthDesign3}
            alt="Forgot Password Design"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
