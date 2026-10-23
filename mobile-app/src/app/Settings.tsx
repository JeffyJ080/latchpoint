import { useEffect, useState } from 'react';
import { Switch, Text, TextInput, View } from 'react-native';
import ManagementPage, {
  Action,
  Card,
  ui,
} from '../components/ManagementPage';
import { useAuth } from '../context/AuthContext';
import { useManagement } from '../hooks/useManagement';
import {
  errorMessage,
  type ConfigData,
} from '../services/management';

export default function SettingsScreen() {
  const { request, logout } = useAuth();
  const resource = useManagement<ConfigData>('/management/config');

  const [mfa, setMfa] = useState(false);
  const [symbol, setSymbol] = useState(false);
  const [minLength, setMinLength] = useState('');
  const [expiryDays, setExpiryDays] = useState('');
  const [timeout, setTimeoutValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [message, setMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  function apply(config: ConfigData) {
    setMfa(config.mfaEnabled);
    setSymbol(config.passwordPolicy.requireSymbol);
    setMinLength(String(config.passwordPolicy.minLength));
    setExpiryDays(String(config.passwordPolicy.expiryDays));
    setTimeoutValue(String(config.sessionTimeoutMinutes));
  }

  useEffect(() => {
    if (resource.data) apply(resource.data);
  }, [resource.data]);

  async function save() {
    if (saving || !resource.data) return;

    setMessage('');
    setSaveError('');

    const length = Number(minLength);
    const expiry = Number(expiryDays);
    const minutes = Number(timeout);

    if (
      !/^[0-9]+$/.test(minLength) ||
      !Number.isInteger(length) ||
      length < 8 ||
      length > 128 ||
      !/^[0-9]+$/.test(expiryDays) ||
      !Number.isInteger(expiry) ||
      expiry < 1 ||
      expiry > 3650 ||
      !/^[0-9]+$/.test(timeout) ||
      !Number.isInteger(minutes) ||
      minutes < 1 ||
      minutes > 1440
    ) {
      setSaveError(
        'Use whole numbers: password length 8–128, expiry 1–3650 days, and session timeout 1–1440 minutes.',
      );
      return;
    }

    setSaving(true);

    try {
      const updated = await request<ConfigData>('/management/config', {
        method: 'PUT',
        body: {
          mfaEnabled: mfa,
          passwordPolicy: {
            minLength: length,
            requireSymbol: symbol,
            expiryDays: expiry,
          },
          sessionTimeoutMinutes: minutes,
        },
      });

      apply(updated);
      setMessage('Configuration saved successfully.');
    } catch (caught) {
      setSaveError(errorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    if (loggingOut || saving) return;

    setLoggingOut(true);

    try {
      await logout();
    } catch {
      // AuthContext clears local access even if revocation cannot reach the server.
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <ManagementPage
      title="Settings"
      loading={resource.loading}
      error={resource.error}
      reload={() => {
        if (!saving) {
          setMessage('');
          setSaveError('');
          resource.reload();
        }
      }}
    >
      {resource.data && (
        <>
          <Card title="Authentication policy">
            <View style={ui.row}>
              <Text style={ui.text}>Enable MFA for enrolled accounts</Text>
              <Switch
                value={mfa}
                onValueChange={setMfa}
                disabled={saving}
              />
            </View>

            <Text style={ui.label}>Minimum password length (8–128)</Text>
            <TextInput
              style={ui.input}
              value={minLength}
              onChangeText={setMinLength}
              keyboardType="number-pad"
              editable={!saving}
              accessibilityLabel="Minimum password length"
            />

            <View style={[ui.row, { marginTop: 16 }]}>
              <Text style={ui.text}>Require a password symbol</Text>
              <Switch
                value={symbol}
                onValueChange={setSymbol}
                disabled={saving}
              />
            </View>

            <Text style={ui.label}>Password expiry in days (1–3650)</Text>
            <TextInput
              style={ui.input}
              value={expiryDays}
              onChangeText={setExpiryDays}
              keyboardType="number-pad"
              editable={!saving}
              accessibilityLabel="Password expiry in days"
            />

            <Text style={ui.label}>Session timeout in minutes (1–1440)</Text>
            <TextInput
              style={ui.input}
              value={timeout}
              onChangeText={setTimeoutValue}
              keyboardType="number-pad"
              editable={!saving}
              accessibilityLabel="Session timeout in minutes"
            />

            <Text style={[ui.text, { marginVertical: 16 }]}>
              Session timeout changes apply to new sessions.
              MFA requires an active account enrollment.
            </Text>

            {!!saveError && (
              <Text accessibilityRole="alert" style={ui.error}>
                {saveError}
              </Text>
            )}

            {!!message && <Text style={ui.success}>{message}</Text>}

            <Action
              label={saving ? 'Saving…' : 'Save configuration'}
              onPress={() => void save()}
              disabled={saving || loggingOut}
            />
          </Card>

          <Card title="Adapter connection">
            <Text style={ui.text}>
              {resource.data.adapterConnection.status}
            </Text>
            <Text style={ui.text}>
              {resource.data.adapterConnection.endpoint}
            </Text>
          </Card>
        </>
      )}

      <Action
        label={loggingOut ? 'Logging out…' : 'Log out'}
        onPress={() => void handleLogout()}
        disabled={loggingOut || saving}
      />
    </ManagementPage>
  );
}