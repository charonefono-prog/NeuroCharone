import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { helmetPoints, helmetRegions } from "@/shared/helmet-data";
import { type Session } from "@/lib/local-storage";

interface SessionHelmetViewerProps {
  session: Session;
}

export function SessionHelmetViewer({ session }: SessionHelmetViewerProps) {
  const colors = useColors();
  const [showLabels, setShowLabels] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const helmetWidth = screenWidth - 48; // padding 24 * 2

  // Criar mapa de pontos estimulados para acesso rápido
  const stimulatedPointsSet = new Set(session.stimulatedPoints);

  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.muted }}>
          Visualização do Capacete
        </Text>
        <TouchableOpacity
          onPress={() => setShowLabels(!showLabels)}
          activeOpacity={0.7}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            backgroundColor: colors.primary + "20",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: colors.primary,
            }}
          >
            {showLabels ? "🏷️ Ocultar" : "🏷️ Mostrar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Imagem do Capacete com Pontos Sobrepostos */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
          alignItems: "center",
        }}
      >
        <View style={{ position: "relative", width: helmetWidth, height: helmetWidth }}>
          {/* Imagem do Capacete */}
          <Image
            source={require("@/assets/images/helmet-diagram.png")}
            style={{
              width: helmetWidth,
              height: helmetWidth,
              resizeMode: "contain",
            }}
          />

          {/* Pontos Sobrepostos */}
          {helmetPoints.map((point: any) => {
            const isStimulated = stimulatedPointsSet.has(point.name);

            if (!isStimulated) return null;

            // Obter cor da região
            const region = helmetRegions.find((r: any) => r.id === point.region);
            const pointColor = region?.color || colors.primary;

            // Calcular posição do ponto (em percentual da imagem)
            const x = (point.position.x / 100) * helmetWidth;
            const y = (point.position.y / 100) * helmetWidth;
            const pointRadius = 8;

            return (
              <View
                key={point.id}
                style={{
                  position: "absolute",
                  left: x - pointRadius,
                  top: y - pointRadius,
                  width: pointRadius * 2,
                  height: pointRadius * 2,
                  borderRadius: pointRadius,
                  backgroundColor: pointColor,
                  borderWidth: 2,
                  borderColor: "#FFFFFF",
                  shadowColor: pointColor,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.6,
                  shadowRadius: 4,
                  elevation: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                {/* Label do Ponto */}
                {showLabels && (
                  <View
                    style={{
                      position: "absolute",
                      top: -24,
                      left: -20,
                      backgroundColor: pointColor,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                      zIndex: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "700",
                        color: "#FFFFFF",
                      }}
                    >
                      {point.name}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Legenda de Pontos Estimulados */}
      {session.stimulatedPoints.length > 0 && (
        <View
          style={{
            backgroundColor: colors.primary + "10",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.primary + "30",
            padding: 12,
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
            Pontos Estimulados ({session.stimulatedPoints.length})
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {session.stimulatedPoints.map((pointName, index) => {
              const point = helmetPoints.find((p: any) => p.name === pointName);
              const region = point ? helmetRegions.find((r: any) => r.id === point.region) : null;
              const pointColor = region?.color || colors.primary;
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: pointColor,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: pointColor,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: colors.foreground,
                    }}
                  >
                    {pointName}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Informações da Sessão */}
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
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ gap: 2 }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: colors.muted }}>
              Duração
            </Text>
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
              {session.durationMinutes} min
            </Text>
          </View>
          <View style={{ gap: 2 }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: colors.muted }}>
              Intensidade
            </Text>
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
              {session.joules}J
            </Text>
          </View>
          {session.symptomScore !== undefined && (
            <View style={{ gap: 2 }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: colors.muted }}>
                Score
              </Text>
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.primary }}>
                {session.symptomScore}/10
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
