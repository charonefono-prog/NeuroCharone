import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, Alert, TextInput, Platform } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ScaleResultScreen } from "@/components/scale-result-screen";
import { ALL_SCALES, ScaleType, calculateScaleScore } from "@/lib/clinical-scales";
import { saveScaleResponse, getPatientScaleResponses, getScaleEvolution, getScaleStatistics } from "@/lib/scale-storage";
import { getPatients } from "@/lib/local-storage";
import * as Haptics from "expo-haptics";
// Gráficos serão adicionados em fase posterior

interface Patient {
  id: string;
  fullName: string;
}

export default function ScalesScreen() {
  const colors = useColors();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showScaleList, setShowScaleList] = useState(false);
  const [showPatientSelector, setShowPatientSelector] = useState(false);
  const [selectedScale, setSelectedScale] = useState<typeof ALL_SCALES[0] | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showScaleForm, setShowScaleForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [notes, setNotes] = useState("");
  const [scaleHistory, setScaleHistory] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    }
  };

  const handleSelectScale = (scale: typeof ALL_SCALES[0]) => {
    setSelectedScale(scale);
    setShowScaleList(false);
    // Recarregar pacientes antes de abrir seletor
    loadPatients();
    setShowPatientSelector(true);
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientSelector(false);
    setShowScaleForm(true);
    setAnswers({});
    setNotes("");
    // Recarregar histórico do paciente
    loadPatientHistory(patient.id);
  };

  const loadPatientHistory = async (patientId: string) => {
    try {
      const history = await getPatientScaleResponses(patientId);
      setScaleHistory(history);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  };

  const handleAnswerChange = (itemId: string, value: number | string) => {
    setAnswers({ ...answers, [itemId]: value });
  };

  const handleSubmitScale = async () => {
    if (!selectedScale || !selectedPatient) {
      Alert.alert("Erro", "Escala ou paciente não selecionado");
      return;
    }

    // Validar se todos os itens foram respondidos
    if (Object.keys(answers).length < selectedScale.totalItems) {
      Alert.alert("Erro", "Por favor, responda todos os itens da escala");
      return;
    }

    try {
      const { score, interpretation } = calculateScaleScore(selectedScale.type as ScaleType, answers);

      const response = {
        id: `${Date.now()}-${Math.random()}`,
        patientId: selectedPatient.id,
        patientName: selectedPatient.fullName,
        scaleType: selectedScale.type as ScaleType,
        scaleName: selectedScale.name,
        date: new Date().toISOString(),
        answers,
        totalScore: score,
        interpretation,
        notes: notes || undefined,
      };

      const success = await saveScaleResponse(response);
      if (success) {
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Salvar resultado para exibir na tela de resultados
        setLastResult(response);
        
        // Fechar formulário e mostrar resultados
        setShowScaleForm(false);
        setShowResults(true);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a escala");
      console.error("Erro ao salvar escala:", error);
    }
  };

  const handleViewHistory = async () => {
    if (!selectedScale || !selectedPatient) return;

    try {
      const history = await getScaleEvolution(selectedPatient.id, selectedScale.type as ScaleType);
      const stats = await getScaleStatistics(selectedPatient.id, selectedScale.type as ScaleType);
      setScaleHistory(history);
      setStatistics(stats);
      setShowResults(false);
      setShowHistory(true);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o histórico");
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setSelectedScale(null);
    setSelectedPatient(null);
    setLastResult(null);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ gap: 24 }}>
          {/* Header */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground }}>
              Escalas Clínicas
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              Avalie seus pacientes com escalas profissionais
            </Text>
          </View>

          {/* Botão para nova avaliação */}
          <TouchableOpacity
            onPress={() => setShowScaleList(true)}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>➕</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
                Nova Avaliação
              </Text>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                Aplicar uma escala clínica
              </Text>
            </View>
            <Text style={{ fontSize: 20, color: "white" }}>›</Text>
          </TouchableOpacity>

          {/* Lista de escalas disponíveis */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
              Escalas Disponíveis
            </Text>
            {ALL_SCALES.map((scale) => (
              <TouchableOpacity
                key={scale.type}
                onPress={() => handleSelectScale(scale)}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 16,
                  gap: 8,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                  {scale.name}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  {scale.description}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                  {scale.totalItems} itens
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal - Seleção de Escala */}
      <Modal visible={showScaleList} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              maxHeight: "80%",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, marginBottom: 16 }}>
              Selecione uma Escala
            </Text>
            <FlatList
              data={ALL_SCALES}
              keyExtractor={(item) => item.type}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectScale(item)}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <Text style={{ fontSize: 16, color: colors.foreground, fontWeight: "500" }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setShowScaleList(false)}
              style={{
                marginTop: 16,
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: colors.border,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, color: colors.foreground, fontWeight: "600" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal - Seleção de Paciente */}
      <Modal visible={showPatientSelector} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              maxHeight: "80%",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, marginBottom: 16 }}>
              Selecione um Paciente
            </Text>
            <FlatList
              data={patients}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectPatient(item)}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <Text style={{ fontSize: 16, color: colors.foreground, fontWeight: "500" }}>
                    {item.fullName}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setShowPatientSelector(false)}
              style={{
                marginTop: 16,
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: colors.border,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, color: colors.foreground, fontWeight: "600" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal - Formulário da Escala */}
      <Modal visible={showScaleForm} transparent animationType="slide">
        <ScreenContainer className="p-6">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ gap: 16 }}>
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>
                  {selectedScale?.name}
                </Text>
                <Text style={{ fontSize: 14, color: colors.muted }}>
                  Paciente: {selectedPatient?.fullName}
                </Text>
              </View>

              {/* Itens da escala */}
              {selectedScale?.items.map((item) => (
                <View key={item.id} style={{ gap: 8, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                    {item.question}
                  </Text>
                  <View style={{ gap: 8 }}>
                    {item.options.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => handleAnswerChange(item.id, option.value)}
                        style={{
                          paddingVertical: 12,
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          borderWidth: 2,
                          borderColor: answers[item.id] === option.value ? colors.primary : colors.border,
                          backgroundColor: answers[item.id] === option.value ? colors.primary + "20" : colors.surface,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: answers[item.id] === option.value ? colors.primary : colors.foreground,
                            fontWeight: answers[item.id] === option.value ? "600" : "400",
                          }}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}

              {/* Campo de notas */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Notas (opcional)
                </Text>
                <TextInput
                  placeholder="Adicione observações sobre a avaliação..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 14,
                    color: colors.foreground,
                  }}
                  placeholderTextColor={colors.muted}
                />
              </View>

              {/* Botões */}
              <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
                <TouchableOpacity
                  onPress={() => setShowScaleForm(false)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 8,
                    backgroundColor: colors.border,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: colors.foreground, fontWeight: "600", fontSize: 16 }}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmitScale}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 8,
                    backgroundColor: colors.primary,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
                    ✓ Enviar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ScreenContainer>
      </Modal>

      {/* Modal - Resultados */}
      <Modal visible={showResults} transparent animationType="slide">
        {lastResult && selectedScale && (
          <ScaleResultScreen
            result={lastResult}
            scale={selectedScale}
            onClose={handleCloseResults}
            onViewHistory={handleViewHistory}
          />
        )}
      </Modal>

      {/* Modal - Histórico e Gráficos */}
      <Modal visible={showHistory} transparent animationType="slide">
        <ScreenContainer className="p-6">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ gap: 16 }}>
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>
                  Histórico: {selectedScale?.name}
                </Text>
                <Text style={{ fontSize: 14, color: colors.muted }}>
                  Paciente: {selectedPatient?.fullName}
                </Text>
              </View>

              {/* Estatísticas */}
              {statistics && (
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
                  <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                    Estatísticas
                  </Text>
                  <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 14, color: colors.muted }}>Total de aplicações:</Text>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                        {statistics.totalApplications}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 14, color: colors.muted }}>Pontuação média:</Text>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                        {statistics.averageScore}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 14, color: colors.muted }}>Maior pontuação:</Text>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.success }}>
                        {statistics.highestScore}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 14, color: colors.muted }}>Menor pontuação:</Text>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.error }}>
                        {statistics.lowestScore}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 14, color: colors.muted }}>Tendência:</Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color:
                            statistics.trend === "improving"
                              ? colors.success
                              : statistics.trend === "declining"
                              ? colors.error
                              : colors.muted,
                        }}
                      >
                        {statistics.trend === "improving"
                          ? "📈 Melhorando"
                          : statistics.trend === "declining"
                          ? "📉 Piorando"
                          : "➡️ Estável"}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Histórico de respostas */}
              <View style={{ gap: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                  Histórico de Avaliações
                </Text>
                {scaleHistory.map((response) => (
                  <View
                    key={response.id}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      padding: 12,
                      gap: 8,
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                        {new Date(response.date).toLocaleDateString("pt-BR")}
                      </Text>
                      <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary }}>
                        {response.totalScore}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 12, color: colors.muted }}>
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

              {/* Botão Fechar */}
              <TouchableOpacity
                onPress={() => setShowHistory(false)}
                style={{
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: colors.border,
                  alignItems: "center",
                  marginTop: 16,
                }}
              >
                <Text style={{ color: colors.foreground, fontWeight: "600", fontSize: 16 }}>
                  Fechar
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}
