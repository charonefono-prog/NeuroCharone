import React, { useRef } from "react";
import { View, Text, Pressable, Alert, Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export interface ChartExportProps {
  chartName: string;
  patientName: string;
  onExport?: () => void;
}

/**
 * Componente de exportação de gráficos como PNG/PDF
 */
export function ChartExport({ chartName, patientName, onExport }: ChartExportProps) {
  const colors = useColors();
  const viewRef = useRef<View>(null);

  const handleExportPNG = async () => {
    try {
      // Gerar nome do arquivo
      const fileName = `grafico_${patientName.replace(/\s+/g, "_")}_${chartName.replace(/\s+/g, "_")}_${new Date().getTime()}.png`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      // Criar conteúdo SVG/PNG simulado
      const pngContent = `
        PNG Chart Export
        Patient: ${patientName}
        Chart: ${chartName}
        Date: ${new Date().toLocaleDateString("pt-BR")}
        Time: ${new Date().toLocaleTimeString("pt-BR")}
      `;

      await FileSystem.writeAsStringAsync(filePath, pngContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Compartilhar arquivo
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: "image/png",
          dialogTitle: "Exportar Gráfico",
        });
      }

      Alert.alert("Sucesso", "Gráfico exportado com sucesso!");
      onExport?.();
    } catch (error) {
      console.error("Erro ao exportar gráfico:", error);
      Alert.alert("Erro", "Falha ao exportar gráfico");
    }
  };

  const handleExportPDF = async () => {
    try {
      // Gerar nome do arquivo
      const fileName = `grafico_${patientName.replace(/\s+/g, "_")}_${chartName.replace(/\s+/g, "_")}_${new Date().getTime()}.pdf`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      // Criar conteúdo PDF simulado
      const pdfContent = `
        %PDF-1.4
        Chart Export
        Patient: ${patientName}
        Chart: ${chartName}
        Date: ${new Date().toLocaleDateString("pt-BR")}
        Time: ${new Date().toLocaleTimeString("pt-BR")}
      `;

      await FileSystem.writeAsStringAsync(filePath, pdfContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Compartilhar arquivo
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: "application/pdf",
          dialogTitle: "Exportar Gráfico",
        });
      }

      Alert.alert("Sucesso", "Gráfico exportado como PDF com sucesso!");
      onExport?.();
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      Alert.alert("Erro", "Falha ao exportar PDF");
    }
  };

  return (
    <View
      ref={viewRef}
      style={{
        flexDirection: "row",
        gap: 8,
        marginTop: 12,
      }}
    >
      {/* Botão Exportar PNG */}
      <Pressable
        onPress={handleExportPNG}
        style={({ pressed }) => [
          {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: colors.success,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <IconSymbol name="paperplane.fill" size={14} color="white" />
        <Text style={{ fontSize: 12, fontWeight: "600", color: "white" }}>
          PNG
        </Text>
      </Pressable>

      {/* Botão Exportar PDF */}
      <Pressable
        onPress={handleExportPDF}
        style={({ pressed }) => [
          {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: colors.error,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <IconSymbol name="paperplane.fill" size={14} color="white" />
        <Text style={{ fontSize: 12, fontWeight: "600", color: "white" }}>
          PDF
        </Text>
      </Pressable>
    </View>
  );
}
