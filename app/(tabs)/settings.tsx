import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Alert, Modal } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useProfessionalInfo } from "@/hooks/use-professional-info";
import * as Haptics from "expo-haptics";
import { recalculateAllScaleResponses } from "@/lib/scale-storage";
import { useRouter } from "expo-router";
import {
  exportFullBackup,
  pickBackupFile,
  getBackupSummary,
  formatBackupSummary,
  detectConflicts,
  importBackupData,
  formatImportSummary,
  getLastBackupDate,
  type BackupData,
  type ConflictResolution,
} from "@/lib/backup-system";

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { professional, loading } = useProfessionalInfo();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  // Import flow states
  const [pendingBackup, setPendingBackup] = useState<BackupData | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictCount, setConflictCount] = useState(0);

  useEffect(() => {
    getLastBackupDate().then(setLastBackup);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setExporting(true);
      const success = await exportFullBackup();
      if (success) {
        const date = await getLastBackupDate();
        setLastBackup(date);
        Alert.alert("Sucesso", "Backup completo exportado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao exportar:", error);
      Alert.alert("Erro", "Não foi possível exportar o backup.");
    } finally {
      setExporting(false);
    }
  }, []);

  const handleImportStart = useCallback(async () => {
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setImporting(true);

      const backup = await pickBackupFile();
      if (!backup) {
        setImporting(false);
        return;
      }

      setPendingBackup(backup);

      // Detectar conflitos
      const conflicts = await detectConflicts(backup);
      setConflictCount(conflicts.length);

      // Mostrar resumo
      setShowSummaryModal(true);
    } catch (error) {
      console.error("Erro ao importar:", error);
      Alert.alert("Erro", "Não foi possível ler o arquivo de backup.");
      setImporting(false);
    }
  }, []);

  const handleImportConfirm = useCallback(async (resolution: ConflictResolution) => {
    if (!pendingBackup) return;

    setShowSummaryModal(false);
    setShowConflictModal(false);

    try {
      const result = await importBackupData(pendingBackup, resolution);

      if (result.success) {
        const summaryText = formatImportSummary(result.summary);
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        Alert.alert(
          "Importação Concluída",
          summaryText + "\n\nRecomendamos reiniciar o app para garantir que todos os dados sejam carregados corretamente.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Erro", "Ocorreu um erro durante a importação. Alguns dados podem não ter sido importados.");
      }
    } catch (error) {
      console.error("Erro na importação:", error);
      Alert.alert("Erro", "Falha ao importar os dados.");
    } finally {
      setPendingBackup(null);
      setImporting(false);
    }
  }, [pendingBackup]);

  const handleCancelImport = useCallback(() => {
    setShowSummaryModal(false);
    setShowConflictModal(false);
    setPendingBackup(null);
    setImporting(false);
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  const hasProfile = professional.firstName.trim().length > 0;
  const summaryText = pendingBackup ? formatBackupSummary(getBackupSummary(pendingBackup)) : "";

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ padding: 24, gap: 24 }}>
          {/* Header */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: "700", color: colors.foreground }}>
              Configurações
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              Ferramentas e utilitários do sistema
            </Text>
          </View>

          {/* Card do Profissional - Resumo */}
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
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                Dados do Profissional
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/profile")}
                style={{
                  backgroundColor: colors.primary + "15",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>
                  Editar no Perfil
                </Text>
              </TouchableOpacity>
            </View>

            {hasProfile ? (
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 13, color: colors.muted }}>Nome:</Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
                    {professional.title}. {professional.firstName} {professional.lastName}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 13, color: colors.muted }}>Conselho:</Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
                    {professional.councilNumber || "Não informado"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 13, color: colors.muted }}>Registro:</Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
                    {professional.registrationNumber || "Não informado"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 13, color: colors.muted }}>Assinatura:</Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: professional.electronicSignature ? colors.success : colors.error }}>
                    {professional.electronicSignature ? "Gerada" : "Não gerada"}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: colors.warning + "15",
                  borderRadius: 8,
                  padding: 12,
                  borderLeftWidth: 3,
                  borderLeftColor: colors.warning,
                }}
              >
                <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 20 }}>
                  Preencha seus dados no Perfil para que apareçam nos documentos exportados e na assinatura eletrônica.
                </Text>
              </View>
            )}
          </View>

          {/* ─── Seção Backup / Restauração ─── */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>
              Backup e Restauração
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 20 }}>
              Exporte todos os dados do app para um arquivo JSON ou importe um backup existente.
            </Text>
            {lastBackup && (
              <Text style={{ fontSize: 12, color: colors.muted }}>
                Último backup: {lastBackup}
              </Text>
            )}
          </View>

          {/* Botão Exportar Backup */}
          <TouchableOpacity
            onPress={handleExport}
            disabled={exporting}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.primary + "40",
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              opacity: exporting ? 0.6 : 1,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary + "15",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {exporting ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={{ fontSize: 22 }}>📤</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground }}>
                Exportar Backup Completo
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                Salva pacientes, sessões, escalas, planos, perfil e todas as configurações
              </Text>
            </View>
          </TouchableOpacity>

          {/* Botão Importar Backup */}
          <TouchableOpacity
            onPress={handleImportStart}
            disabled={importing}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.success + "40",
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              opacity: importing ? 0.6 : 1,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.success + "15",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {importing ? (
                <ActivityIndicator size="small" color={colors.success} />
              ) : (
                <Text style={{ fontSize: 22 }}>📥</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground }}>
                Importar Backup
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                Selecione um arquivo JSON exportado anteriormente para restaurar os dados
              </Text>
            </View>
          </TouchableOpacity>

          {/* Botão Recalcular Escalas */}
          <TouchableOpacity
            onPress={async () => {
              try {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                const success = await recalculateAllScaleResponses();
                if (success) {
                  Alert.alert("Sucesso", "Todas as escalas foram recalculadas com sucesso!");
                } else {
                  Alert.alert("Erro", "Erro ao recalcular escalas");
                }
              } catch (error) {
                console.error("Erro:", error);
                Alert.alert("Erro", "Erro ao recalcular escalas");
              }
            }}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.warning + "15",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 22 }}>🔄</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground }}>
                Recalcular Todas as Escalas
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                Recalcula pontuações e interpretações de todas as escalas aplicadas
              </Text>
            </View>
          </TouchableOpacity>

          {/* Informação */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
              padding: 16,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
              INFORMAÇÃO
            </Text>
            <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 20 }}>
              Os dados do profissional são gerenciados na aba "Perfil". Eles aparecem automaticamente em todos os PDFs exportados, relatórios e na assinatura eletrônica dos documentos.
            </Text>
          </View>

          {/* Espaço para tab bar */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* ─── Modal: Resumo do Backup ─── */}
      <Modal
        visible={showSummaryModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelImport}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 24 }}>
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 16,
              padding: 24,
              gap: 16,
              maxHeight: "80%",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>
              Resumo do Backup
            </Text>

            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={{ fontSize: 14, color: colors.foreground, lineHeight: 22 }}>
                {summaryText}
              </Text>
            </ScrollView>

            {conflictCount > 0 && (
              <View
                style={{
                  backgroundColor: colors.warning + "15",
                  borderRadius: 8,
                  padding: 12,
                  borderLeftWidth: 3,
                  borderLeftColor: colors.warning,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  {conflictCount} conflito(s) detectado(s)
                </Text>
                <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4, lineHeight: 20 }}>
                  Alguns dados do backup já existem no app. Escolha como deseja resolver:
                </Text>
              </View>
            )}

            {/* Botões de ação */}
            <View style={{ gap: 10 }}>
              {conflictCount > 0 ? (
                <>
                  <TouchableOpacity
                    onPress={() => handleImportConfirm("overwrite_all")}
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: 10,
                      padding: 14,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "600", color: "#FFFFFF" }}>
                      Sobrescrever Todos os Conflitos
                    </Text>
                    <Text style={{ fontSize: 12, color: "#FFFFFF99", marginTop: 2 }}>
                      Dados do backup substituem os existentes
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleImportConfirm("keep_all")}
                    style={{
                      backgroundColor: colors.success,
                      borderRadius: 10,
                      padding: 14,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "600", color: "#FFFFFF" }}>
                      Manter Dados Atuais
                    </Text>
                    <Text style={{ fontSize: 12, color: "#FFFFFF99", marginTop: 2 }}>
                      Importa apenas dados novos, ignora conflitos
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => handleImportConfirm("keep")}
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    padding: 14,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: "600", color: "#FFFFFF" }}>
                    Importar Dados
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleCancelImport}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 10,
                  padding: 14,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "600", color: colors.muted }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
