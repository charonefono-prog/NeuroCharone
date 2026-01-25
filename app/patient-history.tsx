import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePatientAuth } from "@/hooks/use-patient-auth";
import { getPatientScaleHistory, getScaleStatistics } from "@/lib/scale-storage";
import { ALL_SCALES } from "@/lib/clinical-scales";
import { ScaleChart, ScaleLineChart } from "@/components/scale-chart";
import * as Haptics from "expo-haptics";

export default function PatientHistoryScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isAuthenticated, patientId, patientName, logoutPatient, loading: authLoading } =
    usePatientAuth();

  const [scalesByType, setScalesByType] = useState<Record<string, any[]>>({});
  const [statistics, setStatistics] = useState<Record<string, any>>({});
  const [selectedScaleType, setSelectedScaleType] = useState<string | null>(null);
  const [showScaleDetail, setShowScaleDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/patient-login");
    }
  }, [isAuthenticated, authLoading]);

  // Carregar escalas do paciente
  useEffect(() => {
    if (isAuthenticated && patientId) {
      loadScales();
    }
  }, [isAuthenticated, patientId]);

  const loadScales = async () => {
    try {
      setLoading(true);
      const allScales: Record<string, any[]> = {};
      const allStats: Record<string, any> = {};

      for (const scale of ALL_SCALES) {
        const responses = await getPatientScaleHistory(patientId!, scale.type);
        if (responses.length > 0) {
          allScales[scale.type] = responses;
          allStats[scale.type] = await getScaleStatistics(patientId!, scale.type);
        }
      }

      setScalesByType(allScales);
      setStatistics(allStats);

      // Selecionar primeira escala disponível
      const firstScaleType = Object.keys(allScales)[0];
      if (firstScaleType) {
        setSelectedScaleType(firstScaleType);
      }
    } catch (error) {
      console.error("Erro ao carregar escalas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await logoutPatient();
    router.replace("/patient-login");
  };

  const getScaleInfo = (scaleType: string) => {
    return ALL_SCALES.find((s) => s.type === scaleType);
  };

  const getScoreColor = (score: number, scaleId: string) => {
    // Mapa de scores máximos por escala
    const maxScores: Record<string, number> = {
      doss: 7,
      btss: 22,
      bdae: 100,
      cm: 36,
      sara: 40,
      qcs: 80,
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
    };

    const maxScore = maxScores[scaleId] || 100;
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return colors.error;
    if (percentage >= 60) return colors.warning;
    return colors.success;
  };

  if (authLoading || loading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const availableScales = Object.keys(scalesByType);

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <View className="gap-2 mb-6">
          <Text className="text-3xl font-bold text-foreground">Olá, {patientName}</Text>
          <Text className="text-sm text-muted">Seu histórico de evolução</Text>
        </View>

        {/* Resumo Geral */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
            📊 Resumo
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted }}>
            Você realizou <Text style={{ fontWeight: "600" }}>{availableScales.length}</Text>{" "}
            tipos de avaliação
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted }}>
            Total de{" "}
            <Text style={{ fontWeight: "600" }}>
              {Object.values(scalesByType).reduce((sum, scales) => sum + scales.length, 0)}
            </Text>{" "}
            avaliações registradas
          </Text>
        </View>

        {/* Lista de Escalas */}
        {availableScales.length > 0 ? (
          <>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
              Minhas Avaliações
            </Text>

            <View style={{ gap: 8, marginBottom: 16 }}>
              {availableScales.map((scaleId) => {
                const scale = getScaleInfo(scaleId);
                const responses = scalesByType[scaleId];
                const stats = statistics[scaleId];
                const lastResponse = responses[responses.length - 1];

                if (!scale) return null;

                return (
                  <TouchableOpacity
                    key={scaleId}
                    onPress={() => {
                      setSelectedScaleType(scaleId);
                      setShowScaleDetail(true);
                    }}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 12,
                      padding: 12,
                      borderLeftWidth: 4,
                      borderLeftColor: getScoreColor(lastResponse.totalScore, scaleId),
                    }}
                  >
                    <View style={{ gap: 8 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                          {scale.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: getScoreColor(lastResponse.totalScore, scaleId),
                          }}
                        >
                          {lastResponse.totalScore}
                        </Text>
                      </View>

                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: 12, color: colors.muted }}>
                          {responses.length} avaliação{responses.length !== 1 ? "ões" : ""}
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.muted }}>
                          Última: {new Date(lastResponse.date).toLocaleDateString("pt-BR")}
                        </Text>
                      </View>

                      {stats && (
                        <View style={{ flexDirection: "row", gap: 8 }}>
                          <Text style={{ fontSize: 11, color: colors.muted }}>
                            Melhor: {stats.maxScore}
                          </Text>
                          <Text style={{ fontSize: 11, color: colors.muted }}>
                            Média: {stats.averageScore.toFixed(1)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
              Nenhuma avaliação registrada
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center" }}>
              Suas avaliações aparecerão aqui conforme forem realizadas
            </Text>
          </View>
        )}

        {/* Botão de Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: colors.error,
            borderRadius: 12,
            padding: 12,
            alignItems: "center",
            marginTop: 16,
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 14, color: "white", fontWeight: "600" }}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Detalhes */}
      <Modal
        visible={showScaleDetail && selectedScaleType !== null}
        animationType="slide"
        onRequestClose={() => setShowScaleDetail(false)}
      >
        <ScreenContainer className="p-4">
          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedScaleType && scalesByType[selectedScaleType] && (
              <>
                {/* Cabeçalho */}
                <View style={{ gap: 2, marginBottom: 16 }}>
                  <TouchableOpacity onPress={() => setShowScaleDetail(false)}>
                    <Text style={{ fontSize: 14, color: colors.primary, fontWeight: "500" }}>
                      ← Voltar
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.foreground, marginTop: 8 }}>
                    {getScaleInfo(selectedScaleType)?.name}
                  </Text>
                </View>

                {/* Gráfico de Barras */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
                    Evolução em Barras
                  </Text>
                  <ScaleChart data={scalesByType[selectedScaleType]} scaleType={selectedScaleType} />
                </View>

                {/* Gráfico de Linha */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
                    Tendência
                  </Text>
                  <ScaleLineChart data={scalesByType[selectedScaleType]} />
                </View>

                {/* Histórico */}
                <View style={{ gap: 12, marginBottom: 24 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                    Histórico Detalhado
                  </Text>

                  {scalesByType[selectedScaleType].map((response, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: colors.surface,
                        borderRadius: 12,
                        padding: 12,
                        gap: 8,
                      }}
                    >
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: 12, color: colors.muted }}>
                          {new Date(response.date).toLocaleDateString("pt-BR")}
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
                          {response.totalScore} pontos
                        </Text>
                      </View>
                      <Text style={{ fontSize: 13, color: colors.foreground }}>
                        {response.interpretation}
                      </Text>
                      {response.notes && (
                        <Text style={{ fontSize: 12, color: colors.muted, fontStyle: "italic" }}>
                          Notas: {response.notes}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}
