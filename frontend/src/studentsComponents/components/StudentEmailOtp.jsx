import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MailCheck, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentEmailOtp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [freeze, setFreeze] = useState(false);
  const [freezeTimer, setFreezeTimer] = useState(60);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  // Resend OTP timer
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Freeze timer
  useEffect(() => {
    let interval;
    if (freeze && freezeTimer > 0) {
      interval = setInterval(() => setFreezeTimer(t => t - 1), 1000);
    } else if (freeze && freezeTimer === 0) {
      setFreeze(false);
      setFreezeTimer(60);
      setAttemptsLeft(3);
      toast.success('You can try again now!');
    }
    return () => clearInterval(interval);
  }, [freeze, freezeTimer]);

  const handleChange = (e, idx) => {
    if (freeze) return;
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (!value) return;
    const newOtp = [...otp];
    newOtp[idx] = value[value.length - 1];
    setOtp(newOtp);
    if (idx < 5 && value) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (freeze) return;
    if (e.key === 'Backspace') {
      if (otp[idx]) {
        const newOtp = [...otp];
        newOtp[idx] = '';
        setOtp(newOtp);
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    if (freeze) return;
    const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    if (paste.length === 6) {
      setOtp(paste.split(''));
      inputsRef.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (freeze) return;
    setLoading(true);
    setError('');
    const otpValue = otp.join('');
    setTimeout(() => {
      setLoading(false);
      if (otpValue === '123456') {
        toast.success('Email verified and updated!');
        localStorage.setItem('studentEmail', email);
        navigate('/profile');
      } else {
        if (attemptsLeft > 1) {
          setAttemptsLeft(a => a - 1);
          toast.error(`Invalid OTP. You have ${attemptsLeft - 1} attempt(s) left.`);
        } else {
          setFreeze(true);
          setAttemptsLeft(0);
          toast.error('Too many failed attempts. Please wait 60 seconds.');
        }
        setError('Invalid OTP.');
      }
    }, 1200);
  };

  const handleResend = () => {
    setResendTimer(30);
    toast.success('OTP resent!');
    // Simulate resend OTP (replace with real API call)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3f0ff] via-[#f6f8fa] to-[#e3f0ff] px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center border border-blue-100 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="self-start mb-6 flex items-center gap-2 text-[#0F52BA] border border-[#0F52BA] hover:bg-[#F0F6FF] font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
        <div className="bg-[#E3F0FF] rounded-full p-4 mb-4 flex items-center justify-center shadow-sm">
          <MailCheck className="text-[#0F52BA] w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold mb-1 text-center text-[#0F52BA] tracking-tight">Email Verification</h2>
        <p className="mb-2 text-center text-gray-600 text-base">Enter the 6-digit code sent to <span className="font-semibold text-[#0F52BA]">{email}</span></p>
        <p className="mb-6 text-center text-gray-400 text-sm">This helps us keep your account secure.</p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="flex gap-3 mb-5" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputsRef.current[idx] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                className={`w-12 h-14 text-center text-2xl border-2 border-blue-200 rounded-lg focus:border-[#0F52BA] focus:ring-2 focus:ring-[#0F52BA] bg-white transition-all font-mono tracking-widest shadow-sm ${freeze ? 'opacity-60 pointer-events-none' : ''}`}
                autoFocus={idx === 0}
                disabled={freeze}
              />
            ))}
          </div>
          {freeze && (
            <p className="text-red-600 text-xs mb-2">Too many failed attempts. Please wait {freezeTimer} seconds.</p>
          )}
          {error && !freeze && <p className="text-red-600 text-xs mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#0F52BA] text-white py-2 rounded-lg hover:bg-[#1565C0] transition-all font-semibold disabled:opacity-60 mb-2 shadow-sm"
            disabled={loading || freeze}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : null}
            Verify & Update Email
          </button>
        </form>
        <button
          onClick={handleResend}
          className="text-[#0F52BA] text-sm mt-2 hover:underline disabled:opacity-60 font-semibold"
          disabled={resendTimer > 0}
        >
          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
        </button>
        <p className="text-gray-400 text-xs mt-3">Attempts left: {attemptsLeft}</p>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeInCard 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
} 