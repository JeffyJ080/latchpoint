
import SectionPage from '../components/SectionPage';

export default function SecurityEventsScreen() {
  return (
    <SectionPage
      title="Security Events"
      description="Review authentication activity and security-related events."
      items={[
        {
          title: 'Repeated login failures',
          status: 'HIGH',
          color: '#ff707a',
          description: ''
        },
        {
          title: 'Successful authentication',
          status: 'INFO',
          color: '#5cff87',
          description: ''
        },
        {
          title: 'Request blocked',
          status: 'BLOCKED',
          color: '#ffbd69',
          description: ''
        },
      ]}
    />
  );
}
