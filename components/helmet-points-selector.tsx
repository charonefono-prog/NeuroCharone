import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import { helmetRegions } from "@/shared/helmet-data";

interface HelmetPointsSelectorProps {
  selectedPoints: string[];
  onPointsChange: (points: string[]) => void;
  title?: string;
}

export function HelmetPointsSelector({
  selectedPoints,
  onPointsChange,
  title = "Pontos de Estimulação (10-20 EEG)",
}: HelmetPointsSelectorProps) {
  const colors = useColors();
  const [selectedPointInfo, setSelectedPointInfo] = useState<{
    pointId: string;
    regionName: string;
    functions: string[];
    clinicalApplications: string[];
  } | null>(null);

  // Extrair todos os pontos únicos
  const allPoints = Array.from(
    new Set(helmetRegions.flatMap((region) => region.points))
  ).sort();

  const getPointInfo = (pointId: string) => {
    const region = helmetRegions.find((r) => r.points.includes(pointId));
    if (!region) return null;
    return {
      pointId,
      regionName: region.name,
      functions: region.functions,
      clinicalApplications: region.clinicalApplications,
    };
  };

  const getPointColor = (pointId: string) => {
    const region = helmetRegions.find((r) => r.points.includes(pointId));
    return region?.colorHex || colors.border;
  };

  const togglePoint = (pointId: string) => {
    const newPoints = selectedPoints.includes(pointId)
      ? selectedPoints.filter((p) => p !== pointId)
      : [...selectedPoints, pointId];
    onPointsChange(newPoints);
  };

  return (
    <View style={{ gap: 12 }}>
      {/* Título */}
      <View>
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
          {title}
        </Text>
        <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
          {selectedPoints.length} ponto(s) selecionado(s)
        </Text>
      </View>

      {/* Grid de Pontos */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 16,
          gap: 12,
        }}
      >
        {/* Linha 1: Referência Anterior */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
          <PointButton
            pointId="Nz"
            label="Nz"
            isSelected={selectedPoints.includes("Nz")}
            onPress={() => {
              togglePoint("Nz");
              setSelectedPointInfo(getPointInfo("Nz"));
            }}
            color={getPointColor("Nz")}
          />
        </View>

        {/* Linha 2: Frontal Anterior */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
          <PointButton
            pointId="Fp1"
            label="Fp1"
            isSelected={selectedPoints.includes("Fp1")}
            onPress={() => {
              togglePoint("Fp1");
              setSelectedPointInfo(getPointInfo("Fp1"));
            }}
            color={getPointColor("Fp1")}
          />
          <PointButton
            pointId="Fpz"
            label="Fpz"
            isSelected={selectedPoints.includes("Fpz")}
            onPress={() => {
              togglePoint("Fpz");
              setSelectedPointInfo(getPointInfo("Fpz"));
            }}
            color={getPointColor("Fpz")}
          />
          <PointButton
            pointId="Fp2"
            label="Fp2"
            isSelected={selectedPoints.includes("Fp2")}
            onPress={() => {
              togglePoint("Fp2");
              setSelectedPointInfo(getPointInfo("Fp2"));
            }}
            color={getPointColor("Fp2")}
          />
        </View>

        {/* Linha 3: Frontal Anterior-Média */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
          <PointButton
            pointId="AF3"
            label="AF3"
            isSelected={selectedPoints.includes("AF3")}
            onPress={() => {
              togglePoint("AF3");
              setSelectedPointInfo(getPointInfo("AF3"));
            }}
            color={getPointColor("AF3")}
          />
          <PointButton
            pointId="AFz"
            label="AFz"
            isSelected={selectedPoints.includes("AFz")}
            onPress={() => {
              togglePoint("AFz");
              setSelectedPointInfo(getPointInfo("AFz"));
            }}
            color={getPointColor("AFz")}
          />
          <PointButton
            pointId="AF4"
            label="AF4"
            isSelected={selectedPoints.includes("AF4")}
            onPress={() => {
              togglePoint("AF4");
              setSelectedPointInfo(getPointInfo("AF4"));
            }}
            color={getPointColor("AF4")}
          />
        </View>

        {/* Linha 4: Frontal Média e Temporal */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
          <PointButton
            pointId="F7"
            label="F7"
            isSelected={selectedPoints.includes("F7")}
            onPress={() => {
              togglePoint("F7");
              setSelectedPointInfo(getPointInfo("F7"));
            }}
            color={getPointColor("F7")}
          />
          <PointButton
            pointId="F3"
            label="F3"
            isSelected={selectedPoints.includes("F3")}
            onPress={() => {
              togglePoint("F3");
              setSelectedPointInfo(getPointInfo("F3"));
            }}
            color={getPointColor("F3")}
          />
          <PointButton
            pointId="Fz"
            label="Fz"
            isSelected={selectedPoints.includes("Fz")}
            onPress={() => {
              togglePoint("Fz");
              setSelectedPointInfo(getPointInfo("Fz"));
            }}
            color={getPointColor("Fz")}
          />
          <PointButton
            pointId="F4"
            label="F4"
            isSelected={selectedPoints.includes("F4")}
            onPress={() => {
              togglePoint("F4");
              setSelectedPointInfo(getPointInfo("F4"));
            }}
            color={getPointColor("F4")}
          />
          <PointButton
            pointId="F8"
            label="F8"
            isSelected={selectedPoints.includes("F8")}
            onPress={() => {
              togglePoint("F8");
              setSelectedPointInfo(getPointInfo("F8"));
            }}
            color={getPointColor("F8")}
          />
        </View>

        {/* Linha 5: Frontal-Central */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
          <PointButton
            pointId="FC5"
            label="FC5"
            isSelected={selectedPoints.includes("FC5")}
            onPress={() => {
              togglePoint("FC5");
              setSelectedPointInfo(getPointInfo("FC5"));
            }}
            color={getPointColor("FC5")}
          />
          <PointButton
            pointId="FC1"
            label="FC1"
            isSelected={selectedPoints.includes("FC1")}
            onPress={() => {
              togglePoint("FC1");
              setSelectedPointInfo(getPointInfo("FC1"));
            }}
            color={getPointColor("FC1")}
          />
          <PointButton
            pointId="FC2"
            label="FC2"
            isSelected={selectedPoints.includes("FC2")}
            onPress={() => {
              togglePoint("FC2");
              setSelectedPointInfo(getPointInfo("FC2"));
            }}
            color={getPointColor("FC2")}
          />
          <PointButton
            pointId="FC6"
            label="FC6"
            isSelected={selectedPoints.includes("FC6")}
            onPress={() => {
              togglePoint("FC6");
              setSelectedPointInfo(getPointInfo("FC6"));
            }}
            color={getPointColor("FC6")}
          />
        </View>

        {/* Linha 6: Central */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
          <PointButton
            pointId="T3"
            label="T3"
            isSelected={selectedPoints.includes("T3")}
            onPress={() => {
              togglePoint("T3");
              setSelectedPointInfo(getPointInfo("T3"));
            }}
            color={getPointColor("T3")}
          />
          <PointButton
            pointId="C3"
            label="C3"
            isSelected={selectedPoints.includes("C3")}
            onPress={() => {
              togglePoint("C3");
              setSelectedPointInfo(getPointInfo("C3"));
            }}
            color={getPointColor("C3")}
          />
          <PointButton
            pointId="Cz"
            label="Cz"
            isSelected={selectedPoints.includes("Cz")}
            onPress={() => {
              togglePoint("Cz");
              setSelectedPointInfo(getPointInfo("Cz"));
            }}
            color={getPointColor("Cz")}
          />
          <PointButton
            pointId="C4"
            label="C4"
            isSelected={selectedPoints.includes("C4")}
            onPress={() => {
              togglePoint("C4");
              setSelectedPointInfo(getPointInfo("C4"));
            }}
            color={getPointColor("C4")}
          />
          <PointButton
            pointId="T4"
            label="T4"
            isSelected={selectedPoints.includes("T4")}
            onPress={() => {
              togglePoint("T4");
              setSelectedPointInfo(getPointInfo("T4"));
            }}
            color={getPointColor("T4")}
          />
        </View>

        {/* Linha 7: Central-Parietal */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
          <PointButton
            pointId="CP5"
            label="CP5"
            isSelected={selectedPoints.includes("CP5")}
            onPress={() => {
              togglePoint("CP5");
              setSelectedPointInfo(getPointInfo("CP5"));
            }}
            color={getPointColor("CP5")}
          />
          <PointButton
            pointId="CP1"
            label="CP1"
            isSelected={selectedPoints.includes("CP1")}
            onPress={() => {
              togglePoint("CP1");
              setSelectedPointInfo(getPointInfo("CP1"));
            }}
            color={getPointColor("CP1")}
          />
          <PointButton
            pointId="CP2"
            label="CP2"
            isSelected={selectedPoints.includes("CP2")}
            onPress={() => {
              togglePoint("CP2");
              setSelectedPointInfo(getPointInfo("CP2"));
            }}
            color={getPointColor("CP2")}
          />
          <PointButton
            pointId="CP6"
            label="CP6"
            isSelected={selectedPoints.includes("CP6")}
            onPress={() => {
              togglePoint("CP6");
              setSelectedPointInfo(getPointInfo("CP6"));
            }}
            color={getPointColor("CP6")}
          />
        </View>

        {/* Linha 8: Parietal */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
          <PointButton
            pointId="T5"
            label="T5"
            isSelected={selectedPoints.includes("T5")}
            onPress={() => {
              togglePoint("T5");
              setSelectedPointInfo(getPointInfo("T5"));
            }}
            color={getPointColor("T5")}
          />
          <PointButton
            pointId="P3"
            label="P3"
            isSelected={selectedPoints.includes("P3")}
            onPress={() => {
              togglePoint("P3");
              setSelectedPointInfo(getPointInfo("P3"));
            }}
            color={getPointColor("P3")}
          />
          <PointButton
            pointId="Pz"
            label="Pz"
            isSelected={selectedPoints.includes("Pz")}
            onPress={() => {
              togglePoint("Pz");
              setSelectedPointInfo(getPointInfo("Pz"));
            }}
            color={getPointColor("Pz")}
          />
          <PointButton
            pointId="P4"
            label="P4"
            isSelected={selectedPoints.includes("P4")}
            onPress={() => {
              togglePoint("P4");
              setSelectedPointInfo(getPointInfo("P4"));
            }}
            color={getPointColor("P4")}
          />
          <PointButton
            pointId="T6"
            label="T6"
            isSelected={selectedPoints.includes("T6")}
            onPress={() => {
              togglePoint("T6");
              setSelectedPointInfo(getPointInfo("T6"));
            }}
            color={getPointColor("T6")}
          />
        </View>

        {/* Linha 9: Occipital */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
          <PointButton
            pointId="O1"
            label="O1"
            isSelected={selectedPoints.includes("O1")}
            onPress={() => {
              togglePoint("O1");
              setSelectedPointInfo(getPointInfo("O1"));
            }}
            color={getPointColor("O1")}
          />
          <PointButton
            pointId="Oz"
            label="Oz"
            isSelected={selectedPoints.includes("Oz")}
            onPress={() => {
              togglePoint("Oz");
              setSelectedPointInfo(getPointInfo("Oz"));
            }}
            color={getPointColor("Oz")}
          />
          <PointButton
            pointId="O2"
            label="O2"
            isSelected={selectedPoints.includes("O2")}
            onPress={() => {
              togglePoint("O2");
              setSelectedPointInfo(getPointInfo("O2"));
            }}
            color={getPointColor("O2")}
          />
        </View>

        {/* Linha 10: Referência Posterior */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
          <PointButton
            pointId="Iz"
            label="Iz"
            isSelected={selectedPoints.includes("Iz")}
            onPress={() => {
              togglePoint("Iz");
              setSelectedPointInfo(getPointInfo("Iz"));
            }}
            color={getPointColor("Iz")}
          />
        </View>
      </View>

      {/* Modal com Informações do Ponto */}
      <Modal
        visible={!!selectedPointInfo}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPointInfo(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 20,
              maxHeight: "80%",
              width: "100%",
            }}
          >
            <ScrollView>
              {selectedPointInfo && (
                <View style={{ gap: 16 }}>
                  {/* Header */}
                  <View style={{ gap: 8 }}>
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: selectedPointInfo.regionName ? getPointColor(selectedPointInfo.pointId) : colors.border,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.background }}>
                        {selectedPointInfo.pointId}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.foreground }}>
                      {selectedPointInfo.pointId}
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.muted }}>
                      Região: {selectedPointInfo.regionName}
                    </Text>
                  </View>

                  {/* Funções */}
                  {selectedPointInfo.functions.length > 0 && (
                    <View style={{ gap: 8 }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                        Funções:
                      </Text>
                      {selectedPointInfo.functions.map((func, idx) => (
                        <Text
                          key={idx}
                          style={{
                            fontSize: 12,
                            color: colors.muted,
                            marginLeft: 12,
                            lineHeight: 18,
                          }}
                        >
                          • {func}
                        </Text>
                      ))}
                    </View>
                  )}

                  {/* Aplicações Clínicas */}
                  {selectedPointInfo.clinicalApplications.length > 0 && (
                    <View style={{ gap: 8 }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                        Aplicações Clínicas:
                      </Text>
                      {selectedPointInfo.clinicalApplications.map((app, idx) => (
                        <Text
                          key={idx}
                          style={{
                            fontSize: 12,
                            color: colors.muted,
                            marginLeft: 12,
                            lineHeight: 18,
                          }}
                        >
                          • {app}
                        </Text>
                      ))}
                    </View>
                  )}

                  {/* Botão Fechar */}
                  <TouchableOpacity
                    onPress={() => setSelectedPointInfo(null)}
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: 12,
                      padding: 12,
                      marginTop: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.background,
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      Fechar
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

interface PointButtonProps {
  pointId: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
  color: string;
}

function PointButton({ pointId, label, isSelected, onPress, color }: PointButtonProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: isSelected ? color : colors.background,
        borderWidth: 2,
        borderColor: color,
        justifyContent: "center",
        alignItems: "center",
        opacity: isSelected ? 1 : 0.6,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "bold",
          color: isSelected ? colors.background : color,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
