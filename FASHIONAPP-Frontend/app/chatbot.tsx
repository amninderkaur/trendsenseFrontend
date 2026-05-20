import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
    useWindowDimensions,
} from "react-native";

import api from "@/api/axios";
import { colors, globalStyles } from "@/constants/globalStyles";
import { getToken } from "@/utils/token";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const starterMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Hi, I’m your fashion assistant. Ask me about color matching, outfit ideas, styling tips, or what to wear for a specific occasion.",
  },
];

const quickPrompts = [
  "What colors go well with pale yellow?",
  "What pants go with a white top?",
  "How do you pair shoes with a belt?",
  "Can I wear hair accessories with a formal outfit?",
];

export default function ChatbotScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= 768;
  const iconSize = isLargeScreen ? 32 : 24;
  const sendIconSize = isLargeScreen ? 28 : 20;

  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading],
  );

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();

    if (!trimmed || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmed,
    };

    const history = messages
      .filter((message) => message.id !== "welcome")
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        text: message.text,
      }));

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = await getToken();

      const response = await api.post(
        "/api/chat",
        {
          message: trimmed,
          history: history,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: response.data.reply,
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (err) {
      console.error("Chatbot error:", err);

      const errorMessage: ChatMessage = {
        id: `${Date.now()}-error`,
        role: "assistant",
        text: "Sorry, I couldn't connect to the AI right now. Please try again.",
      };

      setMessages((current) => [...current, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.chatScreen}>
      <View style={globalStyles.chatContent}>
        <View
          style={
            isLargeScreen
              ? [globalStyles.chatHeader, globalStyles.largeChatHeader]
              : globalStyles.chatHeader
          }
        >
          <Pressable
            onPress={() => router.back()}
            style={
              isLargeScreen
                ? [globalStyles.iconButton, globalStyles.largeIconButton]
                : globalStyles.iconButton
            }
          >
            <MaterialIcons
              name="chevron-left"
              size={iconSize}
              color={colors.text}
            />
          </Pressable>

          <View>
            <Text
              style={
                isLargeScreen
                  ? [globalStyles.pageTitle, globalStyles.largeSectionTitle]
                  : globalStyles.pageTitle
              }
            >
              Fashion Bot
            </Text>

            <Text
              style={
                isLargeScreen
                  ? [globalStyles.bodyText, globalStyles.largeCardText]
                  : globalStyles.bodyText
              }
            >
              General styling help and outfit advice
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={
            isLargeScreen
              ? [globalStyles.chatContainer, globalStyles.largeChatContainer]
              : globalStyles.chatContainer
          }
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <View
                key={message.id}
                style={
                  isLargeScreen
                    ? [
                        isUser
                          ? globalStyles.userBubble
                          : globalStyles.botBubble,
                        globalStyles.largeChatBubble,
                      ]
                    : isUser
                      ? globalStyles.userBubble
                      : globalStyles.botBubble
                }
              >
                <Text
                  style={
                    isLargeScreen
                      ? [
                          isUser ? globalStyles.userText : globalStyles.botText,
                          globalStyles.largeChatText,
                        ]
                      : isUser
                        ? globalStyles.userText
                        : globalStyles.botText
                  }
                >
                  {message.text}
                </Text>
              </View>
            );
          })}

          {loading ? (
            <View
              style={
                isLargeScreen
                  ? [globalStyles.botBubble, globalStyles.largeChatBubble]
                  : globalStyles.botBubble
              }
            >
              <ActivityIndicator color={colors.blueDark} />
            </View>
          ) : null}

          <View style={globalStyles.quickPromptRow}>
            {quickPrompts.map((prompt) => (
              <Pressable
                key={prompt}
                style={
                  isLargeScreen
                    ? [globalStyles.quickPrompt, globalStyles.largeQuickPrompt]
                    : globalStyles.quickPrompt
                }
                onPress={() => sendMessage(prompt)}
                disabled={loading}
              >
                <Text
                  style={
                    isLargeScreen
                      ? [
                          globalStyles.quickPromptText,
                          globalStyles.largeQuickPromptText,
                        ]
                      : globalStyles.quickPromptText
                  }
                >
                  {prompt}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View
          style={
            isLargeScreen
              ? [globalStyles.chatInputBar, globalStyles.largeChatInputBar]
              : globalStyles.chatInputBar
          }
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask a fashion question..."
            placeholderTextColor={colors.blueDark}
            style={
              isLargeScreen
                ? [globalStyles.chatInput, globalStyles.largeChatInput]
                : globalStyles.chatInput
            }
            multiline
          />

          <Pressable
            style={
              !canSend
                ? isLargeScreen
                  ? [
                      globalStyles.sendButton,
                      globalStyles.largeSendButton,
                      globalStyles.disabledButton,
                    ]
                  : [globalStyles.sendButton, globalStyles.disabledButton]
                : isLargeScreen
                  ? [globalStyles.sendButton, globalStyles.largeSendButton]
                  : globalStyles.sendButton
            }
            onPress={() => sendMessage(input)}
            disabled={!canSend}
          >
            <MaterialIcons
              name="send"
              size={sendIconSize}
              color={colors.white}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
