import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

export interface HelmetPointsSelectorProps {
  selectedPoints: string[];
  onPointsChange: (points: string[]) => void;
}

interface EEGPoint {
  id: string;
  name: string;
  region: string;
  color: string;
  functions: string[];
  clinicalApplications: string[];
}

const EEG_POINTS: EEGPoint[] = [
  { id: "Fp1", name: "Fp1", region: "Frontal Polar", color: "#EF4444", functions: ["Pré-frontal dorsolateral esquerdo"], clinicalApplications: ["Depressão", "Ansiedade", "TDAH"] },
  { id: "Fp2", name: "Fp2", region: "Frontal Polar", color: "#EF4444", functions: ["Pré-frontal dorsolateral direito"], clinicalApplications: ["Depressão", "Ansiedade", "TDAH"] },
  { id: "F7", name: "F7", region: "Frontal", color: "#FBBF24", functions: ["Córtex pré-frontal esquerdo"], clinicalApplications: ["Linguagem", "Memória", "Atenção"] },
  { id: "F3", name: "F3", region: "Frontal", color: "#FBBF24", functions: ["Córtex motor esquerdo"], clinicalApplications: ["Movimento", "Controle motor"] },
  { id: "Fz", name: "Fz", region: "Frontal Central", color: "#FBBF24", functions: ["Córtex motor central"], clinicalApplications: ["Movimento bilateral", "Equilíbrio"] },
  { id: "F4", name: "F4", region: "Frontal", color: "#FBBF24", functions: ["Córtex motor direito"], clinicalApplications: ["Movimento", "Controle motor"] },
  { id: "F8", name: "F8", region: "Frontal", color: "#FBBF24", functions: ["Córtex pré-frontal direito"], clinicalApplications: ["Linguagem", "Memória", "Atenção"] },
  { id: "C3", name: "C3", region: "Central", color: "#06B6D4", functions: ["Córtex sensório-motor esquerdo"], clinicalApplications: ["Dor", "Movimento", "Sensibilidade"] },
  { id: "Cz", name: "Cz", region: "Central", color: "#06B6D4", functions: ["Córtex sensório-motor central"], clinicalApplications: ["Movimento bilateral", "Dor central"] },
  { id: "C4", name: "C4", region: "Central", color: "#06B6D4", functions: ["Córtex sensório-motor direito"], clinicalApplications: ["Dor", "Movimento", "Sensibilidade"] },
  { id: "P3", name: "P3", region: "Parietal", color: "#A78BFA", functions: ["Córtex parietal esquerdo"], clinicalApplications: ["Dor", "Propriocepção", "Integração sensorial"] },
  { id: "Pz", name: "Pz", region: "Parietal", color: "#A78BFA", functions: ["Córtex parietal central"], clinicalApplications: ["Dor central", "Equilíbrio"] },
  { id: "P4", name: "P4", region: "Parietal", color: "#A78BFA", functions: ["Córtex parietal direito"], clinicalApplications: ["Dor", "Propriocepção", "Integração sensorial"] },
  { id: "O1", name: "O1", region: "Occipital", color: "#F87171", functions: ["Córtex visual esquerdo"], clinicalApplications: ["Visão", "Migrânea", "Processamento visual"] },
  { id: "Oz", name: "Oz", region: "Occipital", color: "#F87171", functions: ["Córtex visual central"], clinicalApplications: ["Visão central", "Migrânea"] },
  { id: "O2", name: "O2", region: "Occipital", color: "#F87171", functions: ["Córtex visual direito"], clinicalApplications: ["Visão", "Migrânea", "Processamento visual"] },
  { id: "T3", name: "T3", region: "Temporal", color: "#10B981", functions: ["Córtex temporal esquerdo"], clinicalApplications: ["Linguagem", "Memória", "Audição"] },
  { id: "T4", name: "T4", region: "Temporal", color: "#10B981", functions: ["Córtex temporal direito"], clinicalApplications: ["Linguagem", "Memória", "Audição"] },
  { id: "T5", name: "T5", region: "Temporal Posterior", color: "#10B981", functions: ["Junção têmporo-parietal esquerda"], clinicalApplications: ["Linguagem", "Memória", "Integração sensorial"] },
  { id: "T6", name: "T6", region: "Temporal Posterior", color: "#10B981", functions: ["Junção têmporo-parietal direita"], clinicalApplications: ["Linguagem", "Memória", "Integração sensorial"] },
  { id: "Nz", name: "Nz", region: "Nasion", color: "#9CA3AF", functions: ["Ponto de referência anterior"], clinicalApplications: ["Referência anatômica"] },
];

