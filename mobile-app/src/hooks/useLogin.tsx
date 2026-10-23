import { useState } from 'react';
import { useAuth, type LoginResponse } from '../context/AuthContext';
import { ApiError, apiRequest } from '../services/api';

export function useLogin() {
    const { completeLogin } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [challengeId, setChallengeId] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    async function submit() {
        if (busy) return;

        setError('');

        if (
            challengeId
                ? !/^[0-9]{6}$/.test(code)
                : !username.trim() || !password
        ) {
            setError(
                challengeId
                    ? 'Enter the six-digit authenticator code.'
                    : 'Enter your username and password.',
            );
            return;
        }

        setBusy(true);

        try {
            const result = await apiRequest<LoginResponse>(
                challengeId ? '/verify-mfa' : '/login',
                {
                    method: 'POST',
                    body: challengeId
                        ? { challengeId, code }
                        : { username: username.trim(), password },
                },
            );

            if (result.mfaRequired && result.mfaChallengeId) {
                setChallengeId(result.mfaChallengeId);
                setPassword('');
                setCode('');
            } else {
                await completeLogin(result);
            }
        } catch (caught) {
            if (caught instanceof ApiError) {
                if (caught.status === 429) {
                    setError('Too many failed attempts. Try again later.');
                    setChallengeId(null);
                    setCode('');
                } else if (caught.code === 'password_expired') {
                    setError('Your password has expired. Contact the administrator.');
                } else if (caught.status === 403) {
                    setError('An administrator account is required.');
                } else if (caught.status === 401) {
                    setError(
                        challengeId
                            ? 'Invalid code or expired challenge. Retry or start again.'
                            : 'Incorrect username or password.',
                    );
                } else if (caught.status === 0) {
                    setError('Cannot reach the server. Check your connection.');
                } else {
                    setError(`Request failed (${caught.code}).`);
                }
            } else {
                setError('Could not complete login. Please try again.');
            }
        } finally {
            setBusy(false);
        }
    }

    function startAgain() {
        setChallengeId(null);
        setCode('');
        setPassword('');
        setError('');
    }

    return {
        username,
        setUsername,
        password,
        setPassword,
        code,
        setCode,
        challengeId,
        busy,
        error,
        submit,
        startAgain,
    };
}