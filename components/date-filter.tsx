import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

export interface DateFilterProps {
  onDateRangeChange: (range: DateRange) => void;
  currentLabel?: string;
}

const PRESET_RANGES = [
  {
    label: "Últimas 4 semanas",
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 28);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: "Últimos 3 meses",
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: "Últimos 6 meses",
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: "Último 1 ano",
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setFullYear(start.getFullYear() - 1);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: "Todos os registros",
    getDates: () => {
      const end = new Date();
      const start = new Date("2000-01-01");
      return { startDate: start, endDate: end };
    },
  },
];

/**
 * Componente de filtro de data para análise de efetividade
 */
export function DateFilter({ onDateRangeChange, currentLabel = "Todos os registros" }: DateFilterProps) {
  const colors = useColors();
  const [showModal, setShowModal] = useState(false);

  const handleSelectRange = (preset: typeof PRESET_RANGES[0]) => {
    const dates = preset.getDates();
    onDateRangeChange({
      startDate: dates.startDate,
      endDate: dates.endDate,
      label: preset.label,
    });
    setShowModal(false);
  };

  return (
    <>
      {/* Botão de Filtro */}
      <Pressable
        onPress={() => setShowModal(true)}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: colors.primary + "15",
            borderWidth: 1,
            borderColor: colors.primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <IconSymbol name="calendar" size={16} color={colors.primary} />
        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>
          {currentLabel}
        </Text>
      </Pressable>

      {/* Modal de Seleção */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
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
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 20,
              paddingBottom: 32,
              gap: 12,
            }}
          >
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>
                Filtrar por Período
              </Text>
              <Pressable
                onPress={() => setShowModal(false)}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <IconSymbol name="xmark" size={24} color={colors.foreground} />
              </Pressable>
            </View>

            {/* Opções */}
            {PRESET_RANGES.map((preset, index) => (
              <Pressable
                key={index}
                onPress={() => handleSelectRange(preset)}
                style={({ pressed }) => [
                  {
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: preset.label === currentLabel ? colors.primary + "20" : colors.surface,
                    borderWidth: 1,
                    borderColor: preset.label === currentLabel ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: preset.label === currentLabel ? "700" : "500",
                      color: preset.label === currentLabel ? colors.primary : colors.foreground,
                    }}
                  >
                    {preset.label}
                  </Text>
                  {preset.label === currentLabel && (
                    <IconSymbol name="paperplane.fill" size={20} color={colors.primary} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}
