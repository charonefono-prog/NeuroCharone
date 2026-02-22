import { ScrollView, Text, View, TouchableOpacity, Alert, FlatList, Modal, TextInput } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPatients, type Patient } from '@/lib/local-storage';
import { useOrientation } from '@/hooks/use-orientation';

interface TherapeuticCycle {
  id: string;
  patientId: string;
  patientName: string;
  objectives: string;
  plannedSessions: number;
  estimatedDuration: number;
  startDate: string;
  endDate: string;
  frequency: string;
  intensity: string;
  status: 'planned' | 'active' | 'completed';
  createdAt: string;
}

export default function CyclesScreen() {
  const { isPortrait, isLandscape, width } = useOrientation();
  const [cycles, setCycles] = useState<TherapeuticCycle[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    objectives: '',
    plannedSessions: '10',
    estimatedDuration: '30',
    frequency: '2x por semana',
    intensity: 'média',
  });

  useEffect(() => {
    loadCycles();
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const patientsData = await getPatients();
      setPatients(patientsData);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    }
  };

  const loadCycles = async () => {
    try {
      const stored = await AsyncStorage.getItem('therapeutic_cycles');
      if (stored) {
        setCycles(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar ciclos:', error);
    }
  };

  const saveCycle = async () => {
    if (!selectedPatient) {
      Alert.alert('Erro', 'Por favor, selecione um paciente');
      return;
    }
    if (!formData.objectives.trim()) {
      Alert.alert('Erro', 'Por favor, preencha os objetivos do ciclo');
      return;
    }

    const newCycle: TherapeuticCycle = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      objectives: formData.objectives,
      plannedSessions: parseInt(formData.plannedSessions),
      estimatedDuration: parseInt(formData.estimatedDuration),
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + parseInt(formData.estimatedDuration) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      frequency: formData.frequency,
      intensity: formData.intensity,
      status: 'planned',
      createdAt: new Date().toISOString(),
    };

    const updated = [...cycles, newCycle];
    await AsyncStorage.setItem('therapeutic_cycles', JSON.stringify(updated));
    setCycles(updated);

    setFormData({
      objectives: '',
      plannedSessions: '10',
      estimatedDuration: '30',
      frequency: '2x por semana',
      intensity: 'média',
    });
    setSelectedPatient(null);
    setShowForm(false);

    Alert.alert('Sucesso', 'Ciclo terapêutico criado com sucesso!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return '#FFA500';
      case 'active':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planned':
        return 'Planejado';
      case 'active':
        return 'Ativo';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  return (
    <ScreenContainer className={isPortrait ? 'p-4' : 'p-2'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className={isPortrait ? 'gap-4' : 'gap-2'}>
          {/* Header */}
          <View className={isPortrait ? 'items-center gap-2 mb-4' : 'items-center gap-1 mb-2'}>
            <Text className={isPortrait ? 'text-3xl font-bold text-foreground' : 'text-2xl font-bold text-foreground'}>🔄 Ciclos Terapêuticos</Text>
            <Text className={isPortrait ? 'text-base text-muted text-center' : 'text-sm text-muted text-center'}>
              Planeje e acompanhe os ciclos de tratamento
            </Text>
          </View>

          {/* Botão Novo Ciclo */}
          <TouchableOpacity
            className="bg-primary p-4 rounded-lg items-center"
            onPress={() => setShowForm(!showForm)}
          >
            <Text className="text-white font-semibold text-base">
              {showForm ? '✕ Cancelar' : '+ Novo Ciclo'}
            </Text>
          </TouchableOpacity>

          {/* Formulário */}
          {showForm && (
            <View className="bg-surface p-4 rounded-lg gap-3 border border-border">
              <Text className="text-lg font-semibold text-foreground">Criar Novo Ciclo</Text>

              {/* Seletor de Paciente */}
              <View>
                <Text className="text-sm font-medium text-foreground mb-1">Paciente *</Text>
                <TouchableOpacity
                  className="bg-background p-3 rounded border border-border flex-row justify-between items-center"
                  onPress={() => setShowPatientModal(true)}
                >
                  <Text className={selectedPatient ? 'text-foreground font-semibold' : 'text-muted'}>
                    {selectedPatient ? selectedPatient.fullName : 'Selecione um paciente...'}
                  </Text>
                  <Text className="text-primary text-lg">›</Text>
                </TouchableOpacity>
              </View>

              {/* Objetivos */}
              <View>
                <Text className="text-sm font-medium text-foreground mb-1">Objetivos do Ciclo</Text>
                <TextInput
                  className="bg-background p-3 rounded border border-border text-foreground"
                  placeholder="Digite os objetivos do ciclo..."
                  placeholderTextColor="#999"
                  value={formData.objectives}
                  onChangeText={(text) => setFormData({ ...formData, objectives: text })}
                  multiline
                  numberOfLines={3}
                  style={{ textAlignVertical: 'top' }}
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </View>

              {/* Sessões Planejadas */}
              <View>
                <Text className="text-sm font-medium text-foreground mb-1">
                  Sessões Planejadas
                </Text>
                <View className="flex-row gap-2">
                  {['5', '10', '15', '20'].map((num) => (
                    <TouchableOpacity
                      key={num}
                      className={`flex-1 p-2 rounded ${
                        formData.plannedSessions === num ? 'bg-primary' : 'bg-background border border-border'
                      }`}
                      onPress={() => setFormData({ ...formData, plannedSessions: num })}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          formData.plannedSessions === num ? 'text-white' : 'text-foreground'
                        }`}
                      >
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Duração */}
              <View>
                <Text className="text-sm font-medium text-foreground mb-1">Duração (dias)</Text>
                <View className="flex-row gap-2">
                  {['14', '21', '30', '45'].map((num) => (
                    <TouchableOpacity
                      key={num}
                      className={`flex-1 p-2 rounded ${
                        formData.estimatedDuration === num ? 'bg-primary' : 'bg-background border border-border'
                      }`}
                      onPress={() => setFormData({ ...formData, estimatedDuration: num })}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          formData.estimatedDuration === num ? 'text-white' : 'text-foreground'
                        }`}
                      >
                        {num}d
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Frequência */}
              <View>
                <Text className="text-sm font-medium text-foreground mb-1">Frequência</Text>
                <View className="flex-row gap-2 flex-wrap">
                  {['1x por semana', '2x por semana', '3x por semana'].map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      className={`p-2 rounded ${
                        formData.frequency === freq ? 'bg-primary' : 'bg-background border border-border'
                      }`}
                      onPress={() => setFormData({ ...formData, frequency: freq })}
                    >
                      <Text
                        className={`font-semibold text-sm ${
                          formData.frequency === freq ? 'text-white' : 'text-foreground'
                        }`}
                      >
                        {freq}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Intensidade */}
              <View>
                <Text className="text-sm font-medium text-foreground mb-1">Intensidade</Text>
                <View className="flex-row gap-2">
                  {['baixa', 'média', 'alta'].map((int) => (
                    <TouchableOpacity
                      key={int}
                      className={`flex-1 p-2 rounded ${
                        formData.intensity === int ? 'bg-primary' : 'bg-background border border-border'
                      }`}
                      onPress={() => setFormData({ ...formData, intensity: int })}
                    >
                      <Text
                        className={`text-center font-semibold capitalize ${
                          formData.intensity === int ? 'text-white' : 'text-foreground'
                        }`}
                      >
                        {int}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Botão Salvar */}
              <TouchableOpacity
                className="bg-success p-3 rounded-lg items-center mt-2"
                onPress={saveCycle}
              >
                <Text className="text-white font-semibold">✓ Salvar Ciclo</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Modal de Seleção de Paciente */}
          <Modal
            visible={showPatientModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowPatientModal(false)}
          >
            <ScreenContainer className="p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold text-foreground">Selecionar Paciente</Text>
                <TouchableOpacity onPress={() => setShowPatientModal(false)}>
                  <Text className="text-2xl text-primary">✕</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={patients}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="bg-surface p-4 rounded-lg mb-2 border border-border"
                    onPress={() => {
                      setSelectedPatient(item);
                      setShowPatientModal(false);
                    }}
                  >
                    <Text className="text-lg font-semibold text-foreground">{item.fullName}</Text>
                    <Text className="text-sm text-muted mt-1">Paciente cadastrado</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View className="items-center py-8">
                    <Text className="text-muted">Nenhum paciente cadastrado</Text>
                  </View>
                }
              />
            </ScreenContainer>
          </Modal>

          {/* Lista de Ciclos */}
          {cycles && cycles.length > 0 && (
            <View className="gap-3 mt-4">
              <Text className="text-lg font-semibold text-foreground mb-2">Ciclos Criados</Text>
              {cycles.map((cycle) => {
                if (!cycle || !cycle.id) return null;
                return (
                  <View key={cycle.id} className="bg-surface p-4 rounded-lg border border-border gap-3">
                    {/* Cabeçalho: Paciente e Status */}
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-xs text-muted mb-1">Paciente</Text>
                        <Text className="text-base font-bold text-foreground" numberOfLines={1}>
                          {cycle.patientName || 'Sem nome'}
                        </Text>
                      </View>
                      <View
                        className="px-3 py-1 rounded-full ml-2"
                        style={{ backgroundColor: getStatusColor(cycle.status) }}
                      >
                        <Text className="text-white text-xs font-semibold">
                          {getStatusLabel(cycle.status)}
                        </Text>
                      </View>
                    </View>

                    {/* Objetivos */}
                    <View className="bg-background p-3 rounded">
                      <Text className="text-xs text-muted mb-1">Objetivos</Text>
                      <Text className="text-sm text-foreground leading-5">
                        {cycle.objectives || 'Sem objetivos'}
                      </Text>
                    </View>

                    {/* Detalhes em Grid */}
                    <View className="gap-2">
                      <View className="flex-row gap-3">
                        <View className="flex-1 bg-background p-2 rounded">
                          <Text className="text-xs text-muted">Sessões</Text>
                          <Text className="text-lg font-bold text-primary mt-1">
                            {cycle.plannedSessions || 0}
                          </Text>
                        </View>
                        <View className="flex-1 bg-background p-2 rounded">
                          <Text className="text-xs text-muted">Duração</Text>
                          <Text className="text-lg font-bold text-primary mt-1">
                            {cycle.estimatedDuration || 0}d
                          </Text>
                        </View>
                        <View className="flex-1 bg-background p-2 rounded">
                          <Text className="text-xs text-muted">Frequência</Text>
                          <Text className="text-xs font-semibold text-foreground mt-1" numberOfLines={2}>
                            {cycle.frequency || '-'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Datas */}
                    <View className="pt-2 border-t border-border">
                      <Text className="text-xs text-muted">
                        📅 {cycle.startDate} até {cycle.endDate}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
          {(!cycles || cycles.length === 0) && (
            <View className="bg-surface p-6 rounded-lg items-center mt-4">
              <Text className="text-lg text-muted">Nenhum ciclo criado ainda</Text>
              <Text className="text-sm text-muted mt-2">
                Clique em "Novo Ciclo" para começar
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
