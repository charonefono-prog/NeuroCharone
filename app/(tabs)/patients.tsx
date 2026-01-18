import { ScrollView, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getPatients, type Patient } from "@/lib/local-storage";
import { AddPatientModal } from "@/components/add-patient-modal";
import { useRouter } from "expo-router";

export default function PatientsScreen() {
  const colors = useColors();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused" | "completed">("all");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Error loading patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return colors.success;
      case "paused":
        return colors.warning;
      case "completed":
        return colors.muted;
      default:
        return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "paused":
        return "Pausado";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, gap: 16 }}>
          {/* Header */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.foreground }}>
              Pacientes
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              {filteredPatients.length} paciente(s) encontrado(s)
            </Text>
          </View>

          {/* Busca */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
              gap: 8,
            }}
          >
            <IconSymbol name="house.fill" size={20} color={colors.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar por nome..."
              placeholderTextColor={colors.muted}
              style={{
                flex: 1,
                paddingVertical: 12,
                fontSize: 16,
                color: colors.foreground,
              }}
            />
          </View>

          {/* Filtros */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {(["all", "active", "paused", "completed"] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setStatusFilter(status)}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: statusFilter === status ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: statusFilter === status ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: statusFilter === status ? "#FFFFFF" : colors.foreground,
                    }}
                  >
                    {status === "all" ? "Todos" : getStatusLabel(status)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Botão Flutuante */}
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.8}
            style={{
              position: "absolute",
              right: 24,
              bottom: 24,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              zIndex: 999,
            }}
          >
            <IconSymbol name="house.fill" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Lista de Pacientes */}
          <View style={{ gap: 12 }}>
            {filteredPatients.length === 0 ? (
              <View style={{ padding: 32, alignItems: "center" }}>
                <IconSymbol name="house.fill" size={48} color={colors.muted} />
                <Text style={{ fontSize: 16, color: colors.muted, marginTop: 16, textAlign: "center" }}>
                  Nenhum paciente encontrado
                </Text>
                <Text style={{ fontSize: 14, color: colors.muted, marginTop: 8, textAlign: "center" }}>
                  {search ? "Tente uma busca diferente" : "Adicione seu primeiro paciente"}
                </Text>
              </View>
            ) : (
              filteredPatients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  onPress={() => router.push(`/(patient)/${patient.id}` as any)}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 16,
                    gap: 8,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                        {patient.fullName}
                      </Text>
                      <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
                        {calculateAge(patient.birthDate)} anos
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 12,
                        backgroundColor: getStatusColor(patient.status) + "20",
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: "600", color: getStatusColor(patient.status) }}>
                        {getStatusLabel(patient.status)}
                      </Text>
                    </View>
                  </View>

                  {patient.diagnosis && (
                    <Text style={{ fontSize: 14, color: colors.muted }} numberOfLines={2}>
                      {patient.diagnosis}
                    </Text>
                  )}

                  {patient.phone && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <IconSymbol name="house.fill" size={16} color={colors.muted} />
                      <Text style={{ fontSize: 14, color: colors.muted }}>
                        {patient.phone}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal de Cadastro */}
      <AddPatientModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadPatients}
      />
    </ScreenContainer>
  );
}
