export type DashboardData = {
    authStatus: string;
    recentLogins: {
        success: number;
        failed: number;
    };
    mfaEnabled: boolean;
    legacyConnectionStatus: string;
};

export type SecurityEvent = {
    id: string;
    timestamp: string;
    username: string | null;
    status: string;
    ipAddress: string | null;
};

export type EventsData = {
    events: SecurityEvent[];
};

export type SecurityAlert = {
    id: string;
    type: string;
    message: string;
    timestamp: string;
};

export type AlertsData = {
    alerts: SecurityAlert[];
};

export type ConfigData = {
    mfaEnabled: boolean;
    passwordPolicy: {
        minLength: number;
        requireSymbol: boolean;
        expiryDays: number;
    };
    sessionTimeoutMinutes: number;
    adapterConnection: {
        endpoint: string;
        status: string;
    };
};

export function formatTime(value: string): string {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function readable(value: string): string {
    return value.replace(/_/g, ' ');
}

export function errorMessage(error: unknown): string {
    if (error instanceof Error) {
        if (error.message === 'network_error') {
            return 'Cannot reach Auth Core. Check your connection.';
        }

        if (error.message === 'request_timeout') {
            return 'The server took too long to respond. Please retry.';
        }

        return error.message.replace(/_/g, ' ');
    }

    return 'The request failed. Please retry.';
}