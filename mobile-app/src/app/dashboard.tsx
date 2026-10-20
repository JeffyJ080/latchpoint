
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

type ChartDataset = {
  data: number[];
  color?: (opacity?: number) => string;
  strokeWidth?: number;
};

type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
  legend?: string[];
};

type ChartConfig = {
  backgroundColor?: string;
  backgroundGradientFrom?: string;
  backgroundGradientTo?: string;
  decimalPlaces?: number;
  color?: (opacity?: number) => string;
  labelColor?: (opacity?: number) => string;
  propsForBackgroundLines?: {
    stroke?: string;
    strokeDasharray?: string;
  };
  propsForDots?: {
    r?: string;
    strokeWidth?: string;
  };
  propsForHorizontalLabels?: {
    fontSize?: number;
  };
  propsForVerticalLabels?: {
    fontSize?: number;
  };
};

type LineChartProps = {
  data: ChartData;
  width: number;
  height: number;
  fromZero?: boolean;
  bezier?: boolean;
  withInnerLines?: boolean;
  withOuterLines?: boolean;
  withVerticalLines?: boolean;
  withHorizontalLabels?: boolean;
  withDots?: boolean;
  chartConfig?: ChartConfig;
  style?: any;
};

function LineChart({
  data,
  width,
  height,
  style,
}: LineChartProps) {
  const allValues = data.datasets.flatMap((dataset) => dataset.data);
  const maxValue = Math.max(...allValues, 1);
  const minValue = Math.min(...allValues, 0);
  const chartHeight = Math.max(height - 28, 120);
  const stepX = data.labels.length > 1 ? (width - 24) / (data.labels.length - 1) : 0;

  const buildSeries = (dataset: ChartDataset, index: number) => {
    const color = dataset.color?.(1) ?? '#71679b';

    const points = dataset.data.map((value, pointIndex) => {
      const x = 12 + pointIndex * stepX;
      const y =
        chartHeight -
        ((value - minValue) / Math.max(maxValue - minValue || 1, 1)) *
        (chartHeight - 12) -
        6;

      return { x, y };
    });

    return (
      <View key={`${color}-${index}`}>
        {points.map((point, pointIndex) => (
          <View
            key={`${point.x}-${point.y}-${pointIndex}`}
            style={{
              position: 'absolute',
              left: point.x - 3,
              top: point.y - 3,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: color,
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={[{ width, height, overflow: 'hidden' }, style]}>
      <View
        style={{
          position: 'relative',
          width,
          height: chartHeight,
          marginTop: 8,
          borderRadius: 10,
          backgroundColor: 'transparent',
        }}
      >
        {Array.from({ length: 4 }).map((_, gridIndex) => (
          <View
            key={`grid-${gridIndex}`}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: (chartHeight / 3) * gridIndex + 8,
              borderTopWidth: 1,
              borderTopColor: '#3f3950',
              opacity: 0.7,
            }}
          />
        ))}
        {data.datasets.map((dataset, index) => buildSeries(dataset, index))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        {data.labels.map((label) => (
          <Text key={label} style={{ color: '#aaa6b8', fontSize: 10 }}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const COLORS = {
  background: '#100e24',
  sidebar: '#17132d',
  card: '#211d32',
  cardLight: '#29243a',
  border: '#3f3950',
  purple: '#a78bfa',
  purpleDark: '#7c3aed',
  white: '#ffffff',
  muted: '#aaa6b8',
  green: '#5cff87',
  red: '#ff707a',
  orange: '#ffbd69',
  blue: '#7db7ff',
};

const NAV_ITEMS = [
  { label: 'Overview', icon: '◫' },
  { label: 'Security Events', icon: '◉' },
  { label: 'Users', icon: '♙' },
  { label: 'Alerts', icon: '!' },
  { label: 'Settings', icon: '⚙' },
];

type Period = '24H' | '7D' | '30D';

const PERIODS: Period[] = ['24H', '7D', '30D'];

const ACTIVITY_DATA: Record<Period, {
  labels: string[];
  logins: number[];
  blocked: number[];
}> = {
  '24H': {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    logins: [12, 8, 25, 34, 28, 42],
    blocked: [3, 5, 2, 8, 4, 11],
  },
  '7D': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    logins: [120, 160, 145, 210, 185, 240, 198],
    blocked: [12, 18, 9, 27, 15, 35, 21],
  },
  '30D': {
    labels: ['1–5', '6–10', '11–15', '16–20', '21–25', '26–30'],
    logins: [520, 680, 590, 820, 740, 910],
    blocked: [42, 65, 38, 84, 57, 96],
  },
};

//All values will be replaced upon integrating with real data
const METRICS = [
  {
    label: 'Total Users',
    value: '248',
    change: '+12 this month',
    icon: '♙',
    color: COLORS.purple,
  },
  {
    label: 'Login Attempts',
    value: '1,284',
    change: 'Across connected apps',
    icon: '↗',
    color: COLORS.blue,
  },
  {
    label: 'Blocked Attempts',
    value: '37',
    change: 'Requests denied',
    icon: '⊘',
    color: COLORS.green,
  },
  {
    label: 'Security Alerts',
    value: '3',
    change: 'Require review',
    icon: '!',
    color: COLORS.orange,
  },
];

const EVENTS = [
  {
    title: 'Repeated Login Failures',
    description: 'Multiple failed authentication attempts',
    time: '2 min ago',
    severity: 'HIGH',
    color: COLORS.red,
    icon: '!',
  },
  {
    title: 'Authentication Successful',
    description: 'A user session was established',
    time: '5 min ago',
    severity: 'INFO',
    color: COLORS.green,
    icon: '✓',
  },
  {
    title: 'Request Blocked',
    description: 'A request was rejected by a security rule',
    time: '12 min ago',
    severity: 'MEDIUM',
    color: COLORS.orange,
    icon: '⊘',
  },
];

const WEBSITES = [
  {
    name: 'Neo Website',
    domain: 'Neo.example.com',
    status: 'Connected',
    color: COLORS.green,
  },
  {
    name: 'Christian website',
    domain: 'Chris.example.com',
    status: 'Connected',
    color: COLORS.green,
  },
  {
    name: 'Boikanya website',
    domain: 'BK.example.com',
    status: 'Check connection',
    color: COLORS.orange,
  },
];

type SectionHeadingProps = {
  title: string;
  action?: string;
};

function SectionHeading({ title, action }: SectionHeadingProps) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Text style={styles.sectionAction}>{action}</Text>
      ) : null}
    </View>
  );
}

type MetricCardData = {
  label: string;
  value: string;
  change: string;
  icon: string;
  color: string;
};

function MetricCard({ item }: { item: MetricCardData }) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricTop}>
        <Text style={[styles.metricIcon, { color: item.color }]}>
          {item.icon}
        </Text>
        <View
          style={[
            styles.metricDot,
            { backgroundColor: item.color },
          ]}
        />
      </View>

      <Text style={styles.metricValue}>{item.value}</Text>
      <Text style={styles.metricLabel}>{item.label}</Text>
      <Text style={styles.metricChange}>{item.change}</Text>
    </View>
  );
}

type NavigationItemData = {
  label: string;
  icon: string;
};

function NavigationItem({
  item,
  active,
  onPress,
  compact = false,
}: {
  item: NavigationItemData;
  active: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      style={[
        compact ? styles.mobileNavItem : styles.sidebarItem,
        active && (compact ? styles.mobileNavActive : styles.sidebarActive),
      ]}
    >
      <Text
        style={[
          compact ? styles.mobileNavIcon : styles.sidebarIcon,
          active && styles.activeNavText,
        ]}
      >
        {item.icon}
      </Text>

      <Text
        style={[
          compact ? styles.mobileNavLabel : styles.sidebarLabel,
          active && styles.activeNavText,
        ]}
        numberOfLines={1}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

function DashboardChart({
  period,
  setPeriod,
  width,
}: {
  period: Period;
  setPeriod: (value: Period) => void;
  width: number;
}) {
  const activity = ACTIVITY_DATA[period];

  const chartData = {
    labels: activity.labels,
    datasets: [
      {
        data: activity.logins,
        color: () => COLORS.purple,
        strokeWidth: 3,
      },
      {
        data: activity.blocked,
        color: () => COLORS.green,
        strokeWidth: 2,
      },
    ],
    legend: ['Successful logins', 'Blocked attempts'],
  };

  return (
    <View style={styles.panel}>
      <View style={styles.chartHeader}>
        <View style={styles.chartHeadingText}>
          <Text style={styles.panelTitle}>Authentication Activity</Text>
          <Text style={styles.panelSubtitle}>
            Login and blocked-request trends
          </Text>
        </View>
      </View>

      <View style={styles.periodRow}>
        {PERIODS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setPeriod(item)}
            style={[
              styles.periodButton,
              period === item && styles.periodButtonActive,
            ]}
          >
            <Text
              style={[
                styles.periodText,
                period === item && styles.periodTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={chartData}
          width={Math.max(width, 290)}
          height={230}
          fromZero
          bezier
          withInnerLines
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLabels
          withDots
          chartConfig={{
            backgroundColor: COLORS.card,
            backgroundGradientFrom: COLORS.card,
            backgroundGradientTo: COLORS.card,
            decimalPlaces: 0,
            color: (opacity = 1) =>
              `rgba(170, 166, 184, ${opacity})`,
            labelColor: () => COLORS.muted,
            propsForBackgroundLines: {
              stroke: COLORS.border,
              strokeDasharray: '4 5',
            },
            propsForDots: {
              r: '3',
              strokeWidth: '1',
            },
            propsForHorizontalLabels: {
              fontSize: 10,
            },
            propsForVerticalLabels: {
              fontSize: 10,
            },
          }}
          style={styles.chart}
        />
      </ScrollView>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: COLORS.purple }]}
          />
          <Text style={styles.legendText}>Successful logins</Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: COLORS.green }]}
          />
          <Text style={styles.legendText}>Blocked attempts</Text>
        </View>
      </View>

    </View>
  );
}

