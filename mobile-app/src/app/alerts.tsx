import { Text } from 'react-native';
import ManagementPage, {
  Card,
  ui,
} from '../components/ManagementPage';
import { useManagement } from '../hooks/useManagement';
import {
  formatTime,
  readable,
  type AlertsData,
} from '../services/management';

export default function AlertsScreen() {
  const resource = useManagement<AlertsData>('/management/alerts');
  const alerts = resource.data?.alerts ?? [];

  return (
    <ManagementPage title="Security Alerts" {...resource}>
      {!resource.error && alerts.length === 0 && (
        <Card title="No active alerts">
          <Text style={ui.text}>
            No alert conditions were reported by the backend.
          </Text>
        </Card>
      )}

      {alerts.map((alert) => (
        <Card key={alert.id} title={readable(alert.type)}>
          <Text style={ui.text}>{alert.message}</Text>
          <Text style={[ui.text, { marginTop: 10 }]}>
            Checked: {formatTime(alert.timestamp)}
          </Text>
        </Card>
      ))}
    </ManagementPage>
  );
}