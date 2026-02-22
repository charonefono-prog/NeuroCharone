const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function clearData() {
  try {
    await AsyncStorage.removeItem('therapeutic_cycles');
    console.log('✅ Dados de ciclos limpos com sucesso!');
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
  }
}

clearData();
