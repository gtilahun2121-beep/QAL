'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

interface RegistrationFormProps {
  onSuccess: () => void;
  onError?: (message: string) => void;
}

export default function RegistrationForm({ onSuccess, onError }: RegistrationFormProps) {
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    fayda: '',
    password: '',
    confirmPassword: '',
    pin: '',
    otp: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (formData.firstName.length < 2) newErrors.firstName = 'First name must be at least 2 characters';
    if (formData.lastName.length < 2) newErrors.lastName = 'Last name must be at least 2 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    // Phone: +2519 + 8 digits = 10 digits after +251
    const phoneRegex = /^\+2519\d{8}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone must be +2519 followed by 8 digits';
    }

    // Email: @gmail.com only
    if (!formData.email.endsWith('@gmail.com')) {
      newErrors.email = 'Email must end with @gmail.com';
    }
    if (!formData.email.match(/^[^\s@]+@gmail\.com$/)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    // Fayda: exactly 16 digits
    if (!/^\d{16}$/.test(formData.fayda)) {
      newErrors.fayda = 'Fayda number must be exactly 16 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!/^\d{4,}$/.test(formData.pin)) {
      newErrors.pin = 'PIN must be at least 4 digits';
    }
    if (!/^\d{5}$/.test(formData.otp)) {
      newErrors.otp = 'OTP must be exactly 5 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    else if (step === 2) isValid = validateStep2();
    else if (step === 3) isValid = validateStep3();
    else if (step === 4) isValid = validateStep4();

    if (isValid) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        profession: '',
        fayda: formData.fayda,
        guarantor: '',
      });
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setErrors({ submit: message });
      onError?.(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  s <= step
                    ? 'bg-[#0d7e4d] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`h-1 flex-grow mx-2 transition-all ${
                    s < step ? 'bg-[#0d7e4d]' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm font-semibold text-gray-600">
          Step {step} of 4
        </p>
      </div>

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div>
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                  errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-[#0d7e4d]'
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                  errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-[#0d7e4d]'
                }`}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Contact Information */}
      {step === 2 && (
        <div>
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+2519xxxxxxxx"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-200 focus:border-[#0d7e4d]'
                }`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@gmail.com"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#0d7e4d]'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Identity Verification (Fayda) */}
      {step === 3 && (
        <div>
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Identity Verification (Fayda)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fayda Number</label>
              <input
                type="text"
                name="fayda"
                value={formData.fayda}
                onChange={handleChange}
                placeholder="Enter 16-digit Fayda number"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                  errors.fayda ? 'border-red-500' : 'border-gray-200 focus:border-[#0d7e4d]'
                }`}
              />
              {errors.fayda && <p className="text-red-500 text-sm mt-1">{errors.fayda}</p>}
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700 font-semibold">✅ Identity Confirmed</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Security (Password, PIN, OTP) */}
      {step === 4 && (
        <div>
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Security</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Create Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#0d7e4d]'
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-[#0d7e4d]'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Create PIN</label>
              <input
                type="text"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                placeholder="At least 4 digits"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                  errors.pin ? 'border-red-500' : 'border-gray-200 focus:border-[#0d7e4d]'
                }`}
              />
              {errors.pin && <p className="text-red-500 text-sm mt-1">{errors.pin}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">OTP Verification</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 5-digit OTP"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                  errors.otp ? 'border-red-500' : 'border-gray-200 focus:border-[#0d7e4d]'
                }`}
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {errors.submit && (
        <div className="mt-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
          <p className="text-red-700 font-semibold">{errors.submit}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
          >
            ← Back
          </button>
        )}
        <button
          onClick={handleNextStep}
          disabled={submitting}
          className="flex-1 px-6 py-3 bg-[#0d7e4d] text-white font-bold rounded-lg hover:bg-[#0a5c38] transition-all disabled:opacity-50"
        >
          {submitting ? '⏳ Processing...' : step === 4 ? '🎉 Create Account' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
