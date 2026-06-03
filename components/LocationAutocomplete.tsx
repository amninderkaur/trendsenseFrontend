import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../api/axios";
import { getToken } from "../utils/token";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  inputStyle?: any;
  containerStyle?: any;
  dropdownBg?: string;
  dropdownText?: string;
  dropdownBorder?: string;
}

export default function LocationAutocomplete({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  inputStyle,
  containerStyle,
  dropdownBg = "#fff",
  dropdownText = "#000",
  dropdownBorder = "#ccc",
}: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const token = getToken();
        const res = await api.get<string[]>("/api/location/autocomplete", {
          params: { q: value.trim() },
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = Array.isArray(res.data) ? res.data : [];
        setSuggestions(list);
        setOpen(list.length > 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  const select = (item: string) => {
    onChangeText(item);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
      />
      {open && (
        <View
          style={[
            styles.dropdown,
            { backgroundColor: dropdownBg, borderColor: dropdownBorder },
          ]}
        >
          {suggestions.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.item,
                i < suggestions.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: dropdownBorder,
                },
              ]}
              onPress={() => select(item)}
            >
              <Text style={[styles.itemText, { color: dropdownText }]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 100,
    overflow: "visible",
  },
  dropdown: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    marginTop: 2,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 14,
  },
});
