import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Web-only login page for PWA
 * This is used when AuthProvider is available (web/PWA only)
 */
export default function WebLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      setError("");
      
      // Call PWA-specific auth API
      const response = await fetch("/api/pwaAuth.login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Falha ao fazer login");
      }

      // Store token and user data
      await AsyncStorage.setItem("auth_user", JSON.stringify(data.user));
      await AsyncStorage.setItem("auth_token", data.token);

      // Redirect to app
      router.replace("/(tabs)");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Falha ao fazer login";
      setError(errorMsg);
      if (Platform.OS === "web") {
        alert(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center px-6 gap-6">
          {/* Header */}
          <View className="items-center gap-2 mb-4">
            <Text className="text-4xl font-bold text-foreground">NeuroLaserMap</Text>
            <Text className="text-base text-muted">Mapeamento de Neuromodulação</Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="bg-error/10 border border-error rounded-lg p-3">
              <Text className="text-error text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Email Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Email</Text>
            <TextInput
              className="border border-border rounded-lg px-4 py-3 bg-surface text-foreground"
              placeholder="seu@email.com"
              placeholderTextColor="#9BA1A6"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Senha</Text>
            <TextInput
              className="border border-border rounded-lg px-4 py-3 bg-surface text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#9BA1A6"
              secureTextEntry
              editable={!isLoading}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="bg-primary rounded-lg py-3 items-center active:opacity-80"
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white font-semibold text-base">
              {isLoading ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View className="flex-row justify-center gap-1">
            <Text className="text-muted">Não tem conta?</Text>
            <TouchableOpacity onPress={() => router.push("/web-register")}>
              <Text className="text-primary font-semibold">Cadastre-se</Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View className="bg-surface rounded-lg p-4 border border-border mt-4">
            <Text className="text-xs text-muted leading-relaxed">
              Após o cadastro, sua conta será analisada pelo administrador. Você receberá um email
              de confirmação quando for aprovado.
            </Text>
          </View>

          {/* Test Credentials */}
          <View className="bg-blue-100 rounded-lg p-4 border border-blue-300 mt-4">
            <Text className="text-xs text-blue-900 font-semibold mb-2">Credenciais de Teste:</Text>
            <Text className="text-xs text-blue-900">Email: admin@neurolasermap.com</Text>
            <Text className="text-xs text-blue-900">Senha: admin123456</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
