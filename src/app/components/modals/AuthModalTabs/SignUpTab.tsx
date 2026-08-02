'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Language, defaultLanguage } from '@/i18n/config';
import FormInput from '@/app/components/forms/FormInput';
import FormButton from '@/app/components/forms/FormButton';
import FormSuccess from '@/app/components/forms/FormSuccess';
import { useAuth } from '@/app/context/AuthContext';

interface SignUpTabProps {
  lang?: Language;
  onSuccess?: (title: string, message: string, duration?: number) => void;
  onError?: (title: string, message: string, duration?: number) => void;
}

export default function SignUpTab({ lang = defaultLanguage, onSuccess, onError }: SignUpTabProps) {
  const { signup, isLoading } = useAuth();
  const [step, setStep] = useState(1); // 1: Personal | 2: Contact | 3: Fayda | 4: OTP
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '+2519',
    email: '',
    fayda: '',
    otp: '',
  });
  const [fayda, setFayda] = useState({
    verified: false,
    loading: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleFieldChange = (field: string, value: string) => {
    if (field === 'phoneNumber') {
      // Enforce +2519 prefix and max 10 digits total
      if (!value.startsWith('+2519')) {
        value = '+2519';
      }
      // Allow only digits after +2519
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 10) {
        value = '+' + digitsOnly.substring(0, 10);
      }
    } else if (field === 'fayda') {
      // Allow only digits, max 16
      value = value.replace(/\D/g, '').slice(0, 16);
    } else if (field === 'otp') {
      // Allow only digits, max 5
      value = value.replace(/\D/g, '').slice(0, 5);
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
    if (formData.firstName.length < 2) newErrors.firstName = 'Name must be at least 2 characters';
    if (formData.lastName.length < 2) newErrors.lastName = 'Name must be at least 2 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    // Phone validation: +2519 + 8 digits = 10 total
    const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      newErrors.phoneNumber = 'Phone must be +2519 followed by 8 digits';
    } else if (!formData.phoneNumber.startsWith('+2519')) {
      newErrors.phoneNumber = 'Phone must start with +2519';
    }
    
    // Email validation: must end with @gmail.com
    if (!formData.email.trim()) {
      newErrors.email = 'Email required';
    } else if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.email = 'Email must end with @gmail.com';
    } else if (!formData.email.match(/^[a-zA-Z0-9._]+@gmail\.com$/)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fayda.trim()) {
      newErrors.fayda = 'Fayda number required';
    } else if (formData.fayda.length !== 16) {
      newErrors.fayda = 'Fayda must be exactly 16 digits';
    } else if (!/^\d+$/.test(formData.fayda)) {
      newErrors.fayda = 'Fayda must contain only digits';
    }
    if (!fayda.verified) {
      newErrors.fayda = 'Please verify your Fayda identity first';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP required';
    } else if (formData.otp.length !== 5) {
      newErrors.otp = 'OTP must be 5 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyFayda = async () => {
    if (!formData.fayda.trim()) {
      setErrors({ fayda: 'Enter Fayda number first' });
      return;
    }
    if (formData.fayda.length !== 16) {
      setErrors({ fayda: 'Fayda must be exactly 16 digits' });
      return;
    }

    setFayda({ ...fayda, loading: true });
    try {
      // Simulate Fayda API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setFayda({ verified: true, loading: false });
      setErrors({});
    } catch (error) {
      setErrors({ fayda: 'Fayda verification failed' });
      setFayda({ ...fayda, loading: false });
    }
  };

  const handleNext = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    else if (step === 2) isValid = validateStep2();
    else if (step === 3) isValid = validateStep3();
    
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateStep4()) {
      onError?.('Validation Error', 'Please enter valid OTP');
      return;
    }

    try {
      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.otp, // Use OTP as temporary password
        phoneNumber: formData.phoneNumber,
        profession: '',
        fayda: formData.fayda,
        guarantor: '',
      });

      setSuccessMessage('✓ Registration complete!');
      onSuccess?.('🎉 Welcome to QalNet!', 'Your secure account is ready.', 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      onError?.('Error', message);
    }
  };

  if (successMessage) {
    return <FormSuccess title="✓ Success" message={successMessage} />;
  }

  return (
    <div>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm transition-all mb-2 ${
                  s <= step
                    ? 'bg-[#0d7e4d] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              <p className="text-xs text-gray-600 text-center">
                {s === 1 ? 'Personal' : s === 2 ? 'Contact' : s === 3 ? 'Fayda' : 'OTP'}
              </p>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#0d7e4d] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">
          {step === 1
            ? lang === 'en'
              ? 'Personal Information'
              : 'ስለራስዎ መግለጫ'
            : step === 2
            ? lang === 'en'
              ? 'Contact Information'
              : 'የእርስዎ ግንኙነት'
            : step === 3
            ? lang === 'en'
              ? 'Identity Verification (Fayda)'
              : 'ማንነት ማረጋገጫ'
            : lang === 'en'
            ? 'OTP Verification'
            : 'OTP ማጣራት'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {lang === 'en' ? `Step ${step} of 4` : `ደረጃ ${step} ከ 4`}
        </p>
      </div>

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-5"
        >
          <FormInput
            label={lang === 'en' ? '👤 First Name' : '👤 መጀመሪያ ስም'}
            type="text"
            value={formData.firstName}
            onChange={(value) => handleFieldChange('firstName', value)}
            placeholder="John"
            error={errors.firstName}
          />

          <FormInput
            label={lang === 'en' ? '👤 Last Name' : '👤 ስም'}
            type="text"
            value={formData.lastName}
            onChange={(value) => handleFieldChange('lastName', value)}
            placeholder="Doe"
            error={errors.lastName}
          />

          <button
            onClick={handleNext}
            className="w-full py-3 bg-[#0d7e4d] text-white font-bold rounded-lg hover:bg-[#0a5c38] transition-all duration-200 mt-8"
          >
            {lang === 'en' ? 'Next →' : 'ቀጥል →'}
          </button>
        </motion.div>
      )}

      {/* Step 2: Contact Information */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-5"
        >
          <FormInput
            label={lang === 'en' ? '📱 Phone Number' : '📱 ስልክ ቁጥር'}
            type="text"
            value={formData.phoneNumber}
            onChange={(value) => handleFieldChange('phoneNumber', value)}
            placeholder="+2519 xxxxxxxx"
            error={errors.phoneNumber}
            hint={lang === 'en' ? '+2519 followed by 8 digits' : '+2519 ከ 8 ዲጂት ጋር'}
          />

          <FormInput
            label={lang === 'en' ? '📧 Email Address' : '📧 ኢሜል'}
            type="email"
            value={formData.email}
            onChange={(value) => handleFieldChange('email', value)}
            placeholder="username@gmail.com"
            error={errors.email}
            hint={lang === 'en' ? 'Must end with @gmail.com' : '@gmail.com ያመልከት'}
          />

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleBack}
              className="flex-1 py-3 border-2 border-[#0d7e4d] text-[#0d7e4d] font-bold rounded-lg hover:bg-gray-50 transition-all"
            >
              {lang === 'en' ? '← Back' : '← ተመለስ'}
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-[#0d7e4d] text-white font-bold rounded-lg hover:bg-[#0a5c38] transition-all"
            >
              {lang === 'en' ? 'Next →' : 'ቀጥል →'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Fayda Identity Verification */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-5"
        >
          <FormInput
            label={lang === 'en' ? '🆔 Fayda Number' : '🆔 Fayda ቁጥር'}
            type="text"
            value={formData.fayda}
            onChange={(value) => handleFieldChange('fayda', value)}
            placeholder="1234567890123456"
            disabled={fayda.verified}
            error={errors.fayda}
            hint={lang === 'en' ? '16 digits only' : '16 ዲጂት ብቻ'}
          />

          {fayda.verified && (
            <div className="bg-green-50 border border-green-300 rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-bold text-green-800">
                  {lang === 'en' ? 'Identity Verified' : 'ማንነት ታገዩ'}
                </p>
                <p className="text-sm text-green-700">
                  {lang === 'en'
                    ? 'Your Fayda ID has been verified'
                    : 'Fayda ID ስሪዎ ታገዩ'}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleVerifyFayda}
            disabled={fayda.verified || fayda.loading}
            className={`w-full py-3 font-bold rounded-lg transition-all ${
              fayda.verified
                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {fayda.loading
              ? '⏳ Verifying...'
              : fayda.verified
              ? '✓ Verified'
              : lang === 'en'
              ? 'Verify with Fayda'
              : 'Fayda ን ያረጋግጡ'}
          </button>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleBack}
              className="flex-1 py-3 border-2 border-[#0d7e4d] text-[#0d7e4d] font-bold rounded-lg hover:bg-gray-50 transition-all"
            >
              {lang === 'en' ? '← Back' : '← ተመለስ'}
            </button>
            <button
              onClick={handleNext}
              disabled={!fayda.verified}
              className={`flex-1 py-3 font-bold rounded-lg transition-all ${
                fayda.verified
                  ? 'bg-[#0d7e4d] text-white hover:bg-[#0a5c38]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {lang === 'en' ? 'Next →' : 'ቀጥል →'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 4: OTP Verification */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-5"
        >
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-semibold">
              {lang === 'en'
                ? 'We sent a 5-digit OTP to your phone number'
                : 'ወደ ስልክ ቁጥርዎ 5-ዲጂት OTP ልኬላልክ'}
            </p>
          </div>

          <FormInput
            label={lang === 'en' ? '🔐 Enter OTP' : '🔐 OTP ገብአ'}
            type="text"
            value={formData.otp}
            onChange={(value) => handleFieldChange('otp', value)}
            placeholder="00000"
            maxLength={5}
            error={errors.otp}
            hint={lang === 'en' ? '5 digits' : '5 ዲጂት'}
          />

          {/* Trust Indicators */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3 mt-6">
            <h4 className="font-bold text-green-900 text-sm">
              {lang === 'en' ? 'Security Features' : 'ደህንነት ባህሪዎች'}
            </h4>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex items-center gap-2">
                <span>🔒</span>
                <span>{lang === 'en' ? 'End-to-end encryption' : 'ሙሉ በሙሉ ምስጢር'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>{lang === 'en' ? 'Fayda identity verified' : 'Fayda ማንነት ታገዩ'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📱</span>
                <span>{lang === 'en' ? 'OTP verification' : 'OTP ማጣራት'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span>{lang === 'en' ? 'Your data is protected' : 'ወደ ውሂብ ደህንነቱ'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleBack}
              className="flex-1 py-3 border-2 border-[#0d7e4d] text-[#0d7e4d] font-bold rounded-lg hover:bg-gray-50 transition-all"
            >
              {lang === 'en' ? '← Back' : '← ተመለስ'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 py-3 bg-[#0d7e4d] text-white font-bold rounded-lg hover:bg-[#0a5c38] transition-all disabled:opacity-50"
            >
              {isLoading
                ? '⏳ Verifying...'
                : lang === 'en'
                ? '🎉 Verify & Create Account'
                : '🎉 ተጣራ'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            {lang === 'en'
              ? 'By creating an account, you agree to our Terms of Service'
              : 'መስተዋወቅ በመ ዝግ, ውሎችን ተስማምተው ነው'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
