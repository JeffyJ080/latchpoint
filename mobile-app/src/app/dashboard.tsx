import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.headerIcon}>Menu</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Dashboard</Text>

        <Pressable>
          <Text style={styles.headerIcon}>⚙</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Good morning, Admin</Text>

          <Text style={styles.welcomeText}>
            Here's an overview of your application's security.
          </Text>
        </View>

        {/* System Status */}
        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusLabel}>SYSTEM STATUS</Text>
            <Text style={styles.statusTitle}>Framework Operational</Text>
          </View>

          <View style={styles.statusIndicator} />
        </View>

        {/* Statistics */}
        <Text style={styles.sectionTitle}>Security Overview</Text>

        <View style={styles.statsGrid}>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}></Text>
            <Text style={styles.statNumber}>248</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}></Text>
            <Text style={styles.statNumber}>1,284</Text>
            <Text style={styles.statLabel}>Login Attempts</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}></Text>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Attacks Detected</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}></Text>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Security Alerts</Text>
          </View>

        </View>

        {/* Authentication Activity */}
        <Text style={styles.sectionTitle}>
          Authentication Activity
        </Text>

        <View style={styles.chartCard}>

          <Text style={styles.chartTitle}>
            Login Activity
          </Text>

          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>
              Authentication Activity Chart
            </Text>
          </View>

        </View>

        {/* Recent Events */}
        <Text style={styles.sectionTitle}>
          Recent Security Events
        </Text>

        <View style={styles.eventsCard}>

          <View style={styles.event}>
            <Text style={styles.eventIcon}>🔴</Text>

            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>
                Failed Login Attempt
              </Text>

              <Text style={styles.eventDescription}>
                Multiple failed authentication attempts detected
              </Text>
            </View>

            <Text style={styles.eventTime}>2m</Text>
          </View>


          <View style={styles.divider} />


          <View style={styles.event}>
            <Text style={styles.eventIcon}>🟢</Text>

            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>
                Successful Authentication
              </Text>

              <Text style={styles.eventDescription}>
                User successfully authenticated
              </Text>
            </View>

            <Text style={styles.eventTime}>5m</Text>
          </View>


          <View style={styles.divider} />


          <View style={styles.event}>
            <Text style={styles.eventIcon}>🟠</Text>

            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>
                Possible Brute-Force Attack
              </Text>

              <Text style={styles.eventDescription}>
                Unusual number of login attempts detected
              </Text>
            </View>

            <Text style={styles.eventTime}>12m</Text>
          </View>

        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>

        <Pressable style={styles.navItem}>
          <Text style={styles.navIcon}>⌂</Text>
          <Text style={styles.navText}>Dashboard</Text>
        </Pressable>

        <Pressable style={styles.navItem}>
          <Text style={styles.navIcon}></Text>
          <Text style={styles.navText}>Users</Text>
        </Pressable>

        <Pressable style={styles.navItem}>
          <Text style={styles.navIcon}></Text>
          <Text style={styles.navText}>Alerts</Text>
        </Pressable>

        <Pressable style={styles.navItem}>
          <Text style={styles.navIcon}>⚙</Text>
          <Text style={styles.navText}>Settings</Text>
        </Pressable>

      </View>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#100e24',
  },

  header: {
    height: 90,
    paddingHorizontal: 20,
    paddingTop: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  headerIcon: {
    color: '#ffffff',
    fontSize: 22,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  welcomeSection: {
    marginTop: 20,
    marginBottom: 25,
  },

  welcomeTitle: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  welcomeText: {
    color: '#aaa6b8',
    fontSize: 14,
  },

  statusCard: {
    backgroundColor: '#3f3950',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  statusLabel: {
    color: '#aaa6b8',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  statusTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  statusIndicator: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#5cff87',
  },

  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  statCard: {
    backgroundColor: '#3f3950',
    width: '48%',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  statIcon: {
    fontSize: 22,
    marginBottom: 10,
  },

  statNumber: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: 'bold',
  },

  statLabel: {
    color: '#aaa6b8',
    fontSize: 12,
    marginTop: 3,
  },

  chartCard: {
    backgroundColor: '#3f3950',
    borderRadius: 14,
    padding: 18,
    marginBottom: 25,
  },

  chartTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  chartPlaceholder: {
    height: 170,
    borderRadius: 10,
    backgroundColor: '#29243a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  chartText: {
    color: '#aaa6b8',
    fontSize: 13,
  },

  eventsCard: {
    backgroundColor: '#3f3950',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  event: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },

  eventIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  eventInfo: {
    flex: 1,
  },

  eventTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  eventDescription: {
    color: '#aaa6b8',
    fontSize: 11,
  },

  eventTime: {
    color: '#aaa6b8',
    fontSize: 11,
    marginLeft: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#514b63',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: '#211d32',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#3f3950',
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  navIcon: {
    color: '#ffffff',
    fontSize: 20,
    marginBottom: 4,
  },

  navText: {
    color: '#aaa6b8',
    fontSize: 10,
  },

});