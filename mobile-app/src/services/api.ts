const configuredUrl = process.env.EXPO_PUBLIC_API_URL;

if (!configuredUrl) {
    throw new Error('EXPO_PUBLIC_API_URL is missing from mobile-app/.env');
}

export const API_URL = configuredUrl.replace(/\/+$/, '');

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly code: string,
    ) {
        super(code);
        this.name = 'ApiError';
    }
}

type ApiOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    token?: string;
};

export async function apiRequest<T>(
    path: string,
    options: ApiOptions = {},
): Promise<T> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
    };

    if (options.body !== undefined) {
        headers['Content-Type'] = 'application/json';
    }

    if (options.token) {
        headers.Authorization = `Bearer ${options.token}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: options.method ?? 'GET',
            headers,
            body:
                options.body !== undefined
                    ? JSON.stringify(options.body)
                    : undefined,
            signal: controller.signal,
        });

        const text = await response.text();
        let data: unknown = null;

        if (text) {
            try {
                data = JSON.parse(text);
            } catch {
                if (response.ok) {
                    throw new ApiError(response.status, 'invalid_server_response');
                }
            }
        }

        if (!response.ok) {
            const code =
                typeof data === 'object' &&
                    data !== null &&
                    'error' in data &&
                    typeof data.error === 'string'
                    ? data.error
                    : `http_${response.status}`;

            throw new ApiError(response.status, code);
        }

        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            0,
            controller.signal.aborted ? 'request_timeout' : 'network_error',
        );
    } finally {
        clearTimeout(timeout);
    }
}