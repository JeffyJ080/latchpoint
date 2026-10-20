import SectionPage from '../components/SectionPage';

export default function AlertsScreen() {
  return (
    <SectionPage
      title="Security Alerts"
      description="Review potential security issues that may require investigation."
      items={[
        {
          title: 'Repeated authentication failures',
          description: 'Review the frequency of failed logins.',
          status: 'HIGH',
          color: '#ff707a',
        },
        {
          title: 'Unusual login activity',
          description: 'Activity that differs from expected patterns.',
          status: 'MEDIUM',
          color: '#ffbd69',
        },
        {
          title: 'Integration health check',
          description: 'Verify that connected services are reachable.',
          status: 'REVIEW',
          color: '#a78bfa',
        },
      ]}
    />
  );
}
