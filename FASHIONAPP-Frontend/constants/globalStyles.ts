// constants/globalStyles.js

import { StyleSheet } from "react-native";

export const colors = {
  bg: "#c1d1bf",
  bgDark: "#a3bea9",
  card: "#eeede8",
  input: "#dae4e2",
  blue: "#b9d6da",
  blueDark: "#96b7bc",
  text: "#000000",
  muted: "#4B5563",
  accent: "#FF6B4A",
  white: "#FFFFFF",
};

export const globalStyles = StyleSheet.create({
  // =========================
  // LAYOUT
  // =========================

  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    position: "relative",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  // =========================
  // AUTH PAGES
  // Login / Register shared
  // =========================

  formCard: {
    width: "100%",
    maxWidth: 340,
    minHeight: 500,
    backgroundColor: colors.card,
    padding: 28,
    borderRadius: 32,
    justifyContent: "center",

    shadowColor: colors.text,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  largeFormCard: {
    maxWidth: 900,
    minHeight: 520,
    padding: 60,
    borderRadius: 40,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 18,
    backgroundColor: colors.input,

    shadowColor: colors.text,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  largeInput: {
    paddingHorizontal: 28,
    paddingVertical: 24,
    fontSize: 22,
    borderRadius: 20,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },

  largePasswordInput: {
    fontSize: 22,
  },

  showText: {
    paddingHorizontal: 12,
    fontWeight: "600",
    color: colors.accent,
  },

  largeShowText: {
    fontSize: 18,
  },

  // =========================
  // BUTTONS
  // =========================

  primaryButton: {
    backgroundColor: colors.bgDark,
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },

  largePrimaryButton: {
    paddingVertical: 24,
    borderRadius: 40,
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  largePrimaryButtonText: {
    fontSize: 22,
  },

  // =========================
  // TYPOGRAPHY
  // =========================

  pageTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },

  largePageTitle: {
    fontSize: 56,
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 16,
    color: colors.blueDark,
    marginBottom: 24,
  },

  bodyText: {
    fontSize: 14,
    color: colors.muted,
  },

  errorText: {
    color: colors.accent,
    marginBottom: 12,
    fontSize: 14,
  },

  largeErrorText: {
    fontSize: 18,
  },

  // =========================
  // LINKS
  // =========================

  centeredLink: {
    alignItems: "center",
    marginTop: 10,
  },

  linkText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  largeLinkText: {
    fontSize: 18,
  },

  // =========================
  // DECORATIVE ELEMENTS
  // =========================

  topRightCircle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.blueDark,
    top: -80,
    right: -80,
    opacity: 0.47,
  },

  bottomLeftCircle: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.blue,
    bottom: -60,
    left: -60,
    opacity: 0.56,
  },

  // =========================
  // CARDS
  // =========================

  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,

    shadowColor: colors.text,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  //==============================
  // PERSONALIZATION MODAL
  //==============================

  modalContainer: {
    backgroundColor: colors.card,
    borderRadius: 25,
    padding: 20,
    maxHeight: "90%",
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
  },

  largeModalContainer: {
    maxWidth: 700,
    padding: 40,
    borderRadius: 35,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },

  largeModalTitle: {
    fontSize: 40,
    marginBottom: 30,
  },

  modalHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 10,
    marginTop: 15,
  },

  largeModalHeading: {
    fontSize: 24,
    marginTop: 24,
  },

  // =========================
  // Main Menu
  // =========================

  dashboardContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 30,
  },

  largeDashboardContainer: {
    padding: 40,
    alignItems: "center",
  },

  dashboardContent: {
    width: "100%",
    maxWidth: 900,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },

  largeSectionTitle: {
    fontSize: 28,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },

  largeCardTitle: {
    fontSize: 28,
  },

  cardText: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 10,
  },

  largeCardText: {
    fontSize: 18,
  },

  dashboardCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,

    shadowColor: colors.text,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  largeDashboardCard: {
    padding: 32,
    borderRadius: 28,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 10,

    shadowColor: colors.text,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  largeMenuItem: {
    paddingVertical: 20,
    paddingHorizontal: 22,
    borderRadius: 22,
  },

  menuText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "500",
  },

  largeMenuText: {
    fontSize: 20,
  },
  //==========================
  // CHATBOT PAGE
  //==========================
  // =========================
  // CHATBOT
  // =========================

  chatScreen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 56,
  },

  chatContent: {
    flex: 1,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },

  largeChatHeader: {
    paddingHorizontal: 40,
    paddingBottom: 24,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },

  largeIconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  chatContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },

  largeChatContainer: {
    paddingHorizontal: 40,
    gap: 16,
  },

  botBubble: {
    alignSelf: "flex-start",
    maxWidth: "86%",
    backgroundColor: colors.card,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "86%",
    backgroundColor: colors.blueDark,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  largeChatBubble: {
    maxWidth: "75%",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 24,
  },

  botText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
  },

  userText: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 21,
  },

  largeChatText: {
    fontSize: 20,
    lineHeight: 28,
  },

  quickPromptRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingTop: 8,
  },

  quickPrompt: {
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  largeQuickPrompt: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },

  quickPromptText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
  },

  largeQuickPromptText: {
    fontSize: 17,
  },

  chatInputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },

  largeChatInputBar: {
    paddingHorizontal: 40,
    paddingBottom: 36,
    gap: 16,
  },

  chatInput: {
    flex: 1,
    minHeight: 50,
    maxHeight: 120,
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.blueDark,
  },

  largeChatInput: {
    minHeight: 70,
    maxHeight: 160,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 18,
    fontSize: 20,
  },

  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.blueDark,
    alignItems: "center",
    justifyContent: "center",
  },

  largeSendButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  disabledButton: {
    opacity: 0.5,
  },
});
