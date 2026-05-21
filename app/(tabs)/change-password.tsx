import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { changePassword } from "../../api/user";
import { colors } from "../../constants/globalStyles";
import { useAppTheme } from "../../context/ThemeContext";
import { clearSession } from "../../utils/token";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { themeColors } = useAppTheme();

  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [secureCurrent, setSecureCurrent] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!current) { setError("Please enter your current password."); return; }
    if (newPass.length < 6) { setError("New password must be at least 6 characters."); return; }
    if (newPass !== confirm) { setError("Passwords do not match."); return; }

    setError("");
    setLoading(true);
    try {
      await changePassword(current, newPass);
      setSuccess(true);
      setTimeout(() => {
        clearSession();
        router.replace("/(auth)/login");
      }, 1200);
    } catch {
      setError("Current password is incorrect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.bg }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: themeColors.button }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: themeColors.text }]}>Change Password</Text>
      </View>

      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.label, { color: themeColors.muted }]}>Current Password</Text>
        <View style={[styles.passwordRow, { backgroundColor: colors.input }]}>
          <TextInput
            style={[styles.passwordInput, { color: themeColors.text }]}
            placeholder="••••••"
            placeholderTextColor={colors.muted}
            secureTextEntry={secureCurrent}
            value={current}
            onChangeText={(t) => { setCurrent(t); setError(""); }}
          />
          <TouchableOpacity onPress={() => setSecureCurrent(!secureCurrent)}>
            <Text style={styles.showText}>{secureCurrent ? "show" : "Hide"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { color: themeColors.muted }]}>New Password</Text>
        <View style={[styles.passwordRow, { backgroundColor: colors.input }]}>
          <TextInput
            style={[styles.passwordInput, { color: themeColors.text }]}
            placeholder="••••••"
            placeholderTextColor={colors.muted}
            secureTextEntry={secureNew}
            value={newPass}
            onChangeText={(t) => { setNewPass(t); setError(""); }}
          />
          <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
            <Text style={styles.showText}>{secureNew ? "show" : "Hide"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { color: themeColors.muted }]}>Confirm New Password</Text>
        <View style={[styles.passwordRow, { backgroundColor: colors.input }]}>
          <TextInput
            style={[styles.passwordInput, { color: themeColors.text }]}
            placeholder="••••••"
            placeholderTextColor={colors.muted}
            secureTextEntry={secureConfirm}
            value={confirm}
            onChangeText={(t) => { setConfirm(t); setError(""); }}
          />
          <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
            <Text style={styles.showText}>{secureConfirm ? "show" : "Hide"}</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>Password changed!</Text> : null}

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: themeColors.button }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveButtonText}>Save New Password</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700" },
  backButton: { alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, marginBottom: 12 },
  backButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  card: { marginHorizontal: 20, borderRadius: 16, padding: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 14 },
  passwordRow: { flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 14, marginBottom: 4 },
  passwordInput: { flex: 1, paddingVertical: 14, fontSize: 15 },
  showText: { color: colors.blueDark, fontWeight: "700", fontSize: 13, paddingLeft: 8 },
  error: { color: "#c0726e", fontSize: 13, marginTop: 10, textAlign: "center" },
  successText: { color: "#5a9e6f", fontSize: 14, fontWeight: "700", marginTop: 10, textAlign: "center" },
  saveButton: { marginTop: 24, paddingVertical: 16, borderRadius: 30, alignItems: "center" },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
