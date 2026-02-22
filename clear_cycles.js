const AsyncStorage = require('@react-native-async-storage/async-storage').default;

(async () => {
  try {
    await AsyncStorage.removeItem('therapeutic_cycles');
    console.log('✅ Ciclos de teste removidos!');
  } catch (error) {
    console.error('Erro:', error);
  }
})();
