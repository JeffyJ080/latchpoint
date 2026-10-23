import * as SecureStore from 'expo-secure-store';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import { ApiError, apiRequest } from '../services/api';

type Session = {
    sessionToken: string;
    expiresAt: string;
    username: string;
};

export type LoginResponse = {
    sessionToken: string | null;
    expiresAt: string | null;
    mfaRequired: boolean | null;
    mfaChallengeId: string | null;
};

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
};

type AuthValue = {
    session: Session | null;
    ready: boolean;
    completeLogin: (response: LoginResponse) => Promise<void>;
    logout: () => Promise<void>;
    request: <T>(path: string, options?: RequestOptions) => Promise<T>;
};

const KEY = 'latchpoint.session';
const AuthContext = createContext<AuthValue | null>(null);

async function readStoredSession(): Promise<string | null> {
    return Platform.OS === 'web'
        ? window.sessionStorage.getItem(KEY)
        : SecureStore.getItemAsync(KEY);
}

async function writeStoredSession(session: Session): Promise<void> {
    const value = JSON.stringify(session);

    if (Platform.OS === 'web') {
        window.sessionStorage.setItem(KEY, value);
    } else {
        await SecureStore.setItemAsync(KEY, value);
    }
}

async function removeStoredSession(): Promise<void> {
    if (Platform.OS === 'web') {
        window.sessionStorage.removeItem(KEY);
    } else {
        await SecureStore.deleteItemAsync(KEY);
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [ready, setReady] = useState(false);

    const clearSession = useCallback(async () => {
        setSession(null);
        await removeStoredSession().catch(() => { });
    }, []);

    useEffect(() => {
        let active = true;

        async function restore() {
            try {
                const stored = await readStoredSession();
                if (!stored) return;

                const saved = JSON.parse(stored) as Session;

                if (
                    !saved.sessionToken ||
                    !saved.expiresAt ||
                    !(Date.parse(saved.expiresAt) > Date.now())
                ) {
                    throw new Error('Expired session');
                }

                const result = await apiRequest<{
                    valid: boolean;
                    username: string | null;
                }>('/session/validate', {
                    method: 'POST',
                    body: { sessionToken: saved.sessionToken },
                });

                if (!result.valid || !result.username) {
                    throw new Error('Invalid session');
                }

                saved.username = result.username;

                // Management access confirms this is an administrator session.
                await apiRequest('/management/dashboard', {
                    token: saved.sessionToken,
                });

                if (active) setSession(saved);
            } catch {
                await removeStoredSession().catch(() => { });
            } finally {
                if (active) setReady(true);
            }
        }

        void restore();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!session) return;

        const checkExpiry = () => {
            if (!(Date.parse(session.expiresAt) > Date.now())) {
                void clearSession();
            }
        };

        checkExpiry();
        const timer = setInterval(checkExpiry, 1000);

        return () => clearInterval(timer);
    }, [session, clearSession]);

    const completeLogin = useCallback(async (response: LoginResponse) => {
        if (!response.sessionToken || !response.expiresAt) {
            throw new Error('The server did not return a session.');
        }

        const next: Session = {
            sessionToken: response.sessionToken,
            expiresAt: response.expiresAt,
            username: '',
        };

        try {
            const validated = await apiRequest<{
                valid: boolean;
                username: string | null;
            }>('/session/validate', {
                method: 'POST',
                body: { sessionToken: next.sessionToken },
            });

            if (!validated.valid || !validated.username) {
                throw new Error('The session could not be validated.');
            }

            next.username = validated.username;

            await apiRequest('/management/dashboard', {
                token: next.sessionToken,
            });

            await writeStoredSession(next);
            setSession(next);
        } catch (error) {
            // Do not leave an unused session after rejected admin access.
            await apiRequest('/logout', {
                method: 'POST',
                body: { sessionToken: next.sessionToken },
            }).catch(() => { });

            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        const token = session?.sessionToken;

        try {
            if (token) {
                await apiRequest('/logout', {
                    method: 'POST',
                    body: { sessionToken: token },
                });
            }
        } finally {
            await clearSession();
        }
    }, [session, clearSession]);

    const request = useCallback(
        async <T,>(path: string, options: RequestOptions = {}): Promise<T> => {
            if (
                !session ||
                !(Date.parse(session.expiresAt) > Date.now())
            ) {
                await clearSession();
                throw new ApiError(401, 'session_expired');
            }

            try {
                return await apiRequest<T>(path, {
                    ...options,
                    token: session.sessionToken,
                });
            } catch (error) {
                if (
                    error instanceof ApiError &&
                    (error.status === 401 || error.status === 403)
                ) {
                    await clearSession();
                }

                throw error;
            }
        },
        [session, clearSession],
    );

    return (
        <AuthContext.Provider value={{ session, ready, completeLogin, logout, request }
        }>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthValue {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return value;
}