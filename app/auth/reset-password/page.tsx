'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import BackgroundImage from '@/images/auth-design4.png';
import LogoImage from '@/images/logo-image.png';
import LockIcon from '@/images/lock-icon.svg';

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 23;

export default function ResetPasswordOTPPage() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    // Auto-focus to next input
    if (numericValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const otpCode = otp.join('');
  const isOtpComplete = otpCode.length === OTP_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    if (!isOtpComplete) {
      setError('Please enter all 6 digits');
      setIsLoading(false);
      return;
    }

    try {
      // Call OTP verification API
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: otpCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid OTP code');
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/auth/reset-password-form';
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to verify OTP. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setError('');
    setCountdown(RESEND_COUNTDOWN);
    setCanResend(false);

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to resend OTP');
      }

      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Overlay - Hidden on Mobile */}
      <div className="absolute inset-0 z-0 hidden sm:block">
        <Image
          src={BackgroundImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      {/* Dark Overlay Only on Mobile */}
      <div className="absolute inset-0 z-0 sm:hidden bg-black/40"></div>

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-xl mx-4 bg-white rounded-3xl shadow-2xl p-6">
        {/* Logo */}
        <div className="mb-8">
          <Image src={LogoImage} alt="Logo" width={120} priority />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 mb-2">
          Reset Your Password.
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-sm mb-8">
          Enter your 6‑digit OTP code in order to reset.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">
              OTP verified successfully! Redirecting...
            </p>
          </div>
        )}

        {/* OTP Input Section */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-1 sm:gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-gray-100 rounded-2xl text-center text-lg font-bold text-gray-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                placeholder="0"
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={isLoading || !isOtpComplete}
            className="w-full py-3 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'rgba(95, 0, 208, 1)',
            }}
            aria-label="Reset password"
          >
            <span>{isLoading ? 'Verifying...' : 'Reset Password'}</span>
            <Image src={LockIcon} alt="Lock" width={18} height={22} />
          </button>
        </form>

        {/* Footer Text with Resend Link */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || isLoading}
              className="text-purple-600 hover:text-purple-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color: canResend
                  ? 'rgba(95, 0, 208, 1)'
                  : 'rgba(95, 0, 208, 0.5)',
              }}
              aria-label="Resend OTP code"
            >
              Re‑send OTP Code in {countdown}s
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
