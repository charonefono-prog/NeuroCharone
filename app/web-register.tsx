import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

/**
 * Web-only register page for PWA
 */
export default function WebRegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !name || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não correspondem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      setError("");
      
      // Call PWA-specific auth API
      const response = await fetch("/api/pwaAuth.register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Falha ao registrar");
      }

      // Show success message
      if (Platform.OS === "web") {
        alert("Cadastro realizado! Aguarde a aprovação do administrador.");
      }

      // Redirect to login
      router.replace("/web-login");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Falha ao registrar";
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
        <View className="flex-1 justify-center px-6 gap-4">
          {/* Header */}
          <View className="items-center gap-2 mb-4">
            <Text className="text-4xl font-bold text-foreground">NeuroLaserMap</Text>
            <Text className="text-base text-muted">Criar Conta</Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="bg-error/10 border border-error rounded-lg p-3">
              <Text className="text-error text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Name Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Nome Completo</Text>
            <TextInput
              className="border border-border rounded-lg px-4 py-3 bg-surface text-foreground"
              placeholder="Seu nome"
              placeholderTextColor="#9BA1A6"
              editable={!isLoading}
              value={name}
              onChangeText={setName}
            />
          </View>

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

          {/* Confirm Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Confirmar Senha</Text>
            <TextInput
              className="border border-border rounded-lg px-4 py-3 bg-surface text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#9BA1A6"
              secureTextEntry
              editable={!isLoading}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            className="bg-primary rounded-lg py-3 items-center active:opacity-80 mt-2"
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text className="text-white font-semibold text-base">
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center gap-1">
            <Text className="text-muted">Já tem conta?</Text>
            <TouchableOpacity onPress={() => router.push("/web-login")}>
              <Text className="text-primary font-semibold">Faça login</Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View className="bg-surface rounded-lg p-4 border border-border mt-4">
            <Text className="text-xs text-muted leading-relaxed">
              Após o cadastro, sua conta será analisada pelo administrador. Você receberá um email
              de confirmação quando for aprovado.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
