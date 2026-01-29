import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { HelmetView } from "@/components/helmet-view";
import type { TherapeuticPlan } from "@/lib/local-storage";

interface TherapeuticPlanDisplayProps {
  plan: TherapeuticPlan | null;
  patientName?: string;
}

/**
 * Componente para exibir o plano terapêutico com visualização do capacete marcado
 * Mostra a imagem do capacete com os pontos do plano já marcados
 */
export function TherapeuticPlanDisplay({ plan, patientName }: TherapeuticPlanDisplayProps) {
  const colors = useColors();

  if (!plan) {
    return null;
  }

  return (
    <View style={{ gap: 16, marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      {/* Header do Plano */}
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>
          Plano Terapêutico
        </Text>
        {patientName && (
          <Text style={{ fontSize: 13, color: colors.muted }}>
            Paciente: {patientName}
          </Text>
        )}
      </View>

      {/* Visualização do Capacete com Pontos Marcados */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 12,
        }}
      >
        <HelmetView
          selectedPoints={plan.targetPoints}
          readonly={true}
          showLegend={true}
        />
      </View>

      {/* Informações do Plano */}
      <View style={{ gap: 12 }}>
        {/* Objetivo */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 12,
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
            Objetivo
          </Text>
          <Text style={{ fontSize: 14, color: colors.foreground, lineHeight: 20 }}>
            {plan.objective}
          </Text>
        </View>

        {/* Regiões Alvo */}
        {plan.targetRegions.length > 0 && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 12,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
              Regiões Alvo
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {plan.targetRegions.map((region, index) => (
                <View
                  key={index}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: colors.primary + "20",
                  }}
                >
                  <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "500" }}>
                    {region}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Pontos Alvo */}
        {plan.targetPoints.length > 0 && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 12,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
              Pontos a Estimular
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {plan.targetPoints.map((point, index) => (
                <View
                  key={index}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: colors.primary + "25",
                    borderWidth: 1,
                    borderColor: colors.primary,
                  }}
                >
                  <Text style={{ fontSize: 13, color: colors.primary, fontWeight: "600" }}>
                    {point}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Frequência e Duração */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 12,
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
              Frequência
            </Text>
            <Text style={{ fontSize: 14, color: colors.foreground, fontWeight: "600" }}>
              {plan.frequency}x/semana
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 12,
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
              Duração Total
            </Text>
            <Text style={{ fontSize: 14, color: colors.foreground, fontWeight: "600" }}>
              {plan.totalDuration} semanas
            </Text>
          </View>
        </View>

        {/* Notas */}
        {plan.notes && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 12,
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
              Notas
            </Text>
            <Text style={{ fontSize: 14, color: colors.foreground, lineHeight: 20 }}>
              {plan.notes}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
