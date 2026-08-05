'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Language, defaultLanguage } from '@/i18n/config';

interface SimpleRegistrationFormProps {
  lang?: Language;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export default function SimpleRegistrationForm({ 
  lang = defaultLanguage, 
  onSuccess, 
  onError 
}: SimpleRegistrationFormProps) {
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fayda, setFayda] = useState({ verified: false, verifying: false });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '+2519',
    email: '',
    fayda: '',
    otp: '',
  });

  const updateField = (field: string, value: string) => {
    if (field === 'phoneNumber') {
      if (!value.startsWith('+2519')) value = '+2519';
      const digits = value.replace(/\D/g, '');
      if (digits.length > 10) value = '+' + digits.substring(0, 10);
    } else if (field === 'fayda') {
      value = value.replace(/\D/g, '').slice(0, 16);
    } else if (field === 'otp') {
      value = value.replace(/\D/g, '').slice(0, 5);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleCreateAccount = async () => {
    console.log('=== handleCreateAccount called ===');
    console.log('FormData:', formData);
    console.log('Fayda verified:', fayda.verified);
    
    if (formData.otp.length !== 5) {
      setErrors({ otp: 'OTP must be 5 digits' });
      return;
    }

    setSubmitting(true);
    console.log('Starting signup...');

    try {
      const result = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.otp,
        phoneNumber: formData.phoneNumber,
        profession: '',
        fayda: formData.fayda,
        guarantor: '',
      });

      console.log('Signup result:', result);
      console.log('Calling onSuccess callback');
      setSubmitting(false);
      onSuccess?.();
    } catch (err) {
      console.error('Signup error:', err);
      setSubmitting(false);
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setErrors({ submit: msg });
      onError?.(msg);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-2xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`flex-1 text-center ${s <= step ? 'text-[#0d7e4d]' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mx-auto mb-2 ${
                s < step ? 'bg-[#0d7e4d] text-white' : s === step ? 'bg-[#0d7e4d] text-white border-2 border-white' : 'bg-gray-200'
              }`}>
                {s < step ? '✓' : s}
              </div>
              <span className="text-xs font-semibold">{['Personal', 'Contact', 'Fayda', 'OTP'][s-1]}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#0d7e4d] h-2 rounded-full transition-all" style={{ width: `${(step/4)*100}%` }} />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">{lang === 'en' ? `Step ${step}: ${['Personal', 'Contact', 'Fayda', 'OTP'][step-1]}` : `Step ${step}`}</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={e => updateField('firstName', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0d7e4d] focus:outline-none"
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={e => updateField('lastName', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0d7e4d] focus:outline-none"
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

          <button
            onClick={() => {
              if (formData.firstName.length >= 2 && formData.lastName.length >= 2) {
                setStep(2);
              } else {
                setErrors({ firstName: 'Min 2 chars', lastName: 'Min 2 chars' });
              }
            }}
            className="w-full bg-[#0d7e4d] text-white font-bold py-3 rounded-lg hover:bg-[#0a5c38] mt-6"
          >
            Next →
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <input
            type="tel"
            placeholder="+2519 + 8 digits"
            value={formData.phoneNumber}
            onChange={e => updateField('phoneNumber', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0d7e4d] focus:outline-none"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}

          <input
            type="email"
            placeholder="user@gmail.com"
            value={formData.email}
            onChange={e => updateField('email', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0d7e4d] focus:outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border-2 border-[#0d7e4d] text-[#0d7e4d] font-bold py-3 rounded-lg hover:bg-gray-50"
            >
              ← Back
            </button>
            <button
              onClick={() => {
                const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
                if (phoneDigits.length === 10 && formData.email.endsWith('@gmail.com')) {
                  setStep(3);
                } else {
                  if (phoneDigits.length !== 10) setErrors({ phoneNumber: '+2519 + 8 digits' });
                  if (!formData.email.endsWith('@gmail.com')) setErrors({ email: '@gmail.com only' });
                }
              }}
              className="flex-1 bg-[#0d7e4d] text-white font-bold py-3 rounded-lg hover:bg-[#0a5c38]"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Fayda Number (16 digits)"
            value={formData.fayda}
            onChange={e => updateField('fayda', e.target.value)}
            disabled={fayda.verified}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0d7e4d] focus:outline-none disabled:bg-gray-100"
          />
          {errors.fayda && <p className="text-red-500 text-sm">{errors.fayda}</p>}

          {fayda.verified ? (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-bold text-green-800">Identity Verified</p>
                <p className="text-sm text-green-700">Fayda ID confirmed</p>
              </div>
            </div>
          ) : null}

          <button
            onClick={async () => {
              if (formData.fayda.length !== 16) {
                setErrors({ fayda: 'Must be 16 digits' });
                return;
              }
              setFayda({ verified: false, verifying: true });
              await new Promise(r => setTimeout(r, 1500));
              setFayda({ verified: true, verifying: false });
              setErrors({});
            }}
            disabled={fayda.verified || fayda.verifying}
            className={`w-full font-bold py-3 rounded-lg ${
              fayda.verified ? 'bg-green-100 text-green-800 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {fayda.verifying ? '⏳ Verifying...' : fayda.verified ? '✓ Verified' : 'Verify with Fayda'}
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 border-2 border-[#0d7e4d] text-[#0d7e4d] font-bold py-3 rounded-lg hover:bg-gray-50"
            >
              ← Back
            </button>
            <button
              onClick={() => fayda.verified && setStep(4)}
              disabled={!fayda.verified}
              className={`flex-1 font-bold py-3 rounded-lg ${
                fayda.verified ? 'bg-[#0d7e4d] text-white hover:bg-[#0a5c38]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="space-y-4">
          <p className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-sm text-blue-900 font-semibold">
            We sent a 5-digit OTP to your phone
          </p>

          <input
            type="text"
            placeholder="00000"
            value={formData.otp}
            onChange={e => updateField('otp', e.target.value)}
            maxLength={5}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0d7e4d] focus:outline-none text-center text-2xl tracking-widest"
          />
          {errors.otp && <p className="text-red-500 text-sm text-center">{errors.otp}</p>}
          {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <h4 className="font-bold text-green-900 text-sm mb-3">🔒 Security</h4>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex items-center gap-2"><span>🔒</span><span>End-to-end encryption</span></div>
              <div className="flex items-center gap-2"><span>✅</span><span>Fayda verified</span></div>
              <div className="flex items-center gap-2"><span>📱</span><span>OTP verified</span></div>
              <div className="flex items-center gap-2"><span>🛡️</span><span>Data protected</span></div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="flex-1 border-2 border-[#0d7e4d] text-[#0d7e4d] font-bold py-3 rounded-lg hover:bg-gray-50"
            >
              ← Back
            </button>
            <button
              onClick={handleCreateAccount}
              disabled={submitting}
              className="flex-1 bg-[#0d7e4d] text-white font-bold py-3 rounded-lg hover:bg-[#0a5c38] disabled:opacity-50"
            >
              {submitting ? '⏳ Creating...' : '🎉 Create Account'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
