import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

export default function RegisterScreen() {
  const router = useRouter();
  const { invite } = useLocalSearchParams<{ invite?: string }>();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validatingInvite, setValidatingInvite] = useState(true);
  const [inviteValid, setInviteValid] = useState(false);

  const validateInviteMutation = trpc.admin.validateInvite.useMutation();
  const registerMutation = trpc.auth.register.useMutation();

  // Validar convite ao carregar
  useEffect(() => {
    if (invite) {
      validateInvite();
    } else {
      setValidatingInvite(false);
      setError("Link de convite inválido");
    }
  }, [invite]);

  const validateInvite = async () => {
    if (!invite) return;

    try {
      const result = await validateInviteMutation.mutateAsync({
        inviteCode: invite,
      });
      setInviteValid(true);
      if (result.email) {
        setEmail(result.email);
      }
    } catch (err: any) {
      setError(err.message || "Convite inválido ou expirado");
    } finally {
      setValidatingInvite(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await registerMutation.mutateAsync({
        email,
        password,
        fullName,
        specialty,
        phone,
        inviteCode: invite || "",
      });

      // Mostrar mensagem de sucesso
      router.replace("/(auth)/pending-approval");
    } catch (err: any) {
      setError(err.message || "Erro ao registrar");
    } finally {
      setLoading(false);
    }
  };

  if (validatingInvite) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text className="mt-4 text-muted">Validando convite...</Text>
      </ScreenContainer>
    );
  }

  if (!inviteValid) {
    return (
      <ScreenContainer className="flex items-center justify-center p-6">
        <View className="gap-4 items-center">
          <Text className="text-2xl font-bold text-foreground">Convite Inválido</Text>
          <Text className="text-muted text-center">{error}</Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="bg-primary rounded-lg px-6 py-3 mt-4"
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
        <View className="flex-1 justify-center px-6 gap-6 py-8">
          {/* Header */}
          <View className="items-center gap-2 mb-4">
            <Text className="text-3xl font-bold text-foreground">Criar Conta</Text>
            <Text className="text-base text-muted">Complete seu cadastro</Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="bg-error/10 border border-error rounded-lg p-4">
              <Text className="text-error font-semibold">{error}</Text>
            </View>
          ) : null}

          {/* Full Name Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Nome Completo *</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="Seu nome"
              placeholderTextColor="#9BA1A6"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />
          </View>

          {/* Email Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Email *</Text>
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
            <Text className="text-sm font-semibold text-foreground">Senha *</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#9BA1A6"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              secureTextEntry
            />
            <Text className="text-xs text-muted">Mínimo 6 caracteres</Text>
          </View>

          {/* Specialty Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Especialidade</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="Ex: Fisioterapia"
              placeholderTextColor="#9BA1A6"
              value={specialty}
              onChangeText={setSpecialty}
              editable={!loading}
            />
          </View>

          {/* Phone Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Telefone</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="(11) 99999-9999"
              placeholderTextColor="#9BA1A6"
              value={phone}
              onChangeText={setPhone}
              editable={!loading}
              keyboardType="phone-pad"
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-primary rounded-lg py-4 items-center mt-4"
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-base">Criar Conta</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center items-center gap-2 mt-4">
            <Text className="text-muted">Já tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-primary font-semibold">Faça login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
