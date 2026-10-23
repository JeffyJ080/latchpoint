import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    title: string;
    loading: boolean;
    error: string;
    reload: () => void;
    children: ReactNode;
};

export function Action({
    label,
    onPress,
    disabled = false,
}: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
}) {
    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress}
            disabled={disabled}
            style={[ui.button, disabled && { opacity: 0.5 }]}
        >
            <Text style={ui.buttonText}>{label}</Text>
        </Pressable>
    );
}

export function Card({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <View style={ui.card}>
            <Text style={ui.cardTitle}>{title}</Text>
            {children}
        </View>
    );
}

export default function ManagementPage({
    title,
    loading,
    error,
    reload,
    children,
}: Props) {
    const router = useRouter();

    return (
        <View style={ui.page}>
            <ScrollView contentContainerStyle={ui.content}>
                <View style={ui.row}>
                    <Pressable onPress={() => router.replace('/dashboard')}>
                        <Text style={ui.link}>‹ Dashboard</Text>
                    </Pressable>

                    <Action
                        label={loading ? 'Loading…' : 'Refresh'}
                        onPress={reload}
                        disabled={loading}
                    />
                </View>

                <Text style={ui.title}>{title}</Text>

                {!!error && (
                    <Text accessibilityRole="alert" style={ui.error}>
                        {error}
                    </Text>
                )}

                {loading ? (
                    <ActivityIndicator
                        color="#a78bfa"
                        size="large"
                        style={{ marginTop: 30 }}
                    />
                ) : (
                    children
                )}
            </ScrollView>
        </View>
    );
}

export const ui = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#100e24',
    },
    content: {
        width: '100%',
        maxWidth: 1100,
        alignSelf: 'center',
        padding: 22,
        paddingBottom: 50,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        marginVertical: 22,
    },
    card: {
        backgroundColor: '#211d32',
        borderColor: '#3f3950',
        borderWidth: 1,
        borderRadius: 14,
        padding: 18,
        marginBottom: 14,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
    },
    text: {
        color: '#aaa6b8',
        fontSize: 14,
        lineHeight: 22,
    },
    label: {
        color: '#fff',
        fontSize: 14,
        marginTop: 14,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
    },
    button: {
        backgroundColor: '#c6baf1',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    buttonText: {
        color: '#292838',
        fontWeight: '700',
    },
    link: {
        color: '#c6baf1',
        paddingVertical: 10,
    },
    input: {
        backgroundColor: '#e5deff',
        color: '#100e24',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
    },
    error: {
        color: '#ff9098',
        marginBottom: 16,
        lineHeight: 22,
    },
    success: {
        color: '#5cff87',
        marginBottom: 16,
        lineHeight: 22,
    },
});