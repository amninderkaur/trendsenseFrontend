import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getAdminStats } from "../../api/admin";
import { colors } from "../../constants/globalStyles";
import { getRole } from "../../utils/token";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const isAdmin = getRole() === "ADMIN";

  React.useEffect(() => {
    const load = async () => {
      try { setStats(await getAdminStats()); } catch { setStats(null); } finally { setLoading(false); }
    };
    if (isAdmin) load(); else setLoading(false);
  }, [isAdmin]);

  if (!isAdmin) {
    return <View style={styles.center}><Text style={styles.title}>Admin access only</Text><Text>Please log in with the admin email.</Text></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Admin Dashboard</Text>
      {loading ? <ActivityIndicator /> : (
        <View style={styles.grid}>
          <Card label="Total Users" value={stats?.totalUsers ?? 0} />
          <Card label="Clothes Added" value={stats?.totalClothes ?? 0} />
          <Card label="App Usage" value={stats?.usageCount ?? 0} />
          <Card label="Reviews" value={stats?.totalReviews ?? 0} />
        </View>
      )}
      <Pressable style={styles.button} onPress={() => router.push("/admin/users" as any)}><Text style={styles.buttonText}>Manage Users</Text></Pressable>
      <Pressable style={styles.button} onPress={() => router.push("/admin/reviews" as any)}><Text style={styles.buttonText}>Review History</Text></Pressable>
      <Pressable style={[styles.button, styles.customerViewButton]} onPress={() => router.push("/(tabs)/mainMenu" as any)}>
        <Text style={styles.buttonText}>Customer View</Text>
      </Pressable>
    </ScrollView>
  );
}

function Card({ label, value }: { label: string; value: any }) {
  return <View style={styles.card}><Text style={styles.cardValue}>{value}</Text><Text style={styles.cardLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: colors.bg },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 18, width: "47%" },
  cardValue: { fontSize: 28, fontWeight: "800", color: colors.blueDark },
  cardLabel: { color: colors.muted, marginTop: 4 },
  button: { backgroundColor: colors.bgDark, borderRadius: 999, padding: 14, alignItems: "center", marginBottom: 10 },
  customerViewButton: { backgroundColor: colors.blueDark, marginTop: 10 },
  buttonText: { color: colors.white, fontWeight: "800" },
});
