import { useState, useEffect, useCallback } from 'react';

const CAPTCHA_THRESHOLD = 3; // Show CAPTCHA after 3 failed attempts
const STORAGE_KEY = 'login_failed_attempts';
const STORAGE_EXPIRY_KEY = 'login_failed_attempts_expiry';
const EXPIRY_DURATION = 15 * 60 * 1000; // 15 minutes

interface CaptchaState {
  failedAttempts: number;
  showCaptcha: boolean;
  captchaToken: string | null;
  isCaptchaVerified: boolean;
}

export function useCaptcha() {
  const [state, setState] = useState<CaptchaState>({
    failedAttempts: 0,
    showCaptcha: false,
    captchaToken: null,
    isCaptchaVerified: false,
  });

  // Load failed attempts from storage on mount
  useEffect(() => {
    const storedAttempts = localStorage.getItem(STORAGE_KEY);
    const storedExpiry = localStorage.getItem(STORAGE_EXPIRY_KEY);

    if (storedAttempts && storedExpiry) {
      const expiry = parseInt(storedExpiry, 10);
      if (Date.now() < expiry) {
        const attempts = parseInt(storedAttempts, 10);
        setState(prev => ({
          ...prev,
          failedAttempts: attempts,
          showCaptcha: attempts >= CAPTCHA_THRESHOLD,
        }));
      } else {
        // Clear expired data
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_EXPIRY_KEY);
      }
    }
  }, []);

  const incrementFailedAttempts = useCallback(() => {
    setState(prev => {
      const newAttempts = prev.failedAttempts + 1;
      const showCaptcha = newAttempts >= CAPTCHA_THRESHOLD;

      // Persist to storage
      localStorage.setItem(STORAGE_KEY, newAttempts.toString());
      localStorage.setItem(STORAGE_EXPIRY_KEY, (Date.now() + EXPIRY_DURATION).toString());

      return {
        ...prev,
        failedAttempts: newAttempts,
        showCaptcha,
        captchaToken: null,
        isCaptchaVerified: false,
      };
    });
  }, []);

  const resetFailedAttempts = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_EXPIRY_KEY);
    setState({
      failedAttempts: 0,
      showCaptcha: false,
      captchaToken: null,
      isCaptchaVerified: false,
    });
  }, []);

  const onCaptchaVerify = useCallback((token: string) => {
    setState(prev => ({
      ...prev,
      captchaToken: token,
      isCaptchaVerified: true,
    }));
  }, []);

  const onCaptchaExpire = useCallback(() => {
    setState(prev => ({
      ...prev,
      captchaToken: null,
      isCaptchaVerified: false,
    }));
  }, []);

  const canAttemptLogin = useCallback(() => {
    // If CAPTCHA is not required, allow login
    if (!state.showCaptcha) return true;
    // If CAPTCHA is required, only allow if verified
    return state.isCaptchaVerified;
  }, [state.showCaptcha, state.isCaptchaVerified]);

  return {
    ...state,
    incrementFailedAttempts,
    resetFailedAttempts,
    onCaptchaVerify,
    onCaptchaExpire,
    canAttemptLogin,
    captchaThreshold: CAPTCHA_THRESHOLD,
  };
}
