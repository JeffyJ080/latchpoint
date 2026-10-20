import SectionPage from '../components/SectionPage';

export default function UsersScreen() {
  return (
    <SectionPage
      title="Users"
      description="Review user accounts and their access roles."
      items={[
        {
          title: 'Admin User',
          description: 'Full administrative access to the framework.',
          status: 'ADMIN',
          color: '#a78bfa',
        },
        {
          title: 'Business User',
          description: 'Standard application access.',
          status: 'END USER',
          color: '#7db7ff',
        },
        {
          title: 'Account management',
          description: 'User creation, role assignments and account status.',
          status: 'PREVIEW',
          color: '#ffbd69',
        },
      ]}
    />
  );
}
