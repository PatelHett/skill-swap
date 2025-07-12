// src/hooks/useUsernameCheck.ts
import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

interface UsernameCheckResult {
  isChecking: boolean;
  isAvailable: boolean | null;
  message: string;
  hasError: boolean;
}

export const useUsernameCheck = (username: string, delay: number = 500) => {
  const [result, setResult] = useState<UsernameCheckResult>({
    isChecking: false,
    isAvailable: null,
    message: '',
    hasError: false,
  });

  const checkUsername = useCallback(async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck.length < 3) {
      setResult({
        isChecking: false,
        isAvailable: null,
        message: '',
        hasError: false,
      });
      return;
    }

    setResult(prev => ({ ...prev, isChecking: true, hasError: false }));

    try {
      const response = await api.get(`/auth/check-username?username=${usernameToCheck}`);
      const { available, message } = response.data;

      setResult({
        isChecking: false,
        isAvailable: available,
        message: message,
        hasError: false,
      });
    } catch (error: any) {
      setResult({
        isChecking: false,
        isAvailable: null,
        message: 'Error checking username availability',
        hasError: true,
      });
    }
  }, []);

  useEffect(() => {
    if (!username) {
      setResult({
        isChecking: false,
        isAvailable: null,
        message: '',
        hasError: false,
      });
      return;
    }

    const timeoutId = setTimeout(() => {
      checkUsername(username);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [username, delay, checkUsername]);

  return result;
};