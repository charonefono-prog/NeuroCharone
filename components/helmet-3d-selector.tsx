import { View, Text, TouchableOpacity, Image, ScrollView, Platform } from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import { helmetRegions, getRegionById } from "@/shared/helmet-data";
import * as Haptics from "expo-haptics";
import { RegionInfoModal } from "./region-info-modal";
import { IconSymbol } from "./ui/icon-symbol";

interface Helmet3DSelectorProps {
  selectedPoints: string[];
  onPointsChange: (points: string[]) => void;
  title?: string;
}

export function Helmet3DSelector({ selectedPoints, onPointsChange, title }: Helmet3DSelectorProps) {
  const colors = useColors();
  const [view, setView] = useState<"top" | "side">("top");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedRegionInfo, setSelectedRegionInfo] = useState<string | null>(null);

  const togglePoint = (pointName: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const newPoints = selectedPoints.includes(pointName)
      ? selectedPoints.filter((p) => p !== pointName)
      : [...selectedPoints, pointName];
    
    onPointsChange(newPoints);
  };

  const selectAllInRegion = (regionPoints: string[]) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const allSelected = regionPoints.every((p) => selectedPoints.includes(p));
    
    if (allSelected) {
      // Desselecionar todos da região
      onPointsChange(selectedPoints.filter((p) => !regionPoints.includes(p)));
    } else {
      // Selecionar todos da região
      const newPoints = [...new Set([...selectedPoints, ...regionPoints])];
      onPointsChange(newPoints);
    }
  };

  const showRegionInfo = (regionId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedRegionInfo(regionId);
    setShowInfoModal(true);
  };

  return (
    <View style={{ gap: 16 }}>
      {/* Título e Contador */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
          {title || "Pontos de Estimulação"}
        </Text>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            backgroundColor: colors.primary + "20",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
            {selectedPoints.length} selecionados
          </Text>
        </View>
      </View>

      {/* Seletor de Visualização */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 4,
          gap: 4,
        }}
      >
        <TouchableOpacity
          onPress={() => setView("top")}
          activeOpacity={0.7}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor: view === "top" ? colors.primary : "transparent",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: view === "top" ? "#FFFFFF" : colors.foreground,
            }}
          >
            Vista Superior
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setView("side")}
          activeOpacity={0.7}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor: view === "side" ? colors.primary : "transparent",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: view === "side" ? "#FFFFFF" : colors.foreground,
            }}
          >
            Vista Lateral
          </Text>
        </TouchableOpacity>
      </View>

      {/* Imagem do Capacete */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 16,
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Image
          source={view === "top" ? require("@/assets/images/helmet-top.png") : require("@/assets/images/helmet-side.png")}
          style={{
            width: "100%",
            height: 300,
            resizeMode: "contain",
          }}
        />
        <Text style={{ fontSize: 12, color: colors.muted, marginTop: 8, textAlign: "center" }}>
          {view === "top" ? "Visualização superior do capacete de neuromodulação" : "Visualização lateral do capacete de neuromodulação"}
        </Text>
      </View>

      {/* Seleção por Região */}
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
          Selecionar por Região
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {helmetRegions.map((region) => {
            const allSelected = region.points.every((p) => selectedPoints.includes(p));
            const someSelected = region.points.some((p) => selectedPoints.includes(p));

            return (
              <View key={region.id} style={{ flexDirection: "row", gap: 4 }}>
                <TouchableOpacity
                  onPress={() => selectAllInRegion(region.points)}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: allSelected ? region.colorHex : someSelected ? region.colorHex + "40" : colors.surface,
                    borderWidth: 1,
                    borderColor: someSelected ? region.colorHex : colors.border,
                    minWidth: 140,
                  }}
                >
                  <View style={{ gap: 4 }}>
                    <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: allSelected ? "#FFFFFF" : colors.foreground,
                    }}
                  >
                    {region.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: allSelected ? "#FFFFFF" : colors.muted,
                      marginTop: 2,
                    }}
                  >
                    {region.points.length} pontos
                  </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => showRegionInfo(region.id)}
                activeOpacity={0.7}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                  <Text style={{ fontSize: 18, color: colors.primary }}>ℹ️</Text>
                </TouchableOpacity>
              </View>
            );          })}
        </ScrollView>
      </View>

      {/* Seleção Individual de Pontos */}
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
          Pontos Individuais
        </Text>

        {helmetRegions.map((region) => (
          <View key={region.id} style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: region.colorHex,
                  }}
                />
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.muted }}>
                  {region.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => showRegionInfo(region.id)}
                activeOpacity={0.7}
                style={{ padding: 4 }}
              >
                <Text style={{ fontSize: 16 }}>ℹ️</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {region.points.map((pointName) => {
                const isSelected = selectedPoints.includes(pointName);
                return (
                  <TouchableOpacity
                    key={pointName}
                    onPress={() => togglePoint(pointName)}
                    activeOpacity={0.7}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 8,
                      backgroundColor: isSelected ? region.colorHex : colors.surface,
                      borderWidth: 1,
                      borderColor: isSelected ? region.colorHex : colors.border,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: isSelected ? "#FFFFFF" : colors.foreground,
                      }}
                    >
                      {pointName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      {/* Botão Limpar Seleção */}
      {selectedPoints.length > 0 && (
        <TouchableOpacity
          onPress={() => onPointsChange([])}
          activeOpacity={0.7}
          style={{
            paddingVertical: 12,
            borderRadius: 12,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.error,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.error }}>
            Limpar Seleção
          </Text>
        </TouchableOpacity>
      )}

      {/* Modal de Informações */}
      {selectedRegionInfo && (
        <RegionInfoModal
          visible={showInfoModal}
          region={getRegionById(selectedRegionInfo) || undefined}
          onClose={() => {
            setShowInfoModal(false);
            setSelectedRegionInfo(null);
          }}
        />
      )}
    </View>
  );
}
