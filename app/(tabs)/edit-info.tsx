import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getMe, updateUser } from "../../api/user";
import { colors } from "../../constants/globalStyles";
import { useAppTheme } from "../../context/ThemeContext";
import { getName, saveName } from "../../utils/token";

export default function EditInfoScreen() {
  const router = useRouter();
  const { themeColors } = useAppTheme();

  const [name, setName] = useState(getName() || "");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "sms">("email");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getMe()
      .then((data) => {
        if (data?.name) setName(data.name);
        if (data?.phoneNumber) {
          // Strip +1 country code and store raw digits
          const digits = data.phoneNumber.replace(/^\+1/, "").replace(/\D/g, "");
          setPhoneDigits(digits);
        }
        if (data?.deliveryMethod) setDeliveryMethod(data.deliveryMethod);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatPhoneDisplay = (digits: string) => {
    if (!digits) return "";
    const area = digits.slice(0, 3);
    const prefix = digits.slice(3, 6);
    const line = digits.slice(6, 10);
    let out = "";
    if (area) out += "(" + area;
    if (area.length === 3) out += ")";
    if (prefix) out += " " + prefix;
    if (line) out += "-" + line;
    return out;
  };

  const handlePhoneChange = (text: string) => {
    let digits = text.replace(/\D/g, "");
    if (digits.startsWith("1") && digits.length > 1) digits = digits.slice(1);
    setPhoneDigits(digits.slice(0, 10));
    setError("");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    if (phoneDigits && phoneDigits.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await updateUser({
        name: name.trim(),
        phoneNumber: phoneDigits ? "+1" + phoneDigits : undefined,
        deliveryMethod,
      });
      saveName(name.trim());
      setSuccess(true);
      setTimeout(() => router.back(), 1000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
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
        <Text style={[styles.title, { color: themeColors.text }]}>Edit Info</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.blueDark} />
      ) : (
        <View style={[styles.card, { backgroundColor: themeColors.card }]}>

          <Text style={[styles.label, { color: themeColors.muted }]}>Full Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: themeColors.text }]}
            value={name}
            onChangeText={(t) => { setName(t); setError(""); }}
            placeholder="Full Name"
            placeholderTextColor={colors.muted}
            autoCapitalize="words"
          />

          <Text style={[styles.label, { color: themeColors.muted }]}>Phone Number (optional)</Text>
          <View style={[styles.phoneRow, { backgroundColor: colors.input }]}>
            <Text style={[styles.countryCode, { color: themeColors.text }]}>+1</Text>
            <View style={styles.phoneDivider} />
            <TextInput
              style={[styles.phoneInput, { color: themeColors.text }]}
              value={formatPhoneDisplay(phoneDigits)}
              onChangeText={handlePhoneChange}
              placeholder="(647) 123-4567"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={[styles.label, { color: themeColors.muted }]}>Verification code delivery</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleButton, deliveryMethod === "email" && styles.toggleActive]}
              onPress={() => setDeliveryMethod("email")}
            >
              <Text style={[styles.toggleText, deliveryMethod === "email" && styles.toggleTextActive]}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, deliveryMethod === "sms" && styles.toggleActive]}
              onPress={() => setDeliveryMethod("sms")}
            >
              <Text style={[styles.toggleText, deliveryMethod === "sms" && styles.toggleTextActive]}>
                SMS
              </Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>Saved!</Text> : null}

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: themeColors.button }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.saveButtonText}>Save Changes</Text>}
          </TouchableOpacity>
        </View>
      )}
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
  input: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, marginBottom: 4 },
  phoneRow: { flexDirection: "row", alignItems: "center", borderRadius: 12, marginBottom: 4, overflow: "hidden" },
  countryCode: { paddingHorizontal: 14, fontSize: 15, fontWeight: "700" },
  phoneDivider: { width: 1, alignSelf: "stretch", backgroundColor: colors.muted, opacity: 0.3 },
  phoneInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 14, fontSize: 15 },
  toggleRow: { flexDirection: "row", borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: colors.input, marginBottom: 4 },
  toggleButton: { flex: 1, paddingVertical: 13, alignItems: "center", backgroundColor: colors.input },
  toggleActive: { backgroundColor: colors.blueDark },
  toggleText: { fontSize: 15, fontWeight: "600", color: colors.muted },
  toggleTextActive: { color: "#fff" },
  error: { color: "#c0726e", fontSize: 13, marginTop: 8, textAlign: "center" },
  successText: { color: "#5a9e6f", fontSize: 14, fontWeight: "700", marginTop: 8, textAlign: "center" },
  saveButton: { marginTop: 24, paddingVertical: 16, borderRadius: 30, alignItems: "center" },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
