import { Platform, Pressable, Text } from "react-native";
import { useAuth } from "@/lib/auth-context";

export function FloatingLogoutButton() {
  const { logout } = useAuth();

  if (Platform.OS !== "web") return null;

  const handleLogout = async () => {
    const shouldLogout = window.confirm("Deseja realmente sair da sua conta?");
    if (shouldLogout) {
      await logout();
    }
  };

  return (
    <Pressable
      onPress={handleLogout}
      style={({ pressed }) => ({
        position: "fixed" as any,
        top: 16,
        right: 16,
        width: 50,
        height: 50,
        backgroundColor: pressed ? "#DC2626" : "#EF4444",
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        boxShadow: pressed
          ? "0 4px 12px rgba(239, 68, 68, 0.4)"
          : "0 2px 8px rgba(239, 68, 68, 0.3)",
        transform: pressed ? "scale(0.95)" : "scale(1)",
        transition: "all 0.2s ease" as any,
      } as any)}
    >
      <Text style={{ fontSize: 24 }}>🚪</Text>
    </Pressable>
  );
}
