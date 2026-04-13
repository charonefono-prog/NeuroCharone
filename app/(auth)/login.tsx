import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginMutation = trpc.auth.login.useMutation();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await loginMutation.mutateAsync({
        email,
        password,
      });

      // Salvar dados do usuário
      await AsyncStorage.setItem("user", JSON.stringify(result));
      await AsyncStorage.setItem("isAuthenticated", "true");

      // Redirecionar para home
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center px-6 gap-6">
          {/* Header */}
          <View className="items-center gap-2 mb-8">
            <Text className="text-4xl font-bold text-foreground">NeuroLaserMap</Text>
            <Text className="text-base text-muted">Acesse sua conta</Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="bg-error/10 border border-error rounded-lg p-4">
              <Text className="text-error font-semibold">{error}</Text>
            </View>
          ) : null}

          {/* Email Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Email</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="seu@email.com"
              placeholderTextColor="#9BA1A6"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Senha</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#9BA1A6"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-primary rounded-lg py-4 items-center mt-4"
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-base">Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View className="flex-row justify-center items-center gap-2 mt-4">
            <Text className="text-muted">Não tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text className="text-primary font-semibold">Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
