import { Modal, View, Text, TouchableOpacity, ScrollView, TextInput, Platform } from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "./ui/icon-symbol";
import { helmetRegions } from "@/shared/helmet-data";
import * as Haptics from "expo-haptics";

export interface AdvancedFilters {
  diagnosis?: string;
  status?: "active" | "paused" | "completed" | "all";
  startDateFrom?: string;
  startDateTo?: string;
  regions?: string[];
}

interface AdvancedFiltersModalProps {
  visible: boolean;
  filters: AdvancedFilters;
  onApply: (filters: AdvancedFilters) => void;
  onClose: () => void;
}

export function AdvancedFiltersModal({ visible, filters, onApply, onClose }: AdvancedFiltersModalProps) {
  const colors = useColors();
  const [localFilters, setLocalFilters] = useState<AdvancedFilters>(filters);

  const handleApply = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setLocalFilters({
      diagnosis: "",
      status: "all",
      startDateFrom: "",
      startDateTo: "",
      regions: [],
    });
  };

  const toggleRegion = (regionId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const currentRegions = localFilters.regions || [];
    const newRegions = currentRegions.includes(regionId)
      ? currentRegions.filter((r) => r !== regionId)
      : [...currentRegions, regionId];
    
    setLocalFilters({ ...localFilters, regions: newRegions });
  };

  const activeFiltersCount = [
    localFilters.diagnosis && localFilters.diagnosis.length > 0,
    localFilters.status && localFilters.status !== "all",
    localFilters.startDateFrom && localFilters.startDateFrom.length > 0,
    localFilters.startDateTo && localFilters.startDateTo.length > 0,
    localFilters.regions && localFilters.regions.length > 0,
  ].filter(Boolean).length;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
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
          <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground }}>
                  Filtros Avançados
                </Text>
                {activeFiltersCount > 0 && (
                  <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
                    {activeFiltersCount} {activeFiltersCount === 1 ? "filtro ativo" : "filtros ativos"}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <IconSymbol name="house.fill" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {/* Filtro por Diagnóstico */}
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                Diagnóstico
              </Text>
              <TextInput
                value={localFilters.diagnosis || ""}
                onChangeText={(text) => setLocalFilters({ ...localFilters, diagnosis: text })}
                placeholder="Digite o diagnóstico..."
                placeholderTextColor={colors.muted}
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: colors.foreground,
                }}
              />
            </View>

            {/* Filtro por Status */}
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                Status do Tratamento
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {[
                  { value: "all", label: "Todos" },
                  { value: "active", label: "Ativo" },
                  { value: "paused", label: "Pausado" },
                  { value: "completed", label: "Concluído" },
                ].map((status) => {
                  const isSelected = (localFilters.status || "all") === status.value;
                  return (
                    <TouchableOpacity
                      key={status.value}
                      onPress={() => {
                        if (Platform.OS !== "web") {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                        setLocalFilters({ ...localFilters, status: status.value as any });
                      }}
                      activeOpacity={0.7}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: isSelected ? colors.primary : colors.surface,
                        borderWidth: 1,
                        borderColor: isSelected ? colors.primary : colors.border,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: isSelected ? "#FFFFFF" : colors.foreground,
                        }}
                      >
                        {status.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Filtro por Período */}
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                Período de Tratamento
              </Text>
              <View style={{ gap: 12 }}>
                <View>
                  <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 8 }}>
                    Data de Início (De)
                  </Text>
                  <TextInput
                    value={localFilters.startDateFrom || ""}
                    onChangeText={(text) => setLocalFilters({ ...localFilters, startDateFrom: text })}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor={colors.muted}
                    keyboardType="numeric"
                    maxLength={10}
                    style={{
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 16,
                      color: colors.foreground,
                    }}
                  />
                </View>
                <View>
                  <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 8 }}>
                    Data de Início (Até)
                  </Text>
                  <TextInput
                    value={localFilters.startDateTo || ""}
                    onChangeText={(text) => setLocalFilters({ ...localFilters, startDateTo: text })}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor={colors.muted}
                    keyboardType="numeric"
                    maxLength={10}
                    style={{
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 16,
                      color: colors.foreground,
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Filtro por Regiões Cerebrais */}
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                Regiões Cerebrais Estimuladas
              </Text>
              <Text style={{ fontSize: 14, color: colors.muted }}>
                Selecione as regiões para filtrar pacientes que receberam estimulação nessas áreas
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {helmetRegions.map((region) => {
                  const isSelected = (localFilters.regions || []).includes(region.id);
                  return (
                    <TouchableOpacity
                      key={region.id}
                      onPress={() => toggleRegion(region.id)}
                      activeOpacity={0.7}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: isSelected ? region.colorHex : colors.surface,
                        borderWidth: 1,
                        borderColor: isSelected ? region.colorHex : colors.border,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: isSelected ? "#FFFFFF" : region.colorHex,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: isSelected ? "#FFFFFF" : colors.foreground,
                        }}
                      >
                        {region.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Botões de Ação */}
            <View style={{ gap: 12, marginTop: 8 }}>
              <TouchableOpacity
                onPress={handleApply}
                activeOpacity={0.7}
                style={{
                  backgroundColor: colors.primary,
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF" }}>
                  Aplicar Filtros
                </Text>
              </TouchableOpacity>

              {activeFiltersCount > 0 && (
                <TouchableOpacity
                  onPress={handleClear}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 16,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                    Limpar Filtros
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
