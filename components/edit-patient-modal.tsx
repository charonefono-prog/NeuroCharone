import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useState, useEffect } from "react";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "./ui/icon-symbol";
import { updatePatient, type Patient } from "@/lib/local-storage";
import * as Haptics from "expo-haptics";

interface EditPatientModalProps {
  visible: boolean;
  patient: Patient;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPatientModal({ visible, patient, onClose, onSuccess }: EditPatientModalProps) {
  const colors = useColors();
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [initialSymptomScore, setInitialSymptomScore] = useState("");
  const [status, setStatus] = useState<"active" | "paused" | "completed">("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible && patient) {
      setFullName(patient.fullName);
      setBirthDate(patient.birthDate.split("T")[0]);
      setPhone(patient.phone || "");
      setEmail(patient.email || "");
      setDiagnosis(patient.diagnosis || "");
      setMedicalNotes(patient.medicalNotes || "");
      setInitialSymptomScore(patient.initialSymptomScore?.toString() || "");
      setStatus(patient.status);
    }
  }, [visible, patient]);

  const formatDateInput = (text: string) => {
    const numbers = text.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const formatPhoneInput = (text: string) => {
    const numbers = text.replace(/\D/g, "");
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSave = async () => {
    setError("");

    // Validações
    if (!fullName.trim()) {
      setError("Nome completo é obrigatório");
      return;
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!birthDate || !dateRegex.test(birthDate)) {
      setError("Data de nascimento inválida (use DD/MM/AAAA)");
      return;
    }

    const [day, month, year] = birthDate.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      setError("Data de nascimento inválida");
      return;
    }

    try {
      setLoading(true);

      await updatePatient(patient.id, {
        fullName: fullName.trim(),
        birthDate: date.toISOString(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        diagnosis: diagnosis.trim() || undefined,
        medicalNotes: medicalNotes.trim() || undefined,
        initialSymptomScore: initialSymptomScore.trim() ? Number(initialSymptomScore) : undefined,
        status,
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating patient:", err);
      setError("Erro ao atualizar paciente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleCancel}>
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
            maxHeight: "95%",
          }}
        >
          <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground }}>
                Editar Paciente
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
                  placeholder="Nome completo do paciente"
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
                  onChangeText={(text) => setBirthDate(formatDateInput(text))}
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
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>Telefone</Text>
                <TextInput
                  value={phone}
                  onChangeText={(text) => setPhone(formatPhoneInput(text))}
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

              {/* Email */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@exemplo.com"
                  placeholderTextColor={colors.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
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
                  Diagnóstico
                </Text>
                <TextInput
                  value={diagnosis}
                  onChangeText={setDiagnosis}
                  placeholder="Diagnóstico médico"
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: colors.foreground,
                    minHeight: 80,
                  }}
                />
              </View>

              {/* Observações Médicas */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Observações Médicas
                </Text>
                <TextInput
                  value={medicalNotes}
                  onChangeText={setMedicalNotes}
                  placeholder="Observações adicionais"
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: colors.foreground,
                    minHeight: 80,
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

              {/* Status */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Status do Tratamento
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {[
                    { value: "active" as const, label: "Ativo", color: colors.success },
                    { value: "paused" as const, label: "Pausado", color: colors.warning },
                    { value: "completed" as const, label: "Concluído", color: colors.muted },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setStatus(option.value)}
                      activeOpacity={0.7}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 12,
                        backgroundColor: status === option.value ? option.color : colors.surface,
                        borderWidth: 1,
                        borderColor: status === option.value ? option.color : colors.border,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: status === option.value ? "#FFFFFF" : colors.foreground,
                        }}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
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
