/* 
* Change Password Section component
* This component allows users to:
* - enter their current password
* - enter a new password
* - show or hide password fields
* - save the new password through the backend
* - log out after successful password change
*/
// ================
//     IMPORTS
// ================
import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { changePassword } from "../../api/user";
import { useAppTheme } from "../../context/ThemeContext";
import { clearSession } from "../../utils/token";

// ==============
//     TYPES
// ==============
type Props = {
    onClose: () => void;
    onPasswordChanged: () => void;
};

// ================
// CHANGE PASSWORD COMPONENT
// ================
export default function ChangePasswordSection({
    onClose,
    onPasswordChanged,
}: Props) {


    const { themeColors } = useAppTheme();

    // Password field state
    const [current, setCurrent] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirm, setConfirm] = useState("");

    // Password visibility state
    const [secureCurrent, setSecureCurrent] = useState(true);
    const [secureNew, setSecureNew] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);

    // Submission state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Validate and submit password change request
    const handleSave = async () => {
        if (!current) {
            setError("Please enter your current password.");
            return;
        }

        if (newPass.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        if (newPass !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await changePassword(current, newPass);

            setSuccess(true);

            // Clear session and force the 
            // user to log in again
            setTimeout(() => {
                clearSession();
                onPasswordChanged();
            }, 1200);
        } catch {
            setError("Current password is incorrect. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ================
    //     RENDER
    // ================
    return (
        <View style={[styles.card, { backgroundColor: themeColors.card, shadowColor: themeColors.shadow }]}>
            <Text style={[styles.title, { color: themeColors.text }]}>
                Change Password
            </Text>

            <Text style={[styles.description, { color: themeColors.muted }]}>
                Update your password. You will be asked to log in again after changing it.
            </Text>

            <Text style={[styles.label, { color: themeColors.muted }]}>
                Current Password
            </Text>

            <View style={[styles.passwordRow, { backgroundColor: themeColors.input }]}>
                <TextInput
                    style={[styles.passwordInput, { color: themeColors.text }]}
                    placeholder="••••••"
                    placeholderTextColor={themeColors.muted}
                    secureTextEntry={secureCurrent}
                    value={current}
                    onChangeText={(text) => {
                        setCurrent(text);
                        setError("");
                    }}
                />

                <TouchableOpacity onPress={() => setSecureCurrent(!secureCurrent)}>
                    <Text style={[styles.showText, { color: themeColors.blueDark }]}>
                        {secureCurrent ? "Show" : "Hide"}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: themeColors.muted }]}>
                New Password
            </Text>

            <View style={[styles.passwordRow, { backgroundColor: themeColors.input }]}>
                <TextInput
                    style={[styles.passwordInput, { color: themeColors.text }]}
                    placeholder="••••••"
                    placeholderTextColor={themeColors.muted}
                    secureTextEntry={secureNew}
                    value={newPass}
                    onChangeText={(text) => {
                        setNewPass(text);
                        setError("");
                    }}
                />

                <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
                    <Text style={[styles.showText, { color: themeColors.blueDark }]}>{secureNew ? "Show" : "Hide"}</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: themeColors.muted }]}>
                Confirm New Password
            </Text>

            <View style={[styles.passwordRow, { backgroundColor: themeColors.input }]}>
                <TextInput
                    style={[styles.passwordInput, { color: themeColors.text }]}
                    placeholder="••••••"
                    placeholderTextColor={themeColors.muted}
                    secureTextEntry={secureConfirm}
                    value={confirm}
                    onChangeText={(text) => {
                        setConfirm(text);
                        setError("");
                    }}
                />

                <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
                    <Text style={[styles.showText, { color: themeColors.blueDark }]}>
                        {secureConfirm ? "Show" : "Hide"}
                    </Text>
                </TouchableOpacity>
            </View>

            {error ? <Text style={[styles.error, { color: themeColors.error }]}>{error}</Text> : null}

            {success ? (
                <Text style={[styles.successText, { color: themeColors.success }]}>
                    Password changed! Redirecting to login...
                </Text>
            ) : null}

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: themeColors.muted }]}
                    onPress={onClose}
                    disabled={loading}
                >
                    <Text style={[styles.actionButtonText, { color: themeColors.white }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: themeColors.bgDark }]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={themeColors.white} />
                    ) : (
                        <Text style={[styles.actionButtonText, { color: themeColors.white }]}>Save Password</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ================
//     STYLES
// ================
const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 24,

        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: {
            width: 0,
            height: 6,
        },

        elevation: 5,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 8,
    },

    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },

    label: {
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 6,
        marginTop: 14,
    },

    passwordRow: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingHorizontal: 14,
    },

    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
    },

    showText: {
        fontWeight: "700",
        fontSize: 13,
        paddingLeft: 8,
    },

    error: {
        fontSize: 13,
        marginTop: 10,
        textAlign: "center",
    },

    successText: {
        fontSize: 14,
        fontWeight: "700",
        marginTop: 10,
        textAlign: "center",
    },

    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 24,
    },

    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
    },

    actionButtonText: {
        fontSize: 16,
        fontWeight: "700",
    },
});