export function HelmetPointsSelector({
  selectedPoints,
  onPointsChange,
}: HelmetPointsSelectorProps) {
  const colors = useColors();
  const [selectedPointInfo, setSelectedPointInfo] = useState<EEGPoint | null>(null);

  const togglePoint = (pointId: string) => {
    if (selectedPoints.includes(pointId)) {
      onPointsChange(selectedPoints.filter(p => p !== pointId));
    } else {
      onPointsChange([...selectedPoints, pointId]);
    }
  };

  const getRegionColor = (region: string): string => {
    const regionColors: Record<string, string> = {
      "Frontal Polar": "#EF4444",
      "Frontal": "#FBBF24",
      "Frontal Central": "#FBBF24",
      "Central": "#06B6D4",
      "Parietal": "#A78BFA",
      "Occipital": "#F87171",
      "Temporal": "#10B981",
      "Temporal Posterior": "#10B981",
      "Nasion": "#9CA3AF",
    };
    return regionColors[region] || "#9CA3AF";
  };

  return (
    <View className="flex-1 gap-4">
      <View className="bg-surface rounded-lg p-4">
        <Text className="text-sm font-semibold text-foreground mb-2">
          Seleção de Pontos 10-20 EEG
        </Text>
        <Text className="text-xs text-muted">
          Clique nos pontos para selecionar/desselecionar. {selectedPoints.length} ponto(s) selecionado(s)
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="flex-wrap flex-row gap-2 p-2">
          {EEG_POINTS.map((point) => (
            <Pressable
              key={point.id}
              onPress={() => {
                togglePoint(point.id);
                setSelectedPointInfo(point);
              }}
              className={cn(
                "w-16 h-16 rounded-full items-center justify-center border-2",
                selectedPoints.includes(point.id)
                  ? "border-primary bg-opacity-80"
                  : "border-border bg-opacity-50"
              )}
              style={{
                backgroundColor: selectedPoints.includes(point.id)
                  ? getRegionColor(point.region)
                  : `${getRegionColor(point.region)}40`,
              }}
            >
              <Text
                className={cn(
                  "font-bold text-xs",
                  selectedPoints.includes(point.id)
                    ? "text-white"
                    : "text-foreground"
                )}
              >
                {point.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedPointInfo}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPointInfo(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-surface rounded-lg p-6 w-full max-w-sm">
            {selectedPointInfo && (
              <>
                <View className="flex-row items-center gap-3 mb-4">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: getRegionColor(selectedPointInfo.region) }}
                  >
                    <Text className="font-bold text-white text-lg">
                      {selectedPointInfo.name}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground">
                      {selectedPointInfo.name}
                    </Text>
                    <Text className="text-sm text-muted">
                      {selectedPointInfo.region}
                    </Text>
                  </View>
                </View>

                <View className="gap-3">
                  <View>
                    <Text className="text-sm font-semibold text-foreground mb-1">
                      Funções:
                    </Text>
                    {selectedPointInfo.functions.map((func, idx) => (
                      <Text key={idx} className="text-xs text-muted ml-2">
                        • {func}
                      </Text>
                    ))}
                  </View>

                  <View>
                    <Text className="text-sm font-semibold text-foreground mb-1">
                      Aplicações Clínicas:
                    </Text>
                    {selectedPointInfo.clinicalApplications.map((app, idx) => (
                      <Text key={idx} className="text-xs text-muted ml-2">
                        • {app}
                      </Text>
                    ))}
                  </View>
                </View>

                <Pressable
                  onPress={() => setSelectedPointInfo(null)}
                  className="mt-4 bg-primary rounded-lg p-3"
                >
                  <Text className="text-center font-semibold text-background">
                    Fechar
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
