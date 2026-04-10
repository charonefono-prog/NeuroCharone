import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "./ui/icon-symbol";
import { savePatient } from "@/lib/local-storage";
import * as Haptics from "expo-haptics";

interface AddPatientModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPatientModal({ visible, onClose, onSuccess }: AddPatientModalProps) {
  const colors = useColors();
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [initialSymptomScore, setInitialSymptomScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, "");
    
    // Aplica máscara DD/MM/AAAA
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const formatPhone = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, "");
    
    // Aplica máscara (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const validateDate = (dateStr: string): boolean => {
    if (dateStr.length !== 10) return false;
    
    const [day, month, year] = dateStr.split("/").map(Number);
    if (!day || !month || !year) return false;
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    
    return true;
  };

  const handleSave = async () => {
    setError("");

    // Validações
    if (!fullName.trim()) {
      setError("Nome completo é obrigatório");
      return;
    }

    if (!birthDate.trim()) {
      setError("Data de nascimento é obrigatória");
      return;
    }

    if (!validateDate(birthDate)) {
      setError("Data de nascimento inválida (use DD/MM/AAAA)");
      return;
    }

    if (!diagnosis.trim()) {
      setError("Diagnóstico é obrigatório");
      return;
    }

    try {
      setLoading(true);
      
      // Converter data de DD/MM/AAAA para AAAA-MM-DD
      const [day, month, year] = birthDate.split("/");
      const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      await savePatient({
        fullName: fullName.trim(),
        birthDate: isoDate,
        phone: phone.trim() || undefined,
        diagnosis: diagnosis.trim(),
        initialSymptomScore: initialSymptomScore.trim() ? Number(initialSymptomScore) : undefined,
        status: "active",
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Limpar formulário
      setFullName("");
      setBirthDate("");
      setPhone("");
      setDiagnosis("");
      setInitialSymptomScore("");
      setError("");

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving patient:", err);
      setError("Erro ao salvar paciente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName("");
    setBirthDate("");
    setPhone("");
    setDiagnosis("");
    setInitialSymptomScore("");
    setError("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "90%",
          }}
        >
          <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground }}>
                Novo Paciente
              </Text>
              <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
                <IconSymbol name="house.fill" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {/* Erro */}
            {error ? (
              <View
                style={{
                  backgroundColor: colors.error + "20",
                  padding: 12,
                  borderRadius: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.error,
                }}
              >
                <Text style={{ color: colors.error, fontSize: 14 }}>{error}</Text>
              </View>
            ) : null}

            {/* Campos */}
            <View style={{ gap: 16 }}>
              {/* Nome Completo */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Nome Completo *
                </Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Digite o nome completo"
                  placeholderTextColor={colors.muted}
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: colors.foreground,
                  }}
                />
              </View>

              {/* Data de Nascimento */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Data de Nascimento *
                </Text>
                <TextInput
                  value={birthDate}
                  onChangeText={(text) => setBirthDate(formatDate(text))}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  maxLength={10}
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: colors.foreground,
                  }}
                />
              </View>

              {/* Telefone */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Telefone
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={(text) => setPhone(formatPhone(text))}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor={colors.muted}
                  keyboardType="phone-pad"
                  maxLength={15}
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: colors.foreground,
                  }}
                />
              </View>

              {/* Diagnóstico */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Diagnóstico *
                </Text>
                <TextInput
                  value={diagnosis}
                  onChangeText={setDiagnosis}
                  placeholder="Digite o diagnóstico"
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: colors.foreground,
                    minHeight: 100,
                  }}
                />
              </View>

              {/* Avaliação Inicial de Sintomas */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Avaliação Inicial dos Sintomas (0-10)
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: -4 }}>
                  0 = Sem sintomas | 10 = Sintomas muito intensos
                </Text>
                <TextInput
                  value={initialSymptomScore}
                  onChangeText={(text) => {
                    // Limitar entre 0 e 10
                    const num = Number(text);
                    if (text === "" || (num >= 0 && num <= 10)) {
                      setInitialSymptomScore(text);
                    }
                  }}
                  placeholder="Ex: 8"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: colors.foreground,
                  }}
                />
              </View>
            </View>

            {/* Botões */}
            <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
              <TouchableOpacity
                onPress={handleCancel}
                disabled={loading}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={loading}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF" }}>
                  {loading ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
