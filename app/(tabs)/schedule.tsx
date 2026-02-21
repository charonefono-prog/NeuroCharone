import { ScrollView, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface FutureSchedule {
  id: string;
  date: string;
  time: string;
  observations: string;
  createdAt: string;
}

export default function ScheduleScreen() {
  const colors = useColors();
  const [schedules, setSchedules] = useState<FutureSchedule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    observations: '',
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const data = await AsyncStorage.getItem('@future_schedules');
      if (data) setSchedules(JSON.parse(data));
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  };

  const saveSchedules = async (updated: FutureSchedule[]) => {
    try {
      await AsyncStorage.setItem('@future_schedules', JSON.stringify(updated));
      setSchedules(updated);
    } catch (error) {
      console.error('Erro ao salvar agendamentos:', error);
    }
  };

  const addSchedule = () => {
    if (!formData.date.trim() || !formData.time.trim()) {
      alert('Por favor, preencha data e hora');
      return;
    }

    const newSchedule: FutureSchedule = {
      id: Date.now().toString(),
      date: formData.date,
      time: formData.time,
      observations: formData.observations,
      createdAt: new Date().toISOString(),
    };

    const updated = [...schedules, newSchedule];
    saveSchedules(updated);
    setFormData({ date: '', time: '', observations: '' });
    setShowForm(false);
  };

  const deleteSchedule = (id: string) => {
    const updated = schedules.filter(s => s.id !== id);
    saveSchedules(updated);
  };

  const updateSchedule = (id: string, field: string, value: string) => {
    const updated = schedules.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    );
    saveSchedules(updated);
  };

  const renderSchedule = ({ item }: { item: FutureSchedule }) => (
    <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground">{item.date}</Text>
          <Text className="text-base text-primary font-medium">{item.time}</Text>
        </View>
        <TouchableOpacity
          onPress={() => deleteSchedule(item.id)}
          style={{ padding: 8 }}
        >
          <Text className="text-error text-lg">✕</Text>
        </TouchableOpacity>
      </View>

      {item.observations && (
        <Text className="text-sm text-muted mt-2">{item.observations}</Text>
      )}
    </View>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-foreground">Agendamentos Futuros</Text>
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)}
            style={{
              backgroundColor: colors.primary,
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text className="text-background font-semibold">+</Text>
          </TouchableOpacity>
        </View>

        {showForm && (
          <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Novo Agendamento</Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">Data</Text>
              <TextInput
                value={formData.date}
                onChangeText={(text: string) => setFormData({ ...formData, date: text })}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.muted}
                style={{
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  color: colors.foreground,
                }}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">Hora</Text>
              <TextInput
                value={formData.time}
                onChangeText={(text: string) => setFormData({ ...formData, time: text })}
                placeholder="HH:MM"
                placeholderTextColor={colors.muted}
                style={{
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  color: colors.foreground,
                }}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">Observações</Text>
              <TextInput
                value={formData.observations}
                onChangeText={(text: string) => setFormData({ ...formData, observations: text })}
                placeholder="Adicione observações..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  color: colors.foreground,
                  minHeight: 80,
                  textAlignVertical: 'top',
                }}
              />
            </View>

            <TouchableOpacity
              onPress={addSchedule}
              style={{
                backgroundColor: colors.primary,
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text className="text-background font-semibold">Salvar Agendamento</Text>
            </TouchableOpacity>
          </View>
        )}

        {schedules.length > 0 ? (
          <FlatList
            data={schedules}
            renderItem={renderSchedule}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-muted text-center">Nenhum agendamento futuro</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
