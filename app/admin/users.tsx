import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  deleteAdminUser,
  getAdminUsers,
  sendEmailToUser,
  updateAdminUser,
} from "../../api/admin";
import { colors } from "../../constants/globalStyles";
import { getRole } from "../../utils/token";

type User = {
  id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  clothesCount?: number;
  usageCount?: number;
};

type EditState = {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
};

type EmailState = {
  subject: string;
  content: string;
};

export default function AdminUsers() {
  const router = useRouter();

  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Which user card is in edit / email mode
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState<EditState>({ name: "", email: "", phoneNumber: "", role: "USER" });
  const [saving, setSaving] = React.useState(false);

  const [emailingId, setEmailingId] = React.useState<string | null>(null);
  const [emailForm, setEmailForm] = React.useState<EmailState>({ subject: "", content: "" });
  const [sending, setSending] = React.useState(false);

  if (getRole() !== "ADMIN") {
    return (
      <View style={styles.center}>
        <Text style={styles.accessDenied}>Access denied.</Text>
      </View>
    );
  }

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : data?.users ?? []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { loadUsers(); }, []);

  const openEdit = (user: User) => {
    setEmailingId(null);
    setEditingId(user.id);
    setEditForm({
      name: user.name ?? "",
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
      role: user.role ?? "USER",
    });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const payload: Partial<EditState> = {};
      if (editForm.name.trim()) payload.name = editForm.name.trim();
      if (editForm.email.trim()) payload.email = editForm.email.trim();
      if (editForm.phoneNumber.trim()) payload.phoneNumber = editForm.phoneNumber.trim();
      if (editForm.role) payload.role = editForm.role;

      await updateAdminUser(id, payload);
      setEditingId(null);
      await loadUsers();
    } catch {
      Alert.alert("Error", "Could not update user. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string, email?: string) => {
    Alert.alert(
      "Delete user",
      `Permanently delete ${email ?? "this user"} and all their data?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAdminUser(id);
              await loadUsers();
            } catch {
              Alert.alert("Error", "Could not delete user.");
            }
          },
        },
      ]
    );
  };

  const openEmail = (user: User) => {
    setEditingId(null);
    setEmailingId(user.id);
    setEmailForm({ subject: "", content: "" });
  };

  const cancelEmail = () => setEmailingId(null);

  const sendEmail = async (id: string) => {
    if (!emailForm.subject.trim() || !emailForm.content.trim()) {
      Alert.alert("Required", "Please fill in both subject and message.");
      return;
    }
    setSending(true);
    try {
      await sendEmailToUser(id, emailForm.subject.trim(), emailForm.content.trim());
      Alert.alert("Sent", "Email sent successfully.");
      setEmailingId(null);
    } catch {
      Alert.alert("Error", "Could not send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Manage Users</Text>
      <Text style={styles.subtitle}>{users.length} user{users.length !== 1 ? "s" : ""} total</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.blueDark} style={{ marginTop: 40 }} />
      ) : users.length === 0 ? (
        <Text style={styles.empty}>No users found.</Text>
      ) : (
        users.map((user) => {
          const id = user.id;
          const isEditing = editingId === id;
          const isEmailing = emailingId === id;

          return (
            <View key={id} style={styles.card}>
              {/* User info */}
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(user.name || user.email || "?").charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.userName}>{user.name ?? "—"}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <View style={[styles.roleBadge, user.role === "ADMIN" && styles.roleBadgeAdmin]}>
                    <Text style={styles.roleBadgeText}>{user.role ?? "USER"}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.statsRow}>
                {user.phoneNumber ? (
                  <Text style={styles.statText}>📞 {user.phoneNumber}</Text>
                ) : null}
                <Text style={styles.statText}>👕 {user.clothesCount ?? 0} clothes</Text>
                <Text style={styles.statText}>📊 {user.usageCount ?? 0} uses</Text>
              </View>

              {/* Edit form */}
              {isEditing && (
                <View style={styles.form}>
                  <Text style={styles.formTitle}>Edit user</Text>

                  <Text style={styles.fieldLabel}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.name}
                    onChangeText={(v) => setEditForm((p) => ({ ...p, name: v }))}
                    placeholder="Display name"
                    placeholderTextColor={colors.muted}
                  />

                  <Text style={styles.fieldLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.email}
                    onChangeText={(v) => setEditForm((p) => ({ ...p, email: v }))}
                    placeholder="Email address"
                    placeholderTextColor={colors.muted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <Text style={styles.fieldLabel}>Phone number</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.phoneNumber}
                    onChangeText={(v) => setEditForm((p) => ({ ...p, phoneNumber: v }))}
                    placeholder="e.g. +1 416 555 0100"
                    placeholderTextColor={colors.muted}
                    keyboardType="phone-pad"
                  />

                  <Text style={styles.fieldLabel}>Role</Text>
                  <View style={styles.roleToggleRow}>
                    {["USER", "ADMIN"].map((r) => (
                      <Pressable
                        key={r}
                        style={[styles.roleToggle, editForm.role === r && styles.roleToggleActive]}
                        onPress={() => setEditForm((p) => ({ ...p, role: r }))}
                      >
                        <Text style={[styles.roleToggleText, editForm.role === r && styles.roleToggleTextActive]}>
                          {r}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <View style={styles.formActions}>
                    <Pressable style={styles.cancelButton} onPress={cancelEdit}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.saveButton, saving && { opacity: 0.6 }]}
                      onPress={() => saveEdit(id)}
                      disabled={saving}
                    >
                      {saving
                        ? <ActivityIndicator color={colors.white} />
                        : <Text style={styles.saveButtonText}>Save changes</Text>}
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Email form */}
              {isEmailing && (
                <View style={styles.form}>
                  <Text style={styles.formTitle}>Send email to {user.name ?? user.email}</Text>

                  <Text style={styles.fieldLabel}>Subject</Text>
                  <TextInput
                    style={styles.input}
                    value={emailForm.subject}
                    onChangeText={(v) => setEmailForm((p) => ({ ...p, subject: v }))}
                    placeholder="Email subject"
                    placeholderTextColor={colors.muted}
                  />

                  <Text style={styles.fieldLabel}>Message</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={emailForm.content}
                    onChangeText={(v) => setEmailForm((p) => ({ ...p, content: v }))}
                    placeholder="Write your message..."
                    placeholderTextColor={colors.muted}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                  />

                  <View style={styles.formActions}>
                    <Pressable style={styles.cancelButton} onPress={cancelEmail}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.saveButton, sending && { opacity: 0.6 }]}
                      onPress={() => sendEmail(id)}
                      disabled={sending}
                    >
                      {sending
                        ? <ActivityIndicator color={colors.white} />
                        : <Text style={styles.saveButtonText}>Send email</Text>}
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Action buttons (hide while a form is open for this card) */}
              {!isEditing && !isEmailing && (
                <View style={styles.actionRow}>
                  <Pressable style={styles.actionButton} onPress={() => openEdit(user)}>
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </Pressable>
                  <Pressable style={styles.actionButton} onPress={() => openEmail(user)}>
                    <Text style={styles.actionButtonText}>Email</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => confirmDelete(id, user.email)}
                  >
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
  accessDenied: { fontSize: 18, color: colors.muted },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.bgDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 12,
  },
  backButtonText: { color: colors.white, fontWeight: "700" },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 2 },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: 16 },
  empty: { color: colors.muted, marginTop: 40, textAlign: "center" },

  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    gap: 12,
  },
  cardHeader: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blueDark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.white, fontWeight: "800", fontSize: 18 },
  cardMeta: { flex: 1, gap: 2 },
  userName: { fontSize: 15, fontWeight: "700", color: colors.text },
  userEmail: { fontSize: 13, color: colors.muted },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.input,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginTop: 4,
  },
  roleBadgeAdmin: { backgroundColor: colors.bgDark },
  roleBadgeText: { fontSize: 11, fontWeight: "700", color: colors.text },

  statsRow: { flexDirection: "row", gap: 14, flexWrap: "wrap" },
  statText: { fontSize: 13, color: colors.muted },

  form: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.input,
  },
  formTitle: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 6 },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: colors.muted, marginTop: 6, marginBottom: 2 },
  input: {
    backgroundColor: colors.bg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.input,
    color: colors.text,
    fontSize: 14,
  },
  textArea: { minHeight: 100 },

  roleToggleRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  roleToggle: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.input,
    alignItems: "center",
    backgroundColor: colors.bg,
  },
  roleToggleActive: { backgroundColor: colors.bgDark, borderColor: colors.bgDark },
  roleToggleText: { fontWeight: "700", color: colors.muted },
  roleToggleTextActive: { color: colors.white },

  formActions: { flexDirection: "row", gap: 10, marginTop: 12 },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.input,
    alignItems: "center",
  },
  cancelButtonText: { color: colors.muted, fontWeight: "600" },
  saveButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.bgDark,
    alignItems: "center",
  },
  saveButtonText: { color: colors.white, fontWeight: "700" },

  actionRow: { flexDirection: "row", gap: 8 },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.bgDark,
    alignItems: "center",
  },
  actionButtonText: { color: colors.text, fontWeight: "600", fontSize: 13 },
  deleteButton: { borderColor: "#d9534f" },
  deleteButtonText: { color: "#d9534f" },
});
