import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
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

  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; email?: string } | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  if (getRole() !== "ADMIN") {
    return (
      <View style={styles.center}>
        <View style={styles.emptyStateIcon}>
          <Text style={styles.emptyStateIconText}>🔒</Text>
        </View>
        <Text style={styles.deniedTitle}>Access Denied</Text>
        <Text style={styles.deniedText}>Admin access required to view this page.</Text>
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
    setDeleteError(null);
    setDeleteTarget({ id, email });
  };

  const cancelDelete = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const runDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAdminUser(deleteTarget.id);
      setDeleteTarget(null);
      await loadUsers();
    } catch {
      setDeleteError("Could not delete user. Please try again.");
    } finally {
      setDeleting(false);
    }
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
      Alert.alert("Success", "Email sent successfully! ✓");
      setEmailingId(null);
      setEmailForm({ subject: "", content: "" });
    } catch {
      Alert.alert("Error", "Could not send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Dashboard</Text>
      </Pressable>

      <View style={styles.headerSection}>
        <View>
          <Text style={styles.title}>Manage Users</Text>
          <Text style={styles.subtitle}>Control and manage all user accounts</Text>
        </View>
        <View style={styles.userCountBadge}>
          <Text style={styles.userCountIcon}>👥</Text>
          <Text style={styles.userCountText}>{users.length}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blueDark} />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No Users Found</Text>
          <Text style={styles.emptyText}>There are no users to manage at the moment.</Text>
        </View>
      ) : (
        users.map((user, index) => {
          const id = user.id;
          const isEditing = editingId === id;
          const isEmailing = emailingId === id;

          return (
            <View key={id} style={styles.card}>
              {/* User Header */}
              <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(user.name || user.email || "?").charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{user.name ?? "No Name"}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <View style={[styles.roleBadge, user.role === "ADMIN" && styles.roleBadgeAdmin]}>
                      <Text style={styles.roleBadgeText}>
                        {user.role === "ADMIN" ? "🔑 Admin" : "👤 User"}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.userIndex}>#{index + 1}</Text>
              </View>

              {/* User Stats */}
              <View style={styles.statsContainer}>
                {user.phoneNumber && (
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>📞</Text>
                    <View style={styles.statContent}>
                      <Text style={styles.statLabel}>Phone</Text>
                      <Text style={styles.statValue}>{user.phoneNumber}</Text>
                    </View>
                  </View>
                )}
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>👕</Text>
                  <View style={styles.statContent}>
                    <Text style={styles.statLabel}>Clothes</Text>
                    <Text style={styles.statValue}>{user.clothesCount ?? 0}</Text>
                  </View>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>📊</Text>
                  <View style={styles.statContent}>
                    <Text style={styles.statLabel}>Uses</Text>
                    <Text style={styles.statValue}>{user.usageCount ?? 0}</Text>
                  </View>
                </View>
              </View>

              {/* Edit Form */}
              {isEditing && (
                <View style={styles.form}>
                  <View style={styles.formHeader}>
                    <Text style={styles.formIcon}>✏️</Text>
                    <Text style={styles.formTitle}>Edit User Profile</Text>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      value={editForm.name}
                      onChangeText={(v) => setEditForm((p) => ({ ...p, name: v }))}
                      placeholder="Enter user's display name"
                      placeholderTextColor={colors.muted}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Email Address</Text>
                    <TextInput
                      style={styles.input}
                      value={editForm.email}
                      onChangeText={(v) => setEditForm((p) => ({ ...p, email: v }))}
                      placeholder="user@example.com"
                      placeholderTextColor={colors.muted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      value={editForm.phoneNumber}
                      onChangeText={(v) => setEditForm((p) => ({ ...p, phoneNumber: v }))}
                      placeholder="e.g. +1 416 555 0100"
                      placeholderTextColor={colors.muted}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>User Role</Text>
                    <View style={styles.roleToggleRow}>
                      {["USER", "ADMIN"].map((r) => (
                        <Pressable
                          key={r}
                          style={[
                            styles.roleToggle,
                            editForm.role === r && styles.roleToggleActive,
                          ]}
                          onPress={() => setEditForm((p) => ({ ...p, role: r }))}
                        >
                          <Text style={styles.roleToggleIcon}>
                            {r === "ADMIN" ? "🔑" : "👤"}
                          </Text>
                          <Text
                            style={[
                              styles.roleToggleText,
                              editForm.role === r && styles.roleToggleTextActive,
                            ]}
                          >
                            {r}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
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
                      {saving ? (
                        <ActivityIndicator color={colors.white} />
                      ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Email Form */}
              {isEmailing && (
                <View style={styles.form}>
                  <View style={styles.formHeader}>
                    <Text style={styles.formIcon}>✉️</Text>
                    <Text style={styles.formTitle}>Send Email to {user.name ?? "User"}</Text>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Subject</Text>
                    <TextInput
                      style={styles.input}
                      value={emailForm.subject}
                      onChangeText={(v) => setEmailForm((p) => ({ ...p, subject: v }))}
                      placeholder="Email subject"
                      placeholderTextColor={colors.muted}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Message</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={emailForm.content}
                      onChangeText={(v) => setEmailForm((p) => ({ ...p, content: v }))}
                      placeholder="Write your message here..."
                      placeholderTextColor={colors.muted}
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                    />
                  </View>

                  <View style={styles.formActions}>
                    <Pressable style={styles.cancelButton} onPress={cancelEmail}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.saveButton, sending && { opacity: 0.6 }]}
                      onPress={() => sendEmail(id)}
                      disabled={sending}
                    >
                      {sending ? (
                        <ActivityIndicator color={colors.white} />
                      ) : (
                        <Text style={styles.saveButtonText}>Send Email</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              {!isEditing && !isEmailing && (
                <View style={styles.actionRow}>
                  <Pressable
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => openEdit(user)}
                  >
                    <Text style={styles.actionButtonIcon}>✏️</Text>
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.emailButton]}
                    onPress={() => openEmail(user)}
                  >
                    <Text style={styles.actionButtonIcon}>✉️</Text>
                    <Text style={styles.actionButtonText}>Email</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => confirmDelete(id, user.email)}
                  >
                    <Text style={styles.actionButtonIcon}>🗑️</Text>
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })
      )}

      <Modal
        visible={!!deleteTarget}
        transparent
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Text style={styles.modalIcon}>🗑️</Text>
            </View>
            <Text style={styles.modalTitle}>Delete User</Text>
            <Text style={styles.modalMessage}>
              Permanently delete {deleteTarget?.email ?? "this user"} and all their data?{"\n\n"}
              This action cannot be undone.
            </Text>
            {deleteError && <Text style={styles.modalErrorText}>{deleteError}</Text>}
            <View style={styles.formActions}>
              <Pressable style={styles.cancelButton} onPress={cancelDelete} disabled={deleting}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.deleteConfirmButton, deleting && { opacity: 0.6 }]}
                onPress={runDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },

  // Empty/Access States
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
  deniedTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },
  deniedText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
  },

  // Back Button
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.input,
  },
  backButtonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 14,
  },

  // Header Section
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "500",
  },
  userCountBadge: {
    backgroundColor: colors.blueDark + "20",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: "center",
    gap: 4,
  },
  userCountIcon: {
    fontSize: 20,
  },
  userCountText: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.blueDark,
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
    fontWeight: "500",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },

  // Card
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    gap: 12,
    shadowColor: colors.text,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // Card Header
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.input,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.blueDark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 22,
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  userEmail: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "500",
  },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.blue + "20",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginTop: 4,
  },
  roleBadgeAdmin: {
    backgroundColor: colors.bgDark + "20",
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text,
  },
  userIndex: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
  },

  // Stats Container
  statsContainer: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 8,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.bg,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statIcon: {
    fontSize: 18,
  },
  statContent: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },

  // Form
  form: {
    backgroundColor: colors.input + "30",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.input,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  formIcon: {
    fontSize: 20,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  formGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.input,
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  textArea: {
    minHeight: 100,
  },

  // Role Toggle
  roleToggleRow: {
    flexDirection: "row",
    gap: 10,
  },
  roleToggle: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.input,
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.card,
  },
  roleToggleActive: {
    backgroundColor: colors.bgDark,
    borderColor: colors.bgDark,
  },
  roleToggleIcon: {
    fontSize: 16,
  },
  roleToggleText: {
    fontWeight: "700",
    color: colors.muted,
    fontSize: 13,
  },
  roleToggleTextActive: {
    color: colors.white,
  },

  // Form Actions
  formActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.input,
    alignItems: "center",
    backgroundColor: colors.card,
  },
  cancelButtonText: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 14,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.blueDark,
    alignItems: "center",
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },

  // Action Row
  actionRow: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 4,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    gap: 4,
    flexDirection: "row",
    justifyContent: "center",
  },
  editButton: {
    borderColor: colors.blue,
    backgroundColor: colors.blue + "10",
  },
  emailButton: {
    borderColor: colors.blueDark,
    backgroundColor: colors.blueDark + "10",
  },
  deleteButton: {
    borderColor: "#ef5350",
    backgroundColor: "#ef5350" + "10",
  },
  actionButtonIcon: {
    fontSize: 14,
  },
  actionButtonText: {
    fontWeight: "700",
    fontSize: 12,
    color: colors.text,
  },

  // Delete Confirm Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
    gap: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  modalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ef5350" + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  modalIcon: {
    fontSize: 26,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
  },
  modalMessage: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
  },
  modalErrorText: {
    fontSize: 13,
    color: "#ef5350",
    fontWeight: "600",
    textAlign: "center",
  },
  deleteConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#ef5350",
    alignItems: "center",
  },
});
