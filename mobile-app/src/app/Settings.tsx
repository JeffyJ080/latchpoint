import SectionPage from '../components/SectionPage';

export default function SettingsScreen() {
  return (
    <><SectionPage
      title="Settings"
      description="Manage framework configuration and dashboard preferences."
      items={[
        {
          title: 'Authentication',
          description: 'Review password and sign-in policy configuration.',
          status: 'VIEW',
          color: '#a78bfa',
        },
        {
          title: 'Multi-factor authentication',
          description: 'Review MFA configuration and enforcement.',
          status: 'VIEW',
          color: '#a78bfa',
        },
        {
          title: 'Session security',
          description: 'Review session expiration and session policies.',
          status: 'VIEW',
          color: '#a78bfa',
        },
        {
          title: 'Notifications',
          description: 'Configure how security alerts should be presented.',
          status: 'VIEW',
          color: '#a78bfa',
        },
      ]}
    />
</>

  );
}