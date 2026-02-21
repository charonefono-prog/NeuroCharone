import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useEffect, useState, useCallback } from "react";
import { getSessions, getPatients, type Session, type Patient } from "@/lib/local-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

interface AgendaNote {
  sessionId: string;
  note: string;
  updatedAt: string;
}

const AGENDA_NOTES_KEY = "@neuromap:agenda_notes";

export default function AgendaScreen() {
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [agendaNotes, setAgendaNotes] = useState<Record<string, string>>({});
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, patientsData] = await Promise.all([
        getSessions(),
        getPatients(),
      ]);
      setSessions(sessionsData);
      setPatients(patientsData);
      await loadNotes();
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem(AGENDA_NOTES_KEY);
      if (stored) {
        const notes: AgendaNote[] = JSON.parse(stored);
        const notesMap: Record<string, string> = {};
        notes.forEach((n) => {
          notesMap[n.sessionId] = n.note;
        });
        setAgendaNotes(notesMap);
      }
    } catch (error) {
      console.error("Erro ao carregar notas:", error);
    }
  };

  const saveNote = async (sessionId: string, note: string) => {
    try {
      const updatedNotes = { ...agendaNotes, [sessionId]: note };
      setAgendaNotes(updatedNotes);

      const notesArray: AgendaNote[] = Object.entries(updatedNotes).map(([id, text]) => ({
        sessionId: id,
        note: text,
        updatedAt: new Date().toISOString(),
      }));

      await AsyncStorage.setItem(AGENDA_NOTES_KEY, JSON.stringify(notesArray));
      setEditingNoteId(null);
      setEditingNoteText("");

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      Alert.alert("Erro", "Não foi possível salvar a observação");
    }
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient?.fullName || "Paciente desconhecido";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Agrupar sessões por data
  const groupedSessions = sessions.reduce((groups, session) => {
    const dateKey = new Date(session.sessionDate).toLocaleDateString("pt-BR");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(session);
    return groups;
  }, {} as Record<string, Session[]>);

  // Ordenar datas (mais recente primeiro)
  const sortedDates = Object.keys(groupedSessions).sort((a, b) => {
    const dateA = groupedSessions[a][0].sessionDate;
    const dateB = groupedSessions[b][0].sessionDate;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, gap: 16 }}>
          {/* Header */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground }}>
              Agenda
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              Histórico de sessões por data e hora
            </Text>
          </View>

          {/* Lista agrupada por data */}
          {sortedDates.length === 0 ? (
            <View style={{ padding: 32, alignItems: "center" }}>
              <IconSymbol name="clock.fill" size={48} color={colors.muted} />
              <Text style={{ fontSize: 14, color: colors.muted, marginTop: 16, textAlign: "center" }}>
                Nenhuma sessão agendada
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 8, textAlign: "center" }}>
                As sessões aparecerão aqui após serem registradas
              </Text>
            </View>
          ) : (
            sortedDates.map((dateKey) => {
              const daySessions = groupedSessions[dateKey];
              const firstSession = daySessions[0];
              const dateLabel = formatDate(firstSession.sessionDate);

              return (
                <View key={dateKey} style={{ gap: 8 }}>
                  {/* Data Header */}
                  <View
                    style={{
                      backgroundColor: colors.primary + "15",
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <IconSymbol name="calendar" size={18} color={colors.primary} />
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary, textTransform: "capitalize" }}>
                      {dateLabel}
                    </Text>
                  </View>

                  {/* Sessões do dia */}
                  {daySessions
                    .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime())
                    .map((session) => (
                      <View
                        key={session.id}
                        style={{
                          backgroundColor: colors.surface,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: colors.border,
                          padding: 16,
                          gap: 12,
                          marginLeft: 8,
                        }}
                      >
                        {/* Hora e Paciente */}
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                          <View
                            style={{
                              backgroundColor: colors.primary + "20",
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderRadius: 10,
                              alignItems: "center",
                            }}
                          >
                            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.primary }}>
                              {formatTime(session.sessionDate)}
                            </Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                              {getPatientName(session.patientId)}
                            </Text>
                            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                              {session.durationMinutes} min
                            </Text>
                          </View>
                        </View>

                        {/* Observações da Agenda */}
                        <View style={{ gap: 6 }}>
                          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                            Observações da Agenda
                          </Text>

                          {editingNoteId === session.id ? (
                            <View style={{ gap: 8 }}>
                              <TextInput
                                value={editingNoteText}
                                onChangeText={setEditingNoteText}
                                placeholder="Adicionar observações..."
                                placeholderTextColor={colors.muted}
                                multiline
                                numberOfLines={3}
                                style={{
                                  backgroundColor: colors.background,
                                  borderWidth: 1,
                                  borderColor: colors.primary,
                                  borderRadius: 8,
                                  padding: 12,
                                  fontSize: 14,
                                  color: colors.foreground,
                                  minHeight: 80,
                                  textAlignVertical: "top",
                                }}
                                returnKeyType="done"
                              />
                              <View style={{ flexDirection: "row", gap: 8 }}>
                                <TouchableOpacity
                                  onPress={() => saveNote(session.id, editingNoteText)}
                                  style={{
                                    flex: 1,
                                    backgroundColor: colors.primary,
                                    paddingVertical: 10,
                                    borderRadius: 8,
                                    alignItems: "center",
                                  }}
                                >
                                  <Text style={{ fontSize: 14, fontWeight: "600", color: "white" }}>
                                    Salvar
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    setEditingNoteId(null);
                                    setEditingNoteText("");
                                  }}
                                  style={{
                                    flex: 1,
                                    backgroundColor: colors.border,
                                    paddingVertical: 10,
                                    borderRadius: 8,
                                    alignItems: "center",
                                  }}
                                >
                                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                                    Cancelar
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                setEditingNoteId(session.id);
                                setEditingNoteText(agendaNotes[session.id] || "");
                                if (Platform.OS !== "web") {
                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }
                              }}
                              style={{
                                backgroundColor: colors.background,
                                borderWidth: 1,
                                borderColor: colors.border,
                                borderRadius: 8,
                                padding: 12,
                                minHeight: 48,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: agendaNotes[session.id] ? colors.foreground : colors.muted,
                                  lineHeight: 20,
                                }}
                              >
                                {agendaNotes[session.id] || "Toque para adicionar observações..."}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    ))}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
