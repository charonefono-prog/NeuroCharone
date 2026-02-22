import { ScrollView, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getPatients, getPlansByPatient, getSessionsByPatient, updatePatient, deletePatient, type Patient } from "@/lib/local-storage";
import { AddPatientModal } from "@/components/add-patient-modal";
import { AdvancedFiltersModal, type AdvancedFilters } from "@/components/advanced-filters-modal";
import { filterPatients, countActiveFilters, getDefaultFilters, type PatientWithData } from "@/lib/patient-filters";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform, Alert } from "react-native";
import { exportPatientsToCSV } from "@/lib/csv-export";

export default function PatientsScreen() {
  const colors = useColors();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused" | "completed">("all");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsWithData, setPatientsWithData] = useState<PatientWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(getDefaultFilters());
  const router = useRouter();

  useEffect(() => {
    loadPatients();
  }, []);

  const handleExportCSV = async () => {
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      const filePath = await exportPatientsToCSV(patients);
      if (filePath) {
        Alert.alert("Sucesso", "Dados exportados com sucesso!");
      } else {
        Alert.alert("Erro", "Não foi possível exportar os dados.");
      }
    } catch (error) {
      console.error("Erro ao exportar:", error);
      Alert.alert("Erro", "Ocorreu um erro ao exportar os dados.");
    }
  };

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);

      // Carregar dados adicionais para filtragem
      const withData = await Promise.all(
        data.map(async (patient) => {
          const [plans, sessions] = await Promise.all([
            getPlansByPatient(patient.id),
            getSessionsByPatient(patient.id),
          ]);
          return { patient, plans, sessions };
        })
      );
      setPatientsWithData(withData);
    } catch (error) {
      console.error("Error loading patients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros avançados primeiro
  const advancedFiltered = filterPatients(patientsWithData, advancedFilters);
  
  // Depois aplicar busca por nome e filtro de status simples
  const filteredPatients = advancedFiltered
    .map((item) => item.patient)
    .filter((patient) => {
      const matchesSearch = patient.fullName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const activeFiltersCount = countActiveFilters(advancedFilters);

  const handleApplyFilters = (filters: AdvancedFilters) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setAdvancedFilters(filters);
  };

  const handleClearAllFilters = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setAdvancedFilters(getDefaultFilters());
    setStatusFilter("all");
    setSearch("");
  };

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
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ gap: 8, flex: 1 }}>
              <Text style={{ fontSize: 28, fontWeight: "700", color: colors.foreground, letterSpacing: -0.5 }}>
                Pacientes
              </Text>
              <Text style={{ fontSize: 14, color: colors.muted }}>
                {filteredPatients.length} paciente(s) encontrado(s)
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={handleExportCSV}
                activeOpacity={0.7}
                style={{
                  backgroundColor: colors.surface,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Exportar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowFiltersModal(true)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: activeFiltersCount > 0 ? colors.primary : colors.surface,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: activeFiltersCount > 0 ? colors.primary : colors.border,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
              <IconSymbol
                name="chevron.left.forwardslash.chevron.right"
                size={20}
                color={activeFiltersCount > 0 ? "#FFFFFF" : colors.foreground}
              />
              {activeFiltersCount > 0 && (
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.primary }}>
                    {activeFiltersCount}
                  </Text>
                </View>
              )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Indicador de Filtros Ativos */}
          {activeFiltersCount > 0 && (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 14, color: colors.foreground }}>
                {activeFiltersCount} {activeFiltersCount === 1 ? "filtro ativo" : "filtros ativos"}
              </Text>
              <TouchableOpacity onPress={handleClearAllFilters} activeOpacity={0.7}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
                  Limpar Tudo
                </Text>
              </TouchableOpacity>
            </View>
          )}

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

                  {/* Botões de Ação */}
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
                    {patient.status !== "completed" && (
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            "Marcar como Concluído",
                            "Tem certeza que deseja marcar este paciente como concluído?",
                            [
                              { text: "Cancelar", style: "cancel" },
                              {
                                text: "Concluir",
                                style: "default",
                                onPress: async () => {
                                  try {
                                    await updatePatient(patient.id, { status: "completed" });
                                    loadPatients();
                                  } catch (error) {
                                    Alert.alert("Erro", "Não foi possível atualizar o paciente.");
                                    console.error(error);
                                  }
                                },
                              },
                            ]
                          );
                        }}
                        activeOpacity={0.7}
                        style={{
                          flex: 1,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 8,
                          backgroundColor: colors.success,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: "600", color: "#FFFFFF" }}>
                          Concluir
                        </Text>
                      </TouchableOpacity>
                    )}
                    
                    {patient.status === "completed" && (
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            "Reabrir Paciente",
                            "Tem certeza que deseja reabrir este paciente?",
                            [
                              { text: "Cancelar", style: "cancel" },
                              {
                                text: "Reabrir",
                                style: "default",
                                onPress: async () => {
                                  try {
                                    await updatePatient(patient.id, { status: "active" });
                                    loadPatients();
                                  } catch (error) {
                                    Alert.alert("Erro", "Não foi possível atualizar o paciente.");
                                    console.error(error);
                                  }
                                },
                              },
                            ]
                          );
                        }}
                        activeOpacity={0.7}
                        style={{
                          flex: 1,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 8,
                          backgroundColor: colors.warning,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: "600", color: "#FFFFFF" }}>
                          Reabrir
                        </Text>
                      </TouchableOpacity>
                    )}
                    
                    {patient.status === "active" && (
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            "Pausar Paciente",
                            "Tem certeza que deseja pausar este paciente?",
                            [
                              { text: "Cancelar", style: "cancel" },
                              {
                                text: "Pausar",
                                style: "destructive",
                                onPress: async () => {
                                  try {
                                    await updatePatient(patient.id, { status: "paused" });
                                    loadPatients();
                                  } catch (error) {
                                    Alert.alert("Erro", "Não foi possível atualizar o paciente.");
                                    console.error(error);
                                  }
                                },
                              },
                            ]
                          );
                        }}
                        activeOpacity={0.7}
                        style={{
                          flex: 1,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 8,
                          backgroundColor: colors.warning,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: "600", color: "#FFFFFF" }}>
                          Pausar
                        </Text>
                      </TouchableOpacity>
                    )}
                    
                    {patient.status === "paused" && (
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            "Reativar Paciente",
                            "Tem certeza que deseja reativar este paciente?",
                            [
                              { text: "Cancelar", style: "cancel" },
                              {
                                text: "Reativar",
                                style: "default",
                                onPress: async () => {
                                  try {
                                    await updatePatient(patient.id, { status: "active" });
                                    loadPatients();
                                  } catch (error) {
                                    Alert.alert("Erro", "Não foi possível atualizar o paciente.");
                                    console.error(error);
                                  }
                                },
                              },
                            ]
                          );
                        }}
                        activeOpacity={0.7}
                        style={{
                          flex: 1,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 8,
                          backgroundColor: colors.success,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: "600", color: "#FFFFFF" }}>
                          Reativar
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          "Excluir Paciente",
                          "Esta ação não pode ser desfeita. Todos os dados do paciente serão removidos.",
                          [
                            { text: "Cancelar", style: "cancel" },
                            {
                              text: "Excluir",
                              style: "destructive",
                              onPress: async () => {
                                try {
                                  const success = await deletePatient(patient.id);
                                  if (success) {
                                    loadPatients();
                                  } else {
                                    Alert.alert("Erro", "Não foi possível excluir o paciente.");
                                  }
                                } catch (error) {
                                  Alert.alert("Erro", "Ocorreu um erro ao excluir o paciente.");
                                  console.error(error);
                                }
                              },
                            },
                          ]
                        );
                      }}
                      activeOpacity={0.7}
                      style={{
                        flex: 1,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor: colors.error,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: "600", color: "#FFFFFF" }}>
                        Excluir
                      </Text>
                    </TouchableOpacity>
                  </View>
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
      
      {/* Modal de Filtros Avançados */}
      <AdvancedFiltersModal
        visible={showFiltersModal}
        filters={advancedFilters}
        onApply={handleApplyFilters}
        onClose={() => setShowFiltersModal(false)}
      />
    </ScreenContainer>
  );
}
