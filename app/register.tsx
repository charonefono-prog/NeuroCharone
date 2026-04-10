import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const colors = useColors();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [needsApproval, setNeedsApproval] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleRegister = async () => {
    // Clear previous errors
    setError("");
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Validate inputs
    let hasError = false;
    if (!name) {
      setNameError("Nome é obrigatório");
      hasError = true;
    } else if (name.length < 3) {
      setNameError("Nome deve ter pelo menos 3 caracteres");
      hasError = true;
    }

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

    if (!confirmPassword) {
      setConfirmPasswordError("Confirmação de senha é obrigatória");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem");
      hasError = true;
    }

    if (hasError) return;

    try {
      setError("");
      const result = await register(email, name, password);
      if (result.needsApproval) {
        setNeedsApproval(true);
        return;
      }
      // Auto-approved (admin) - go to app
      router.replace("/(tabs)");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha no registro";
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
            <Text style={{ fontSize: 48 }}>✅</Text>
            <Text className="text-2xl font-bold text-foreground text-center">
              Cadastro Realizado!
            </Text>
            <Text className="text-base text-muted text-center leading-relaxed">
              Sua conta foi criada com sucesso! Agora é necessário aguardar a aprovação do administrador.
              Você será notificado quando sua conta for ativada.
            </Text>
          </View>
          <TouchableOpacity
            className="bg-primary rounded-lg py-3.5 items-center active:opacity-80"
            onPress={() => {
              setNeedsApproval(false);
              router.replace("/login");
            }}
          >
            <Text className="text-white font-semibold">Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center px-6 gap-4 py-6">
          {/* Header */}
          <View className="items-center gap-2 mb-4">
            <Text style={{ fontSize: 48 }}>🧠</Text>
            <Text className="text-3xl font-bold text-foreground">Criar Conta</Text>
            <Text className="text-sm text-muted">NeuroLaserMap</Text>
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
              style={{
                borderWidth: 1,
                borderColor: nameError ? colors.error : colors.border,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: colors.surface,
                color: colors.foreground,
                fontSize: 16,
              }}
              placeholder="Dr. João Silva"
              placeholderTextColor={colors.muted}
              editable={!isLoading}
              value={name}
              onChangeText={setName}
              returnKeyType="next"
            />
            {nameError ? (
              <Text style={{ color: colors.error, fontSize: 12 }}>{nameError}</Text>
            ) : null}
          </View>

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
              onChangeText={setEmail}
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
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={colors.muted}
              secureTextEntry
              editable={!isLoading}
              value={password}
              onChangeText={setPassword}
              returnKeyType="next"
            />
            {passwordError ? (
              <Text style={{ color: colors.error, fontSize: 12 }}>{passwordError}</Text>
            ) : null}
          </View>

          {/* Confirm Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Confirmar Senha</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: confirmPasswordError ? colors.error : colors.border,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: colors.surface,
                color: colors.foreground,
                fontSize: 16,
              }}
              placeholder="Repita a senha"
              placeholderTextColor={colors.muted}
              secureTextEntry
              editable={!isLoading}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
            {confirmPasswordError ? (
              <Text style={{ color: colors.error, fontSize: 12 }}>{confirmPasswordError}</Text>
            ) : null}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingVertical: 14,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              opacity: isLoading || nameError || emailError || passwordError || confirmPasswordError ? 0.6 : 1,
            }}
            onPress={handleRegister}
            disabled={isLoading || !!nameError || !!emailError || !!passwordError || !!confirmPasswordError}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
                Cadastrar
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center gap-1">
            <Text className="text-muted">Já tem conta?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text className="text-primary font-semibold">Entrar</Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View className="bg-surface rounded-lg p-4 border border-border mt-2">
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
