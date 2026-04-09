import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [needsApproval, setNeedsApproval] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

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
              className="border border-border rounded-lg px-4 py-3 bg-surface text-foreground"
              placeholder="Dr. João Silva"
              placeholderTextColor="#9BA1A6"
              editable={!isLoading}
              value={name}
              onChangeText={setName}
              returnKeyType="next"
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
              returnKeyType="next"
            />
          </View>

          {/* Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Senha</Text>
            <TextInput
              className="border border-border rounded-lg px-4 py-3 bg-surface text-foreground"
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#9BA1A6"
              secureTextEntry
              editable={!isLoading}
              value={password}
              onChangeText={setPassword}
              returnKeyType="next"
            />
          </View>

          {/* Confirm Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Confirmar Senha</Text>
            <TextInput
              className="border border-border rounded-lg px-4 py-3 bg-surface text-foreground"
              placeholder="Repita a senha"
              placeholderTextColor="#9BA1A6"
              secureTextEntry
              editable={!isLoading}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            className="bg-primary rounded-lg py-3.5 items-center active:opacity-80 mt-2"
            onPress={handleRegister}
            disabled={isLoading}
            style={isLoading ? { opacity: 0.6 } : undefined}
          >
            <Text className="text-white font-semibold text-base">
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Text>
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
