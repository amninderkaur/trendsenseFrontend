import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { deleteAdminUser, getAdminUsers, updateAdminUser } from "../../api/admin";
import { colors } from "../../constants/globalStyles";
import { getRole } from "../../utils/token";

export default function AdminUsers() {
  const router = useRouter();

  if (getRole() !== "ADMIN") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <Text style={{ fontSize: 18, color: colors.muted }}>Access denied.</Text>
      </View>
    );
  }
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editEmail, setEditEmail] = React.useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : data?.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { loadUsers(); }, []);

  const remove = async (id: string) => {
    try {
      await deleteAdminUser(id);
      await loadUsers();
    } catch {
      Alert.alert("Error", "Could not delete user.");
    }
  };

  const save = async (id: string) => {
    try {
      await updateAdminUser(id, { email: editEmail });
      setEditingId(null);
      await loadUsers();
    } catch {
      Alert.alert("Error", "Could not update user.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => router.back()}><Text style={styles.backButtonText}>← Back</Text></Pressable>
      <Text style={styles.title}>Manage Users</Text>
      {loading ? <ActivityIndicator /> : users.map((user) => {
        const id = user.id || user._id || user.userId;
        return (
          <View key={id} style={styles.card}>
            <Text style={styles.label}>ID: {id}</Text>
            <Text style={styles.label}>Email: {user.email}</Text>
            <Text style={styles.label}>Clothes Added: {user.clothesCount ?? user.totalClothes ?? 0}</Text>
            <Text style={styles.label}>Usage: {user.usageCount ?? 0}</Text>
            {editingId === id ? (
              <>
                <TextInput style={styles.input} value={editEmail} onChangeText={setEditEmail} placeholder="Email" />
                <Pressable style={styles.button} onPress={() => save(id)}><Text style={styles.buttonText}>Save Changes</Text></Pressable>
              </>
            ) : (
              <Pressable style={styles.button} onPress={() => { setEditingId(id); setEditEmail(user.email || ""); }}><Text style={styles.buttonText}>Edit Account</Text></Pressable>
            )}
            <Pressable style={[styles.button, styles.deleteButton]} onPress={() => remove(id)}><Text style={styles.buttonText}>Delete Account</Text></Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  backButton: { alignSelf: "flex-start", backgroundColor: colors.bgDark, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, marginBottom: 12 },
  backButtonText: { color: colors.white, fontWeight: "700" },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 16 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 16, marginBottom: 12 },
  label: { color: colors.text, marginBottom: 6, fontWeight: "600" },
  input: { backgroundColor: colors.white, borderRadius: 12, padding: 12, marginVertical: 8, borderWidth: 1, borderColor: colors.input },
  button: { backgroundColor: colors.bgDark, borderRadius: 999, padding: 12, alignItems: "center", marginTop: 8 },
  deleteButton: { backgroundColor: "#d9534f" },
  buttonText: { color: colors.white, fontWeight: "800" },
});
