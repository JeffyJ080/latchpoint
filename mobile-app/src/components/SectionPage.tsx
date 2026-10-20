import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const C = {
  background: '#100e24',
  sidebar: '#17132d',
  card: '#211d32',
  border: '#3f3950',
  purple: '#a78bfa',
  white: '#ffffff',
  muted: '#aaa6b8',
  green: '#5cff87',
  orange: '#ffbd69',
  red: '#ff707a',
};

export type PageItem = {
  title: string;
  description: string;
  status?: string;
  color?: string;
};

type Props = {
  title: string;
  description: string;
  items: PageItem[];
};

export default function SectionPage({
  title,
  description,
  items,
}: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace('/dashboard')}
          style={styles.backButton}
          accessibilityRole="button"
        >
          <Text style={styles.backText}>‹  Dashboard</Text>
        </Pressable>

        <Text style={styles.brand}>LatchPoint</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>LATCHPOINT SECURITY</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.statusCard}>
          <View style={styles.statusDot} />
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>Dashboard preview</Text>
            <Text style={styles.statusDescription}>
              Sample content · Backend not connected
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {title} overview
        </Text>

        {items.map((item, index) => (
          <View key={`${item.title}-${index}`} style={styles.itemCard}>
            <View style={styles.itemTop}>
              <Text style={styles.itemTitle}>{item.title}</Text>

              {item.status ? (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: `${item.color ?? C.purple}20`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: item.color ?? C.purple },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.itemDescription}>
              {item.description}
            </Text>
          </View>
        ))}

        {items.length === 0 && (
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>Nothing to display yet</Text>
            <Text style={styles.itemDescription}>
              Content will appear here when data becomes available.
            </Text>
          </View>
        )}



        {title === 'Settings' && (
          <Pressable
            style={styles.logoutButton}
            onPress={() => router.replace('/login')}
            accessibilityRole="button"
          >
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        )}

        <Text style={styles.footer}>
          LatchPoint · Security management
        </Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
    minHeight: '100%',
  },
  
  buttonContainer: {
    padding: 20,
    alignItems: 'flex-start',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    minHeight: 72,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backButton: {
    paddingVertical: 10,
    paddingRight: 12,
  },
  backText: {
    color: C.purple,
    fontSize: 13,
    fontWeight: '600',
  },
  brand: {
    color: C.white,
    fontSize: 17,
    fontWeight: '800',
  },
  content: {
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
    padding: 24,
    paddingBottom: 50,
  },
  eyebrow: {
    color: C.purple,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  title: {
    color: C.white,
    fontSize: 29,
    fontWeight: '800',
  },
  description: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 17,
    marginBottom: 28,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.orange,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    color: C.white,
    fontSize: 13,
    fontWeight: '700',
  },
  statusDescription: {
    color: C.muted,
    fontSize: 11,
    marginTop: 5,
  },
  sectionTitle: {
    color: C.white,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 13,
  },
  itemCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 17,
    marginBottom: 12,
  },
  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  itemTitle: {
    color: C.white,
    fontSize: 13,
    fontWeight: '700',
    flexShrink: 1,
  },
  itemDescription: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    color: C.muted,
    fontSize: 10,
    marginTop: 25,
  },
});
