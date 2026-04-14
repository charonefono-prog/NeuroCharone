import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      setIsSubmitting(true);

      if (!email || !password) {
        setError("Por favor, preencha todos os campos");
        return;
      }

      await login(email, password);
      router.replace("/(tabs)");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterPress = () => {
    router.push("/register");
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center gap-8">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">NeuroLaserMap</Text>
            <Text className="text-base text-muted text-center">
              Gerenciamento de Fotobiomodulação Transcraniana
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            {/* Email Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Email</Text>
              <TextInput
                placeholder="seu.email@exemplo.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
                className={cn(
                  "px-4 py-3 rounded-lg border border-border bg-surface text-foreground",
                  isSubmitting && "opacity-50"
                )}
              />
            </View>

            {/* Password Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Senha</Text>
              <TextInput
                placeholder="Sua senha"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isSubmitting}
                className={cn(
                  "px-4 py-3 rounded-lg border border-border bg-surface text-foreground",
                  isSubmitting && "opacity-50"
                )}
              />
            </View>

            {/* Error Message */}
            {error && (
              <View className="p-3 rounded-lg bg-error/10 border border-error">
                <Text className="text-sm text-error">{error}</Text>
              </View>
            )}

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isSubmitting}
              className={cn(
                "py-3 rounded-lg items-center justify-center",
                isSubmitting ? "bg-primary/50" : "bg-primary"
              )}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-base font-semibold text-background">Entrar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Register Link */}
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-sm text-muted">Não tem uma conta?</Text>
            <TouchableOpacity onPress={handleRegisterPress} disabled={isSubmitting}>
              <Text className={cn(
                "text-sm font-semibold text-primary",
                isSubmitting && "opacity-50"
              )}>
                Registrar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View className="p-4 rounded-lg bg-surface border border-border gap-2">
            <Text className="text-xs font-semibold text-foreground">ℹ️ Informação</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Após se registrar, sua conta será analisada por um administrador. Você receberá um email de confirmação quando sua conta for aprovada.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
