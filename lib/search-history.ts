import AsyncStorage from "@react-native-async-storage/async-storage";

const SEARCH_HISTORY_KEY = "@neurolasermap/search_history";
const MAX_HISTORY_SIZE = 5;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultCount: number;
}

/**
 * Adiciona uma busca ao histórico
 */
export async function addToSearchHistory(
  query: string,
  resultCount: number
): Promise<void> {
  try {
    const history = await getSearchHistory();

    // Remove duplicatas (mantém a mais recente)
    const filtered = history.filter((item) => item.query !== query);

    // Adiciona a nova busca no início
    const newHistory: SearchHistoryItem[] = [
      {
        query,
        timestamp: Date.now(),
        resultCount,
      },
      ...filtered,
    ];

    // Mantém apenas os últimos 5 itens
    const limited = newHistory.slice(0, MAX_HISTORY_SIZE);

    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error("Erro ao adicionar ao histórico de buscas:", error);
  }
}

/**
 * Retorna o histórico de buscas
 */
export async function getSearchHistory(): Promise<SearchHistoryItem[]> {
  try {
    const data = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao obter histórico de buscas:", error);
    return [];
  }
}

/**
 * Limpa o histórico de buscas
 */
export async function clearSearchHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error("Erro ao limpar histórico de buscas:", error);
  }
}

/**
 * Remove um item específico do histórico
 */
export async function removeFromSearchHistory(query: string): Promise<void> {
  try {
    const history = await getSearchHistory();
    const filtered = history.filter((item) => item.query !== query);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Erro ao remover do histórico de buscas:", error);
  }
}
