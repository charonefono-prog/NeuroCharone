import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Share } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useProfessionalInfo } from "@/hooks/use-professional-info";
import { ScaleResponse } from "@/lib/clinical-scales";
import { exportAndShareScaleResult } from "@/lib/pdf-export-service";
import * as Haptics from "expo-haptics";

interface ScaleResultScreenProps {
  result: ScaleResponse;
  scale: any;
  onClose: () => void;
  onViewHistory: () => void;
}

export function ScaleResultScreen({
  result,
  scale,
  onClose,
  onViewHistory,
}: ScaleResultScreenProps) {
  const colors = useColors();
  const { professional } = useProfessionalInfo();

  const handleShare = async () => {
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const message = `Resultado da Escala ${result.scaleName}\n\nPaciente: ${result.patientName}\nPontuacao: ${result.totalScore}\nInterpretacao: ${result.interpretation}\n\nData: ${new Date(result.date).toLocaleDateString("pt-BR")}`;

      await Share.share({
        message,
        title: `Resultado - ${result.scaleName}`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  const handleExportPDF = async () => {
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      const success = await exportAndShareScaleResult(
        result,
        professional,
        {
          id: result.patientId,
          fullName: result.patientName,
        }
      );
      
      if (!success) {
        alert("Erro ao exportar PDF");
      }
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao exportar PDF");
    }
  };

  const getScoreColor = () => {
    // Cores baseadas na interpretação
    if (
      result.interpretation.includes("excelente") ||
      result.interpretation.includes("normal") ||
      result.interpretation.includes("sem")
    ) {
      return colors.success;
    } else if (
      result.interpretation.includes("severa") ||
      result.interpretation.includes("impossível")
    ) {
      return colors.error;
    } else {
      return colors.warning;
    }
  };

  const getScorePercentage = () => {
    const scaleMaxScores: Record<string, number> = {
      doss: 7,
      btss: 30,
      bdae: 24,
      cm: 100,
      qcs: 100,
      sara: 40,
      pdq39: 30,
      fois: 7,
      dsfs: 10,
      grbasi: 18,
      eat10: 40,
      stopbang: 8,
      hb: 6,
      phq9: 27,
      mdq: 13,
      snapiv: 54,
      amisos: 56,
      mdsupdrs: 20,
      oddrs: 24,
      conners: 30,
      vanderbilt: 24,
    };
    
    const maxScore = scaleMaxScores[scale.type];
    if (maxScore) {
      return Math.round((result.totalScore / maxScore) * 100);
    }
    return 0;
  };

  const scorePercentage = getScorePercentage();
  const scoreColor = getScoreColor();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: colors.background }}
    >
      <View style={{ padding: 24, gap: 24 }}>
        {/* Header */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: "700", color: colors.foreground }}>
            ✓ Avaliação Concluída
          </Text>
          <Text style={{ fontSize: 14, color: colors.muted }}>
            {result.scaleName}
          </Text>
        </View>

        {/* Informações do Paciente */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted, fontWeight: "600" }}>
            PACIENTE
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>
            {result.patientName}
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
            {new Date(result.date).toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {/* Score Principal */}
        <View
          style={{
            backgroundColor: scoreColor + "15",
            borderRadius: 16,
            borderWidth: 2,
            borderColor: scoreColor,
            padding: 24,
            alignItems: "center",
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 14, color: colors.muted, fontWeight: "600" }}>
            PONTUAÇÃO TOTAL
          </Text>
          <Text
            style={{
              fontSize: 56,
              fontWeight: "900",
              color: scoreColor,
            }}
          >
            {result.totalScore}
          </Text>

          {/* Barra de progresso visual */}
          <View style={{ width: "100%", gap: 8 }}>
            <View
              style={{
                height: 8,
                backgroundColor: colors.border,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${Math.min(scorePercentage, 100)}%`,
                  backgroundColor: scoreColor,
                }}
              />
            </View>
            <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center" }}>
              {scorePercentage}% da escala
            </Text>
          </View>
        </View>

        {/* Interpretação */}
        <View
          style={{
            backgroundColor: scoreColor + "10",
            borderRadius: 12,
            borderLeftWidth: 4,
            borderLeftColor: scoreColor,
            padding: 16,
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted, fontWeight: "600" }}>
            INTERPRETAÇÃO
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: scoreColor,
              lineHeight: 24,
            }}
          >
            {result.interpretation}
          </Text>
        </View>

        {/* Descrição da Escala */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted, fontWeight: "600" }}>
            SOBRE ESTA ESCALA
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.foreground,
              lineHeight: 20,
            }}
          >
            {scale.description}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.muted,
              marginTop: 8,
              fontStyle: "italic",
            }}
          >
            Total de itens: {scale.totalItems}
          </Text>
        </View>

        {/* Notas (se houver) */}
        {result.notes && (
          <View
            style={{
              backgroundColor: colors.warning + "15",
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: colors.warning,
              padding: 16,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: colors.muted, fontWeight: "600" }}>
              OBSERVAÇÕES
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.foreground,
                lineHeight: 20,
              }}
            >
              {result.notes}
            </Text>
          </View>
        )}

        {/* Dicas de Interpretação */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted, fontWeight: "600" }}>
            PRÓXIMOS PASSOS
          </Text>

          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
              <Text style={{ fontSize: 20, marginTop: 2 }}>📊</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
                  Visualizar Histórico
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                  Compare com avaliações anteriores
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
              <Text style={{ fontSize: 20, marginTop: 2 }}>📈</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
                  Acompanhar Evolução
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                  Veja gráficos de progresso ao longo do tempo
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
              <Text style={{ fontSize: 20, marginTop: 2 }}>📋</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
                  Gerar Relatório
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                  Exporte em PDF para documentação
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={{ gap: 12, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={onViewHistory}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 16, color: "white", fontWeight: "600" }}>
              Ver Historico
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleExportPDF}
            style={{
              backgroundColor: colors.success,
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 16, color: "white", fontWeight: "600" }}>
              Exportar em PDF
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 16, color: colors.foreground, fontWeight: "600" }}>
              📤 Compartilhar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: colors.border,
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 16, color: colors.foreground, fontWeight: "600" }}>
              ← Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
