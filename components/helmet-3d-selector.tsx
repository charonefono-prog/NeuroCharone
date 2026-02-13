import { View, Text, TouchableOpacity, ScrollView, Platform, Image } from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { helmetRegions, getRegionById, helmetPoints } from "@/shared/helmet-data";
import * as Haptics from "expo-haptics";
import { RegionInfoModal } from "./region-info-modal";
import { PointInfoModal } from "./point-info-modal";
import { IconSymbol } from "./ui/icon-symbol";

interface Helmet3DSelectorProps {
  selectedPoints: string[];
  onPointsChange: (points: string[]) => void;
  title?: string;
  selectedPointId?: string;
  onPointIdChange?: (pointId: string) => void;
}

export function Helmet3DSelector({ selectedPoints, onPointsChange, title, selectedPointId, onPointIdChange }: Helmet3DSelectorProps) {
  const router = useRouter();
  const colors = useColors();
  // Remover seletor de visualização - apenas vista superior (frontal)
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedRegionInfo, setSelectedRegionInfo] = useState<string | null>(null);
  const [showPointModal, setShowPointModal] = useState(false);
  const [selectedPointInfo, setSelectedPointInfo] = useState<string | null>(null);

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

      {/* Imagem do Sistema 10-20 EEG */}
      <View
        style={{
          backgroundColor: colors.surface,
          padding: 16,
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 16,
        }}
      >
        <Image
          source={require("@/assets/images/eeg-10-20-system.png")}
          style={{
            width: 320,
            height: 320,
            resizeMode: "contain",
          }}
        />
        <Text style={{ fontSize: 14, fontWeight: "500", color: colors.muted, textAlign: "center", marginTop: 8 }}>
          Sistema 10-20 - Pontos de Estimulação (Apenas áreas coloridas)
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
                const isHighlighted = selectedPointId === pointName;
                
                return (
                  <View
                    key={pointName}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        togglePoint(pointName);
                        onPointIdChange?.(pointName);
                      }}
                      activeOpacity={0.7}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 8,
                        backgroundColor: isSelected ? region.colorHex : colors.surface,
                        borderWidth: isHighlighted ? 3 : (isSelected ? 2 : 1),
                        borderColor: isHighlighted ? region.colorHex : (isSelected ? region.colorHex : colors.border),
                        shadowColor: isHighlighted ? region.colorHex : "transparent",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isHighlighted ? 0.4 : 0,
                        shadowRadius: isHighlighted ? 8 : 0,
                        elevation: isHighlighted ? 8 : 0,
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
                    <TouchableOpacity
                      onPress={() => {
                        if (Platform.OS !== "web") {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                        setSelectedPointInfo(pointName);
                        setShowPointModal(true);
                      }}
                      activeOpacity={0.7}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconSymbol name="info.circle" size={18} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
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

      {/* Modal de Informações de Região */}
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

      {/* Modal de Informações de Ponto */}
      <PointInfoModal
        visible={showPointModal}
        point={selectedPointInfo}
        onClose={() => {
          setShowPointModal(false);
          setSelectedPointInfo(null);
        }}
      />
    </View>
  );
}
