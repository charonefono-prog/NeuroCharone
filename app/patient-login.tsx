import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePatientAuth } from "@/hooks/use-patient-auth";
import * as Haptics from "expo-haptics";

export default function PatientLoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const { loginPatient } = usePatientAuth();

  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!patientId.trim() || !patientName.trim() || !accessCode.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const success = await loginPatient(patientId, patientName, accessCode);

      if (success) {
        // Navegar para visualização de histórico do paciente
        router.replace("/patient-history");
      } else {
        Alert.alert("Erro", "Código de acesso inválido. Verifique os dados e tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert("Erro", "Ocorreu um erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center gap-6">
          {/* Cabeçalho */}
          <View className="items-center gap-2 mb-8">
            <Text className="text-4xl font-bold text-foreground">Meu Histórico</Text>
            <Text className="text-base text-muted text-center">
              Visualize sua evolução nas escalas de avaliação
            </Text>
          </View>

          {/* Formulário */}
          <View className="gap-4">
            {/* ID do Paciente */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">ID do Paciente</Text>
              <TextInput
                placeholder="Digite seu ID de paciente"
                value={patientId}
                onChangeText={setPatientId}
                editable={!loading}
                placeholderTextColor={colors.muted}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 16,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                }}
              />
            </View>

            {/* Nome do Paciente */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Nome Completo</Text>
              <TextInput
                placeholder="Digite seu nome completo"
                value={patientName}
                onChangeText={setPatientName}
                editable={!loading}
                placeholderTextColor={colors.muted}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 16,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                }}
              />
            </View>

            {/* Código de Acesso */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Código de Acesso</Text>
              <Text className="text-xs text-muted mb-2">
                (Fornecido pelo seu profissional de saúde)
              </Text>
              <TextInput
                placeholder="Digite seu código de acesso"
                value={accessCode}
                onChangeText={setAccessCode}
                editable={!loading}
                secureTextEntry
                placeholderTextColor={colors.muted}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 16,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                }}
              />
            </View>
          </View>

          {/* Botão de Login */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: loading ? colors.muted : colors.primary,
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Text style={{ fontSize: 16, color: "white", fontWeight: "600" }}>
              {loading ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          {/* Informações */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 12,
              gap: 8,
              marginTop: 16,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
              ℹ️ Como Acessar
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 20 }}>
              Você recebeu um ID de paciente e um código de acesso do seu profissional de saúde.
              Use esses dados para acessar seu histórico de evolução.
            </Text>
          </View>

          {/* Voltar */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginTop: 16, alignItems: "center" }}
          >
            <Text style={{ fontSize: 14, color: colors.primary, fontWeight: "500" }}>
              ← Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
