import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    professionalId: "",
    inviteCode: "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    try {
      setError("");
      setIsSubmitting(true);

      // Validações
      if (!formData.email || !formData.fullName || !formData.password) {
        setError("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("As senhas não coincidem");
        return;
      }

      if (formData.password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres");
        return;
      }

      await register(
        formData.email,
        formData.fullName,
        formData.password,
        formData.specialty,
        formData.professionalId,
        formData.inviteCode
      );

      setSuccess(true);
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao registrar";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginPress = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" />
      </ScreenContainer>
    );
  }

  if (success) {
    return (
      <ScreenContainer className="items-center justify-center p-6">
        <View className="items-center gap-4">
          <Text className="text-2xl font-bold text-foreground">✓ Sucesso!</Text>
          <Text className="text-base text-muted text-center">
            Seu registro foi recebido. Você será redirecionado para o login em breve.
          </Text>
          <Text className="text-sm text-muted text-center mt-4">
            Sua conta será analisada por um administrador. Você receberá um email de confirmação quando aprovada.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Criar Conta</Text>
            <Text className="text-sm text-muted text-center">
              Registre-se para gerenciar seus pacientes
            </Text>
          </View>

          {/* Form */}
          <View className="gap-3">
            {/* Email Input */}
            <View className="gap-1">
              <Text className="text-xs font-semibold text-foreground">Email *</Text>
              <TextInput
                placeholder="seu.email@exemplo.com"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
                className={cn(
                  "px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-sm",
                  isSubmitting && "opacity-50"
                )}
              />
            </View>

            {/* Full Name Input */}
            <View className="gap-1">
              <Text className="text-xs font-semibold text-foreground">Nome Completo *</Text>
              <TextInput
                placeholder="Seu Nome"
                placeholderTextColor="#999"
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                editable={!isSubmitting}
                className={cn(
                  "px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-sm",
                  isSubmitting && "opacity-50"
                )}
              />
            </View>

            {/* Specialty Input */}
            <View className="gap-1">
              <Text className="text-xs font-semibold text-foreground">Especialidade</Text>
              <TextInput
                placeholder="Ex: Fonoaudiologia, Fisioterapia"
                placeholderTextColor="#999"
                value={formData.specialty}
                onChangeText={(text) => setFormData({ ...formData, specialty: text })}
                editable={!isSubmitting}
                className={cn(
                  "px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-sm",
                  isSubmitting && "opacity-50"
                )}
              />
            </View>

            {/* Professional ID Input */}
            <View className="gap-1">
              <Text className="text-xs font-semibold text-foreground">Registro Profissional</Text>
              <TextInput
                placeholder="Ex: CRM, CREFONO"
                placeholderTextColor="#999"
                value={formData.professionalId}
                onChangeText={(text) => setFormData({ ...formData, professionalId: text })}
                editable={!isSubmitting}
                className={cn(
                  "px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-sm",
                  isSubmitting && "opacity-50"
                )}
              />
            </View>

            {/* Password Input */}
            <View className="gap-1">
              <Text className="text-xs font-semibold text-foreground">Senha *</Text>
              <TextInput
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
                editable={!isSubmitting}
                className={cn(
                  "px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-sm",
                  isSubmitting && "opacity-50"
                )}
              />
            </View>

            {/* Confirm Password Input */}
            <View className="gap-1">
              <Text className="text-xs font-semibold text-foreground">Confirmar Senha *</Text>
              <TextInput
                placeholder="Repita sua senha"
                placeholderTextColor="#999"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry
                editable={!isSubmitting}
                className={cn(
                  "px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-sm",
                  isSubmitting && "opacity-50"
                )}
              />
            </View>

            {/* Invite Code Input */}
            <View className="gap-1">
              <Text className="text-xs font-semibold text-foreground">Código de Convite</Text>
              <TextInput
                placeholder="Opcional"
                placeholderTextColor="#999"
                value={formData.inviteCode}
                onChangeText={(text) => setFormData({ ...formData, inviteCode: text })}
                editable={!isSubmitting}
                className={cn(
                  "px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-sm",
                  isSubmitting && "opacity-50"
                )}
              />
            </View>

            {/* Error Message */}
            {error && (
              <View className="p-3 rounded-lg bg-error/10 border border-error">
                <Text className="text-xs text-error">{error}</Text>
              </View>
            )}

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isSubmitting}
              className={cn(
                "py-3 rounded-lg items-center justify-center mt-2",
                isSubmitting ? "bg-primary/50" : "bg-primary"
              )}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-sm font-semibold text-background">Registrar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-xs text-muted">Já tem uma conta?</Text>
            <TouchableOpacity onPress={handleLoginPress} disabled={isSubmitting}>
              <Text className={cn(
                "text-xs font-semibold text-primary",
                isSubmitting && "opacity-50"
              )}>
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
