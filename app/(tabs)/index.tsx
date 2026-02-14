import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useEffect, useState, useCallback } from "react";
import { getPatients, getSessions, getPlans, initializeSampleData, type Patient, type Session, type TherapeuticPlan } from "@/lib/local-storage";
import { initializeDefaultTemplates } from "@/lib/plan-templates";
import { AdvancedStatistics } from "@/components/advanced-statistics";
import { exportPatientsToExcel, exportSessionsToExcel, exportStatisticsToExcel } from "@/lib/export-data";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [plans, setPlans] = useState<TherapeuticPlan[]>([]);
  const [showStatistics, setShowStatistics] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      await initializeSampleData();
      await initializeDefaultTemplates();
      const patientsData = await getPatients();
      const sessionsData = await getSessions();
      const plansData = await getPlans();
      setPatients(patientsData);
      setSessions(sessionsData);
      setPlans(plansData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      Alert.alert(
        "Exportar Dados",
        "Escolha o tipo de dados que deseja exportar:",
        [
          {
            text: "Pacientes",
            onPress: async () => {
              try {
                await exportPatientsToExcel(patients);
                Alert.alert("Sucesso", "Lista de pacientes exportada com sucesso!");
              } catch (error) {
                Alert.alert("Erro", "Erro ao exportar pacientes. Tente novamente.");
              }
            },
          },
          {
            text: "Sess\u00f5es",
            onPress: async () => {
              try {
                await exportSessionsToExcel(sessions, patients, plans);
                Alert.alert("Sucesso", "Lista de sess\u00f5es exportada com sucesso!");
              } catch (error) {
                Alert.alert("Erro", "Erro ao exportar sess\u00f5es. Tente novamente.");
              }
            },
          },
          {
            text: "Estat\u00edsticas",
            onPress: async () => {
              try {
                await exportStatisticsToExcel(patients, sessions, plans);
                Alert.alert("Sucesso", "Estat\u00edsticas exportadas com sucesso!");
              } catch (error) {
                Alert.alert("Erro", "Erro ao exportar estat\u00edsticas. Tente novamente.");
              }
            },
          },
          {
            text: "Cancelar",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const activePatients = patients.filter((p) => p.status === "active").length;
  const todaySessions = sessions.filter((s) => {
    const sessionDate = new Date(s.sessionDate);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  }).length;
  const thisWeekSessions = sessions.filter((s) => {
    const sessionDate = new Date(s.sessionDate);
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  }).length;

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, gap: 24 }}>
          {/* Header */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground }}>
              NeuroLaserMap
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              Bem-vindo ao sistema de mapeamento de neuromodulação
            </Text>
          </View>

          {/* Estatísticas */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
              Estatísticas
            </Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <IconSymbol name="house.fill" size={24} color={colors.primary} />
                <Text style={{ fontSize: 24, fontWeight: "700", color: colors.foreground, marginTop: 8 }}>
                  {patients.length}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: "500", color: colors.muted }}>Total Pacientes</Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <IconSymbol name="house.fill" size={24} color={colors.success} />
                <Text style={{ fontSize: 24, fontWeight: "700", color: colors.foreground, marginTop: 8 }}>
                  {activePatients}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: "500", color: colors.muted }}>Ativos</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <IconSymbol name="house.fill" size={24} color={colors.warning} />
                <Text style={{ fontSize: 24, fontWeight: "700", color: colors.foreground, marginTop: 8 }}>
                  {todaySessions}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: "500", color: colors.muted }}>Sessões Hoje</Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <IconSymbol name="house.fill" size={24} color={colors.primary} />
                <Text style={{ fontSize: 24, fontWeight: "700", color: colors.foreground, marginTop: 8 }}>
                  {thisWeekSessions}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: "500", color: colors.muted }}>Esta Semana</Text>
              </View>
            </View>
          </View>

          {/* Ações Rápidas */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
              Ações Rápidas
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/patients")}
              activeOpacity={0.7}
              style={{
                backgroundColor: colors.primary,
                padding: 16,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <IconSymbol name="house.fill" size={24} color="#FFFFFF" />
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF", flex: 1 }}>
                Ver Todos os Pacientes
              </Text>
              <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleExportData}
              activeOpacity={0.7}
              style={{
                backgroundColor: colors.success + "20",
                borderWidth: 1,
                borderColor: colors.success,
                padding: 16,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 24 }}>📄</Text>
              <Text style={{ fontSize: 16, fontWeight: "600", color: colors.success, flex: 1 }}>
                Exportar Dados (Excel)
              </Text>
              <IconSymbol name="chevron.right" size={20} color={colors.success} />
            </TouchableOpacity>
          </View>

          {/* Estatísticas Avançadas */}
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={() => setShowStatistics(!showStatistics)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                Estatísticas Avançadas
              </Text>
              <IconSymbol
                name="chevron.right"
                size={20}
                color={colors.muted}
                style={{ transform: [{ rotate: showStatistics ? "90deg" : "0deg" }] }}
              />
            </TouchableOpacity>

            {showStatistics && (
              <AdvancedStatistics patients={patients} plans={plans} sessions={sessions} />
            )}
          </View>

          {/* Rodapé Sofisticado */}
          <View style={{ 
            paddingTop: 32, 
            paddingBottom: 16,
            borderTopWidth: 2, 
            borderTopColor: colors.border, 
            gap: 12,
            alignItems: 'center'
          }}>
            <View style={{
              backgroundColor: colors.surface,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
              width: '100%'
            }}>
              <Text style={{
                fontSize: 11,
                fontWeight: '700',
                color: colors.primary,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                marginBottom: 4
              }}>
                Desenvolvido por: Carlos Charone
              </Text>
            </View>
            <Text style={{
              fontSize: 11,
              color: colors.muted,
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              NeuroLaserMap - Sistema de Mapeamento de Neuromodulação
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
