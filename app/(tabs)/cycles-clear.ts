// Script para limpar dados de teste
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function clearTestData() {
  try {
    await AsyncStorage.removeItem('therapeutic_cycles');
    console.log('✅ Dados de ciclos limpos!');
  } catch (error) {
    console.error('Erro ao limpar:', error);
  }
}