function RecentEvents() {
  return (
    <View style={styles.panel}>
      <SectionHeading title="Recent Security Events" action="View all" />

      {EVENTS.map((event, index) => (
        <View key={event.title}>
          {index > 0 ? <View style={styles.divider} /> : null}

          <View style={styles.eventRow}>
            <View
              style={[
                styles.eventIconBox,
                { backgroundColor: `${event.color}18` },
              ]}
            >
              <Text style={[styles.eventIcon, { color: event.color }]}>
                {event.icon}
              </Text>
            </View>

            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDescription}>
                {event.description}
              </Text>
              <Text style={styles.eventTime}>{event.time}</Text>
            </View>

            <View
              style={[
                styles.severityBadge,
                { backgroundColor: `${event.color}18` },
              ]}
            >
              <Text style={[styles.severityText, { color: event.color }]}>
                {event.severity}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function SecurityAlerts() {
  return (
    <View style={styles.panel}>
      <SectionHeading title="Security Alerts" action="View all" />

      <View style={styles.alertBanner}>
        <View style={styles.alertIconCircle}>
          <Text style={styles.alertIcon}>!</Text>
        </View>

        <View style={styles.alertInfo}>
          <Text style={styles.alertTitle}>Review required</Text>
          <Text style={styles.alertDescription}>
            There are 3 alerts awaiting investigation.
          </Text>
        </View>
      </View>

    </View>
  );
}

function ConnectedWebsites() {
  return (
    <View style={styles.panel}>
      <SectionHeading title="Connected Websites" action="Manage" />

      {WEBSITES.map((site, index) => (
        <View key={site.domain}>
          {index > 0 ? <View style={styles.divider} /> : null}

          <View style={styles.websiteRow}>
            <View style={styles.websiteIcon}>
              <Text style={styles.websiteIconText}>⌘</Text>
            </View>

            <View style={styles.websiteInfo}>
              <Text style={styles.websiteName}>{site.name}</Text>
              <Text style={styles.websiteDomain}>{site.domain}</Text>
            </View>

            <View style={styles.websiteStatus}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: site.color },
                ]}
              />
              <Text style={[styles.websiteStatusText, { color: site.color }]}>
                {site.status}
              </Text>
            </View>
          </View>
        </View>
      ))}

    </View>
  );
}

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = width >= 1000;
  const isCompact = width < 600;

  const [period, setPeriod] = useState<Period>('7D');
  const [activeNav, setActiveNav] = useState('Overview');
  const [selectedWebsite, setSelectedWebsite] = useState(0);

  const chartWidth = Math.max(
    290,
    Math.min(width - (isWide ? 440 : 64), 680)
  );

  const selectedSite = WEBSITES[selectedWebsite];
  const router = useRouter();

  const ROUTES: Record<string, string> = {
    Overview: '/dashboard',
    'Security Events': '/SecurityEvents',
    Users: '/users',
    Alerts: '/alerts',
    Integrations: '/Integration',
    Settings: '/Settings',
  };

  const renderNavigation = (compact = false) =>
  NAV_ITEMS.filter((item) =>
    compact
      ? ['Overview', 'Security Events', 'Alerts', 'Settings'].includes(
          item.label
        )
      : true
  ).map((item) => (
    <NavigationItem
      key={item.label}
      item={item}
      active={activeNav === item.label}
      onPress={() => {
        setActiveNav(item.label);
        router.push(ROUTES[item.label] as any);
      }}
      compact={compact}
    />
  ));

  return (
    <View style={styles.app}>
      {isWeb && (
        <View style={styles.sidebar}>
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandShield}>🔒︎</Text>
            </View>
            <View>
              <Text style={styles.brandName}>LatchPoint</Text>
              <Text style={styles.brandCaption}>SECURITY PLATFORM</Text>
            </View>
          </View>

          <Text style={styles.navHeading}>WORKSPACE</Text>
          {renderNavigation()}

          <View style={styles.sidebarBottom}>
            <View style={styles.sidebarStatusDot} />
            <View>
              <Text style={styles.sidebarStatusTitle}>Security services</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.main}>
        <View style={styles.topBar}>
          {!isWeb && (
            <View style={styles.mobileBrand}>
              <View style={styles.brandMark}>
                <Text style={styles.brandShield}>⬡</Text>
              </View>
              <Text style={styles.brandName}>LatchPoint</Text>
            </View>
          )}

          <View style={styles.topBarRight}>
            <View style={styles.adminAvatar}>
              <Text style={styles.adminAvatarText}>A</Text>
            </View>
            <View>
              <Text style={styles.adminName}>Admin</Text>
              <Text style={styles.adminRole}>Workspace owner</Text>
            </View>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: isCompact ? 16 : 28 },
          ]}
        >
          <View style={styles.pageHeading}>
            <View style={styles.pageHeadingText}>
              <Text style={styles.eyebrow}>SECURITY OVERVIEW</Text>
              <Text style={styles.pageTitle}>
                {activeNav === 'Overview' ? 'Dashboard' : activeNav}
              </Text>
              <Text style={styles.pageSubtitle}>
                Monitor and manage your connected application's security.
              </Text>
            </View>

          </View>

          <View style={styles.websiteSelector}>
            <View style={styles.siteIdentity}>
              <View style={styles.siteIconBox}>
                <Text style={styles.siteIconText}>⌘</Text>
              </View>
              <View style={styles.siteText}>
                <Text style={styles.siteLabel}>MONITORING WEBSITE</Text>
                <Text style={styles.siteName}>{selectedSite.name}</Text>
                <Text style={styles.siteDomain}>{selectedSite.domain}</Text>
              </View>
            </View>

            <View style={styles.siteRight}>
              <View style={styles.connectionBadge}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: selectedSite.color },
                  ]}
                />
                <Text style={styles.connectionText}>
                  {selectedSite.status}
                </Text>
              </View>

              <View style={styles.siteSwitchRow}>
                {WEBSITES.map((site, index) => (
                  <Pressable
                    key={site.domain}
                    onPress={() => setSelectedWebsite(index)}
                    style={[
                      styles.siteSwitch,
                      selectedWebsite === index && styles.siteSwitchActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.siteSwitchText,
                        selectedWebsite === index &&
                        styles.siteSwitchTextActive,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <SectionHeading title="Security Overview" action="Last 30 days" />

          <View style={styles.metricsGrid}>
            {METRICS.map((item) => (
              <MetricCard key={item.label} item={item} />
            ))}
          </View>

          <View style={styles.primaryGrid}>
            <View style={styles.chartColumn}>
              <DashboardChart
                period={period}
                setPeriod={setPeriod}
                width={chartWidth}
              />
            </View>

            <View style={styles.sideColumn}>
              <View style={styles.panel}>
                <SectionHeading title="Framework Status" action={undefined} />

                <View style={styles.frameworkStatus}>
                  <View style={styles.frameworkStatusIcon}>
                    <Text style={styles.frameworkCheck}>✓</Text>
                  </View>
                  <Text style={styles.frameworkStatusTitle}>
                    Integration overview
                  </Text>
                  <Text style={styles.frameworkStatusDescription}>
                    The dashboard is using sample status data. Live service
                    health has not been verified.
                  </Text>
                </View>

                <View style={styles.frameworkRow}>
                  <Text style={styles.frameworkLabel}>Authentication</Text>
                  <Text style={styles.frameworkRow}></Text>
                </View>
                <View style={styles.frameworkRow}>
                  <Text style={styles.frameworkLabel}>MFA</Text>
                  <Text style={styles.frameworkRow}></Text>
                </View>
                <View style={styles.frameworkRow}>
                  <Text style={styles.frameworkLabel}>Session security</Text>
                  <Text style={styles.frameworkRow}></Text>
                </View>
              </View>

              <SecurityAlerts />
            </View>
          </View>

          <View style={styles.bottomGrid}>
            <View style={styles.bottomGridItem}>
              <RecentEvents />
            </View>
            <View style={styles.bottomGridItem}>
              <ConnectedWebsites />
            </View>
          </View>

          <Text style={styles.footer}>
            LatchPoint · Security monitoring dashboard
          </Text>
        </ScrollView>

        {!isWeb && (
          <View style={styles.bottomNav}>
            {renderNavigation(true)}
          </View>
        )}
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    minHeight: '100%',
  },

  sidebar: {
    width: 235,
    backgroundColor: COLORS.sidebar,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingHorizontal: 18,
    paddingTop: 30,
    paddingBottom: 20,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 45,
    paddingHorizontal: 4,
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#302451',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#57417d',
  },
  brandShield: {
    fontSize: 25,
    color: COLORS.purple,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  brandCaption: {
    color: COLORS.muted,
    fontSize: 9,
    letterSpacing: 1.4,
    marginTop: 3,
  },
  navHeading: {
    color: '#777188',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 10,
  },
  sidebarItem: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  sidebarActive: {
    backgroundColor: '#302451',
    borderWidth: 1,
    borderColor: '#49366c',
  },
  sidebarIcon: {
    width: 20,
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 18,
  },
  sidebarLabel: {
    color: COLORS.muted,
    fontSize: 13,
    flex: 1,
  },
  activeNavText: {
    color: COLORS.purple,
    fontWeight: '700',
  },
  sidebarBottom: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 13,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sidebarStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.orange,
  },
  sidebarStatusTitle: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
  sidebarStatusSubtitle: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 3,
  },

  main: {
    flex: 1,
    minWidth: 0,
  },
  topBar: {
    minHeight: 76,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    gap: 12,
  },
  mobileBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topBarRight: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  adminAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b2d57',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#624b89',
  },
  adminAvatarText: {
    color: COLORS.purple,
    fontWeight: '800',
    fontSize: 14,
  },
  adminName: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  adminRole: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 3,
  },
  content: {
    paddingTop: 28,
    paddingBottom: 40,
  },
  pageHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  pageHeadingText: {
    flex: 1,
  },
  eyebrow: {
    color: COLORS.purple,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 8,
  },
  pageTitle: {
    color: COLORS.white,
    fontSize: 29,
    fontWeight: '800',
  },
  pageSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 9,
    backgroundColor: '#29243a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  liveBadgeText: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  websiteSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 18,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 27,
  },
  siteIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    flex: 1,
    minWidth: 175,
  },
  siteIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#302451',
    alignItems: 'center',
    justifyContent: 'center',
  },
  siteIconText: {
    color: COLORS.purple,
    fontSize: 23,
  },
  siteText: {
    flex: 1,
  },
  siteLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 5,
  },
  siteName: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  siteDomain: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  siteRight: {
    alignItems: 'flex-end',
    gap: 10,
  },
  connectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  connectionText: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: '700',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },
  siteSwitchRow: {
    flexDirection: 'row',
    gap: 5,
  },
  siteSwitch: {
    width: 25,
    height: 25,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  siteSwitchActive: {
    backgroundColor: '#3b2d57',
    borderColor: COLORS.purpleDark,
  },
  siteSwitchText: {
    color: COLORS.muted,
    fontSize: 10,
  },
  siteSwitchTextActive: {
    color: COLORS.purple,
    fontWeight: '800',
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  sectionAction: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  metricCard: {
    flexBasis: 0,
    flexGrow: 1,
    minWidth: 140,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    padding: 17,
  },
  metricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricIcon: {
    fontSize: 22,
    fontWeight: '700',
  },
  metricDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  metricValue: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  metricLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
  },
  metricChange: {
    color: '#8d879f',
    fontSize: 10,
    marginTop: 12,
  },

  primaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 18,
    marginBottom: 20,
  },
  chartColumn: {
    flexGrow: 2,
    flexBasis: 400,
    minWidth: 0,
  },
  sideColumn: {
    flexGrow: 1,
    flexBasis: 270,
    minWidth: 0,
    gap: 18,
  },
  panel: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 18,
    minWidth: 0,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartHeadingText: {
    gap: 5,
  },
  panelTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  panelSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
  },
  periodRow: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: 5,
    padding: 4,
    backgroundColor: COLORS.background,
    borderRadius: 9,
    marginBottom: 12,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#3b2d57',
  },
  periodText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  periodTextActive: {
    color: COLORS.purple,
  },
  chart: {
    borderRadius: 10,
    marginLeft: -8,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    color: COLORS.muted,
    fontSize: 10,
  },

  frameworkStatus: {
    alignItems: 'flex-start',
    marginBottom: 17,
  },
  frameworkStatusIcon: {
    width: 33,
    height: 33,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#302451',
    marginBottom: 12,
  },
  frameworkCheck: {
    color: COLORS.purple,
    fontSize: 17,
    fontWeight: '800',
  },
  frameworkStatusTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  frameworkStatusDescription: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },
  frameworkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 12,
    gap: 8,
  },
  frameworkLabel: {
    color: COLORS.muted,
    fontSize: 11,
    flex: 1,
  },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 13,
    backgroundColor: '#342a35',
    borderWidth: 1,
    borderColor: '#58404b',
    borderRadius: 11,
  },
  alertIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#51303a',
  },
  alertIcon: {
    color: COLORS.orange,
    fontSize: 17,
    fontWeight: '800',
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  alertDescription: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5,
  },
  panelFootnote: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 13,
  },

  bottomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    alignItems: 'flex-start',
  },
  bottomGridItem: {
    flexGrow: 1,
    flexBasis: 330,
    minWidth: 0,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 15,
  },
  eventIconBox: {
    width: 31,
    height: 31,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventIcon: {
    fontSize: 15,
    fontWeight: '800',
  },
  eventInfo: {
    flex: 1,
    minWidth: 0,
  },
  eventTitle: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
  },
  eventDescription: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  eventTime: {
    color: '#827b94',
    fontSize: 9,
    marginTop: 6,
  },
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 5,
  },
  severityText: {
    fontSize: 8,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  websiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  websiteIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: COLORS.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  websiteIconText: {
    color: COLORS.purple,
    fontSize: 19,
  },
  websiteInfo: {
    flex: 1,
    minWidth: 0,
  },
  websiteName: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  websiteDomain: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 4,
  },
  websiteStatus: {
    alignItems: 'flex-end',
    gap: 5,
  },
  websiteStatusText: {
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'right',
  },

  footer: {
    color: '#777188',
    textAlign: 'center',
    fontSize: 10,
    marginTop: 15,
    paddingVertical: 15,
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.sidebar,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  mobileNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: 9,
    marginHorizontal: 2,
  },
  mobileNavActive: {
    backgroundColor: '#302451',
  },
  mobileNavIcon: {
    color: COLORS.muted,
    fontSize: 18,
    fontWeight: '700',
  },
  mobileNavLabel: {
    color: COLORS.muted,
    fontSize: 9,
  },
});
