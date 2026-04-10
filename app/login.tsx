import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";
import { WebButton } from "@/components/web-button";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const colors = useColors();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needsApproval, setNeedsApproval] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setEmailError("Email inválido");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value: string) => {
    if (value && value.length < 6) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async () => {
    // Clear previous errors
    setError("");
    setEmailError("");
    setPasswordError("");

    // Validate inputs
    let hasError = false;
    if (!email) {
      setEmailError("Email é obrigatório");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Email inválido");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Senha é obrigatória");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres");
      hasError = true;
    }

    if (hasError) return;

    try {
      setError("");
      setNeedsApproval(false);
      const result = await login(email, password);
      if (result.needsApproval) {
        setNeedsApproval(true);
        return;
      }
      router.replace("/(tabs)");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha no login";
      setError(msg);
      if (Platform.OS !== "web") {
        Alert.alert("Erro", msg);
      }
    }
  };

  if (needsApproval) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 justify-center px-6 gap-6">
          <View className="items-center gap-4">
            <Text style={{ fontSize: 48 }}>⏳</Text>
            <Text className="text-2xl font-bold text-foreground text-center">
              Aguardando Aprovação
            </Text>
            <Text className="text-base text-muted text-center leading-relaxed">
              Sua conta foi registrada com sucesso, mas ainda precisa ser aprovada pelo administrador.
              Você será notificado quando sua conta for ativada.
            </Text>
          </View>
          <TouchableOpacity
            className="bg-surface border border-border rounded-lg py-3 items-center"
            onPress={() => setNeedsApproval(false)}
          >
            <Text className="text-foreground font-semibold">Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center px-6 gap-6">
          {/* Header */}
          <View className="items-center gap-2 mb-4">
            <Text style={{ fontSize: 64 }}>🧠</Text>
            <Text className="text-4xl font-bold text-foreground">NeuroLaserMap</Text>
            <Text className="text-base text-muted">Sistema de Mapeamento de Neuromodulação</Text>
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
              style={{
                borderWidth: 1,
                borderColor: emailError ? colors.error : colors.border,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: colors.surface,
                color: colors.foreground,
                fontSize: 16,
              }}
              placeholder="seu@email.com"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                validateEmail(value);
              }}
              returnKeyType="next"
            />
            {emailError ? (
              <Text style={{ color: colors.error, fontSize: 12 }}>{emailError}</Text>
            ) : null}
          </View>

          {/* Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Senha</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: passwordError ? colors.error : colors.border,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: colors.surface,
                color: colors.foreground,
                fontSize: 16,
              }}
              placeholder="••••••••"
              placeholderTextColor={colors.muted}
              secureTextEntry
              editable={!isLoading}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                validatePassword(value);
              }}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            {passwordError ? (
              <Text style={{ color: colors.error, fontSize: 12 }}>{passwordError}</Text>
            ) : null}
          </View>

          {/* Login Button */}
          <WebButton
            onPress={handleLogin}
            disabled={isLoading || !!emailError || !!passwordError}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              "Entrar"
            )}
          </WebButton>

          {/* Register Link */}
          <View className="flex-row justify-center gap-1">
            <Text className="text-muted">Não tem conta?</Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text className="text-primary font-semibold">Cadastre-se</Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View className="bg-surface rounded-lg p-4 border border-border mt-4">
            <Text className="text-xs text-muted leading-relaxed text-center">
              Após o cadastro, sua conta será analisada pelo administrador.{"\n"}
              Você será notificado quando for aprovado.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
