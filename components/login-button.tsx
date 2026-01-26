import { TouchableOpacity, Text, ActivityIndicator, View, Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";

export function LoginButton() {
  const colors = useColors();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (Platform.OS === "web") {
        // Web: redirect to OAuth
        const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
        const redirectUrl = `${window.location.origin}/oauth/callback`;
        const oauthUrl = `${apiUrl}/api/oauth/login?redirect_uri=${encodeURIComponent(redirectUrl)}`;
        
        window.location.href = oauthUrl;
      } else {
        // Native: open OAuth in browser
        const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
        const scheme = "manus20260118160000"; // From app.config.ts
        const redirectUrl = `${scheme}://oauth/callback`;
        const oauthUrl = `${apiUrl}/api/oauth/login?redirect_uri=${encodeURIComponent(redirectUrl)}`;

        const result = await WebBrowser.openAuthSessionAsync(oauthUrl, redirectUrl);
        
        if (result.type === "success") {
          // OAuth callback will handle the rest
          router.replace("/(tabs)");
        }
      }
    } catch (error) {
      console.error("[LoginButton] Login error:", error);
      alert("Erro ao fazer login. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLogin}
      disabled={loading}
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        minWidth: 200,
        alignItems: "center",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>
          Fazer Login
        </Text>
      )}
    </TouchableOpacity>
  );
}

export function LoginScreen() {
  const colors = useColors();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
        padding: 24,
      }}
    >
      <View style={{ alignItems: "center", gap: 24, maxWidth: 400 }}>
        <View style={{ alignItems: "center", gap: 8 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: colors.foreground,
              textAlign: "center",
            }}
          >
            NeuroLaserMap
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.muted,
              textAlign: "center",
            }}
          >
            Mapeamento de Neuromodulação a Laser
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.surface,
            padding: 24,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            width: "100%",
            gap: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Faça login para acessar o aplicativo de mapeamento de neuromodulação e gerenciar seus
            pacientes.
          </Text>

          <LoginButton />
        </View>


      </View>
    </View>
  );
}
