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
        <Text style={styles.title}>Admin access only</Text>
        <Text style={styles.muted}>Please log in with an admin account.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Admin Dashboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.blueDark} style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* App-wide stats */}
          <Text style={styles.sectionLabel}>App Stats</Text>
          <View style={styles.grid}>
            <StatCard label="Total Users" value={stats?.totalUsers ?? userCount?.total ?? 0} />
            <StatCard label="Clothes Added" value={stats?.totalClothes ?? 0} />
            <StatCard label="App Uses" value={stats?.usageCount ?? 0} />
            <StatCard label="Reviews" value={stats?.totalReviews ?? 0} />
          </View>

          {/* User role breakdown */}
          {userCount && (
            <>
              <Text style={styles.sectionLabel}>Users by Role</Text>
              <View style={styles.breakdownRow}>
                <BreakdownCard
                  label="Regular users"
                  value={userCount.userCount ?? userCount.users ?? 0}
                  color={colors.blue}
                />
                <BreakdownCard
                  label="Admins"
                  value={userCount.adminCount ?? userCount.admins ?? 0}
                  color={colors.bgDark}
                />
              </View>
            </>
          )}
        </>
      )}

      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={() => router.push("/admin/users" as any)}>
          <Text style={styles.buttonText}>Manage Users</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push("/admin/reviews" as any)}>
          <Text style={styles.buttonText}>Review History</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.customerViewButton]}
          onPress={() => router.push("/(tabs)/mainMenu" as any)}
        >
          <Text style={styles.buttonText}>Customer View</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

function BreakdownCard({ label, value, color }: { label: string; value: any; color: string }) {
  return (
    <View style={[styles.breakdownCard, { borderLeftColor: color }]}>
      <Text style={[styles.breakdownValue, { color }]}>{value}</Text>
      <Text style={styles.breakdownLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: colors.bg },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 16 },
  muted: { color: colors.muted, marginTop: 6 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 18, width: "47%" },
  cardValue: { fontSize: 28, fontWeight: "800", color: colors.blueDark },
  cardLabel: { color: colors.muted, marginTop: 4, fontSize: 13 },

  breakdownRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  breakdownCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
  },
  breakdownValue: { fontSize: 32, fontWeight: "800" },
  breakdownLabel: { color: colors.muted, marginTop: 4, fontSize: 13 },

  actions: { gap: 10 },
  button: {
    backgroundColor: colors.bgDark,
    borderRadius: 999,
    padding: 14,
    alignItems: "center",
  },
  customerViewButton: { backgroundColor: colors.blueDark },
  buttonText: { color: colors.white, fontWeight: "800" },
});
