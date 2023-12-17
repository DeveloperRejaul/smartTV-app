/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';

/**
 * OTP Input Component
 * The `OtpInput` component is used to create an individual input field for entering a single digit of a One-Time Password (OTP).
 *
 * @component
 *
 * @param {Object} props - The component's properties.
 * @param {String} props.value - The value (digit) of the OTP input field.
 * @param {Function} props.onChange - A callback function to handle changes in the input field.
 * @param {Function} props.focusNext - A callback function to focus on the next input field.
 * @param {String} props.id - The unique identifier for the input field.
 * @returns {JSX.Element} The rendered OtpInput component.
 */
function OtpInput({ value, onChange = () => {}, focusNext, focusPrev, id }) {
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (!isNaN(newValue) && newValue.length <= 1) {
      onChange(newValue, e);
      if (newValue === '') {
        focusPrev(id.replace('otp-input-', '') - 1);
      }
    }
  };

  return (
    <input
      id={id}
      type='text'
      className='w-12 h-12 text-3xl text-center border border-black rounded-lg outline-none focus:border-blue focus:border-[4px]'
      value={value}
      onChange={handleInputChange}
    />
  );
}

/**
 * Verify OTP Input Component
 *
 * The `VerifyOtp` component is a reusable component for entering a One-Time Password (OTP). It allows users to input a 4-digit OTP using individual input fields and handles paste events for ease of use.
 *
 * @component
 *
 * @param {object} props - The props for the VerifyOtp component.
 * @param {string[]} props.otp - An array representing the OTP digits.
 * @param {function} props.setOtp - A function to set the OTP digits.
 *
 * @returns {JSX.Element} The rendered VerifyOtp component.
 *
 * @example
 * // Using the VerifyOtp component
 * import VerifyOtp from './VerifyOtp';
 *
 * function MyComponent() {
 *   const [otp, setOtp] = useState(["", "", "", ""]);
 *
 *   return (
 *     <VerifyOtp otp={otp} setOtp={setOtp} />
 *   );
 * }
 */
export default function VerifyOtp({ otp=[], setOtp = () => {}, position = 'center' }) {
  const focusNext = (index) => {
    if (index >= 0 && index < 4) {
      document.getElementById(`otp-input-${index}`).focus();
    }
  };

  const focusPrev = (index) => {
    if (index >= 0 && index < 4) {
      document.getElementById(`otp-input-${index}`).focus();
    }
  };

  const handleInputChange = (newValue, event, index) => {
    event.preventDefault();
    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);
    newOtp[index] !== '' && focusNext(index + 1);
  };

  const handlePaste = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text').slice(0, 4);
    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      focusNext(newOtp.length - 1);
    }
  };

  useEffect(() => {
    document.addEventListener('paste', handlePaste);

    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className={`flex items-center justify-${position} gap-8 h-full`}>
      {otp.map((digit, index) => (
        <OtpInput
          key={index}
          id={`otp-input-${index}`}
          value={digit}
          onChange={(newValue, event) => handleInputChange(newValue, event, index)}
          focusNext={() => focusNext(index + 1)}
          focusPrev={(val = 0) => focusPrev(val)}
        />
      ))}
    </div>
  );
}
