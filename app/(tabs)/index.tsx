import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useEffect, useState } from "react";
import { getPatients, getSessions, getPlans, initializeSampleData, type Patient, type Session, type TherapeuticPlan } from "@/lib/local-storage";
import { AdvancedStatistics } from "@/components/advanced-statistics";

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

  const loadData = async () => {
    try {
      setLoading(true);
      await initializeSampleData();
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
            <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.foreground }}>
              NeuroLaserMap
            </Text>
            <Text style={{ fontSize: 16, color: colors.muted }}>
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
                <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground, marginTop: 8 }}>
                  {patients.length}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>Total Pacientes</Text>
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
                <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground, marginTop: 8 }}>
                  {activePatients}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>Ativos</Text>
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
                <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground, marginTop: 8 }}>
                  {todaySessions}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>Sessões Hoje</Text>
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
                <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground, marginTop: 8 }}>
                  {thisWeekSessions}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>Esta Semana</Text>
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

          {/* Rodapé */}
          <View style={{ paddingTop: 24, borderTopWidth: 1, borderTopColor: colors.border, gap: 4 }}>
            <Text className="text-xs text-muted text-center">
              Desenvolvido por Carlos Charone
            </Text>
            <Text className="text-xs text-muted text-center">
              CREFONO: 9-10025-5
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
