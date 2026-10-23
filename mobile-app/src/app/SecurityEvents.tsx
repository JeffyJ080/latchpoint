import { useState } from 'react';
import { Text, View } from 'react-native';
import ManagementPage, {
  Action,
  Card,
  ui,
} from '../components/ManagementPage';
import { useManagement } from '../hooks/useManagement';
import {
  formatTime,
  readable,
  type EventsData,
} from '../services/management';

type Filter = 'all' | 'success' | 'failed';

export default function SecurityEventsScreen() {
  const [filter, setFilter] = useState<Filter>('all');

  const query = filter === 'all' ? '' : `?status=${filter}`;
  const resource = useManagement<EventsData>(`/management/events${query}`);
  const events = resource.data?.events ?? [];

  return (
    <ManagementPage title="Security Events" {...resource}>
      <View style={[ui.row, { marginBottom: 18 }]}>
        {(['all', 'success', 'failed'] as const).map((value) => (
          <Action
            key={value}
            label={`${filter === value ? '✓ ' : ''}${value.toUpperCase()}`}
            onPress={() => setFilter(value)}
          />
        ))}
      </View>

      <Text style={[ui.text, { marginBottom: 16 }]}>
        Authentication events from the last 30 days.
      </Text>

      {!resource.error && events.length === 0 && (
        <Text style={ui.text}>No events match this filter.</Text>
      )}

      {events.map((event) => (
        <Card
          key={event.id}
          title={event.username || 'Unknown user'}
        >
          <Text
            style={{
              color: event.status === 'success' ? '#5cff87' : '#ffbd69',
              marginBottom: 8,
            }}
          >
            {readable(event.status).toUpperCase() || 'UNKNOWN'}
          </Text>

          <Text style={ui.text}>{formatTime(event.timestamp)}</Text>
          <Text style={ui.text}>IP: {event.ipAddress || 'Not recorded'}</Text>
        </Card>
      ))}
    </ManagementPage>
  );
}