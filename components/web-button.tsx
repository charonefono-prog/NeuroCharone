import { Platform, TouchableOpacity, View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface WebButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  style?: any;
}

export function WebButton({ onPress, children, disabled = false, style }: WebButtonProps) {
  const colors = useColors();

  if (Platform.OS === "web") {
    return (
      <button
        onClick={() => {
          onPress();
        }}
        disabled={disabled}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 8,
          paddingVertical: 14,
          paddingHorizontal: 16,
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          fontSize: 16,
          fontWeight: "600",
          color: "white",
          ...style,
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      {typeof children === "string" ? (
        <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
