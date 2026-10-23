import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../services/management';

export function useManagement<T>(path: string) {
    const { request, ready, session } = useAuth();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [revision, setRevision] = useState(0);

    useFocusEffect(
        useCallback(() => {
            let active = true;

            if (!ready || !session) {
                return () => {
                    active = false;
                };
            }

            setLoading(true);
            setError('');
            setData(null);

            request<T>(path)
                .then((result) => {
                    if (active) setData(result);
                })
                .catch((caught: unknown) => {
                    if (active) setError(errorMessage(caught));
                })
                .finally(() => {
                    if (active) setLoading(false);
                });

            return () => {
                active = false;
            };
        }, [path, request, ready, session, revision]),
    );

    const reload = useCallback(() => {
        setRevision((value) => value + 1);
    }, []);

    return { data, loading, error, reload };
}