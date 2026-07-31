import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getAdminStats, getAdminUserCount } from "../../api/admin";
import { colors } from "../../constants/globalStyles";
import { getRole } from "../../utils/token";

export default function AdminDashboard() {
  const router = useRouter();
  const isAdmin = getRole() === "ADMIN";

  const [stats, setStats] = React.useState<any>(null);
  const [userCount, setUserCount] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    const load = async () => {
      try {
        const [s, u] = await Promise.all([getAdminStats(), getAdminUserCount()]);
        setStats(s);
        setUserCount(u);
      } catch {
        setStats(null);
        setUserCount(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyStateIcon}>
          <Text style={styles.emptyStateIconText}>🔒</Text>
        </View>
        <Text style={styles.title}>Admin Access Only</Text>
        <Text style={styles.subtitle}>Please log in with an admin account to continue.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome back, Administrator</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blueDark} />
          <Text style={styles.loadingText}>Loading dashboard data...</Text>
        </View>
      ) : (
        <>
          {/* Primary Stats Grid */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionLabel}>📊 Key Metrics</Text>
            <View style={styles.statsGrid}>
              <StatCard 
                icon="👥"
                label="Total Users" 
                value={stats?.totalUsers ?? userCount?.total ?? 0}
                accentColor={colors.blueDark}
              />
              <StatCard 
                icon="👕"
                label="Clothes Added" 
                value={stats?.totalClothes ?? 0}
                accentColor={colors.blue}
              />
              <StatCard 
                icon="📈"
                label="App Uses" 
                value={stats?.usageCount ?? 0}
                accentColor={colors.accent}
              />
              <StatCard 
                icon="⭐"
                label="Reviews" 
                value={stats?.totalReviews ?? 0}
                accentColor="#F5A623"
              />
            </View>
          </View>

          {/* User Role Breakdown */}
          {userCount && (
            <View style={styles.breakdownSection}>
              <Text style={styles.sectionLabel}>👤 User Distribution</Text>
              <View style={styles.breakdownContainer}>
                <BreakdownCard
                  icon="👥"
                  label="Regular Users"
                  value={userCount.userCount ?? userCount.users ?? 0}
                  color={colors.blue}
                  percentage={Math.round(((userCount.userCount ?? userCount.users ?? 0) / (stats?.totalUsers ?? 1)) * 100)}
                />
                <BreakdownCard
                  icon="🔑"
                  label="Admins"
                  value={userCount.adminCount ?? userCount.admins ?? 0}
                  color={colors.bgDark}
                  percentage={Math.round(((userCount.adminCount ?? userCount.admins ?? 0) / (stats?.totalUsers ?? 1)) * 100)}
                />
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionLabel}>⚙️ Management</Text>
            <Pressable 
              style={styles.actionCard} 
              onPress={() => router.push("/admin/users" as any)}
            >
              <View style={styles.actionCardContent}>
                <Text style={styles.actionCardIcon}>👥</Text>
                <View style={styles.actionCardText}>
                  <Text style={styles.actionCardTitle}>Manage Users</Text>
                  <Text style={styles.actionCardDesc}>Edit, delete, and email users</Text>
                </View>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </Pressable>

            <Pressable 
              style={styles.actionCard} 
              onPress={() => router.push("/admin/reviews" as any)}
            >
              <View style={styles.actionCardContent}>
                <Text style={styles.actionCardIcon}>⭐</Text>
                <View style={styles.actionCardText}>
                  <Text style={styles.actionCardTitle}>Review History</Text>
                  <Text style={styles.actionCardDesc}>View and reply to user reviews</Text>
                </View>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </Pressable>

            <Pressable
              style={[styles.actionCard, styles.customerViewCardBg]}
              onPress={() => router.push("/(tabs)/mainMenu" as any)}
            >
              <View style={styles.actionCardContent}>
                <Text style={styles.actionCardIcon}>🛍️</Text>
                <View style={styles.actionCardText}>
                  <Text style={[styles.actionCardTitle, styles.customerViewCardText]}>Customer View</Text>
                  <Text style={[styles.actionCardDesc, styles.customerViewCardDesc]}>Switch to customer perspective</Text>
                </View>
              </View>
              <Text style={[styles.actionArrow, styles.customerViewCardText]}>→</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  accentColor 
}: { 
  icon: string;
  label: string; 
  value: any;
  accentColor: string;
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardIconBg, { backgroundColor: accentColor + "15" }]}>
        <Text style={styles.cardIcon}>{icon}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

function BreakdownCard({ 
  icon,
  label, 
  value, 
  color,
  percentage
}: { 
  icon: string;
  label: string; 
  value: any; 
  color: string;
  percentage: number;
}) {
  return (
    <View style={styles.breakdownCard}>
      <View style={styles.breakdownHeader}>
        <Text style={styles.breakdownIcon}>{icon}</Text>
        <View style={styles.breakdownInfo}>
          <Text style={styles.breakdownLabel}>{label}</Text>
          <Text style={styles.breakdownValue}>{value} users</Text>
        </View>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.percentageText, { color }]}>{percentage}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  center: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 20, 
    backgroundColor: colors.bg 
  },

  // Header
  header: { marginBottom: 28, marginTop: 8 },
  title: { 
    fontSize: 32, 
    fontWeight: "900", 
    color: colors.text, 
    marginBottom: 4 
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: colors.muted,
    fontWeight: "500"
  },

  // Empty State
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyStateIconText: { fontSize: 40 },
  subtitle: { 
    color: colors.muted, 
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20
  },

  // Loading
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    color: colors.muted,
    marginTop: 16,
    fontSize: 14,
  },

  // Sections
  statsSection: { marginBottom: 32 },
  breakdownSection: { marginBottom: 32 },
  actionsSection: { marginBottom: 20 },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 14,
  },

  // Stats Grid
  statsGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 12,
  },
  card: { 
    flex: 1,
    minWidth: "47%",
    backgroundColor: colors.card, 
    borderRadius: 18, 
    padding: 16,
    alignItems: "center",
    shadowColor: colors.text,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardIcon: { fontSize: 24 },
  cardValue: { 
    fontSize: 26, 
    fontWeight: "900", 
    color: colors.text,
    marginTop: 4
  },
  cardLabel: { 
    color: colors.muted, 
    marginTop: 6, 
    fontSize: 12,
    fontWeight: "600"
  },

  // Breakdown
  breakdownContainer: { gap: 12 },
  breakdownCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    shadowColor: colors.text,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  breakdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  breakdownIcon: { fontSize: 24 },
  breakdownInfo: { flex: 1 },
  breakdownLabel: { 
    fontSize: 12, 
    color: colors.muted,
    fontWeight: "600",
    marginBottom: 2
  },
  breakdownValue: { 
    fontSize: 18, 
    fontWeight: "900", 
    color: colors.text 
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.input,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
  },

  // Actions
  actionCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: colors.text,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  customerViewCardBg: {
    backgroundColor: colors.accent,
    marginBottom: 0,
  },
  customerViewCardText: {
    color: colors.white,
  },
  customerViewCardDesc: {
    color: colors.white + "CC",
  },
  actionCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  actionCardIcon: { 
    fontSize: 28,
  },
  actionCardText: { flex: 1, gap: 2 },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  actionCardDesc: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "500",
  },
  actionArrow: {
    fontSize: 20,
    color: colors.muted,
    fontWeight: "600",
  },
});
