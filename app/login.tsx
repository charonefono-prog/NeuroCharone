import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha email e senha");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Falha ao fazer login");
        return;
      }

      // Salvar token e dados do usuário
      await AsyncStorage.setItem("authToken", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      // Redirecionar para home
      router.replace("/(tabs)");
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
      console.error(err);
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

          {/* Info Box */}
          <View className="bg-surface rounded-lg p-4 border border-border mt-8">
            <Text className="text-xs text-muted text-center">
              Credenciais de teste fornecidas por email. Acesso válido por 30 dias.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
