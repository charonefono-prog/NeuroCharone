import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { helmetPoints, helmetRegions, getRegionById } from "@/shared/helmet-data";
import { useColors } from "@/hooks/use-colors";

interface HelmetViewProps {
  selectedPoints?: string[];
  onPointToggle?: (pointId: string) => void;
  readonly?: boolean;
  showLegend?: boolean;
}

export function HelmetView({
  selectedPoints = [],
  onPointToggle,
  readonly = false,
  showLegend = true,
}: HelmetViewProps) {
  const colors = useColors();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handlePointPress = (pointId: string) => {
    if (!readonly && onPointToggle) {
      onPointToggle(pointId);
    }
  };

  const isPointSelected = (pointId: string) => selectedPoints.includes(pointId);

  return (
    <View className="gap-4">
      {/* Visualização do Capacete */}
      <View className="bg-surface rounded-2xl p-4 border border-border">
        <Text className="text-lg font-semibold text-foreground mb-4 text-center">
          Mapeamento do Capacete (Sistema 10-20)
        </Text>

        {/* Grid de Pontos */}
        <View className="relative aspect-square w-full">
          {helmetPoints.map((point) => {
            const region = getRegionById(point.region);
            const selected = isPointSelected(point.id);

            return (
              <TouchableOpacity
                key={point.id}
                disabled={readonly}
                onPress={() => handlePointPress(point.id)}
                activeOpacity={0.7}
                style={{
                  position: "absolute",
                  left: `${point.position.x}%`,
                  top: `${point.position.y}%`,
                  transform: [{ translateX: -15 }, { translateY: -15 }],
                  backgroundColor: selected ? (region?.colorHex || colors.primary) : colors.surface,
                  borderColor: selected ? "#FFFFFF" : (region?.colorHex || colors.border),
                  borderWidth: 2,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  className="text-xs font-bold"
                  style={{
                    color: selected ? "#FFFFFF" : colors.foreground,
                  }}
                >
                  {point.name.length > 3 ? point.name.substring(0, 3) : point.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Informações do Ponto Selecionado */}
        {selectedPoints.length > 0 && (
          <View className="mt-4 p-3 bg-background rounded-xl border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Pontos Selecionados: {selectedPoints.length}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {selectedPoints.map((pointId) => {
                const point = helmetPoints.find((p) => p.id === pointId);
                const region = point ? getRegionById(point.region) : null;

                return (
                  <View
                    key={pointId}
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: region?.colorHex || colors.primary }}
                  >
                    <Text className="text-xs font-semibold text-white">{pointId}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>

      {/* Legenda de Regiões */}
      {showLegend && (
        <View className="bg-surface rounded-2xl p-4 border border-border">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Regiões do Capacete
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="gap-2">
              {helmetRegions.map((region) => (
                <TouchableOpacity
                  key={region.id}
                  onPress={() =>
                    setSelectedRegion(selectedRegion === region.id ? null : region.id)
                  }
                  activeOpacity={0.7}
                  className="flex-row items-center gap-3 p-2 rounded-lg"
                  style={{
                    backgroundColor:
                      selectedRegion === region.id ? colors.surface : "transparent",
                  }}
                >
                  <View
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: region.colorHex }}
                  />
                  <Text className="text-sm text-foreground font-medium">{region.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Informações da Região Selecionada */}
          {selectedRegion && (
            <View className="mt-4 p-3 bg-background rounded-xl border border-border">
              {(() => {
                const region = helmetRegions.find((r) => r.id === selectedRegion);
                if (!region) return null;

                return (
                  <View className="gap-2">
                    <Text className="text-base font-semibold text-foreground">
                      {region.name}
                    </Text>
                    <Text className="text-sm text-muted">
                      <Text className="font-semibold">Pontos: </Text>
                      {region.points.join(", ")}
                    </Text>
                    <Text className="text-sm text-muted">
                      <Text className="font-semibold">Funções: </Text>
                      {region.functions.join(", ")}
                    </Text>
                    <Text className="text-sm text-muted">
                      <Text className="font-semibold">Aplicações Clínicas: </Text>
                      {region.clinicalApplications.join(", ")}
                    </Text>
                  </View>
                );
              })()}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
