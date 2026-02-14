import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { COLORED_REGIONS } from "@/shared/manual-colored-points";
import { useColors } from "@/hooks/use-colors";

export interface RegionColorFilterProps {
  selectedRegion: string | null;
  onRegionSelect: (regionId: string | null) => void;
}

export function RegionColorFilter({
  selectedRegion,
  onRegionSelect,
}: RegionColorFilterProps) {
  const colors = useColors();

  return (
    <View className="bg-surface rounded-lg p-4 mb-4 border border-border">
      <Text className="text-sm font-semibold text-foreground mb-3">
        Filtrar por Região
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* Botão "Todas as cores" */}
        <Pressable
          onPress={() => onRegionSelect(null)}
          className={`mr-2 px-4 py-2 rounded-full border-2 ${
            selectedRegion === null
              ? "bg-primary border-primary"
              : "bg-transparent border-border"
          }`}
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          <Text
            className={`text-xs font-semibold ${
              selectedRegion === null ? "text-background" : "text-foreground"
            }`}
          >
            Todas
          </Text>
        </Pressable>

        {/* Botões de regiões coloridas */}
        {COLORED_REGIONS.map((region) => (
          <Pressable
            key={region.id}
            onPress={() => onRegionSelect(region.id)}
            className={`mr-2 px-4 py-2 rounded-full border-2 ${
              selectedRegion === region.id
                ? "border-foreground"
                : "border-transparent"
            }`}
            style={{
              backgroundColor: region.colorHex,
            }}
          >
            <Text className="text-xs font-semibold text-black">
              {region.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {selectedRegion && (
        <View className="mt-3 pt-3 border-t border-border">
          <Text className="text-xs text-muted">
            {COLORED_REGIONS.find((r) => r.id === selectedRegion)?.name} -
            Aplicações:{" "}
            {COLORED_REGIONS.find((r) => r.id === selectedRegion)?.applications.join(
              ", "
            )}
          </Text>
        </View>
      )}
    </View>
  );
}
